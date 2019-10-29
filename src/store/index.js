import React from "react";
import Auth, {AuthEventTypes} from "../definitions/auth";
import {useHistory} from "react-router-dom";

const StoreContext = React.createContext(null);

function useUserAuth() {
    const [user, setUser] = React.useState(Auth.getUser());
    const [userInfo, setUserInfo] = React.useState(null);

    React.useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await Auth.getUserInfo();
            setUserInfo(userInfo);
        };
        fetchUserInfo();
    }, []);

    const history = useHistory();
    const loginCallback = React.useCallback((user, userInfo) => {
        setUser(user);
        setUserInfo(userInfo);
        history.push('/');
    }, [history]);

    const logoutCallback = React.useCallback(() => {
        setUser(null);
        history.push('/login/');
    }, [history]);

    React.useLayoutEffect(() => {
        Auth.subscribe(AuthEventTypes.login, loginCallback);
        Auth.subscribe(AuthEventTypes.logout, logoutCallback);
        return () => {
            Auth.unsubscribe(AuthEventTypes.login, loginCallback);
            Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
        }
    }, [loginCallback, logoutCallback]);
    return [user, userInfo];
}

const GlobalStore = ({children}) => {
    const [user, userInfo] = useUserAuth();
    return (
        <StoreContext.Provider value={{user, userInfo}}>
            {children}
        </StoreContext.Provider>
    )
};

export default GlobalStore;

export function useUser() {
   const {user, userInfo} = React.useContext(StoreContext);
   return {user, userInfo};
}
