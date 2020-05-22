import {AppState} from 'store/reducers';

export const selectUsersReducer = (state: AppState) => state.usersReducer;

export const selectUsers = (state: AppState) => selectUsersReducer(state).users;
