import React, {useEffect} from "react";
import Page from "components/Page";
import Auth from "definitions/auth";
import {useUser} from "store";
import {Redirect} from "react-router-dom";
import {DEFAULT_LOGIN_REDIRECT} from "definitions/constants";
import {getAppUrl, getCurrentUrl} from "definitions/helpers";

const LoginPage = (props) => {
    const {location} = props;
    const {credentials, userInfo} = useUser();

    const params = new URLSearchParams(location.search);
    const code = params.get('code') || null;

    useEffect(() => {
        if (code && !credentials)
            Auth.onLogin(code, getCurrentUrl());
    }, [code, credentials]);

    const onClick = React.useCallback(() => {
        Auth.login(getCurrentUrl());
    }, []);

    if (credentials) {
        if (location.state && location.state.referrer)
            return (<Redirect to={location.state.referrer}/>);
        return (<Redirect to={DEFAULT_LOGIN_REDIRECT}/>);
    }
    return (
        <Page
            isLoaded={!code}
            title="Вход"
            className="login-page align-items-center justify-content-center"
            checkLogin={false}
            showSidebar={false}
            showUserNav={false}
            location={location}>
            <div className="login-btn" onClick={onClick}>Войти{' '}<i className="fab fa-vk vk"/></div>
        </Page>
    );
};

export default LoginPage;
