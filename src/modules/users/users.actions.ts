import {AxiosError} from 'axios';
import {EUsersAction} from 'modules/users/users.constants';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

export type AccountsFetchPayload = {
  role: AccountRole;
};

export type AccountsDeleteCallback = (accountIds: number[]) => void;

export type AccountsDeleteErrorCallback = (
  accountIds: number[],
  error: AxiosError,
) => void;

export type AccountsDeleteRequestPayload = {
  role: AccountRole;
  accountIds: number[];
  onDelete?: AccountsDeleteCallback;
  onError?: AccountsDeleteErrorCallback;
};

export const usersFetch = fetchActionCreator<
  EUsersAction.ACCOUNTS_FETCH,
  AccountsFetchPayload
>(EUsersAction.ACCOUNTS_FETCH);

export const usersFetched = fetchedActionCreator<
  EUsersAction.ACCOUNTS_FETCHED,
  AccountInfo[],
  AccountsFetchPayload
>(EUsersAction.ACCOUNTS_FETCHED);

export const usersRevoke = dataActionCreator<
  EUsersAction.ACCOUNTS_REVOKE,
  AccountInfo[],
  AccountsFetchPayload
>(EUsersAction.ACCOUNTS_REVOKE);

export const usersDeleteRequest = loadedActionCreator<
  EUsersAction.ACCOUNTS_DELETE_REQUEST,
  AccountsDeleteRequestPayload
>(EUsersAction.ACCOUNTS_DELETE_REQUEST);

export const usersDelete = dataActionCreator<
  EUsersAction.ACCOUNTS_DELETE,
  AccountInfo[],
  AccountsFetchPayload
>(EUsersAction.ACCOUNTS_DELETE);
