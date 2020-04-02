import {AxiosRequestConfig} from "axios";

export const getUrl = (config: AxiosRequestConfig) => {
    return new URL(`${config.baseURL}${config.url?.replace(config.baseURL || '', '')}`);
};
