import Auth from 'definitions/auth';
import _ from 'lodash';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {LearningStatus} from "../types/enums";
import {
    AccountDto,
    CourseDtoResp,
    CourseParticipantDto,
    HomeworkDtoResp,
    LessonDtoResp,
    PersonWebinarDto,
    TeacherDtoResp,
    UserInfoDtoResp,
    WebinarScheduleDtoResp
} from "../types/dtos";
import {
    AccountInfo,
    CourseInfo,
    CourseParticipantInfo,
    HomeworkInfo,
    LessonInfo, PersonWebinar,
    TeacherInfo,
    UserInfo, WebinarScheduleInfo
} from "../types/entities";
// import {handleRequestsWithTestData} from "./test";

export const API_ROOT = process.env.REACT_APP_API_ROOT;

const CancelToken = axios.CancelToken;

export const getCancelToken = () => {
    const source = CancelToken.source();
    return {
        token: source.token,
        cancel: source.cancel
    }
};

const getUrl = (config: AxiosRequestConfig) => {
    return new URL(`${config.baseURL}${config.url?.replace(config.baseURL || '', '')}`);
};

const APIRequest = axios.create({
    baseURL: API_ROOT,
    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        _.forEach(params, (value, key) => {
            if (value instanceof Array) {
                for(const element of value)
                    searchParams.append(key, element);
            } else {
                searchParams.append(key, value);
            }
        });
        return searchParams.toString();
    }
});

APIRequest.interceptors.request.use(function (config) {
    const url = getUrl(config);
    if (/\/login/.test(url.pathname))
        return config;
    try {
        return {
            ...config,
            headers: {
                'Authorization': Auth.getAccessToken()
            }
        }
    } catch (e) {
        throw new axios.Cancel(e.message);
    }
});

const transformCourse =
    ({
         date_start,
         date_end,
         image_link,
         teacher_id,
         ...rest}: CourseDtoResp): CourseInfo => ({
        date_start: new Date(date_start),
        date_end: new Date(date_end),
        image_link: `${API_ROOT}${image_link}`,
        teacher_ids: [teacher_id],
        ...rest
    });

const transformLesson =
    ({
         hometask,
         video_link,
         image_link,
         is_locked: locked,
         attachments,
         ...lesson}: LessonDtoResp): LessonInfo => ({
            ...lesson,
            locked,
            image_link: `${API_ROOT}${image_link}`,
            video_link: `https://player.vimeo.com/video/${video_link}`,
            attachments: attachments ? (
                attachments.map(({file_name, file_link, file_id}) => ({
                        file_name,
                        file_id,
                        file_link: `${API_ROOT}${file_link}?disp=attachment`}
                ))) : [],
            assignment: hometask ? ({
                deadline: new Date(hometask.deadline),
                description: hometask.description,
                files: hometask.file_info ? [
                    {
                        ...hometask.file_info,
                        // downloadName: hometask.file_info.file_name,
                        file_link: `${API_ROOT}${hometask.file_info.file_link}?disp=attachment`},
                ] : undefined,
            }) : hometask
        }
    );

const transformUser = <T extends AccountDto | UserInfoDtoResp, R extends AccountInfo>(accountDto: T): R => {
    const {account_id: id, vk_info, instagram, ...user} = accountDto as any;
    const {photo_max: photo, first_name, last_name, ...info} = vk_info || {};
    return ({
        id,
        ...user,
        vk_info: vk_info ? {
            ...info,
            photo,
            first_name,
            last_name,
            full_name: `${first_name} ${last_name}`
        } : undefined,
        contacts: {
            ig: instagram,
            vk: `https://vk.com/id${vk_info.id}`
        }
    });
};

const transformHomework =
    ({
         file_info,
         pupil,
         date,
         ...rest}: HomeworkDtoResp): HomeworkInfo => (
        {
            ...rest,
            date: date ? new Date(date) : undefined,
            files: file_info ? [
                {
                    ...file_info,
                    file_link: `${API_ROOT}${file_info.file_link}?disp=attachment`
                }
            ] : undefined,
            pupil: transformUser(pupil)
        }
    );

