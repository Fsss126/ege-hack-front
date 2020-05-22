import {
  AccountDtoResp,
  AnswerType,
  CorrectAnswerDto,
  CourseDtoResp,
  CourseParticipantDto,
  DiscountMessage,
  FileInfo,
  HometaskDtoResp,
  HomeworkDtoResp,
  LessonDtoResp,
  LoginResp,
  PersonWebinarDto,
  PupilDtoReq,
  SubjectDtoResp,
  TaskDtoResp,
  TeacherDtoReq,
  TestDtoResp,
  TestStatus,
  ThemeDtoResp,
  VkUserDto,
  WebinarDtoResp,
  WebinarScheduleDtoResp,
} from './dtos';
import {LearningStatus} from './enums';

export type Credentials = LoginResp;

export type SubjectInfo = SubjectDtoResp;

export interface VkUserInfo extends Omit<VkUserDto, 'photo_max'> {
  photo: VkUserDto['photo_max'];
  full_name: string;
}

export interface ContactInfo {
  vk?: string;
  ig?: string;
  fb?: string;
  ok?: string;
}

export interface ProfileInfo {
  id: number;
  vk_info: VkUserInfo;
  contacts: ContactInfo;
}

export interface PupilInfo extends PupilDtoReq {
  grade?: number;
}

export interface PupilProfileInfo
  extends Omit<PupilInfo, 'instagram'>,
    ProfileInfo {}

export interface TeacherInfo extends Omit<TeacherDtoReq, 'instagram'> {}

export interface TeacherProfileInfo extends TeacherInfo, ProfileInfo {
  subjects: SubjectInfo[];
}

export interface AccountInfo
  extends Omit<AccountDtoResp, 'vk_info' | 'pupil' | 'teacher'>,
    ProfileInfo {
  pupil?: PupilInfo;
  teacher?: TeacherInfo;
}

export interface TeacherAccountInfo extends Require<AccountInfo, 'teacher'> {}

export interface PupilAccountInfo extends Require<AccountInfo, 'pupil'> {}

export interface CourseInfo
  extends Omit<CourseDtoResp, 'date_start' | 'date_end' | 'teacher_id'> {
  date_start: Date;
  date_end: Date;
  teacher_ids: CourseDtoResp['teacher_id'][];
}

export type BasicAccountInfo = Omit<AccountInfo, 'permissions' | 'roles'>;

export interface UserCourseInfo extends CourseInfo {
  status: LearningStatus;
}

export interface CourseParticipantInfo
  extends Omit<
      CourseParticipantDto,
      'account_id' | 'vk_info' | 'join_date_time'
    >,
    ProfileInfo {
  join_date_time: Date;
}

export interface WebinarInfo extends Omit<WebinarDtoResp, 'date_start'> {
  date_start: Date;
  date_end: Date;
  image_link: string;
}

export interface WebinarScheduleInfo
  extends Omit<WebinarScheduleDtoResp, 'webinars'> {
  webinars: WebinarInfo[];
}

export interface PersonWebinar
  extends Omit<PersonWebinarDto, 'webinar'>,
    WebinarInfo {}

export interface AssignmentInfo
  extends Omit<HometaskDtoResp, 'deadline' | 'file_info'> {
  deadline?: Date;
  files?: FileInfo[];
}

export interface LessonInfo
  extends Omit<LessonDtoResp, 'is_locked' | 'hometask'> {
  locked: LessonDtoResp['is_locked'];
  assignment?: AssignmentInfo;
  watchProgress?: number;
}

export interface UserHomeworkInfo
  extends Omit<HomeworkDtoResp, 'date' | 'file_info' | 'pupil'> {
  date?: Date;
  files?: FileInfo[];
}

export interface HomeworkInfo extends UserHomeworkInfo {
  pupil: PupilProfileInfo;
}

export type DiscountInfo = DiscountMessage;

export {AnswerType, TestStatus} from './dtos';

interface CommonTestStatusFields {
  status: TestStatus;
  progress: number;
}

