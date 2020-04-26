import React from 'react';
import {Link} from 'react-router-dom';

import Button from '../ui/Button';
import Page, {PageProps} from './Page';

export type ErrorPageRedirectLink = {
  text: React.ReactNode;
  url: string;
};

export type ErrorPageProps = {
  errorCode?: number | string;
  message?: React.ReactNode;
  location: PageProps['location'];
} & ErrorPageRedirectLink;
const ErrorPage = (props: ErrorPageProps): React.ReactElement => {
  const {errorCode, message, url, text, location} = props;
  const code = errorCode ? errorCode.toString() : undefined;

  return (
    <Page title={code} className="error-page" location={location}>
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
      <div className="error-page__error-message">
        {message || 'Произошла ошибка'}
      </div>
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

type SpecificErrorPageProps = Omit<
  React.Defaultize<ErrorPageProps, typeof ErrorPage.defaultProps>,
  'errorCode'
>;

export const PermissionsDeniedErrorPage = (props: SpecificErrorPageProps) => {
  return <ErrorPage {...props} errorCode={403} message="Недостаточно прав" />;
};

export const NotFoundErrorPage = (props: SpecificErrorPageProps) => {
  const {message, ...rest} = props;

  return (
    <ErrorPage
      errorCode={404}
      message={message || 'Похоже, вы потерялись'}
      {...rest}
    />
  );
};

export default ErrorPage;
