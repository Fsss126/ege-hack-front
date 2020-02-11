import Auth from 'definitions/auth';
import _ from 'lodash';
import axios from 'axios';
// import {handleRequestsWithTestData} from "./test";
import {LEARNING_STATUS} from "definitions/constants";

export const API_ROOT = process.env.REACT_APP_API_ROOT;

const CancelToken = axios.CancelToken;

export const getCancelToken = () => {
    const source = CancelToken.source();
    return {
        token: source.token,
        cancel: source.cancel
    }
};

const APIRequest = axios.create({
    baseURL: API_ROOT,
    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        _.forEach(params, (value, key) => {
            if (value instanceof Array) {
                for(let element of value)
                    searchParams.append(key, element);
            } else {
                searchParams.append(key, value);
            }
        });
        return searchParams.toString();
    }
});

APIRequest.interceptors.request.use(function (config) {
    try {
        return {
            auth: {
                username: Auth.getUserId(),
                password: Auth.getUserPassword()
            },
            ...config
        }
    } catch (e) {
        throw new axios.Cancel(e.message);
    }
});

const transformCourse = ({date_start, date_end, image_link, teacher_id, is_online, ...rest}) => ({
    date_start: new Date(date_start),
    date_end: new Date(date_end),
    image_link: `${API_ROOT}${image_link}`,
    teacher_ids: [teacher_id],
    ...rest
});

const transformLesson = ({hometask, video_link, image_link, is_locked: locked, attachments, ...lesson}) => ({
    ...lesson,
    locked,
    image_link: `${API_ROOT}${image_link}`,
    video_link: `https://player.vimeo.com/video/${video_link}`,
    attachments: attachments ? (
        attachments.map(({file_name, file_link, file_id}) => ({
                file_name,
                file_id,
                file_link: `${API_ROOT}${file_link}?disp=attachment`}
        ))) : (attachments),
    assignment: hometask ? ({
        deadline: hometask.deadline ? new Date(hometask.deadline) : hometask.deadline,
        description: hometask.description,
        files: hometask.file_info ? [
            {
                ...hometask.file_info,
                // downloadName: hometask.file_info.file_name,
                file_link: `${API_ROOT}${hometask.file_info.file_link}?disp=attachment`},
        ] : hometask.file_link,
    }) : hometask
});

const transformUser = ({account_id: id, vk_info: {photo_max: photo, first_name, last_name, ...vk_info}, instagram, ...user}) => ({
    id,
    ...user,
    vk_info: {
        ...vk_info,
        photo,
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`
    },
    contacts: {
        ig: instagram,
        vk: `https://vk.com/id${id}`
    }
});

//Interceptors
const transformData = (response) => {
    const {config, data} = response;
    const url = new URL(`${config.baseURL}${config.url.replace(config.baseURL, '')}`);
    switch (true) {
        case url.pathname === '/accounts/teachers':
            return data.map(transformUser);
        case /\/accounts\/teachers\/(\w*)$/.test(url.pathname):
            return transformUser(data);
        case /\/courses\/(\w*)\/participants$/.test(url.pathname):
            return data.map(transformUser);
        case /\/courses(\/\w*)?$/.test(url.pathname): {
            if (config.method === 'get') {
                return data.map((course) => ({
                    ...transformCourse(course),
                    status: config.params && config.params.group === 'PERSON' ? LEARNING_STATUS.learning : undefined
                }));
            } else {
                return transformCourse(data);
            }
        }
        case /\/lessons(\/\w*)?$/.test(url.pathname): {
            if (config.method === 'get')
                return _.sortBy(data, 'num').map(transformLesson);
            else
                return transformLesson(data);
        }
        case /\/lessons\/(\w*)\/homeworks\/pupil$/.test(url.pathname): {
            const {file_info: {file_id, file_name, file_link}, date:dateTime, ...rest} = data;
            const date = new Date();
            return {
                ...rest,
                date,
                files: [
                    {
                        file_name,
                        file_id,
                        file_link: `${API_ROOT}${file_link}?disp=attachment`
                    }
                ]
            };
        }
        case url.pathname === '/courses/schedule/person':
        case /\/courses\/\w*\/schedule\/person$/.test(url.pathname): {
            return _.sortBy(data.map(({webinar: {date_start, duration, ...webinar}, image_link, ...rest}) => ({
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
            const {image_link: link, webinars, ...rest} = data;
            const image_link = `${API_ROOT}${link}`;
            return {
                image_link,
                webinars: webinars.map(({date_start, duration, ...webinar}) => ({
                    ...webinar,
                    date_start: new Date(date_start),
                    date_end: new Date(date_start + duration * 1000 * 60),
                    duration,
                    image_link
                })),
                ...rest
            };
        }
        default:
            return response.data;
    }
};
const transformError = (error) => {
    if (!error.toJSON)
        throw error;
    const {config} = error.toJSON();
    if (config.method !== 'get')
        throw error;
    const url = new URL(config.url);
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
