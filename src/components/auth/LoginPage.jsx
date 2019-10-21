import React from "react";
import Page from "components/Page";
import Auth from "definitions/auth";


const LoginPage = () => {
    const onAuth = React.useCallback((data) => {
        console.log(data);
        const {uid, first_name, last_name, photo, photo_rec, hash} = data;
    }, []);
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
