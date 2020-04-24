import {AxiosError} from 'axios';
import {
  CourseInfo,
  CourseParticipantInfo,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  SubjectInfo,
  TeacherInfo,
  TestInfo,
  TestStateAnswerInfo,
  TestStateInfo,
  TestStatePassedInfo,
  UserCourseInfo,
  UserInfo,
  WebinarScheduleInfo,
} from 'types/entities';

export enum ActionType {
  LOG_IN = 'LOG_IN',
  LOG_IN_REQUEST = 'LOG_IN_ERROR',
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
  TEACHERS_FETCH = 'TEACHERS_FETCH',
  TEACHERS_FETCHED = 'TEACHERS_FETCHED',
  LESSONS_FETCH = 'LESSONS_FETCH',
  LESSONS_FETCHED = 'LESSONS_FETCHED',
  LESSONS_REVOKE = 'LESSONS_REVOKE',
  LESSON_DELETE_REQUEST = 'LESSON_DELETE_REQUEST',
  LESSON_DELETE = 'LESSON_DELETE',
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
  TEST_STATE_FETCH = 'TEST_RESULTS_FETCH',
  TEST_STATE_FETCHED = 'TEST_RESULTS_FETCHED',
  TEST_SAVE_ANSWER_REQUEST = 'TEST_SAVE_ANSWER_REQUEST',
  TEST_SAVE_ANSWER = 'TEST_SAVE_ANSWER',
}

interface Credentials {
  access_token: string;
  refresh_token: string;
}

export type LoginAction = {type: ActionType.LOG_IN};

export type LoginRequestAction = {type: ActionType.LOG_IN_REQUEST};

export type LoginSuccessAction = {
  type: ActionType.LOG_IN_SUCCESS;
  credentials: Credentials | null;
};

export type LoginErrorAction = {
  type: ActionType.LOG_IN_ERROR;
  error: AxiosError;
};

export type LogoutAction = {type: ActionType.LOG_OUT};

export type UserInfoFetchAction = {type: ActionType.USER_INFO_FETCH};

export type UserInfoFetchedAction = {
  type: ActionType.USER_INFO_FETCHED;
  userInfo: UserInfo | AxiosError;
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

export type TeachersFetchAction = {type: ActionType.TEACHERS_FETCH};

export type TeachersFetchedAction = {
  type: ActionType.TEACHERS_FETCHED;
  teachers: TeacherInfo[] | AxiosError;
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
) => void;

export type TestStartErrorCallback = (
  testId: number,
  error: AxiosError,
) => void;

export type TestStartRequestAction = {
  type: ActionType.TEST_START_REQUEST;
  testId: number;
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
  onSuccess?: TestCompleteCallback;
  onError?: TestCompleteErrorCallback;
};

export type TestStateFetchAction = {
  type: ActionType.TEST_STATE_FETCH;
  testId: number;
};

export type TestStateFetchedAction = {
  type: ActionType.TEST_STATE_FETCHED;
  testId: number;
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
  answer: string;
  complete: boolean;
  onSuccess?: TestSaveAnswerCallback;
  onError?: TestSaveAnswerErrorCallback;
};

export type TestSaveAnswerAction = {
  type: ActionType.TEST_SAVE_ANSWER;
  testId: number;
  taskId: number;
  answerInfo: TestStateAnswerInfo;
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
  | TeachersFetchAction
  | TeachersFetchedAction
  | LessonsFetchAction
  | LessonsFetchedAction
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
  | LessonRevokeAction
  | LessonDeleteRequestAction
  | LessonDeleteAction
  | ParticipantsRevokeAction
  | ParticipantDeleteRequestAction
  | ParticipantDeleteAction
  | HomeworksRevokeAction
  | CoursesRevokeAction
  | CourseDeleteRequestAction
  | CourseDeleteAction
  | WebinarsRevokeAction
  | WebinarDeleteRequestAction
  | WebinarDeleteAction
  | TestStartRequestAction
  | TestFetchAction
  | TestFetchedAction
  | TestCompleteRequestAction
  | TestStateFetchAction
  | TestStateFetchedAction
  | TestSaveAnswerRequestAction
  | TestSaveAnswerAction
);
