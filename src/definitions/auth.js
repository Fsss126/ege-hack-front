/*global VK*/
import APIRequest from "api";

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';
const VK_APP_ID = process.env.REACT_APP_VK_APP_ID;

export const AuthEventTypes = {
    login: 'auth.login',
    logout: 'auth.logout'
};

const initVK = false;

function setUserToStorage(user) {
    localStorage.setItem(LOCAL_STORAGE_KEY, user ? JSON.stringify(user) : user);
}

function getUserFromStorage() {
    try {
        const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);
        const user = JSON.parse(storedString);
        if (!user)
            return null;
        if (!(user.first_name && user.last_name))
            throw new Error(`Incomplete data parsed from local storage: ${storedString}`);
        return user;
    } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        throw e;
    }
}

class Auth {
    user = undefined;
    userInfo = undefined;

    constructor() {
        if (!window.VK)
            return;
        window.VK.init({apiId: VK_APP_ID});
        window.VK.Auth.getLoginStatus(res => {
            try {
                console.log('retrieved login status', res);
                let user;
                try {
                    user = getUserFromStorage();
                } catch (e) {
                    console.log('error retrieving user from local storage, revoking grants');
                    VK.Auth.revokeGrants();
                }
                if (!res.session) {
                    this.setUser(null);
                    if (user) {
                        console.log('No session retrieved, removing user from local storage');
                        setUserToStorage(null);
                    }
                    return;
                }
                if (!user) {
                    this.setUser(null);
                    VK.Auth.logout();
                    return;
                }
                const {session} = this.getSession(res);
                this.setUser({session, user});
            }
            catch (e) {
                console.error('User data can not be recovered', e);
                this.setUser(null);
            }
        }, true);
    }

    setUser(user) {
        this.user = user;
        for(let handler of (this.eventHandlers[AuthEventTypes.login] || []))
            handler(this.user);
    }

    eventHandlers = {};

    login = (redirectUrl) => {
        // window.location = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=page&redirect_uri=${redirectUrl}&response_type=token&openapi=1&scope=email`;
        if (!window.VK)
            return;
        if (!initVK)
            window.VK.init({apiId: process.env.REACT_APP_VK_APP_ID});
        window.VK.Auth.login(this.onLogin, 4194304);
    };

    logout = () => {
        window.VK.Auth.logout((data) => {
            console.info('Logout', data);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            this.user = null;
            this.userInfo = null;
            for(let handler of (this.eventHandlers[AuthEventTypes.logout] || []))
                handler();
        });
    };

    getSession = (authRes) => {
        const {session: {user, ...session}} = authRes;
        return {user, session};
    };

    onLogin = (res) => {
        console.log('login', res);
        if (!res.session)
            return;
        let user, session;
        // try {
            ({user, session} = this.getSession(res));
        // }
        // catch (e) {
        //     console.error(e);
        //     alert('Ошибка авторизации во Вконтакте');
        //     return;
        // }
        // user = {
        //     ...user,
        //     uid: 1,
        //     hash: '68ab57e7e70fae3f8f96afc0d85465a9'
        // };
        console.info('Login', user, session);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
        const userData = {session, user};
        this.setUser(userData);
    };

    subscribe(eventType, handler) {
        (this.eventHandlers[eventType] || (this.eventHandlers[eventType] = [])).push(handler);
    }

    unsubscribe(eventType, handler) {
        this.eventHandlers[eventType] = this.eventHandlers[eventType].filter(func => func !== handler);
    }

    getUserId() {
        if (!this.user)
            throw new Error('User not logged in.');
        return this.user.session.mid;
    }

    getUserPassword() {
        if (!this.user)
            throw new Error('User not logged in.');
        return JSON.stringify(this.user.session);
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
