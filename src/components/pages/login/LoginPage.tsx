import Page from 'components/layout/Page';
import Auth from 'definitions/auth';
import {DEFAULT_LOGIN_REDIRECT} from 'definitions/constants';
import {getCurrentUrl} from 'definitions/helpers';
import {useUser} from 'hooks/selectors';
import React, {useEffect} from 'react';
import {StaticContext} from 'react-router';
import {Redirect, RouteComponentProps} from 'react-router-dom';

export interface LoginLocationState {
  referrer?: string;
}

const LoginPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LoginLocationState
>> = (props) => {
  const {location} = props;
  const {credentials} = useUser();

  const params = new URLSearchParams(location.search);
  const code = params.get('code') || null;

  useEffect(() => {
    if (code && !credentials) {
      Auth.onLogin(code, getCurrentUrl());
    }
  }, [code, credentials]);

  const onClick = React.useCallback(() => {
    Auth.login(getCurrentUrl());
  }, []);

  if (credentials) {
    if (location.state && location.state.referrer) {
      return <Redirect to={location.state.referrer} />;
    }
    return <Redirect to={DEFAULT_LOGIN_REDIRECT} />;
  }
  return (
    <Page
      isLoaded={!code}
      title="Вход"
      className="login-page align-items-center justify-content-center"
      checkLogin={false}
      showSidebar={false}
      showUserNav={false}
      location={location}
    >
      <div className="login-btn" onClick={onClick}>
        Войти <i className="fab fa-vk vk" />
      </div>
    </Page>
  );
};

export default LoginPage;
