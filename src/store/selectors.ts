import {AppState} from './reducers';

export const selectDataReducer = (state: AppState) => state.dataReducer;

export const selectUsers = (state: AppState) => selectDataReducer(state).users;

export const selectLessons = (state: AppState) =>
  selectDataReducer(state).lessons;

export const selectUserHomeworks = (state: AppState) =>
  selectDataReducer(state).userHomeworks;

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

export const selectKnowledgeTasks = (state: AppState) =>
  selectDataReducer(state).tasks;

export const selectKnowledgeThemes = (state: AppState) =>
  selectDataReducer(state).themes;

export const selectKnowledgeMap = (state: AppState) =>
  selectDataReducer(state).knowledgeMap;

export const selectKnowledgeTests = (state: AppState) =>
  selectDataReducer(state).tests;

export const selectTestResults = (state: AppState) =>
  selectDataReducer(state).testResults;

export const selectLessonTests = (state: AppState) =>
  selectDataReducer(state).lessonsTests;
