import {AppState} from 'store/reducers';

export const selectTestingReducer = (state: AppState) => state.testingReducer;

export const selectTestStatuses = (state: AppState) =>
  selectTestingReducer(state).statuses;

export const selectTest = (state: AppState) =>
  selectTestingReducer(state).test || undefined;

export const selectTestState = (state: AppState) =>
  selectTestingReducer(state).state || undefined;
