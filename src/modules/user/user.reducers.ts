import Auth from 'definitions/auth';
import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {AccountInfo, Credentials} from 'types/entities';

import {EUserAction} from './user.constants';

export type UserAction = TypedAction<typeof import('./user.actions')>;

export const credentials: Reducer<DataProperty<Credentials>, UserAction> = (
  state = Auth.getCredentials(),
  action,
) => {
  switch (action.type) {
    case EUserAction.LOG_IN_REQUEST:
    case EUserAction.LOG_OUT: {
      return null;
    }
    case EUserAction.LOG_IN_SUCCESS:
    case EUserAction.LOG_IN_ERROR: {
      return action.payload;
    }
    default:
      return state;
  }
};

export const userInfo: Reducer<DataProperty<AccountInfo>, UserAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case EUserAction.USER_INFO_FETCHED:
    case EUserAction.USER_INFO_REVOKE: {
      return action.payload;
    }
    default:
      return state;
  }
};

export const userReducer = combineReducers({
  credentials,
  userInfo,
});
