import React from 'react';
import {Link} from 'react-router-dom';

import Button from '../ui/Button';
import Page from './Page';

export type ErrorPageRedirectLink = {
  text: React.ReactNode;
  url: string;
};

export type ErrorPageProps = {
  errorCode?: number | string;
  message: React.ReactNode;
} & ErrorPageRedirectLink;
const ErrorPage: React.withDefaultProps<React.FC<ErrorPageProps>> = (props) => {
  const {errorCode, message, url, text} = props;
  const code = errorCode ? errorCode.toString() : undefined;

  return (
    <Page title={code} className="error-page">
      <div className="error-page__error-code">
        {code &&
          (typeof errorCode === 'number'
            ? code
                .split('')
                .map((number: string, i: number) => (
                  <span key={i}>{number}</span>
                ))
            : code)}
      </div>
      <div className="error-page__error-message">{message}</div>
      <Button<typeof Link> component={Link} to={url} replace>
        {text}
      </Button>
    </Page>
  );
};
ErrorPage.defaultProps = {
  url: '/',
  text: 'На главную',
};

export const PermissionsDeniedErrorPage: React.FC = () => {
  return <ErrorPage errorCode={403} message="Недостаточно прав" />;
};

export const NotFoundErrorPage: React.FC<Partial<
  Omit<ErrorPageProps, 'errorCode'>
>> = (props) => {
  const {message, url, text} = props;

  return (
    <ErrorPage
      errorCode={404}
      url={url}
      text={text}
      message={message || 'Похоже, вы потерялись'}
    />
  );
};

export default ErrorPage;
