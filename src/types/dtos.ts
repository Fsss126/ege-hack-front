import {AccountRole, Permission} from './enums';

export interface LoginResp {
  access_token: string;
  refresh_token: string;
}

interface RespWithImage {
  image_link: string;
}

interface ReqWithImage {
  image: string;
}

interface SubjectDtoCommon {
  name: string;
  description?: string;
}

export interface SubjectDtoResp extends SubjectDtoCommon, RespWithImage {
  id: number;
}

export interface SubjectDtoReq extends SubjectDtoCommon, ReqWithImage {}

export interface VkUserDto {
  first_name: string;
  id: number;
  last_name: string;
  photo_max: string;
}

export interface AccountDto {
  account_id: number;
  vk_info: VkUserDto;
}

export interface PupilDtoReq {
  instagram?: string;
  city?: string;
  school?: string;
  final_year?: number;
}

export interface PupilDtoResp extends PupilDtoReq, AccountDto {}

export interface TeacherDtoReq {
  bio?: string;
  instagram?: string;
}

export interface TeacherDtoResp extends TeacherDtoReq, AccountDto {
  subjects: SubjectDtoResp[];
}

export interface AccountDtoReq {
  pupil?: PupilDtoReq;
  teacher?: TeacherDtoReq;
}

export interface AccountsRoleReq {
  accounts: string[];
  role: AccountRole;
}

export interface AccountDtoResp {
  id: number;
  email?: string;
  roles: AccountRole[];
  permissions: Permission[];
  vk_info: VkUserDto;
  pupil?: PupilDtoReq & {account_id: number};
  teacher?: TeacherDtoReq & {account_id: number};
}

export interface CourseDtoCommon {
  subject_id: number;
  teacher_id: number;
  name: string;
  description?: string;
  spread_sheet_link?: string;
  price: number;
  date_start: number;
  date_end: number;
  online: boolean;
  hide_from_market: boolean;
}

export interface CourseDtoResp extends CourseDtoCommon, RespWithImage {
  id: number;
  purchased?: boolean;
}

export interface CourseDtoReq extends CourseDtoCommon, ReqWithImage {}

export interface PaymentReq {
  email: string;
  courses: number[];
}

export interface CourseParticipantDto extends AccountDto {
  course_id: number;
  join_date_time: number;
}

export interface WebinarDtoCommon {
  name: string;
  description?: string;
  date_start: number;
  duration: number;
}

export interface WebinarDtoResp extends WebinarDtoCommon {
  id: number;
}

export interface WebinarDtoReq extends WebinarDtoCommon {
  id?: number;
}

interface WebinarScheduleDtoCommon {
  click_meeting_link: string;
}

export interface WebinarScheduleDtoResp
  extends WebinarScheduleDtoCommon,
    RespWithImage {
  course_id: number;
  webinars: WebinarDtoResp[];
}

export interface WebinarScheduleDtoReq
  extends WebinarScheduleDtoCommon,
    ReqWithImage {
  webinars: WebinarDtoReq[];
}

export interface PersonWebinarDto {
  subject_id: number;
  subject_name: string;
  course_id: number;
  course_name: string;
  webinar: WebinarDtoResp;
  image_link: string;
}

export interface FileInfo {
  file_id: string;
  file_name: string;
  file_link: string;
}

export interface HometaskDtoResp {
  deadline?: number;
  description?: string;
  file_info?: FileInfo;
}

export interface HometaskDtoReq {
  deadline: number;
  description?: string;
  file?: string;
}

export interface LessonDtoCommon {
  course_id: number;
  description?: string;
  hometask?: HometaskDtoResp;
  is_locked: boolean;
  name: string;
  num: number;
  video_link: string;
}

export interface LessonDtoReq extends LessonDtoCommon, ReqWithImage {
  attachments: string[];
  test_id?: number;
}

export interface LessonDtoResp extends LessonDtoCommon, RespWithImage {
  id: number;
  attachments: FileInfo[];
  test_id?: number;
}

export interface HomeworkAssessmentDtoReq {
  comment?: string;
  mark?: number;
}

export interface HomeworkDtoResp extends HomeworkAssessmentDtoReq {
  date?: number;
  file_info?: FileInfo;
  lesson_id: number;
  pupil: PupilDtoResp;
}

export interface HomeworkDtoReq {
  file: string;
}

export interface DiscountMessage {
  discount: number;
  discounted_price: number;
  message?: string;
}

export interface LoginVkReq {
  code: string;
  redirect_uri: string;
}

export interface AddParticipantsReq {
  accounts: string[];
}

export interface LinkResp {
  link: string;
}

export enum AnswerType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  FILE = 'FILE',
}

export interface CorrectAnswerDto {
  type: AnswerType;
  text_value?: string;
  num_value?: number;
}

export interface SolutionDto {
  text_value?: string;
  video_value?: string;
}

interface TaskDtoCommon {
  name: string;
  text: string;
  complexity?: number;
  score: number;
  subject_id: number;
  theme_id?: number;
  answer: CorrectAnswerDto;
  solution?: SolutionDto;
}

export interface TaskDtoReq extends TaskDtoCommon, Partial<ReqWithImage> {}

export interface TaskDtoResp extends TaskDtoCommon, Partial<RespWithImage> {
  id: number;
}

interface ThemeDtoCommon {
  name: string;
  subject_id: number;
  parent_theme_id?: number;
}

export interface ThemeDtoReq extends ThemeDtoCommon {}

export interface ThemeDtoResp extends ThemeDtoCommon {
  id: number;
  has_sub_themes: boolean;
  has_sub_tasks: boolean;
}

interface TestDtoCommon {
  name: string;
  deadline?: number;
  pass_criteria: number;
}

export interface TestDtoReq extends TestDtoCommon {
  task_ids: number[];
}

export interface TestDtoResp extends TestDtoCommon {
  id: number;
  tasks: TaskDtoResp[];
}

export enum TestStatus {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  AWAIT = 'AWAIT',
  PASSED = 'PASSED',
  NOT_PASSED = 'NOT_PASSED',
}

export interface TestStatusResp {
  id: number;
  name: string;
  status: TestStatus;
  progress: number;
  deadline?: number;
  percentage?: number;
  passed?: boolean;
  started_at?: number;
  completed_at?: number;
}

export interface UserAnswerDtoCommon {
  task_id: number;
}

export interface UserAnswerDtoReq extends UserAnswerDtoCommon {
  user_answer: string | number;
}

export interface UserAnswerDtoResp {
  type: AnswerType;
  value?: string | number;
  file_info?: FileInfo;
}

export interface TestStateAnswerDto {
  task_id: number;
  user_answer?: UserAnswerDtoResp;
  correct_answer?: CorrectAnswerDto;
  solution?: SolutionDto;
  is_correct?: boolean;
}

export interface TestAnswerResp
  extends Require<TestStateAnswerDto, 'user_answer'> {}

export interface TestStateDtoResp {
  id: number;
  status: TestStatus;
  progress?: number;
  percentage?: number;
  passed?: boolean;
  last_task_id?: number;
  answers: TestStateAnswerDto[];
}

export interface KnowledgeLevelDtoResponse {
  themes: ThemeDtoResp[];
  tasks: TaskDtoResp[];
}
