import {AxiosError} from 'axios';
import {EKnowledgeAction} from 'modules/knowledge/knowledge.constants';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {KnowledgeLevelInfo, TaskInfo, ThemeInfo} from 'types/entities';

export type KnowledgeLevelFetchCallback = (
  subjectId: number,
  themeId: number | undefined,
  content: KnowledgeLevelInfo,
) => void;

export type KnowledgeLevelFetchErrorCallback = (
  subjectId: number,
  themeId: number | undefined,
  error: AxiosError,
) => void;

export type KnowledgeLevelFetchedPayload = {
  subjectId: number;
  themeId?: number;
};

export type KnowledgeThemeFetchPayload = {
  subjectId: number;
  themeId: number;
};

export type KnowledgeThemeDeleteCallback = (
  subjectId: number,
  themeId: number,
  parentThemeId?: number,
) => void;

export type KnowledgeThemeDeleteErrorCallback = (
  subjectId: number,
  themeId: number,
  parentThemeId: number | undefined,
  error: AxiosError,
) => void;

export type KnowledgeThemeDeleteRequestPayload = {
  subjectId: number;
  themeId: number;
  parentThemeId?: number;
  onDelete?: KnowledgeThemeDeleteCallback;
  onError?: KnowledgeThemeDeleteErrorCallback;
};

export type KnowledgeThemeDeletePayload = {
  subjectId: number;
  themeId: number;
  parentThemeId?: number;
};

export type KnowledgeTaskFetchPayload = {
  subjectId: number;
  taskId: number;
};

export type KnowledgeTaskDeleteCallback = (
  subjectId: number,
  taskId: number,
  themeId?: number,
) => void;

export type KnowledgeTaskDeleteErrorCallback = (
  subjectId: number,
  taskId: number,
  themeId: number | undefined,
  error: AxiosError,
) => void;

export type KnowledgeTaskDeleteRequestPayload = {
  subjectId: number;
  taskId: number;
  themeId?: number;
  onDelete?: KnowledgeTaskDeleteCallback;
  onError?: KnowledgeTaskDeleteErrorCallback;
};

export type KnowledgeTaskDeletePayload = {
  subjectId: number;
  taskId: number;
  themeId?: number;
};

export type KnowledgeLevelFetchPayload = KnowledgeLevelFetchedPayload & {
  onSuccess?: KnowledgeLevelFetchCallback;
  onError?: KnowledgeLevelFetchErrorCallback;
};

export const knowledgeLevelFetch = fetchActionCreator<
  EKnowledgeAction.KNOWLEDGE_LEVEL_FETCH,
  KnowledgeLevelFetchPayload
>(EKnowledgeAction.KNOWLEDGE_LEVEL_FETCH);

export const knowledgeLevelFetched = fetchedActionCreator<
  EKnowledgeAction.KNOWLEDGE_LEVEL_FETCHED,
  KnowledgeLevelInfo,
  KnowledgeLevelFetchedPayload
>(EKnowledgeAction.KNOWLEDGE_LEVEL_FETCHED);

export const themeFetch = fetchActionCreator<
  EKnowledgeAction.KNOWLEDGE_THEME_FETCH,
  KnowledgeThemeFetchPayload
>(EKnowledgeAction.KNOWLEDGE_THEME_FETCH);

export const themeFetched = fetchedActionCreator<
  EKnowledgeAction.KNOWLEDGE_THEME_FETCHED,
  ThemeInfo,
  KnowledgeThemeFetchPayload
>(EKnowledgeAction.KNOWLEDGE_THEME_FETCHED);

export const themeRevoke = dataActionCreator<
  EKnowledgeAction.KNOWLEDGE_THEME_REVOKE,
  ThemeInfo
>(EKnowledgeAction.KNOWLEDGE_THEME_REVOKE);

export const themeDeleteRequest = loadedActionCreator<
  EKnowledgeAction.KNOWLEDGE_THEME_DELETE_REQUEST,
  KnowledgeThemeDeleteRequestPayload
>(EKnowledgeAction.KNOWLEDGE_THEME_DELETE_REQUEST);

export const themeDelete = loadedActionCreator<
  EKnowledgeAction.KNOWLEDGE_THEME_DELETE,
  KnowledgeThemeDeletePayload
>(EKnowledgeAction.KNOWLEDGE_THEME_DELETE);

export const taskFetch = fetchActionCreator<
  EKnowledgeAction.KNOWLEDGE_TASK_FETCH,
  KnowledgeTaskFetchPayload
>(EKnowledgeAction.KNOWLEDGE_TASK_FETCH);

export const taskFetched = fetchedActionCreator<
  EKnowledgeAction.KNOWLEDGE_TASK_FETCHED,
  TaskInfo,
  KnowledgeTaskFetchPayload
>(EKnowledgeAction.KNOWLEDGE_TASK_FETCHED);

export const taskRevoke = dataActionCreator<
  EKnowledgeAction.KNOWLEDGE_TASK_REVOKE,
  TaskInfo
>(EKnowledgeAction.KNOWLEDGE_TASK_REVOKE);

export const taskDeleteRequest = loadedActionCreator<
  EKnowledgeAction.KNOWLEDGE_TASK_DELETE_REQUEST,
  KnowledgeTaskDeleteRequestPayload
>(EKnowledgeAction.KNOWLEDGE_TASK_DELETE_REQUEST);

export const taskDelete = loadedActionCreator<
  EKnowledgeAction.KNOWLEDGE_TASK_DELETE,
  KnowledgeTaskDeletePayload
>(EKnowledgeAction.KNOWLEDGE_TASK_DELETE);
