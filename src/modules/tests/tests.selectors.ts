import {AppState} from 'store/reducers';

export const selectTestsReducer = (state: AppState) => state.testsReducer;

export const selectTests = (state: AppState) => selectTestsReducer(state).tests;

export const selectTestResults = (state: AppState) =>
  selectTestsReducer(state).testResults;
