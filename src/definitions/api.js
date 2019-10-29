import Auth from 'definitions/auth';
import axios from 'axios';

export const API_ROOT = 'https://egehackbottest.tk:8080';

const APIRequest = axios.create({
    baseURL: API_ROOT
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

APIRequest.interceptors.response.use(function (response) {
    return response.data;
});

window.APIRequest = APIRequest;

export default APIRequest;
