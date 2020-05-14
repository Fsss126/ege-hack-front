import {useHandleErrors} from 'components/layout/Page';
import * as Input from 'components/ui/input';
import {SimpleDataNode, TreeSelectProps} from 'components/ui/input/TreeSelect';
import {
  useKnowledgeLevelFetch,
  useKnowledgeSubjectContent,
  useKnowledgeTheme,
} from 'hooks/selectors';
import {TreeNodeProps} from 'rc-tree/lib';
import React, {useCallback, useMemo} from 'react';
import {ThemeInfo} from 'types/entities';
import {Deferred} from 'utils/promiseHelper';

export type TreeNode = Require<SimpleDataNode<number, string>, 'rootPId'>;

export type ThemeTreeNode = TreeNode & {
  themeId: number;
  parentThemeId?: number;
  subjectId: number;
};

export const getThemeNodeId = (id: number) => `1.theme.${id}`;

export const getSubjectNodeId = (id: number) => `subject.${id}`;

export const mapThemesToNodes = ({
  id,
  parent_theme_id,
  subject_id,
  has_sub_themes,
  name,
}: ThemeInfo): ThemeTreeNode => ({
  id: getThemeNodeId(id),
  value: id,
  pId: parent_theme_id ? getThemeNodeId(parent_theme_id) : undefined,
  rootPId: getSubjectNodeId(subject_id),
  title: name,
  themeId: id,
  parentThemeId: parent_theme_id,
  subjectId: subject_id,
  isLeaf: !has_sub_themes,
});

export function useLoadThemeLevel() {
  const fetchThemes = useKnowledgeLevelFetch();

  return useCallback(
    (treeNode: ThemeTreeNode): Promise<unknown> => {
      const deferred = new Deferred();
      const {subjectId, themeId} = treeNode;

      fetchThemes(subjectId, themeId, deferred.resolve, deferred.reject);

      return deferred.promise;
    },
    [fetchThemes],
  );
}

export function useThemeSelect(
  subjectId?: number,
  themeId?: number,
  ...excludedThemes: ThemeInfo[]
) {
  const {
    themes,
    loadedThemes,
    error: errorLoadingRootThemes,
    reload: reloadRootThemes,
  } = useKnowledgeSubjectContent(subjectId);
  const {
    theme,
    error: errorLoadingTheme,
    reload: reloadTheme,
  } = useKnowledgeTheme(subjectId, themeId);

  const isLoading =
    subjectId !== undefined && (!themes || (themeId !== undefined && !theme));

  const errors = [errorLoadingRootThemes, errorLoadingTheme];
  const reloadCallbacks = [reloadRootThemes, reloadTheme];

  const {hasError, notFound} = useHandleErrors(errors, reloadCallbacks);

  const themeTreeNodes = useMemo<ThemeTreeNode[] | undefined>(() => {
    let themesNodes = themes ? themes.map(mapThemesToNodes) : [];
    const themeNode = theme ? mapThemesToNodes(theme) : [];

    themesNodes = _.uniqBy(_.concat(themesNodes, themeNode), 'id');

    return isLoading ? undefined : themesNodes;
  }, [isLoading, theme, themes]);

  const loadData = useLoadThemeLevel();

  const loadedNodeIds = loadedThemes.map((id) => getThemeNodeId(id));

  // TODO: set isLeaf flag of parent nodes with no children left after filtering
  const filteredTreeNodes = useMemo(
    () =>
      themeTreeNodes?.filter(({value}) =>
        _.every(excludedThemes, (theme) => value !== theme.id),
      ),
    [excludedThemes, themeTreeNodes],
  );

  return {
    hasError,
    notFound,
    isLoading,
    themeTreeNodes: filteredTreeNodes,
    loadedNodeIds,
    loadData,
    errors,
    reloadCallbacks,
  };
}

export const renderThemeIcon = (props: TreeNodeProps) => {
  const {expanded} = props;

  return expanded ? (
    <i className="far fa-folder-open" />
  ) : (
    <i className="far fa-folder" />
  );
};

type ThemeSelectProps = Omit<
  TreeSelectProps<number, string>,
  | 'treeData'
  | 'treeLoadedKeys'
  | 'treeDataSimpleMode'
  | 'treeIcon'
  | 'loading'
  | 'loadData'
> & {
  subjectId?: number;
  excludedThemes?: ThemeInfo[];
};

export const ThemeSelect = (props: ThemeSelectProps) => {
  const {subjectId, value, excludedThemes, ...rest} = props;

  const {
    hasError,
    isLoading,
    themeTreeNodes,
    loadedNodeIds,
    loadData,
  } = useThemeSelect(
    subjectId,
    value,
    ...(excludedThemes ? excludedThemes : []),
  );

  return (
    <Input.TreeSelect<number, string>
      treeDataSimpleMode
      treeData={themeTreeNodes}
      treeLoadedKeys={loadedNodeIds}
      allowClear
      loading={isLoading && !hasError}
      loadData={loadData as any}
      disabled={themeTreeNodes === undefined}
      value={value}
      treeIcon={renderThemeIcon}
      {...rest}
    />
  );
};
