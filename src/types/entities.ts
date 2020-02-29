import {
    CourseDtoResp,
    CourseParticipantDto, DiscountMessage, FileInfo, HometaskDtoResp, HomeworkDtoResp, LessonDtoResp,
    LoginResp, PersonWebinarDto,
    PupilDtoResp,
    SubjectDtoResp,
    TeacherDtoResp,
    UserInfoDtoResp,
    VkUserDto,
    WebinarDto, WebinarScheduleDtoResp
} from "./dtos";
import {LearningStatus} from "./enums";

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

export interface AccountInfo {
    id: number;
    vk_info: VkUserInfo;
    contacts: ContactInfo;
}

export interface PupilInfo extends Omit<PupilDtoResp, 'account_id' | 'vk_info'>, AccountInfo {
}

export interface TeacherInfo extends Omit<TeacherDtoResp, 'account_id' | 'vk_info'>, AccountInfo {
}

export interface UserInfo extends Omit<UserInfoDtoResp, 'vk_info'>, AccountInfo {
}

export interface CourseInfo extends Omit<CourseDtoResp, 'date_start' | 'date_end' | 'teacher_id'> {
    date_start: Date;
    date_end: Date;
    teacher_ids: CourseDtoResp['teacher_id'][];
}

export interface UserCourseInfo extends CourseInfo {
    status: LearningStatus;
}

export interface CourseParticipantInfo extends Omit<CourseParticipantDto, 'account_id' | 'vk_info' | 'join_date_time'>, AccountInfo {
    join_date_time: Date;
}

export interface WebinarInfo extends Omit<WebinarDto, 'date_start'>{
    date_start: Date;
    date_end: Date;
}

export interface WebinarScheduleInfo extends Omit<WebinarScheduleDtoResp, 'webinars'>{
    webinars: WebinarInfo[];
}

export interface PersonWebinar extends Omit<PersonWebinarDto, 'webinar'>,  WebinarInfo {
}

export interface AssignmentInfo extends Omit<HometaskDtoResp, 'deadline' | 'file_info'> {
    deadline: Date;
    files?: FileInfo[];
}

export interface LessonInfo extends Omit<LessonDtoResp, 'is_locked' | 'hometask'> {
    locked: LessonDtoResp['is_locked'];
    assignment?: AssignmentInfo;
}

export interface HomeworkInfo extends Omit<HomeworkDtoResp, 'date' | 'file_info' | 'pupil'>{
    date?: Date;
    files?: FileInfo[];
    pupil: PupilInfo;
}

export type DiscountInfo = DiscountMessage;
