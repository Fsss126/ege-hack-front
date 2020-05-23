import {AppState} from 'store/reducers';

export const selectUserReducer = (state: AppState) => state.userReducer;

export const selectCredentials = (state: AppState) =>
  selectUserReducer(state).credentials || undefined;

export const selectUserInfo = (state: AppState) =>
  selectUserReducer(state).userInfo || undefined;
