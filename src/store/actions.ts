import {AxiosError} from 'axios';
import {
  CourseParticipantInfo,
  KnowledgeLevelInfo,
  TaskInfo,
  TestInfo,
  TestResultInfo,
  ThemeInfo,
} from 'types/entities';

export type UserAction = TypedAction<
  typeof import('modules/user/user.actions')
>;

export type SubjectsAction = TypedAction<
  typeof import('modules/subjects/subjects.actions')
>;

export type CoursesAction = TypedAction<
  typeof import('modules/courses/courses.actions')
>;

export type TeachersAction = TypedAction<
  typeof import('modules/teachers/teachers.actions')
>;

export type TestingAction = TypedAction<
  typeof import('modules/testing/testing.actions')
>;

export type LessonsAction = TypedAction<
  typeof import('modules/lessons/lessons.actions')
>;

export type UsersAction = TypedAction<
  typeof import('modules/users/users.actions')
>;

export type HomeworksAction = TypedAction<
  typeof import('modules/homeworks/homeworks.actions')
>;

export type WebinarsAction = TypedAction<
  typeof import('modules/webinars/webinars.actions')
>;

export enum ActionType {
  PARTICIPANTS_FETCH = 'PARTICIPANTS_FETCH',
  PARTICIPANTS_FETCHED = 'PARTICIPANTS_FETCHED',
  PARTICIPANTS_DELETE_REQUEST = 'PARTICIPANTS_DELETE_REQUEST',
  PARTICIPANTS_DELETE = 'PARTICIPANTS_DELETE',
  PARTICIPANTS_REVOKE = 'PARTICIPANTS_REVOKE',
  TEST_RESULTS_FETCH = 'TEST_RESULTS_FETCH',
  TEST_RESULTS_FETCHED = 'TEST_RESULTS_FETCHED',
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
  KNOWLEDGE_TEST_FETCH = 'KNOWLEDGE_TEST_FETCH',
  KNOWLEDGE_TEST_FETCHED = 'KNOWLEDGE_TEST_FETCHED',
  KNOWLEDGE_TEST_REVOKE = 'KNOWLEDGE_TEST_REVOKE',
  KNOWLEDGE_TEST_DELETE_REQUEST = 'KNOWLEDGE_TEST_DELETE_REQUEST',
  KNOWLEDGE_TEST_DELETE = 'KNOWLEDGE_TEST_DELETE',
}

export type ParticipantsFetchAction = {
  type: ActionType.PARTICIPANTS_FETCH;
  courseId: number;
};

export type ParticipantsFetchedAction = {
  type: ActionType.PARTICIPANTS_FETCHED;
  courseId: number;
  participants: CourseParticipantInfo[] | AxiosError;
};

export type ParticipantsRevokeAction = {
  type: ActionType.PARTICIPANTS_REVOKE;
  courseId: number;
  responseParticipants: CourseParticipantInfo[];
};

export type ParticipantDeleteCallback = (
  courseId: number,
  userId: number,
) => void;

export type ParticipantDeleteErrorCallback = (
  courseId: number,
  userId: number,
  error: AxiosError,
) => void;

export type ParticipantDeleteRequestAction = {
  type: ActionType.PARTICIPANTS_DELETE_REQUEST;
  courseId: number;
  userId: number;
  onDelete?: ParticipantDeleteCallback;
  onError?: ParticipantDeleteErrorCallback;
};

export type ParticipantDeleteAction = {
  type: ActionType.PARTICIPANTS_DELETE;
  courseId: number;
  userId: number;
};

export type WebinarDeleteCallback = (
  courseId: number,
  webinarId: number,
) => void;

export type WebinarDeleteErrorCallback = (
  courseId: number,
  webinarId: number,
  error: AxiosError,
) => void;

export type TestResultsFetchAction = {
  type: ActionType.TEST_RESULTS_FETCH;
  testId: number;
  lessonId: number;
};

export type TestResultsFetchedAction = {
  type: ActionType.TEST_RESULTS_FETCHED;
  testId: number;
  lessonId: number;
  results: TestResultInfo[] | AxiosError;
};

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

export type KnowledgeLevelFetchAction = {
  type: ActionType.KNOWLEDGE_LEVEL_FETCH;
  subjectId: number;
  themeId?: number;
  onSuccess?: KnowledgeLevelFetchCallback;
  onError?: KnowledgeLevelFetchErrorCallback;
};

export type KnowledgeLevelFetchedAction = {
  type: ActionType.KNOWLEDGE_LEVEL_FETCHED;
  subjectId: number;
  themeId?: number;
  content: KnowledgeLevelInfo | AxiosError;
};

