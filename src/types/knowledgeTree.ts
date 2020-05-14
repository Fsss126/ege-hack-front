import {DataState} from '../store/reducers/dataReducer';
import {SubjectInfo, TaskInfo, ThemeInfo} from './entities';

export enum TreeEntityType {
  TASK = 'task',
  THEME = 'theme',
  SUBJECT = 'subject',
}

interface TreeEntity<
  E extends SubjectInfo | ThemeInfo | TaskInfo,
  T extends TreeEntityType
> {
  type: T;
  id: string;
  pId?: string;
  parentType?: TreeEntityType.SUBJECT | TreeEntityType.THEME;
  rootId?: string;
  entity: E;
  children: (TaskTreeEntity | ThemeTreeEntity)[];
}

export type TaskTreeEntity = Require<
  TreeEntity<TaskInfo, TreeEntityType.TASK>,
  'pId' | 'rootId' | 'parentType'
>;

export type ThemeTreeEntity = Require<
  TreeEntity<ThemeInfo, TreeEntityType.THEME>,
  'pId' | 'rootId'
>;

export type SubjectTreeEntity = TreeEntity<SubjectInfo, TreeEntityType.SUBJECT>;

export type KnowledgeTreeEntity =
  | SubjectTreeEntity
  | ThemeTreeEntity
  | TaskTreeEntity;

export type KnowledgeTree = KnowledgeTreeEntity[];

export const KNOWLEDGE_TREE_ROOT = 'root' as const;

export type KnowledgeTreeLevel = {
  id: number | typeof KNOWLEDGE_TREE_ROOT;
  themeIds: number[];
  taskIds: number[];
};

type KnowledgeMap = DataState['knowledgeMap'];

export const getSubjectNodeId = (id: number) => `0.subject.${id}`;

export const getThemeNodeId = (id: number) => `1.theme.${id}`;

export const getTaskNodeId = (id: number) => `2.task.${id}`;

const getSubjectEntities = (subjects: SubjectInfo[]) =>
  _(subjects)
    .map(
      (entity): SubjectTreeEntity => ({
        type: TreeEntityType.SUBJECT,
        id: getSubjectNodeId(entity.id),
        entity,
        children: [],
      }),
    )
    .value();

const getThemeEntities = (themes: ThemeInfo[]) =>
  _(themes)
    .map(
      (theme): ThemeTreeEntity => ({
        type: TreeEntityType.THEME,
        id: getThemeNodeId(theme.id),
        pId:
          theme.parent_theme_id !== undefined
            ? getThemeNodeId(theme.parent_theme_id)
            : getSubjectNodeId(theme.subject_id),
        rootId: getSubjectNodeId(theme.subject_id),
        entity: theme,
        children: [],
      }),
    )
    .value();

const getTaskEntities = (tasks: TaskInfo[]) =>
  _(tasks)
    .map(
      (task): TaskTreeEntity => ({
        type: TreeEntityType.TASK,
        id: getTaskNodeId(task.id),
        pId:
          task.theme_id !== undefined
            ? getThemeNodeId(task.theme_id)
            : getSubjectNodeId(task.subject_id),
        rootId: getSubjectNodeId(task.subject_id),
        parentType:
          task.theme_id !== undefined
            ? TreeEntityType.THEME
            : TreeEntityType.SUBJECT,
        entity: task,
        children: [],
      }),
    )
    .value();

export function getKnowledgeTree(
  subjects: SubjectInfo[],
  themes: ThemeInfo[],
  tasks: TaskInfo[],
) {
  const subjectEntities = getSubjectEntities(subjects);
  const themeEntities = getThemeEntities(themes);
  const taskEntities = getTaskEntities(tasks);

  const concatPipeline = _<KnowledgeTreeEntity>(themeEntities).concat(
    taskEntities,
  );
  const content = concatPipeline.value() as (
    | TaskTreeEntity
    | ThemeTreeEntity
  )[];
  const entitiesMap = concatPipeline
    .concat(subjectEntities)
    .keyBy('id')
    .value();

  _.forEach(content, (entity) => {
    const parentEl = entitiesMap[entity.pId];
    parentEl?.children.push(entity);
  });

  return {
    subjectEntities,
    themeEntities,
    taskEntities,
    entitiesMap,
    tree: subjectEntities,
  };
}

export function getKnowledgeTreeForSubject(
  themes: ThemeInfo[],
  tasks: TaskInfo[],
) {
  const themeEntities = getThemeEntities(themes);
  const taskEntities = getTaskEntities(tasks);

  const concatPipeline = _<TaskTreeEntity | ThemeTreeEntity>(
    themeEntities,
  ).concat(taskEntities);
  const content = concatPipeline.value();

  const entitiesMap = concatPipeline.keyBy('id').value();

  const topLevel: (TaskTreeEntity | ThemeTreeEntity)[] = [];

  _.forEach(content, (entity) => {
    const parentEl = entitiesMap[entity.pId];

    if (parentEl) {
      parentEl.children.push(entity);
    } else {
      if (entity.parentType === TreeEntityType.SUBJECT) {
        topLevel.push(entity);
      }
    }
  });

  return {
    themeEntities,
    taskEntities,
    entitiesMap,
    tree: topLevel,
  };
}
