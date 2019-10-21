const VK = window.VK;

VK.init({apiId: process.env.REACT_APP_VK_APP_ID});

const LOCAL_STORAGE_KEY = 'ege-hack-user-data';

export default class Auth {
    static EventTypes = {
        login: 'auth.login',
        logout: 'auth.logout'
    };

    static login(userData) {
        console.info('Login', userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
    }

    static logout() {
        VK.Auth.logout((data) => {
            console.info('Logout', data);
        });
    }

    static subscribe(eventType, handler) {
        VK.Observer.subscribe(eventType, handler);
    }

    static unsubscribe(eventType, handler) {
        VK.Observer.unsubscribe(eventType, handler);
    }

    static getUser() {
        try {
            const storedString = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!storedString)
                return  null;
            const storedData = JSON.parse(storedString);
            const {uid, first_name, last_name, photo, photo_rec, hash} = storedData;
            if (!(uid && hash))
                throw new Error(`Incomplete data parsed from local storage: ${storedString}`);
            return {uid, first_name, last_name, photo, photo_rec, hash};
        }
        catch (e) {
            console.error('User data can not be recovered', e);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return null;
        }
    }

    static loginWidget(elementId) {
        VK.Widgets.Auth(elementId, {onAuth: Auth.login});
    }
}
