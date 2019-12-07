/*global VK*/
import APIRequest from "api";

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';

export const AuthEventTypes = {
    login: 'auth.login',
    logout: 'auth.logout'
};

VK.init({apiId: process.env.REACT_APP_VK_APP_ID}, true);

class Auth {
    user = null;
    userInfo = null;

    constructor() {
        try {
            const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!storedString) {
                this.user = null;
                this.userInfo = null;
                return;
            }
            const storedData = JSON.parse(storedString);
            const {session, user} = storedData;
            if (!(session && user))
                throw new Error(`Incomplete data parsed from local storage: ${storedString}`);
            this.user = {session, user};
        }
        catch (e) {
            console.error('User data can not be recovered', e);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            this.user = null;
            this.userInfo = null;
        }
    }

    eventHandlers = {};

    login = () => {
        VK.Auth.login(this.onLogin);
    };

    logout = () => {
        // VK.Auth.logout((data) => {
            console.info('Logout');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            this.user = null;
            this.userInfo = null;
            for(let handler of (this.eventHandlers[AuthEventTypes.logout] || []))
                handler();
        // });
    };

    onLogin = ({session: {user, ...session}}) => {
        // user = {
        //     ...user,
        //     uid: 1,
        //     hash: '68ab57e7e70fae3f8f96afc0d85465a9'
        // };
        console.info('Login', user, session);
        this.user = {session, user};
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.user));
        for(let handler of (this.eventHandlers[AuthEventTypes.login] || []))
            handler(this.user);
    };

    subscribe(eventType, handler) {
        (this.eventHandlers[eventType] || (this.eventHandlers[eventType] = [])).push(handler);
    }

    unsubscribe(eventType, handler) {
        this.eventHandlers[eventType] = this.eventHandlers[eventType].filter(func => func !== handler);
    }

    // subscribe(eventType, handler) {
    //     VK.Observer.subscribe(eventType, handler);
    // }
    //
    // unsubscribe(eventType, handler) {
    //     VK.Observer.unsubscribe(eventType, handler);
    // }

    getUser() {
        return this.user;
    }

    async getUserInfo() {
        if (this.userInfo)
            return this.userInfo;
        try {
            this.userInfo = await APIRequest.get('/accounts/info');
        }
        catch (e) {
            console.error(e);
            this.userInfo = null;
        }
        return this.userInfo;
    }
}

export default new Auth();
