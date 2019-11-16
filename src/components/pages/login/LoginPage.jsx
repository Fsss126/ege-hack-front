import React from "react";
import Page from "components/Page";
import Auth from "definitions/auth";
import {useUser} from "../../store";
import {Redirect, useLocation} from "react-router-dom";
import {DEFAULT_LOGIN_REDIRECT} from "definitions/constants";

const LoginPage = () => {
    // const getIsMounted = useIsMounted();
    const {user, userInfo} = useUser();
    const location = useLocation();

    React.useLayoutEffect(() => {
        // const isMounted = getIsMounted();
        // console.log('init widget', isMounted);
        // if (isMounted)
        Auth.loginWidget('vk-auth');
    }, []);

    if (user)
        return (<Redirect to={DEFAULT_LOGIN_REDIRECT}/>);
    return (
        <Page
            title="Вход"
            className="login-page align-items-center justify-content-center"
            checkLogin={false}>
            <div id="vk-auth"/>
        </Page>
    );
};

export default LoginPage;
