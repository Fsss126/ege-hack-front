import {AppState} from 'store/reducers';

export const selectHomeworksReducer = (state: AppState) =>
  state.homeworksReducer;

export const selectUserHomeworks = (state: AppState) =>
  selectHomeworksReducer(state).userHomeworks;

export const selectHomeworks = (state: AppState) =>
  selectHomeworksReducer(state).homeworks;
