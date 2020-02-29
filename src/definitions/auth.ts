import APIRequest from "api";
import {Credentials, UserInfo} from "types/entities";
import {SimpleCallback} from "types/utility/common";

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';
const VK_APP_ID = process.env.REACT_APP_VK_APP_ID;

export enum AuthEventTypes {
    login = 'auth.login',
    logout = 'auth.logout'
}

function setCredentialsToStorage(credentials: Credentials): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, credentials ? JSON.stringify(credentials) : credentials);
}

function getCredentialsFromStorage(): Credentials | null {
    try {
        const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!storedString)
            return null;
        const credentials = JSON.parse(storedString);
        if (!credentials.access_token)
            throw new Error(`Incomplete data parsed from local storage: ${storedString}`);
        return credentials;
    } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        throw e;
    }
}

export type AuthLoginCallback = (credentials: Credentials | null) => void;
export type AuthLogoutCallback = SimpleCallback;

class Auth {
    credentials!: Credentials | null;
    userInfo?: UserInfo;
    eventHandlers: {
        [AuthEventTypes.login]?: AuthLoginCallback[];
        [AuthEventTypes.logout]?: AuthLogoutCallback[];
    } = {};

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

    setCredentials(credentials: Credentials | null): void {
        this.credentials = credentials;
        for(const handler of (this.eventHandlers[AuthEventTypes.login] || []))
            handler(this.credentials);
    }

    login = (redirectUrl: string): void => {
        window.location.href = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=page&redirect_uri=${redirectUrl}&response_type=code&openapi=1&scope=email`;
        // if (!window.VK)
        //     return;
        // if (!initVK)
        //     window.VK.init({apiId: process.env.REACT_APP_VK_APP_ID});
        // window.VK.Auth.login(this.onLogin, 4194304);
    };

    logout = (): void => {
        console.info('Logout');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        this.credentials = null;
        this.userInfo = undefined;
        for(const handler of (this.eventHandlers[AuthEventTypes.logout] || []))
            handler();
    };

    onLogin = async (code: string, redirectUrl: string): Promise<void> => {
        console.log('login', code);
        const credentials: Credentials = await APIRequest.post('/login/vk', {
            code,
            redirect_uri: redirectUrl
        });
        console.info('got credentials', credentials);
        setCredentialsToStorage(credentials);
        this.setCredentials(credentials);
    };

    subscribe(eventType: AuthEventTypes.login, handler: AuthLoginCallback): void;
    subscribe(eventType: AuthEventTypes.logout, handler: AuthLogoutCallback): void;
    subscribe(eventType: AuthEventTypes, handler: AuthLoginCallback | AuthLogoutCallback): void {
        (this.eventHandlers[eventType] || (this.eventHandlers[eventType] = [])).push(handler);
    }

    unsubscribe(eventType: AuthEventTypes.login, handler: AuthLoginCallback): void;
    unsubscribe(eventType: AuthEventTypes.logout, handler: AuthLogoutCallback): void;
    unsubscribe(eventType: AuthEventTypes, handler: AuthLoginCallback | AuthLogoutCallback): void {
        const {eventHandlers: {[eventType]: eventHandlers}} = this;
        if (!eventHandlers)
            return;
        this.eventHandlers[eventType] = eventHandlers.filter(func => func !== handler) as any;
    }

    getAccessToken(): string {
        if (!this.credentials)
            throw new Error('User not logged in.');
        return this.credentials.access_token;
    }

    getCredentials(): Auth['credentials'] {
        return this.credentials;
    }

    getUserInfo = async (): Promise<Auth['userInfo']> => {
        if (this.userInfo)
            return this.userInfo;
        try {
            this.userInfo = await APIRequest.get('/accounts/info');
        }
        catch (e) {
            console.error(e);
            this.userInfo = undefined;
            return e;
        }
        return this.userInfo;
    }
}

export default new Auth();
