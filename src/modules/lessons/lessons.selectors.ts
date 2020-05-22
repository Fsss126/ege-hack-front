import {AppState} from 'store/reducers';

export const selectLessonsReducer = (state: AppState) => state.lessonsReducer;

export const selectLessons = (state: AppState) =>
  selectLessonsReducer(state).lessons;
