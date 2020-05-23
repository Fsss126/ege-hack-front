import {AppState} from './reducers';

export const selectDataReducer = (state: AppState) => state.dataReducer;

export const selectKnowledgeTasks = (state: AppState) =>
  selectDataReducer(state).tasks;

export const selectKnowledgeThemes = (state: AppState) =>
  selectDataReducer(state).themes;

export const selectKnowledgeMap = (state: AppState) =>
  selectDataReducer(state).knowledgeMap;
