import React from "react";
import Page from "components/Page";
import Auth from "definitions/auth";
import {useUser} from "../../../store";
import {Redirect, useLocation} from "react-router-dom";
import {DEFAULT_LOGIN_REDIRECT} from "definitions/constants";

const LoginPage = (props) => {
    const {location} = props;
    const {user, userInfo} = useUser();

    React.useLayoutEffect(() => {
        Auth.loginWidget('vk-auth');
    }, []);

    if (user) {
        if (location.state && location.state.referrer)
            return (<Redirect to={location.state.referrer}/>);
        return (<Redirect to={DEFAULT_LOGIN_REDIRECT}/>);
    }
    return (
        <Page
            title="Вход"
            className="login-page align-items-center justify-content-center"
            checkLogin={false}
            location={location}>
            <div id="vk-auth"/>
        </Page>
    );
};

export default LoginPage;
