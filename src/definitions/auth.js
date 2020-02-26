/*global VK*/
import APIRequest from "api";
import {getAppUrl} from "./helpers";

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';
const VK_APP_ID = process.env.REACT_APP_VK_APP_ID;

export const AuthEventTypes = {
    login: 'auth.login',
    logout: 'auth.logout'
};

function setCredentialsToStorage(credentials) {
    localStorage.setItem(LOCAL_STORAGE_KEY, credentials ? JSON.stringify(credentials) : credentials);
}

function getCredentialsFromStorage() {
    try {
        const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);
        const credentials = JSON.parse(storedString);
        if (!credentials)
            return null;
        if (!credentials.access_token)
            throw new Error(`Incomplete data parsed from local storage: ${storedString}`);
        return credentials;
    } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        throw e;
    }
}

class Auth {
    credentials = undefined;
    userInfo = undefined;

    constructor() {
        let credentials;
        try {
            credentials = getCredentialsFromStorage();
            this.setCredentials(credentials);
        } catch (e) {
            console.log('error retrieving credentials from local storage');
            this.setCredentials(null);
        }
    }

    setCredentials(user) {
        this.credentials = user;
        for(const handler of (this.eventHandlers[AuthEventTypes.login] || []))
            handler(this.credentials);
    }

    eventHandlers = {};

    login = (redirectUrl) => {
        window.location = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=page&redirect_uri=${redirectUrl}&response_type=code&openapi=1&scope=email`;
        // if (!window.VK)
        //     return;
        // if (!initVK)
        //     window.VK.init({apiId: process.env.REACT_APP_VK_APP_ID});
        // window.VK.Auth.login(this.onLogin, 4194304);
    };

    logout = () => {
        console.info('Logout');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        this.credentials = null;
        this.userInfo = null;
        for(const handler of (this.eventHandlers[AuthEventTypes.logout] || []))
            handler();
    };

    onLogin = async (code, redirectUrl) => {
        console.log('login', code);
        const credentials = await APIRequest.post('/login/vk', {
            code,
            redirect_uri: redirectUrl
        });
        console.info('got credentials', credentials);
        setCredentialsToStorage(credentials);
        this.setCredentials(credentials);
    };

    subscribe(eventType, handler) {
        (this.eventHandlers[eventType] || (this.eventHandlers[eventType] = [])).push(handler);
    }

    unsubscribe(eventType, handler) {
        this.eventHandlers[eventType] = this.eventHandlers[eventType].filter(func => func !== handler);
    }

    getAccessToken() {
        if (!this.credentials)
            throw new Error('User not logged in.');
        return this.credentials.access_token;
    }

    getCredentials() {
        return this.credentials;
    }

    getUserInfo = async () => {
        if (this.userInfo)
            return this.userInfo;
        try {
            this.userInfo = await APIRequest.get('/accounts/info');
        }
        catch (e) {
            console.error(e);
            this.userInfo = null;
            return e;
        }
        return this.userInfo;
    }
}

export default new Auth();
