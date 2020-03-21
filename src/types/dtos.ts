import {AccountRole, Permission} from "./enums";

export interface LoginResp {
    access_token: string;
    refresh_token: string;
}

interface RespWithImage {
    image_link:	string;
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

export interface UserInfoDtoResp {
    id: number;
    email?: string;
    roles: AccountRole[];
    permissions: Permission[];
    vk_info: VkUserDto;
    pupil?: PupilDtoReq & { account_id: number };
    teacher?: TeacherDtoReq & { account_id: number };
}

export interface CourseDtoCommon {
    subject_id: number;
    teacher_id: number;
    name: string;
    description?: string;
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
    click_meeting_link:	string;
}

export interface WebinarScheduleDtoResp extends WebinarScheduleDtoCommon, RespWithImage {
    course_id: number;
    webinars: WebinarDtoResp[];
}

export interface WebinarScheduleDtoReq extends WebinarScheduleDtoCommon, ReqWithImage {
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
    deadline: number;
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
    video_link?: string;
}

export interface LessonDtoReq extends LessonDtoCommon, ReqWithImage {
    attachments: string[];
}

export interface LessonDtoResp extends LessonDtoCommon, RespWithImage {
    id: number;
    attachments: FileInfo[];
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
    FILE = 'FILE'
}
export interface CorrectAnswerDto {
    type: AnswerType;
    value?: string | number;
    videoSolution?: string;
    textSolution?: string;
}

export interface TaskDtoResp extends Partial<RespWithImage>{
    id: number;
    text: string;
    complexity: number;
    weight: number;
    subjectId: number;
    themeId: number;
    order: number;
    answer: CorrectAnswerDto;
}

export interface ThemeDtoResp {
    id: number;
    title: string;
    subjectId: number;
    parentThemeId?: number;
    order: number;
}

export interface TestDtoResp {
    id: number;
    name: string;
    percentage: number;
    tasks: TaskDtoResp[];
}

export enum TestStatus {
    PASSED = 'PASSED',
    STARTED = 'STARTED',
    NOT_STARTED = 'NOT_STARTED',
}

export interface TestStatusResp {
    status: TestStatus;
    percentage: number;
}

export interface UserAnswerDtoCommon {
    task_id: number;
}

export interface UserAnswerDtoReq extends UserAnswerDtoCommon {
    user_answer: string | number;
}

export interface UserAnswerDtoResp extends UserAnswerDtoCommon {
    user_answer: string | number | FileInfo;
}

export interface StartTestDtoResp {
    last_task_id: number;
    answers: UserAnswerDtoResp[];
}

export interface TestResultAnswerDtoResp extends UserAnswerDtoResp {
    right_answer: CorrectAnswerDto;
}

export interface TestResultsDtoResp {
    percentage: number;
    answers: TestResultAnswerDtoResp[];
}


