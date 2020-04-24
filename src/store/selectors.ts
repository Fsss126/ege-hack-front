import {AppState} from './reducers';

export const selectDataReducer = (state: AppState) => state.dataReducer;

export const selectUser = ({
  dataReducer: {credentials, userInfo},
}: AppState) => ({credentials, userInfo});

export const selectSubjects = (state: AppState) =>
  selectDataReducer(state).subjects;

export const selectShopCourses = (state: AppState) =>
  selectDataReducer(state).shopCourses;

export const selectAdminCourses = (state: AppState) =>
  selectDataReducer(state).adminCourses;

export const selectTeacherCourses = (state: AppState) =>
  selectDataReducer(state).teacherCourses;

export const selectUserCourses = (state: AppState) =>
  selectDataReducer(state).userCourses;

export const selectLessons = (state: AppState) =>
  selectDataReducer(state).lessons;

export const selectHomeworks = (state: AppState) =>
  selectDataReducer(state).homeworks;

export const selectParticipants = (state: AppState) =>
  selectDataReducer(state).participants;

export const selectAdminWebinars = (state: AppState) =>
  selectDataReducer(state).adminWebinars;

export const selectWebinars = (state: AppState) =>
  selectDataReducer(state).webinars;

export const selectUpcomingWebinars = (state: AppState) =>
  selectWebinars(state).upcoming;

export const selectTest = (state: AppState) => state.testReducer.test;

export const selectTestState = (state: AppState) => state.testReducer.state;
