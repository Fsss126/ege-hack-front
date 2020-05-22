import APIRequest from 'api';
import {
  usersDelete,
  usersDeleteRequest,
  usersFetch,
  usersFetched,
} from 'modules/users/users.actions';
import {EUsersAction} from 'modules/users/users.constants';
import {all, call, fork, put, takeEvery} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {AccountsRoleReq} from 'types/dtos';
import {AccountInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type AccountsFetchAction = ReturnType<typeof usersFetch>;
type AccountsDeleteRequestAction = ReturnType<typeof usersDeleteRequest>;

function* fetchAccounts() {
  yield* waitForLogin<AccountsFetchAction>(
    EUsersAction.ACCOUNTS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: AccountsFetchAction) {
          const {role} = action.payload;
          try {
            const data: AccountInfo[] = yield call(
              APIRequest.get,
              '/accounts/management',
              {
                params: {
                  role,
                },
              },
            );
            yield put(usersFetched({role, data}));
          } catch (error) {
            yield put(usersFetched({role, data: error}));
          }
        },
        (action) => action.payload.role,
      );
    },
  );
}

function* processAccountsDelete() {
  yield takeEvery(EUsersAction.ACCOUNTS_DELETE_REQUEST, function* (
    action: AccountsDeleteRequestAction,
  ) {
    const {accountIds, role, onDelete, onError} = action.payload;
    try {
      const request: AccountsRoleReq = {
        accounts: accountIds.map((id) => id.toString()),
        role,
      };
      const data: AccountInfo[] = yield call(
        APIRequest.delete,
        '/accounts/management',
        {
          data: request,
        },
      );

      if (onDelete) {
        yield call(onDelete, accountIds);
      }
      yield put(
        usersDelete({
          role,
          data,
        }),
      );
    } catch (error) {
      if (onError) {
        yield call(onError, accountIds, error);
      }
    }
  });
}

export function* usersSaga(): any {
  yield all([fork(fetchAccounts), fork(processAccountsDelete)]);
}