//Interceptors
const transformData = (response: AxiosResponse): AxiosResponse => {
    const {config, data} = response;
    const url = getUrl(config);
    const getData = (): any => {
        switch (true) {
            case url.pathname === '/accounts/info':
                return transformUser<UserInfoDtoResp, UserInfo>(data);
            case url.pathname === '/accounts/teachers':
                return (data as TeacherDtoResp[]).map<TeacherInfo>(transformUser);
            case /\/accounts\/teachers\/(\w*)$/.test(url.pathname):
                return transformUser<TeacherDtoResp, TeacherInfo>(data as TeacherDtoResp);
            case /\/courses\/(\w*)\/participants$/.test(url.pathname):
                return (data as CourseParticipantDto[]).map<CourseParticipantInfo>(participant => ({
                    ...transformUser(participant),
                    join_date_time: new Date(participant.join_date_time)
                }));
            case /\/courses(\/\w*)?$/.test(url.pathname): {
                if (config.method === 'get') {
                    return (data as CourseDtoResp[]).map<CourseInfo>((course) => ({
                        ...transformCourse(course),
                        status: config.params && config.params.group === 'PERSON' ? LearningStatus.LEARNING : undefined
                    }));
                } else {
                    return transformCourse(data);
                }
            }
            case /\/lessons(\/\w*)?$/.test(url.pathname): {
                if (config.method === 'get')
                    return _.sortBy(data as LessonDtoResp[], 'num').map<LessonInfo>(transformLesson);
                else
                    return transformLesson(data);
            }
            case /\/lessons\/(\w*)\/homeworks$/.test(url.pathname): {
                return (data as HomeworkDtoResp[]).map<HomeworkInfo>(transformHomework);
            }
            case /\/lessons\/(\w*)\/homeworks\/pupil/.test(url.pathname): {
                if (config.method === 'get' || config.method === 'put' || config.method === 'patch')
                    return transformHomework(data);
            }
            case url.pathname === '/courses/schedule/person':
            case /\/courses\/\w*\/schedule\/person$/.test(url.pathname): {
                return _.sortBy((data as PersonWebinarDto[]).map<PersonWebinar>(({webinar: {date_start, duration, ...webinar}, image_link, ...rest}) => ({
                    date_start: new Date(date_start),
                    date_end: new Date(date_start + duration * 1000 * 60),
                    duration,
                    image_link: `${API_ROOT}${image_link}`,
                    ...webinar,
                    ...rest
                })), 'date_start');
            }
            case /\/courses\/\w*\/schedule$/.test(url.pathname): {
                if (!data)
                    return data;
                const {image_link: link, webinars, ...rest} = data as WebinarScheduleDtoResp;
                const image_link = `${API_ROOT}${link}`;
                return ({
                    image_link,
                    webinars: webinars.map(({date_start, duration, ...webinar}) => ({
                        ...webinar,
                        date_start: new Date(date_start),
                        date_end: new Date(date_start + duration * 1000 * 60),
                        duration,
                        image_link
                    })),
                    ...rest
                }) as WebinarScheduleInfo;
            }
            default:
                return response.data;
        }
    };
    return getData();
};
const transformError = (error: AxiosError) => {
    if (!error.toJSON)
        throw error;
    const {config} = error;
    const url = getUrl(config);
    if (config.method !== 'get')
        throw error;
    if (error.response && error.response.status === 404) {
        switch (true) {
            case /\/lessons\/(\w*)\/homeworks\/pupil$/.test(url.pathname):
                return null;
            case /\/courses\/\w*\/schedule$/.test(url.pathname):
                return {webinars: []};
            default:
                throw error;
        }
    }
    else
        throw error;
};
APIRequest.interceptors.response.use(transformData, transformError);

//returns test data for all failed requests
// handleRequestsWithTestData(APIRequest);

window.APIRequest = APIRequest;

export default APIRequest;
