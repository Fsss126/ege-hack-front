import Auth from 'definitions/auth';
import _ from 'lodash';
import axios from 'axios';
// import {handleRequstsWithTestData} from "./test";
import {LEARNING_STATUS} from "definitions/constants";
import {getFileExtension} from "definitions/helpers";

export const API_ROOT = 'https://egehackbottest.tk';

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
    if (Auth.user) {
        return {
            auth: {
                username: Auth.user.uid,
                password: Auth.user.hash
            },
            ...config
        }
    }
    else
        throw new axios.Cancel('User not logged in.');
});

//Interceptors
const transformData = (response) => {
    const {config, data} = response;
    const url = new URL(config.url);
    switch (true) {
        case url.pathname === '/accounts/teachers':
            return data.map(({account_id: id, ...teacher}) => ({id, ...teacher}));
        case url.pathname === '/courses':
            return data.map(({date_start, date_end, image_link, teacher_id, ...rest}) => ({
                date_start: new Date(date_start),
                date_end: new Date(date_end),
                image_link: `${API_ROOT}${image_link}`,
                teacher_ids: [teacher_id],
                status: config.params.group === 'PERSON' ? LEARNING_STATUS.learning : undefined,
                ...rest
            }));
        case url.pathname === '/lessons':
            return _.sortBy(data, 'num').map(({hometask, ...lesson}) => ({
                ...lesson,
                image_link: `${API_ROOT}${lesson.image_link}`,
                assignment: hometask ? ({
                    deadline: hometask.deadline ? new Date(hometask.deadline) : hometask.deadline,
                    description: hometask.description,
                    files: hometask.file_link ? [
                        {
                            name: "Задание",
                            downloadName: `Задание${getFileExtension(hometask.file_link)}`,
                            url: `${API_ROOT}${hometask.file_link}?disp=attachment`},
                    ] : hometask.file_link,
                }) : hometask
            }));
        case /\/lessons\/(.*)\/homeworks\/pupil$/.test(url.pathname):
            const {file_link:file, date:dateTime, ...rest} = response.data;
            const date = new Date();
            return {
                ...rest,
                date,
                files: [
                    {
                        original_file_name: `Загруженное_решение${getFileExtension(file)}`,
                        id_file_name: file,
                        file_link: `${API_ROOT}/files/${file}?disp=attachment`
                    }
                ]
            };
        case url.pathname === '/courses/schedule/person':
        case /\/courses\/(.*)\/schedule\/person$/.test(url.pathname):
            return _.sortBy(data.map(({webinar: {date_start, duration, ...webinar}, image_link, ...rest}) => ({
                date_start: new Date(date_start),
                date_end: new Date(date_start + duration * 1000 * 60),
                duration,
                image_link: `${API_ROOT}${image_link}`,
                ...webinar,
                ...rest
            })), 'date_start');
        default:
            return response.data;
    }
};
const transformError = (error) => {
    if (!error.toJSON)
        throw error;
    const {config} = error.toJSON();
    const url = new URL(config.url);
    if (error.response && error.response.status === 404) {
        switch (true) {
            case /\/lessons\/(.*)\/homeworks\/pupil$/.test(url.pathname):
                return ({data: {}});
            default:
                throw error;
        }
    }
    else
        throw error;
};
APIRequest.interceptors.response.use(transformData, transformError);

//returns test data for all failed requests
// handleRequstsWithTestData(APIRequest);

window.APIRequest = APIRequest;

export default APIRequest;
