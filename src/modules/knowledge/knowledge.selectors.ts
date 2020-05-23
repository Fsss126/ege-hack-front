import {AppState} from 'store/reducers';

export const selectKnowledgeReducer = (state: AppState) =>
  state.knowledgeReducer;

export const selectKnowledgeTasks = (state: AppState) =>
  selectKnowledgeReducer(state).tasks;

export const selectKnowledgeThemes = (state: AppState) =>
  selectKnowledgeReducer(state).themes;

export const selectKnowledgeMap = (state: AppState) =>
  selectKnowledgeReducer(state).knowledgeMap;
