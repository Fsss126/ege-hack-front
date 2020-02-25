import {AccountRoles, Permissions} from "./common";

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
    roles: AccountRoles[];
    permissions: Permissions[];
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

export interface WebinarDto {
    id: number;
    name: string;
    description?: string;
    date_start: number;
    duration: number;
}

interface WebinarScheduleDtoCommon {
    click_meeting_link:	string;
    webinars: WebinarDto[];
}

export interface WebinarScheduleDtoResp extends WebinarScheduleDtoCommon, RespWithImage {
    course_id: number;
}

export interface WebinarScheduleDtoReq extends WebinarScheduleDtoCommon, ReqWithImage {}

export interface PersonWebinarDto {
    subject_id: number;
    subject_name: string;
    course_id: number;
    course_name: string;
    webinar: WebinarDto;
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
    file_info: FileInfo;
}

export interface LessonDtoCommon {
    attachments: FileInfo[];
    course_id: number;
    description?: string;
    hometask?: HometaskDtoResp;
    image_link: string;
    is_locked: boolean;
    name: string;
    num: number;
    video_link?: string;
}

export interface LessonDtoReq extends LessonDtoCommon, ReqWithImage {}

export interface LessonDtoResp extends LessonDtoCommon, RespWithImage {
    id: number;
}

export interface HomeworkAssessmentDtoReq {
    comment?: string;
    mark?: number;
}

export interface HomeworkDtoResp extends HomeworkAssessmentDtoReq {
    date?: number;
    file_info?: FileInfo;
    lesson_id: number;
    pupil?: PupilDtoResp;
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

