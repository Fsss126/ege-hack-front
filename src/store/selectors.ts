import {AppState} from './reducers';

export const selectDataReducer = (state: AppState) => state.dataReducer;

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
