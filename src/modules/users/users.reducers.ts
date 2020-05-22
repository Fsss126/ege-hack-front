import {EUsersAction} from 'modules/users/users.constants';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

const users: Reducer<
  Record<AccountRole, DataProperty<AccountInfo[]>>,
  Action
> = (
  state = {
    [AccountRole.PUPIL]: null,
    [AccountRole.TEACHER]: null,
    [AccountRole.HELPER]: null,
    [AccountRole.ADMIN]: null,
    [AccountRole.MODERATOR]: null,
  },
  action,
) => {
  switch (action.type) {
    case EUsersAction.ACCOUNTS_FETCHED:
    case EUsersAction.ACCOUNTS_DELETE:
    case EUsersAction.ACCOUNTS_REVOKE: {
      const {data, role} = action.payload;

      return {
        ...state,
        [role]: data,
      };
    }
    default:
      return state;
  }
};

export const usersReducer = combineReducers({
  users,
});
