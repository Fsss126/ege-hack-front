import {AccountRole} from '../types/enums';
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

export const selectUserTeachers = (state: AppState) =>
  selectDataReducer(state).userTeachers;

export const selectUsers = (state: AppState) => selectDataReducer(state).users;

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

export const selectTasks = (state: AppState) => selectDataReducer(state).tasks;

export const selectThemes = (state: AppState) =>
  selectDataReducer(state).themes;

export const selectKnowledgeTree = (state: AppState) =>
  selectDataReducer(state).knowledgeTree;
