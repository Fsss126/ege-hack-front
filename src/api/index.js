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

const getUrl = (config) => {
    return  new URL(`${config.baseURL}${config.url.replace(config.baseURL, '')}`);
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

const transformUser = ({account_id: id, vk_info, instagram, ...user}) => {
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
            vk: `https://vk.com/id${id}`
        }
    });
};

const transformHomework = ({file_info, pupil, date, ...rest}) => (
    {
        ...rest,
        date: new Date(date),
        files: file_info ? [
            {
                ...file_info,
                file_link: `${API_ROOT}${file_info.file_link}?disp=attachment`
            }
        ] : undefined,
        pupil: pupil ? transformUser(pupil) : pupil
    }
);

//Interceptors
const transformData = (response) => {
    const {config, data} = response;
    const url = getUrl(config);
    switch (true) {
        case url.pathname === '/accounts/teachers':
            return data.map(transformUser);
        case /\/accounts\/teachers\/(\w*)$/.test(url.pathname):
            return transformUser(data);
        case /\/courses\/(\w*)\/participants$/.test(url.pathname):
            return data.map(participant => ({
                ...transformUser(participant),
                join_date_time: new Date(participant.join_date_time)
            }));
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
        case /\/lessons\/(\w*)\/homeworks$/.test(url.pathname): {
            return data.map(transformHomework);
        }
        case /\/lessons\/(\w*)\/homeworks\/pupil/.test(url.pathname): {
            if (config.method === 'get' || config.method === 'put' || config.method === 'patch')
            return transformHomework(data);
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
    const url = getUrl(config);
    if (/\/login/.test(url.pathname)) {
        return {
            "access_token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNTQ3OTI0MzksImVtYWlsIjoicHBwQG1haWwucnUifQ.HC1Uk6fpaXDm8xbBfpSbs4fE9uhcczk4Mxa-kDhEOuA'
        }
    }
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
