import {AppState} from 'store/reducers';

export const selectTeachersReducer = (state: AppState) => state.teachersReducer;

export const selectTeachers = (state: AppState) =>
  selectTeachersReducer(state).teachers || undefined;
