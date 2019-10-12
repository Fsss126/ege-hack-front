import React from "react";
import Page from "./Page";
import {Link} from "react-router-dom";

const ErrorPage = ({errorCode, message, link: {text, url} = {}}) => {
    const code = errorCode && errorCode.toString();
    return (
        <Page title={code} className="error-page">
            <div className="error-page__error-code">
                {code && code.split('').map((number, i) => <span key={i}>{number}</span>)}
            </div>
            <div className="error-page__error-message">{message || 'Похоже, вы потерялись'}</div>
            <Link to={url || '/'} className="btn">{text || 'На главную'}</Link>
        </Page>
    );
};

export default ErrorPage;
