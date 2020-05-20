import {AppState} from 'store/reducers';

export const selectSubjectsReducer = (state: AppState) => state.subjectsReducer;

export const selectSubjects = (state: AppState) =>
  selectSubjectsReducer(state).subjects || undefined;
