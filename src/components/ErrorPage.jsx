import React from "react";
import Page from "./Page";
import {Link} from "react-router-dom";
import Button from "./ui/Button";

const ErrorPage = ({errorCode, message, link: {text, url} = {}}) => {
    const code = errorCode && errorCode.toString();
    return (
        <Page title={code} className="error-page">
            <div className="error-page__error-code">
                {code && code.split('').map((number, i) => <span key={i}>{number}</span>)}
            </div>
            <div className="error-page__error-message">{message}</div>
            <Button tag={Link} to={url | '/'} replace>{text || 'На главную'}</Button>
        </Page>
    );
};

export const PermissionsDeniedErrorPage = () => {
    return <ErrorPage errorCode={403} message="Недостаточно прав"/>;
};

export const NotFoundErrorPage = ({message, link}) => {
    return <ErrorPage
        errorCode={404}
        link={link}
        message={message || 'Похоже, вы потерялись'}/>;
};

export default ErrorPage;