interface TestStatusActiveInfo extends CommonTestStatusFields {
  status: TestStatus.STARTED | TestStatus.NOT_STARTED;
  started_at?: Date;
  is_completed: false;
  is_rated: false;
}

interface TestStatusAwaitingInfo extends CommonTestStatusFields {
  status: TestStatus.AWAIT;
  started_at: Date;
  completed_at: Date;
  is_completed: true;
  is_rated: false;
  percentage?: number;
  passed?: boolean;
}

interface TestStatusPassedInfo extends CommonTestStatusFields {
  status: TestStatus.PASSED | TestStatus.NOT_STARTED;
  started_at: Date;
  completed_at: Date;
  is_completed: true;
  is_rated: true;
  percentage: number;
  passed: boolean;
}

export type CommonTestStatusInfo =
  | TestStatusActiveInfo
  | TestStatusAwaitingInfo
  | TestStatusPassedInfo;

export type TestStatusInfo = {
  id: number;
  name: string;
  deadline?: Date;
  last_task_id?: number;
  pass_criteria: number;
} & CommonTestStatusInfo;

export interface CorrectAnswerInfo {
  type: AnswerType;
  value?: string | number;
  video_solution?: string;
  text_solution?: string;
}

export interface TaskInfo extends Omit<TaskDtoResp, 'solution' | 'answer'> {
  answer: CorrectAnswerInfo;
}

export interface TestTaskInfo extends TaskInfo {
  order: number;
}

export interface SanitizedTaskAnswer {
  type: AnswerType;
}

export interface SanitizedTaskInfo
  extends Omit<TaskDtoResp, 'answer' | 'theme_id' | 'subject_id' | 'solution'> {
  order: number;
  answer: SanitizedTaskAnswer;
}

export type ThemeInfo = ThemeDtoResp;

export interface TestInfo extends Omit<TestDtoResp, 'deadline' | 'tasks'> {
  deadline?: Date;
  tasks: TestTaskInfo[];
}

export interface SanitizedTestInfo extends Omit<TestInfo, 'tasks'> {
  tasks: SanitizedTaskInfo[];
}

export type UserAnswerInfo = {type: AnswerType} & (
  | {type: AnswerType.TEXT; value: string}
  | {type: AnswerType.NUMBER; value: number}
  | {type: AnswerType.FILE; value: FileInfo}
);

export type TestAnswerValue = UserAnswerInfo['value'];

export interface TestStateActiveAnswerInfo {
  task_id: number;
  user_answer?: UserAnswerInfo;
}

export interface TestStateAwaitingAnswerInfo extends TestStateActiveAnswerInfo {
  correct_answer?: CorrectAnswerDto;
  is_correct?: boolean;
}

export interface TestStatePassedAnswerInfo extends TestStateActiveAnswerInfo {
  correct_answer: CorrectAnswerDto;
  is_correct: boolean;
  passed: boolean;
}

export type TestStateAnswerInfo =
  | TestStateActiveAnswerInfo
  | TestStatePassedAnswerInfo;

interface CommonTestStateInfo {
  last_task_id?: number;
  deadline?: Date;
}

export interface TestStateActiveInfo
  extends TestStatusActiveInfo,
    CommonTestStateInfo {
  answers: {
    [key: number]: TestStateActiveAnswerInfo;
  };
}

export interface TestStateAwaitingInfo
  extends TestStatusAwaitingInfo,
    CommonTestStateInfo {
  answers: {
    [key: number]: TestStateAwaitingAnswerInfo;
  };
}

export interface TestStatePassedInfo
  extends TestStatusPassedInfo,
    CommonTestStateInfo {
  answers: {
    [key: number]: TestStatePassedAnswerInfo;
  };
}

export type TestStateInfo =
  | TestStateActiveInfo
  | TestStateAwaitingInfo
  | TestStatePassedInfo;

export type TestCheckingStatusInfo = CommonTestStatusInfo;

export interface TestResultInfo {
  test_id: number;
  status: TestCheckingStatusInfo;
  pupil: PupilProfileInfo;
}

export interface KnowledgeLevelInfo {
  themes: ThemeInfo[];
  tasks: TaskInfo[];
}
