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
  PupilDtoResp,
  SubjectDtoResp,
  TaskDtoResp,
  TeacherDtoResp,
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

export interface CommonAccountInfo {
  id: number;
  vk_info: VkUserInfo;
  contacts: ContactInfo;
}

export interface PupilInfo
  extends Omit<PupilDtoResp, 'account_id' | 'vk_info'>,
    CommonAccountInfo {}

export interface TeacherInfo
  extends Omit<TeacherDtoResp, 'account_id' | 'vk_info'>,
    CommonAccountInfo {}

export interface AccountInfo
  extends Omit<AccountDtoResp, 'vk_info'>,
    CommonAccountInfo {}

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
    CommonAccountInfo {
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
  deadline: Date;
  files?: FileInfo[];
}

export interface LessonInfo
  extends Omit<LessonDtoResp, 'is_locked' | 'hometask' | 'test'> {
  locked: LessonDtoResp['is_locked'];
  assignment?: AssignmentInfo;
  watchProgress?: number;
  test?: TestStatusInfo;
}

export interface HomeworkInfo
  extends Omit<HomeworkDtoResp, 'date' | 'file_info' | 'pupil'> {
  date?: Date;
  files?: FileInfo[];
  pupil: PupilInfo;
}

export type DiscountInfo = DiscountMessage;

export {AnswerType, TestStatus} from './dtos';

export type TestStatusInfo = {
  id: number;
  status: TestStatus;
  name: string;
  deadline?: Date;
} & (
  | {
      status: TestStatus.COMPLETED;
      percentage: number;
      passed: number;
    }
  | {
      status: TestStatus.NOT_STARTED | TestStatus.STARTED;
      progress: number;
    }
);

export type CorrectAnswerInfo = CorrectAnswerDto;

export type TaskInfo = TaskDtoResp;

export interface SanitizedTaskAnswer {
  type: AnswerType;
}

export interface SanitizedTaskInfo
  extends Omit<TaskDtoResp, 'answer' | 'themeId' | 'subjectId'> {
  answer: SanitizedTaskAnswer;
}

export type ThemeInfo = ThemeDtoResp;

export interface TestInfo extends Omit<TestDtoResp, 'deadline'> {
  deadline?: Date;
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
  user_answer: UserAnswerInfo;
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
  last_task_id: number;
  progress: number;
};

export interface TestStateActiveInfo extends CommonTestStateInfo {
  status: TestStatus.NOT_STARTED | TestStatus.STARTED;
  answers: {
    [key: number]: TestStateActiveAnswerInfo;
  };
}

export interface TestStatePassedInfo extends CommonTestStateInfo {
  status: TestStatus.COMPLETED;
  percentage: number;
  passed: boolean;
  answers: {
    [key: number]: TestStatePassedAnswerInfo;
  };
}

export type TestStateInfo = TestStateActiveInfo | TestStatePassedInfo;
