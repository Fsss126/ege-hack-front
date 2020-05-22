import {
  AccountsDeleteCallback,
  AccountsDeleteErrorCallback,
  usersDeleteRequest,
  usersFetch,
  usersRevoke,
} from 'modules/users/users.actions';
import {selectUsers} from 'modules/users/users.selectors';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

export function useAccounts(role: AccountRole) {
  const accounts = useSelector(selectUsers)[role] || undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(usersFetch({role}));
  }, [dispatch, role]);
  useEffect(() => {
    if (!accounts) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, accounts]);
  return accounts instanceof Error
    ? {error: accounts, reload: dispatchFetchAction}
    : {accounts, reload: dispatchFetchAction};
}

export function useRevokeAccounts(role: AccountRole) {
  const dispatch = useDispatch();

  return useCallback(
    (data: AccountInfo[]) => {
      dispatch(usersRevoke({role, data}));
    },
    [dispatch, role],
  );
}

export function useDeleteAccount(
  role: AccountRole,
  onDelete?: AccountsDeleteCallback,
  onError?: AccountsDeleteErrorCallback,
) {
  const dispatch = useDispatch();

  return useCallback(
    (accountId: number) => {
      dispatch(
        usersDeleteRequest({
          role,
          accountIds: [accountId],
          onDelete,
          onError,
        }),
      );
    },
    [dispatch, onDelete, onError, role],
  );
}