export type KnowledgeThemeFetchAction = {
  type: ActionType.KNOWLEDGE_THEME_FETCH;
  subjectId: number;
  themeId: number;
};

export type KnowledgeThemeFetchedAction = {
  type: ActionType.KNOWLEDGE_THEME_FETCHED;
  subjectId: number;
  themeId: number;
  theme: ThemeInfo | AxiosError;
};

export type KnowledgeThemeRevokeAction = {
  type: ActionType.KNOWLEDGE_THEME_REVOKE;
  responseTheme: ThemeInfo;
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

export type KnowledgeThemeDeleteRequestAction = {
  type: ActionType.KNOWLEDGE_THEME_DELETE_REQUEST;
  subjectId: number;
  themeId: number;
  parentThemeId?: number;
  onDelete?: KnowledgeThemeDeleteCallback;
  onError?: KnowledgeThemeDeleteErrorCallback;
};

export type KnowledgeThemeDeleteAction = {
  type: ActionType.KNOWLEDGE_THEME_DELETE;
  subjectId: number;
  themeId: number;
  parentThemeId?: number;
};

export type KnowledgeTaskFetchAction = {
  type: ActionType.KNOWLEDGE_TASK_FETCH;
  subjectId: number;
  taskId: number;
};

export type KnowledgeTaskFetchedAction = {
  type: ActionType.KNOWLEDGE_TASK_FETCHED;
  subjectId: number;
  taskId: number;
  task: TaskInfo | AxiosError;
};

export type KnowledgeTaskRevokeAction = {
  type: ActionType.KNOWLEDGE_TASK_REVOKE;
  responseTask: TaskInfo;
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

export type KnowledgeTaskDeleteRequestAction = {
  type: ActionType.KNOWLEDGE_TASK_DELETE_REQUEST;
  subjectId: number;
  taskId: number;
  themeId?: number;
  onDelete?: KnowledgeTaskDeleteCallback;
  onError?: KnowledgeTaskDeleteErrorCallback;
};

export type KnowledgeTaskDeleteAction = {
  type: ActionType.KNOWLEDGE_TASK_DELETE;
  subjectId: number;
  taskId: number;
  themeId?: number;
};

export type KnowledgeTestFetchAction = {
  type: ActionType.KNOWLEDGE_TEST_FETCH;
  lessonId: number;
};

export type KnowledgeTestFetchedAction = {
  type: ActionType.KNOWLEDGE_TEST_FETCHED;
  lessonId: number;
  test: TestInfo | null | AxiosError;
};

export type KnowledgeTestRevokeAction = {
  type: ActionType.KNOWLEDGE_TEST_REVOKE;
  courseId: number;
  lessonId: number;
  responseTest: TestInfo;
};

export type KnowledgeTestDeleteCallback = (
  courseId: number,
  lessonId: number,
  testId: number,
) => void;

export type KnowledgeTestDeleteErrorCallback = (
  courseId: number,
  lessonId: number,
  testId: number,
  error: AxiosError,
) => void;

export type KnowledgeTestDeleteRequestAction = {
  type: ActionType.KNOWLEDGE_TEST_DELETE_REQUEST;
  courseId: number;
  lessonId: number;
  testId: number;
  onDelete?: KnowledgeTestDeleteCallback;
  onError?: KnowledgeTestDeleteErrorCallback;
};

export type KnowledgeTestDeleteAction = {
  type: ActionType.KNOWLEDGE_TEST_DELETE;
  courseId: number;
  lessonId: number;
  testId: number;
};

export type Action =
  | UserAction
  | SubjectsAction
  | CoursesAction
  | TeachersAction
  | TestingAction
  | LessonsAction
  | UsersAction
  | HomeworksAction
  | WebinarsAction
  | ParticipantsFetchAction
  | ParticipantsFetchedAction
  | ParticipantsRevokeAction
  | ParticipantDeleteRequestAction
  | ParticipantDeleteAction
  | TestResultsFetchAction
  | TestResultsFetchedAction
  | KnowledgeLevelFetchAction
  | KnowledgeLevelFetchedAction
  | KnowledgeThemeFetchAction
  | KnowledgeThemeFetchedAction
  | KnowledgeThemeRevokeAction
  | KnowledgeThemeDeleteRequestAction
  | KnowledgeThemeDeleteAction
  | KnowledgeTaskFetchAction
  | KnowledgeTaskFetchedAction
  | KnowledgeTaskRevokeAction
  | KnowledgeTaskDeleteRequestAction
  | KnowledgeTaskDeleteAction
  | KnowledgeTestFetchAction
  | KnowledgeTestFetchedAction
  | KnowledgeTestRevokeAction
  | KnowledgeTestDeleteRequestAction
  | KnowledgeTestDeleteAction;
