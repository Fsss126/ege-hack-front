import React from "react";
import Page from "./Page";
import {Link} from "react-router-dom";
import Button from "./ui/Button";

export type ErrorPageRedirectLink = {
    text: React.ReactNode;
    url: string;
}
export type ErrorPageProps = {
    errorCode?: number | string;
    message: React.ReactNode;
    link: ErrorPageRedirectLink;
}
const ErrorPage: React.withDefaultProps<React.FC<ErrorPageProps>> = (props) => {
    const {errorCode, message, link: {url, text}} = props;
    const code = errorCode ? errorCode.toString() : undefined;
    return (
        <Page title={code} className="error-page">
            <div className="error-page__error-code">
                {code && (
                    typeof errorCode === "number"
                        ? code.split('').map((number: string, i: number) => <span key={i}>{number}</span>)
                        : code
                )}
            </div>
            <div className="error-page__error-message">{message}</div>
            <Button<typeof Link>
                tag={Link}
                to={url}
                replace>
                {text}
            </Button>
        </Page>
    );
};
ErrorPage.defaultProps = {
    link: {
        url: '/',
        text: 'На главную'
    }
};

export const PermissionsDeniedErrorPage: React.FC = () => {
    return <ErrorPage errorCode={403} message="Недостаточно прав"/>;
};

export const NotFoundErrorPage: React.FC<Pick<ErrorPageProps, 'link' | 'message'>> = (props) => {
    const {message, link} = props;
    return <ErrorPage
        errorCode={404}
        link={link}
        message={message || 'Похоже, вы потерялись'}/>;
};

export default ErrorPage;
