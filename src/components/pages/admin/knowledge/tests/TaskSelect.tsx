import {useHandleErrors} from 'components/layout/Page';
import * as Input from 'components/ui/input';
import {TreeSelectProps} from 'components/ui/input/TreeSelect';
import {TreeEntityType} from 'modules/knowledge/knowledge.constants';
import {
  useKnowledgeSubjectContent,
  useKnowledgeTask,
} from 'modules/knowledge/knowledge.hooks';
import {
  getSubjectNodeId,
  getTaskNodeId,
  getThemeNodeId,
} from 'modules/knowledge/knowledge.utils';
import {TreeNodeProps} from 'rc-tree/lib';
import React, {useMemo} from 'react';
import {TaskInfo, ThemeInfo} from 'types/entities';

import {
  mapThemesToNodes,
  renderThemeIcon,
  ThemeTreeNode,
  TreeNode,
  useLoadThemeLevel,
} from '../themes/ThemeSelect';

export type ContainingThemeTreeNode = ThemeTreeNode & {
  type: TreeEntityType.THEME;
};

export type TaskTreeNode = TreeNode & {
  type: TreeEntityType.TASK;
};

export const mapTasksToNodes = ({
  id,
  theme_id,
  subject_id,
  name,
}: TaskInfo): TaskTreeNode => ({
  id: getTaskNodeId(id),
  value: id,
  pId: theme_id ? getThemeNodeId(theme_id) : undefined,
  rootPId: getSubjectNodeId(subject_id),
  isLeaf: true,
  title: name,
  type: TreeEntityType.TASK,
});

export const mapThemeToContainingNodes = (
  theme: ThemeInfo,
): ContainingThemeTreeNode => ({
  ...mapThemesToNodes(theme),
  isLeaf: !theme.has_sub_themes && !theme.has_sub_tasks,
  selectable: false,
  value: NaN,
  type: TreeEntityType.THEME,
});

export function useTaskSelect(subjectId?: number, taskId?: number) {
  const {
    themes,
    tasks,
    loadedThemes,
    error: errorLoadingRootContent,
    reload: reloadRootContent,
  } = useKnowledgeSubjectContent(subjectId);

  const {task, error: errorLoadingTask, reload: reloadTask} = useKnowledgeTask(
    subjectId,
    taskId,
  );

  const isLoading =
    subjectId !== undefined &&
    (!themes || !tasks || (taskId !== undefined && !task));

  const errors = [errorLoadingRootContent, errorLoadingTask];
  const reloadCallbacks = [reloadRootContent, reloadTask];

  const {hasError, notFound} = useHandleErrors(errors, reloadCallbacks);

  const themeTreeNodes = useMemo<ThemeTreeNode[] | undefined>(() => {
    const themesNodes = themes
      ? themes.map(mapThemeToContainingNodes).filter(({isLeaf}) => !isLeaf)
      : [];

    return isLoading ? undefined : themesNodes;
  }, [isLoading, themes]);
  const taskTreeNodes = useMemo<TaskTreeNode[] | undefined>(() => {
    let tasksNodes = tasks ? tasks.map(mapTasksToNodes) : [];
    const taskNode = task ? mapTasksToNodes(task) : [];

    tasksNodes = _.uniqBy(_.concat(tasksNodes, taskNode), 'id');

    return isLoading ? undefined : tasksNodes;
  }, [isLoading, task, tasks]);

  const treeNodes = useMemo(() => {
    return themeTreeNodes && taskTreeNodes
      ? _.concat<TreeNode>(themeTreeNodes, taskTreeNodes)
      : undefined;
  }, [taskTreeNodes, themeTreeNodes]);

  const loadedNodeIds = loadedThemes.map((id) => getThemeNodeId(id));

  const loadData = useLoadThemeLevel();

  return {
    hasError,
    notFound,
    isLoading,
    treeNodes,
    loadData,
    loadedNodeIds,
    errors,
    reloadCallbacks,
  };
}

export const renderIcon = (props: TreeNodeProps) => {
  const {type} = props as TaskTreeNode | ContainingThemeTreeNode;

  return type === TreeEntityType.THEME ? (
    renderThemeIcon(props)
  ) : type === TreeEntityType.TASK ? (
    <i className="icon-assignment" />
  ) : null;
};

type TaskSelectProps = Omit<
  TreeSelectProps<number, string>,
  | 'treeData'
  | 'treeLoadedKeys'
  | 'treeDataSimpleMode'
  | 'treeIcon'
  | 'loading'
  | 'loadData'
> & {
  subjectId?: number;
  selectedTaskIds?: number[];
};

export const TaskSelect = (props: TaskSelectProps) => {
  const {subjectId, value, selectedTaskIds, ...rest} = props;

  const {
    hasError,
    isLoading,
    treeNodes,
    loadedNodeIds,
    loadData,
  } = useTaskSelect(subjectId, value);

  return (
    <Input.TreeSelect<number, string>
      treeDataSimpleMode
      treeData={treeNodes}
      treeLoadedKeys={loadedNodeIds}
      allowClear
      loading={isLoading && !hasError}
      loadData={loadData as any}
      disabled={treeNodes === undefined}
      value={value}
      treeIcon={renderIcon}
      disabledValues={selectedTaskIds}
      {...rest}
    />
  );
};
