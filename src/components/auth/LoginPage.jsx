import React from "react";
import Page from "components/Page";
import Auth from "definitions/auth";


const LoginPage = () => {
    React.useLayoutEffect(() => {
        Auth.loginWidget('vk-auth');
    }, []);
    return (
        <Page title="Вход" className="login-page align-items-center justify-content-center">
            <div id="vk-auth"/>
        </Page>
    );
};

export default LoginPage;
