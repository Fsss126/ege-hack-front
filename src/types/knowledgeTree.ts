import {
  DataProperty,
  DataState,
  KnowledgeBaseSubject,
} from 'store/reducers/dataReducer';

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
  rootPId?: string;
  entity: E;
  subjectId?: number;
  themeId?: number;
  children: (TaskTreeEntity | ThemeTreeEntity)[];
}

export type TaskTreeEntity = Require<
  TreeEntity<TaskInfo, TreeEntityType.TASK>,
  'pId' | 'rootPId' | 'parentType'
>;

export type ThemeTreeEntity = Require<
  TreeEntity<ThemeInfo, TreeEntityType.THEME>,
  'pId' | 'rootPId'
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
      (subject): SubjectTreeEntity => ({
        type: TreeEntityType.SUBJECT,
        id: getSubjectNodeId(subject.id),
        entity: subject,
        subjectId: subject.id,
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
        rootPId: getSubjectNodeId(theme.subject_id),
        entity: theme,
        subjectId: theme.subject_id,
        themeId: theme.id,
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
        rootPId: getSubjectNodeId(task.subject_id),
        parentType:
          task.theme_id !== undefined
            ? TreeEntityType.THEME
            : TreeEntityType.SUBJECT,
        entity: task,
        children: [],
      }),
    )
    .value();

export function getKnowledgeTree<
  E extends KnowledgeTreeEntity = KnowledgeTreeEntity
>({
  subjects,
  themes,
  tasks,
  mapEntities,
}: {
  subjects: SubjectInfo[];
  themes: ThemeInfo[];
  tasks: TaskInfo[];
  mapEntities?: (entity: KnowledgeTreeEntity) => E;
}) {
  const subjectEntities = (mapEntities
    ? getSubjectEntities(subjects).map(mapEntities)
    : getSubjectEntities(subjects)) as E[];
  const themeEntities = (mapEntities
    ? getThemeEntities(themes).map(mapEntities)
    : getThemeEntities(themes)) as E[];
  const taskEntities = (mapEntities
    ? getTaskEntities(tasks).map(mapEntities)
    : getTaskEntities(tasks)) as E[];

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
    .value() as Dictionary<E>;

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

export function getKnowledgeSubjectContent(
  subjectContent: KnowledgeBaseSubject | false | undefined,
  themes: Dictionary<DataProperty<ThemeInfo>, number>,
  tasks: Dictionary<DataProperty<TaskInfo>, number>,
) {
  const loadedThemes: number[] = [];

  let subjectThemes: ThemeInfo[] | false | undefined;
  let subjectTasks: TaskInfo[] | false | undefined;

  if (subjectContent === false) {
    subjectThemes = false;
  } else if (!subjectContent || !subjectContent.root) {
    subjectThemes = undefined;
  } else {
    subjectThemes = [];
    subjectTasks = [];

    for (const key in subjectContent) {
      const level = subjectContent[key];

      if (!level || level instanceof Error) {
        continue;
      }

      let isLoaded = true;

      for (const themeId of level.themeIds) {
        const theme = themes[themeId];

        if (!theme || theme instanceof Error) {
          isLoaded = false;
        } else {
          subjectThemes.push(theme);
        }
      }

      for (const taskId of level.taskIds) {
        const task = tasks[taskId];

        if (!task || task instanceof Error) {
          isLoaded = false;
        } else {
          subjectTasks.push(task);
        }
      }

      if (isLoaded && key !== 'root') {
        loadedThemes.push(parseInt(key));
      }
    }
  }

  return {loadedThemes, subjectThemes, subjectTasks} as const;
}
