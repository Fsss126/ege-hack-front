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

export interface PupilInfo extends Omit<PupilDtoReq, 'final_year'> {
  final_year?: Date;
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

export interface HomeworkInfo
  extends Omit<HomeworkDtoResp, 'date' | 'file_info' | 'pupil'> {
  date?: Date;
  files?: FileInfo[];
  pupil: PupilProfileInfo;
}

export type DiscountInfo = DiscountMessage;

export {AnswerType, TestStatus} from './dtos';

interface CommonTestStatusInfo {
  id: number;
  status: TestStatus;
  name: string;
  deadline?: Date;
  progress: number;
}

interface TestStatusActiveInfo extends CommonTestStatusInfo {
  status: TestStatus.STARTED | TestStatus.NOT_STARTED;
  started_at?: Date;
  is_completed: false;
  is_rated: false;
}

interface TestStatusAwaitingInfo extends CommonTestStatusInfo {
  status: TestStatus.AWAIT;
  started_at: Date;
  completed_at: Date;
  is_completed: true;
  is_rated: false;
}

interface TestStatusPassedInfo extends CommonTestStatusInfo {
  status: TestStatus.PASSED | TestStatus.NOT_STARTED;
  percentage: number;
  passed: boolean;
  started_at: Date;
  completed_at: Date;
  is_completed: true;
  is_rated: true;
}

export type TestStatusInfo =
  | TestStatusActiveInfo
  | TestStatusAwaitingInfo
  | TestStatusPassedInfo;

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
}

export type TestStateAnswerInfo =
  | TestStateActiveAnswerInfo
  | TestStatePassedAnswerInfo;

type CommonTestStateInfo = {
  id: number;
  status: TestStatus;
  last_task_id?: number;
  progress: number;
};

export interface TestStateActiveInfo extends CommonTestStateInfo {
  status: TestStatus.NOT_STARTED | TestStatus.STARTED;
  is_completed: false;
  is_rated: false;
  answers: {
    [key: number]: TestStateActiveAnswerInfo;
  };
}

export interface TestStateAwaitingInfo extends CommonTestStateInfo {
  status: TestStatus.AWAIT;
  percentage?: number;
  passed?: boolean;
  is_completed: true;
  is_rated: false;
  answers: {
    [key: number]: TestStateAwaitingAnswerInfo;
  };
}

export interface TestStatePassedInfo extends CommonTestStateInfo {
  status: TestStatus.PASSED | TestStatus.NOT_STARTED;
  percentage: number;
  passed: boolean;
  is_completed: true;
  is_rated: true;
  answers: {
    [key: number]: TestStatePassedAnswerInfo;
  };
}

export type TestStateInfo =
  | TestStateActiveInfo
  | TestStateAwaitingInfo
  | TestStatePassedInfo;

export interface KnowledgeLevelInfo {
  themes: ThemeInfo[];
  tasks: TaskInfo[];
}
