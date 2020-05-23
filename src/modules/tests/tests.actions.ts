import {AxiosError} from 'axios';
import {ETestsAction} from 'modules/tests/tests.constants';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {TestInfo, TestResultInfo} from 'types/entities';

export type TestFetchPayload = {
  courseId: number;
  lessonId: number;
};

export type TestResultsFetchPayload = {
  testId: number;
  lessonId: number;
};

export type TestDeleteCallback = (
  courseId: number,
  lessonId: number,
  testId: number,
) => void;

export type TestDeleteErrorCallback = (
  courseId: number,
  lessonId: number,
  testId: number,
  error: AxiosError,
) => void;

export type TestDeleteRequestPayload = {
  courseId: number;
  lessonId: number;
  testId: number;
  onDelete?: TestDeleteCallback;
  onError?: TestDeleteErrorCallback;
};

export type TestDeletePayload = {
  courseId: number;
  lessonId: number;
  testId: number;
};

export const testFetch = fetchActionCreator<
  ETestsAction.TEST_FETCH,
  TestFetchPayload
>(ETestsAction.TEST_FETCH);

export const testFetched = fetchedActionCreator<
  ETestsAction.TEST_FETCHED,
  TestInfo,
  TestFetchPayload
>(ETestsAction.TEST_FETCHED);

export const testResultsFetch = fetchActionCreator<
  ETestsAction.TEST_RESULTS_FETCH,
  TestResultsFetchPayload
>(ETestsAction.TEST_RESULTS_FETCH);

export const testResultsFetched = fetchedActionCreator<
  ETestsAction.TEST_RESULTS_FETCHED,
  TestResultInfo[],
  TestResultsFetchPayload
>(ETestsAction.TEST_RESULTS_FETCHED);

export const testRevoke = dataActionCreator<
  ETestsAction.TEST_REVOKE,
  TestInfo,
  TestFetchPayload
>(ETestsAction.TEST_REVOKE);

export const testDeleteRequest = loadedActionCreator<
  ETestsAction.TEST_DELETE_REQUEST,
  TestDeleteRequestPayload
>(ETestsAction.TEST_DELETE_REQUEST);

export const testDelete = loadedActionCreator<
  ETestsAction.TEST_DELETE,
  TestDeletePayload
>(ETestsAction.TEST_DELETE);
