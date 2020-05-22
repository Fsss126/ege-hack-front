import Page from 'components/layout/Page';
import Auth from 'definitions/auth';
import {DEFAULT_LOGIN_REDIRECT} from 'definitions/constants';
import {getCurrentUrl} from 'definitions/helpers';
import {useCredentials} from 'hooks/selectors';
import React, {useCallback, useEffect} from 'react';
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
  const {credentials, error} = useCredentials();

  const params = new URLSearchParams(location.search);
  const code = params.get('code') || null;

  const login = useCallback(() => {
    if (code) {
      Auth.onLogin(code, getCurrentUrl());
    }
  }, [code]);

  useEffect(() => {
    if (code && !credentials) {
      login();
    }
  }, [code, credentials, login]);

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
      isLoaded={code ? !!credentials : true}
      title="Вход"
      className="login-page align-items-center justify-content-center"
      checkLogin={false}
      showSidebar={false}
      showUserNav={false}
      errors={[error]}
      reloadCallbacks={[login]}
      location={location}
    >
      <div className="login-btn" onClick={onClick}>
        Войти <i className="fab fa-vk vk" />
      </div>
    </Page>
  );
};

export default LoginPage;
