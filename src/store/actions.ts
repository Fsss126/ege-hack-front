import {AxiosError} from 'axios';
import {
  AccountInfo,
  CourseInfo,
  CourseParticipantInfo,
  HomeworkInfo,
  KnowledgeLevelInfo,
  LessonInfo,
  PersonWebinar,
  SubjectInfo,
  TaskInfo,
  TeacherInfo,
  TestInfo,
  TestStateAnswerInfo,
  TestStateInfo,
  TestStatePassedInfo,
  TestStatusInfo,
  ThemeInfo,
  UserCourseInfo,
  WebinarScheduleInfo,
} from 'types/entities';

import {AccountRole} from '../types/enums';

export enum ActionType {
  LOG_IN = 'LOG_IN',
  LOG_IN_REQUEST = 'LOG_IN_REQUEST',
  LOG_IN_SUCCESS = 'LOG_IN_SUCCESS',
  LOG_IN_ERROR = 'LOG_IN_ERROR',
  LOG_OUT = 'LOG_OUT',
  USER_INFO_FETCH = 'USER_INFO_FETCH',
  USER_INFO_FETCHED = 'USER_INFO_FETCHED',
  SHOP_COURSES_FETCH = 'SHOP_COURSES_FETCH',
  SHOP_COURSES_FETCHED = 'SHOP_COURSES_FETCHED',
  USER_COURSES_FETCH = 'USER_COURSES_FETCH',
  USER_COURSES_FETCHED = 'USER_COURSES_FETCHED',
  SUBJECTS_FETCH = 'SUBJECTS_FETCH',
  SUBJECTS_FETCHED = 'SUBJECTS_FETCHED',
  USER_TEACHERS_FETCH = 'USER_TEACHERS_FETCH',
  USER_TEACHERS_FETCHED = 'USER_TEACHERS_FETCHED',
  ACCOUNTS_FETCH = 'ACCOUNTS_FETCH',
  ACCOUNTS_FETCHED = 'ACCOUNTS_FETCHED',
  ACCOUNTS_REVOKE = 'ACCOUNTS_REVOKE',
  ACCOUNTS_DELETE_REQUEST = 'ACCOUNTS_DELETE_REQUEST',
  ACCOUNTS_DELETE = 'ACCOUNTS_DELETE',
  LESSONS_FETCH = 'LESSONS_FETCH',
  LESSONS_FETCHED = 'LESSONS_FETCHED',
  LESSONS_REVOKE = 'LESSONS_REVOKE',
  LESSON_DELETE_REQUEST = 'LESSON_DELETE_REQUEST',
  LESSON_DELETE = 'LESSON_DELETE',
  USER_HOMEWORKS_FETCH = 'USER_HOMEWORKS_FETCH',
  USER_HOMEWORKS_FETCHED = 'USER_HOMEWORKS_FETCHED',
  USER_HOMEWORKS_REVOKE = 'USER_HOMEWORKS_REVOKE',
  COURSE_WEBINARS_FETCH = 'COURSE_WEBINARS_FETCH',
  COURSE_WEBINARS_FETCHED = 'COURSE_WEBINARS_FETCHED',
  UPCOMING_WEBINARS_FETCH = 'UPCOMING_WEBINARS_FETCH',
  UPCOMING_WEBINARS_FETCHED = 'UPCOMING_WEBINARS_FETCHED',
  PARTICIPANTS_FETCH = 'PARTICIPANTS_FETCH',
  PARTICIPANTS_FETCHED = 'PARTICIPANTS_FETCHED',
  PARTICIPANTS_DELETE_REQUEST = 'PARTICIPANTS_DELETE_REQUEST',
  PARTICIPANTS_DELETE = 'PARTICIPANTS_DELETE',
  PARTICIPANTS_REVOKE = 'PARTICIPANTS_REVOKE',
  ADMIN_COURSES_FETCH = 'ADMIN_COURSES_FETCH',
  ADMIN_COURSES_FETCHED = 'ADMIN_COURSES_FETCHED',
  ADMIN_WEBINARS_FETCH = 'ADMIN_WEBINARS_FETCH',
  ADMIN_WEBINARS_FETCHED = 'ADMIN_WEBINARS_FETCHED',
  TEACHER_COURSES_FETCH = 'TEACHER_COURSES_FETCH',
  TEACHER_COURSES_FETCHED = 'TEACHER_COURSES_FETCHED',
  HOMEWORKS_FETCH = 'HOMEWORKS_FETCH',
  HOMEWORKS_FETCHED = 'HOMEWORKS_FETCHED',
  HOMEWORKS_REVOKE = 'HOMEWORKS_REVOKE',
  SUBJECTS_REVOKE = 'SUBJECTS_REVOKE',
  SUBJECT_DELETE_REQUEST = 'SUBJECT_DELETE_REQUEST',
  SUBJECT_DELETE = 'SUBJECT_DELETE',
  COURSES_REVOKE = 'COURSES_REVOKE',
  COURSE_DELETE_REQUEST = 'COURSE_DELETE_REQUEST',
  COURSE_DELETE = 'COURSE_DELETE',
  WEBINARS_REVOKE = 'WEBINARS_REVOKE',
  WEBINAR_DELETE_REQUEST = 'WEBINAR_DELETE_REQUEST',
  WEBINAR_DELETE = 'WEBINAR_DELETE',
  TEST_START_REQUEST = 'TEST_START_REQUEST',
  TEST_FETCH = 'TEST_FETCH',
  TEST_FETCHED = 'TEST_FETCHED',
  TEST_COMPLETE_REQUEST = 'TEST_COMPLETE_REQUEST',
  TEST_STATUS_FETCH = 'TEST_STATUS_FETCH',
  TEST_STATUS_FETCHED = 'TEST_STATUS_FETCHED',
  TEST_STATE_FETCH = 'TEST_STATE_FETCH',
  TEST_STATE_FETCHED = 'TEST_STATE_FETCHED',
  TEST_SAVE_ANSWER_REQUEST = 'TEST_SAVE_ANSWER_REQUEST',
  TEST_SAVE_ANSWER = 'TEST_SAVE_ANSWER',
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

interface Credentials {
  access_token: string;
  refresh_token: string;
}

export type LoginAction = {type: ActionType.LOG_IN};

export type LoginRequestAction = {type: ActionType.LOG_IN_REQUEST};

export type LoginSuccessAction = {
  type: ActionType.LOG_IN_SUCCESS;
  credentials: Credentials;
};

export type LoginErrorAction = {
  type: ActionType.LOG_IN_ERROR;
  error: AxiosError;
};

export type LogoutAction = {type: ActionType.LOG_OUT};

export type UserInfoFetchAction = {type: ActionType.USER_INFO_FETCH};

export type UserInfoFetchedAction = {
  type: ActionType.USER_INFO_FETCHED;
  userInfo: AccountInfo | AxiosError;
};

export type ShopCoursesFetchAction = {type: ActionType.SHOP_COURSES_FETCH};

export type ShopCoursesFetchedAction = {
  type: ActionType.SHOP_COURSES_FETCHED;
  courses: CourseInfo[] | AxiosError;
};

export type AdminCoursesFetchAction = {type: ActionType.ADMIN_COURSES_FETCH};

export type AdminCoursesFetchedAction = {
  type: ActionType.ADMIN_COURSES_FETCHED;
  courses: CourseInfo[] | AxiosError;
};

export type TeacherCoursesFetchAction = {
  type: ActionType.TEACHER_COURSES_FETCH;
};

export type TeacherCoursesFetchedAction = {
  type: ActionType.TEACHER_COURSES_FETCHED;
  courses: CourseInfo[] | AxiosError;
};

export type UserCoursesFetchAction = {type: ActionType.USER_COURSES_FETCH};

export type UserCoursesFetchedAction = {
  type: ActionType.USER_COURSES_FETCHED;
  courses: UserCourseInfo[] | AxiosError;
};

export type SubjectsFetchAction = {type: ActionType.SUBJECTS_FETCH};

export type SubjectsFetchedAction = {
  type: ActionType.SUBJECTS_FETCHED;
  subjects: SubjectInfo[] | AxiosError;
};

export type UserTeachersFetchAction = {type: ActionType.USER_TEACHERS_FETCH};

export type UserTeachersFetchedAction = {
  type: ActionType.USER_TEACHERS_FETCHED;
  teachers: TeacherInfo[] | AxiosError;
};

export type AccountsFetchAction = {
  type: ActionType.ACCOUNTS_FETCH;
  role: AccountRole;
};

export type AccountsFetchedAction = {
  type: ActionType.ACCOUNTS_FETCHED;
  role: AccountRole;
  accounts: AccountInfo[] | AxiosError;
};

export type AccountsRevokeAction = {
  type: ActionType.ACCOUNTS_REVOKE;
  role: AccountRole;
  responseAccounts: AccountInfo[];
};

export type AccountsDeleteCallback = (accountIds: number[]) => void;

export type AccountsDeleteErrorCallback = (
  accountIds: number[],
  error: AxiosError,
) => void;

export type AccountsDeleteRequestAction = {
  type: ActionType.ACCOUNTS_DELETE_REQUEST;
  role: AccountRole;
  accountIds: number[];
  onDelete?: AccountsDeleteCallback;
  onError?: AccountsDeleteErrorCallback;
};

export type AccountsDeleteAction = {
  type: ActionType.ACCOUNTS_DELETE;
  role: AccountRole;
  responseAccounts: AccountInfo[];
};

export type LessonsFetchAction = {
  type: ActionType.LESSONS_FETCH;
  courseId: number;
};

export type LessonsFetchedAction = {
  type: ActionType.LESSONS_FETCHED;
  courseId: number;
  lessons: LessonInfo[] | AxiosError;
};

export type LessonDeleteCallback = (courseId: number, lessonId: number) => void;

export type LessonDeleteErrorCallback = (
  courseId: number,
  lessonId: number,
  error: AxiosError,
) => void;

export type LessonDeleteRequestAction = {
  type: ActionType.LESSON_DELETE_REQUEST;
  courseId: number;
  lessonId: number;
  onDelete?: LessonDeleteCallback;
  onError?: LessonDeleteErrorCallback;
};

export type LessonDeleteAction = {
  type: ActionType.LESSON_DELETE;
  courseId: number;
  lessonId: number;
};

export type UserHomeworksFetchAction = {
  type: ActionType.USER_HOMEWORKS_FETCH;
  courseId: number;
  lessonId: number;
};

export type UserHomeworksFetchedAction = {
  type: ActionType.USER_HOMEWORKS_FETCHED;
  courseId: number;
  lessonId: number;
  homework: HomeworkInfo | AxiosError;
};

export type UserHomeworksRevokeAction = {
  type: ActionType.USER_HOMEWORKS_REVOKE;
  courseId: number;
  lessonId: number;
  responseHomework: HomeworkInfo;
};

export type CourseWebinarsFetchAction = {
  type: ActionType.COURSE_WEBINARS_FETCH;
  courseId: number;
};

export type CourseWebinarsFetchedAction = {
  type: ActionType.COURSE_WEBINARS_FETCHED;
  courseId: number;
  webinars: PersonWebinar[] | AxiosError;
};

export type UpcomingWebinarsFetchAction = {
  type: ActionType.UPCOMING_WEBINARS_FETCH;
};

export type UpcomingWebinarsFetchedAction = {
  type: ActionType.UPCOMING_WEBINARS_FETCHED;
  webinars: PersonWebinar[] | AxiosError;
};

export type ParticipantsFetchAction = {
  type: ActionType.PARTICIPANTS_FETCH;
  courseId: number;
};

export type ParticipantsFetchedAction = {
  type: ActionType.PARTICIPANTS_FETCHED;
  courseId: number;
  participants: CourseParticipantInfo[] | AxiosError;
};

export type AdminWebinarsFetchAction = {
  type: ActionType.ADMIN_WEBINARS_FETCH;
  courseId: number;
};

export type AdminWebinarsFetchedAction = {
  type: ActionType.ADMIN_WEBINARS_FETCHED;
  courseId: number;
  webinars: WebinarScheduleInfo | AxiosError;
};

export type HomeworksFetchAction = {
  type: ActionType.HOMEWORKS_FETCH;
  lessonId: number;
};

export type HomeworksFetchedAction = {
  type: ActionType.HOMEWORKS_FETCHED;
  lessonId: number;
  homeworks: HomeworkInfo[] | AxiosError;
};

export type HomeworksRevokeAction = {
  type: ActionType.HOMEWORKS_REVOKE;
  lessonId: number;
  responseHomework: HomeworkInfo;
};

export type LessonRevokeAction = {
  type: ActionType.LESSONS_REVOKE;
  courseId: number;
  responseLesson: LessonInfo;
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

export type SubjectsRevokeAction = {
  type: ActionType.SUBJECTS_REVOKE;
  responseSubject: SubjectInfo;
};

export type SubjectDeleteCallback = (courseId: number) => void;

export type SubjectDeleteErrorCallback = (
  subjectId: number,
  error: AxiosError,
) => void;

export type SubjectDeleteRequestAction = {
  type: ActionType.SUBJECT_DELETE_REQUEST;
  subjectId: number;
  onDelete?: SubjectDeleteCallback;
  onError?: SubjectDeleteErrorCallback;
};

export type SubjectDeleteAction = {
  type: ActionType.SUBJECT_DELETE;
  subjectId: number;
};

export type CoursesRevokeAction = {
  type: ActionType.COURSES_REVOKE;
  responseCourse: CourseInfo;
};

export type CourseDeleteCallback = (courseId: number) => void;

export type CourseDeleteErrorCallback = (
  courseId: number,
  error: AxiosError,
) => void;

export type CourseDeleteRequestAction = {
  type: ActionType.COURSE_DELETE_REQUEST;
  courseId: number;
  onDelete?: CourseDeleteCallback;
  onError?: CourseDeleteErrorCallback;
};

export type CourseDeleteAction = {
  type: ActionType.COURSE_DELETE;
  courseId: number;
};

export type WebinarsRevokeAction = {
  type: ActionType.WEBINARS_REVOKE;
  courseId: number;
  responseWebinars: WebinarScheduleInfo;
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

export type WebinarDeleteRequestAction = {
  type: ActionType.WEBINAR_DELETE_REQUEST;
  courseId: number;
  webinarId: number;
  webinarsSchedule: WebinarScheduleInfo;
  onDelete?: WebinarDeleteCallback;
  onError?: WebinarDeleteErrorCallback;
};

export type WebinarDeleteAction = {
  type: ActionType.WEBINAR_DELETE;
  courseId: number;
  webinarId: number;
  responseWebinars: WebinarScheduleInfo;
};

export type TestStartCallback = (
  testId: number,
  testInfo: TestStateInfo,
  test: TestInfo,
) => void;

export type TestStartErrorCallback = (
  testId: number,
  error: AxiosError,
) => void;

export type TestStartRequestAction = {
  type: ActionType.TEST_START_REQUEST;
  testId: number;
  lessonId: number;
  courseId: number;
  onSuccess?: TestStartCallback;
  onError?: TestStartErrorCallback;
};

export type TestFetchAction = {
  type: ActionType.TEST_FETCH;
  testId: number;
};

export type TestFetchedAction = {
  type: ActionType.TEST_FETCHED;
  testId: number;
  test: TestInfo | AxiosError;
};

export type TestCompleteCallback = (
  testId: number,
  results: TestStatePassedInfo,
) => void;

export type TestCompleteErrorCallback = (
  testId: number,
  error: AxiosError,
) => void;

export type TestCompleteRequestAction = {
  type: ActionType.TEST_COMPLETE_REQUEST;
  testId: number;
  lessonId: number;
  courseId: number;
  onSuccess?: TestCompleteCallback;
  onError?: TestCompleteErrorCallback;
};

export type TestStatusFetchAction = {
  type: ActionType.TEST_STATUS_FETCH;
  // testId: number;
  lessonId: number;
  courseId: number;
};

export type TestStatusFetchedAction = {
  type: ActionType.TEST_STATUS_FETCHED;
  // testId: number;
  lessonId: number;
  courseId: number;
  status: TestStatusInfo | null | AxiosError;
};

export type TestStateFetchAction = {
  type: ActionType.TEST_STATE_FETCH;
  testId: number;
  lessonId: number;
  courseId: number;
};

export type TestStateFetchedAction = {
  type: ActionType.TEST_STATE_FETCHED;
  testId: number;
  lessonId: number;
  courseId: number;
  state: TestStateInfo | AxiosError;
};

export type TestSaveAnswerCallback = (
  testId: number,
  taskId: number,
  savedAnswer: TestStateAnswerInfo,
) => void;

export type TestSaveAnswerErrorCallback = (
  testId: number,
  taskId: number,
  error: AxiosError,
) => void;

export type TestSaveAnswerRequestAction = {
  type: ActionType.TEST_SAVE_ANSWER_REQUEST;
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answer: string;
  complete: boolean;
  onSuccess?: TestSaveAnswerCallback;
  onError?: TestSaveAnswerErrorCallback;
};

export type TestSaveAnswerAction = {
  type: ActionType.TEST_SAVE_ANSWER;
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answerInfo: TestStateAnswerInfo;
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

export type Action = {type: ActionType} & (
  | LoginAction
  | LoginRequestAction
  | LoginSuccessAction
  | LoginErrorAction
  | LogoutAction
  | UserInfoFetchAction
  | UserInfoFetchedAction
  | ShopCoursesFetchAction
  | ShopCoursesFetchedAction
  | AdminCoursesFetchAction
  | AdminCoursesFetchedAction
  | TeacherCoursesFetchAction
  | TeacherCoursesFetchedAction
  | UserCoursesFetchAction
  | UserCoursesFetchedAction
  | SubjectsFetchAction
  | SubjectsFetchedAction
  | UserTeachersFetchAction
  | UserTeachersFetchedAction
  | AccountsFetchAction
  | AccountsFetchedAction
  | AccountsRevokeAction
  | AccountsDeleteRequestAction
  | AccountsDeleteAction
  | LessonsFetchAction
  | LessonsFetchedAction
  | LessonRevokeAction
  | LessonDeleteRequestAction
  | LessonDeleteAction
  | UserHomeworksFetchAction
  | UserHomeworksFetchedAction
  | UserHomeworksRevokeAction
  | CourseWebinarsFetchAction
  | CourseWebinarsFetchedAction
  | UpcomingWebinarsFetchAction
  | UpcomingWebinarsFetchedAction
  | ParticipantsFetchAction
  | ParticipantsFetchedAction
  | AdminWebinarsFetchAction
  | AdminWebinarsFetchedAction
  | HomeworksFetchAction
  | HomeworksFetchedAction
  | ParticipantsRevokeAction
  | ParticipantDeleteRequestAction
  | ParticipantDeleteAction
  | HomeworksRevokeAction
  | SubjectsRevokeAction
  | SubjectDeleteRequestAction
  | SubjectDeleteAction
  | CoursesRevokeAction
  | CourseDeleteRequestAction
  | CourseDeleteAction
  | WebinarsRevokeAction
  | WebinarDeleteRequestAction
  | WebinarDeleteAction
  | TestStartRequestAction
  | TestStatusFetchAction
  | TestStatusFetchedAction
  | TestFetchAction
  | TestFetchedAction
  | TestCompleteRequestAction
  | TestStateFetchAction
  | TestStateFetchedAction
  | TestSaveAnswerRequestAction
  | TestSaveAnswerAction
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
  | KnowledgeTestDeleteAction
);
