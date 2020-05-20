import {AxiosError} from 'axios';
import {
  fetchedActionCreator,
  infoActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {AccountInfo, Credentials} from 'types/entities';

import {EUserAction} from './user.constants';

export const login = infoActionCreator(EUserAction.LOG_IN);

export const loginRequest = infoActionCreator(EUserAction.LOG_IN_REQUEST);

export const loginSuccess = loadedActionCreator<
  EUserAction.LOG_IN_SUCCESS,
  Credentials
>(EUserAction.LOG_IN_SUCCESS);

export const loginError = loadedActionCreator<
  EUserAction.LOG_IN_ERROR,
  AxiosError
>(EUserAction.LOG_IN_ERROR);

export const logout = infoActionCreator(EUserAction.LOG_OUT);

export const userInfoFetch = infoActionCreator(EUserAction.USER_INFO_FETCH);

export const userInfoFetched = fetchedActionCreator<
  EUserAction.USER_INFO_FETCHED,
  AccountInfo
>(EUserAction.USER_INFO_FETCHED);

export const userInfoRevoke = loadedActionCreator<
  EUserAction.USER_INFO_REVOKE,
  AccountInfo
>(EUserAction.USER_INFO_REVOKE);
