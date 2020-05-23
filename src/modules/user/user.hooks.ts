import Auth, {
  AuthErrorCallback,
  AuthEventTypes,
  AuthLoginCallback,
  AuthLogoutCallback,
  AuthSuccessCallback,
} from 'definitions/auth';
import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AccountInfo} from 'types/entities';

import {
  loginError,
  loginRequest,
  loginSuccess,
  logout,
  userInfoFetch,
  userInfoRevoke,
} from './user.actions';
import {selectCredentials, selectUserInfo} from './user.selectors';

export function useUserAuth(): void {
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    const loginCallback: AuthLoginCallback = () => {
      dispatch(loginRequest());
    };
    const successCallback: AuthSuccessCallback = (credentials) => {
      dispatch(loginSuccess(credentials));
      dispatch(userInfoFetch());
    };
    const errorCallback: AuthErrorCallback = (error) => {
      dispatch(loginError(error));
    };
    const logoutCallback: AuthLogoutCallback = (): void => {
      dispatch(logout());
    };

    Auth.subscribe(AuthEventTypes.login, loginCallback);
    Auth.subscribe(AuthEventTypes.success, successCallback);
    Auth.subscribe(AuthEventTypes.error, errorCallback);
    Auth.subscribe(AuthEventTypes.logout, logoutCallback);

    return (): void => {
      Auth.unsubscribe(AuthEventTypes.login, loginCallback);
      Auth.unsubscribe(AuthEventTypes.success, successCallback);
      Auth.unsubscribe(AuthEventTypes.error, errorCallback);
      Auth.unsubscribe(AuthEventTypes.logout, logoutCallback);
    };
  }, [dispatch]);
}

export function useCredentials() {
  const credentials = useSelector(selectCredentials);

  return credentials instanceof Error
    ? ({error: credentials} as const)
    : ({credentials} as const);
}

export function useUserInfo() {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(userInfoFetch());
  }, [dispatch]);

  return userInfo instanceof Error
    ? {error: userInfo, reload: dispatchFetchAction}
    : {userInfo, reload: dispatchFetchAction};
}

export function useRevokeUserInfo() {
  const dispatch = useDispatch();

  return useCallback(
    (data: AccountInfo) => {
      dispatch(userInfoRevoke({data}));
    },
    [dispatch],
  );
}
