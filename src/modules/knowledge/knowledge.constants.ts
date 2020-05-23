import {DataProperty} from 'store/reducers/types';
import {SubjectInfo, TaskInfo, ThemeInfo} from 'types/entities';

export enum EKnowledgeAction {
  KNOWLEDGE_LEVEL_FETCH = 'KNOWLEDGE_LEVEL_FETCH',
  KNOWLEDGE_LEVEL_FETCHED = 'KNOWLEDGE_LEVEL_FETCHED',
  KNOWLEDGE_THEME_FETCH = 'KNOWLEDGE_THEME_FETCH',
  KNOWLEDGE_THEME_FETCHED = 'KNOWLEDGE_THEME_FETCHED',
  KNOWLEDGE_THEME_REVOKE = 'KNOWLEDGE_THEME_REVOKE',
  KNOWLEDGE_THEME_DELETE_REQUEST = 'KNOWLEDGE_THEME_DELETE_REQUEST',
  KNOWLEDGE_THEME_DELETE = 'KNOWLEDGE_THEME_DELETE',
  KNOWLEDGE_TASK_FETCH = 'KNOWLEDGE_TASK_FETCH',
  KNOWLEDGE_TASK_FETCHED = 'KNOWLEDGE_TASK_FETCHED',
  KNOWLEDGE_TASK_REVOKE = 'KNOWLEDGE_TASK_REVOKE',
  KNOWLEDGE_TASK_DELETE_REQUEST = 'KNOWLEDGE_TASK_DELETE_REQUEST',
  KNOWLEDGE_TASK_DELETE = 'KNOWLEDGE_TASK_DELETE',
}

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

export type KnowledgeBaseSubject = {
  [key in number | typeof KNOWLEDGE_TREE_ROOT]?: DataProperty<
    KnowledgeTreeLevel
  >;
};
