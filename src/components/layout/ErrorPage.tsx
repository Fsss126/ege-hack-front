import classNames from 'classnames';
import React from 'react';
import {Link} from 'react-router-dom';

import Button from '../ui/Button';
import Page, {PageProps} from './Page';

export type CommonErrorPageProps = {
  errorCode?: number | string;
  className?: string;
  message?: React.ReactNode;
  text: React.ReactNode;
  url: string | null;
  accentCodeLetter: number;
};

export type ErrorPageProps = CommonErrorPageProps &
  Pick<
    React.Defaultize<PageProps, typeof Page.defaultProps>,
    'location' | 'showHeader' | 'showSidebar'
  >;
const ErrorPage = (props: ErrorPageProps): React.ReactElement => {
  const {
    errorCode,
    message,
    url,
    text,
    className,
    location,
    accentCodeLetter,
    ...pageProps
  } = props;
  const code = errorCode ? errorCode.toString() : undefined;

  return (
    <Page
      title={code}
      className={classNames('error-page', className)}
      location={location}
      {...pageProps}
    >
      <div className="error-page__error-code">
        {code &&
          code.split('').map((number: string, i: number) => (
            <span
              key={i}
              className={classNames({
                accent: i === accentCodeLetter,
              })}
            >
              {number}
            </span>
          ))}
      </div>
      <div className="error-page__error-message">
        {message || 'Произошла ошибка'}
      </div>
      {url && (
        <Button<typeof Link> component={Link} to={url} replace>
          {text}
        </Button>
      )}
    </Page>
  );
};
ErrorPage.defaultProps = {
  url: '/',
  text: 'На главную',
  accentCodeLetter: 1,
};

export type SpecificErrorPageProps = Omit<
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
