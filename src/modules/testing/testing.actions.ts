import {AxiosError} from 'axios';
import {
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {
  SanitizedTestInfo,
  TestStateAnswerInfo,
  TestStateInfo,
  TestStatePassedInfo,
  TestStatusInfo,
} from 'types/entities';

import {ETestingAction} from './testing.constants';

export type TestStartCallback = (
  testId: number,
  testInfo: TestStateInfo,
  test: SanitizedTestInfo,
) => void;

export type TestStartErrorCallback = (
  testId: number,
  error: AxiosError,
) => void;

export interface TestFetchPayload {
  testId: number;
}

export type TestStartRequestPayload = {
  testId: number;
  lessonId: number;
  courseId: number;
  onSuccess?: TestStartCallback;
  onError?: TestStartErrorCallback;
};

export type TestCompleteCallback = (
  testId: number,
  results: TestStatePassedInfo,
) => void;

export type TestCompleteErrorCallback = (
  testId: number,
  error: AxiosError,
) => void;

export type TestCompleteRequestPayload = {
  testId: number;
  lessonId: number;
  courseId: number;
  onSuccess?: TestCompleteCallback;
  onError?: TestCompleteErrorCallback;
};

export type TestStatusFetchPayload = {
  // testId: number;
  lessonId: number;
  courseId: number;
};

export type TestStateFetchPayload = {
  testId: number;
  lessonId: number;
  courseId: number;
};

export type TestSaveAnswerCallback = (
  testId: number,
  taskId: number,
  savedAnswer: TestStateAnswerInfo,
) => void;

export type TestSaveAnswerErrorCallback = (
  testId: number,
  taskId: number,
  error: AxiosError,
) => void;

export type TestSaveAnswerRequestPayload = {
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answer: string;
  complete: boolean;
  onSuccess?: TestSaveAnswerCallback;
  onError?: TestSaveAnswerErrorCallback;
};

export type TestSaveAnswerPayload = {
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answerInfo: TestStateAnswerInfo;
};

export const testFetch = fetchActionCreator<
  ETestingAction.TEST_FETCH,
  TestFetchPayload
>(ETestingAction.TEST_FETCH);

export const testFetched = fetchedActionCreator<
  ETestingAction.TEST_FETCHED,
  SanitizedTestInfo,
  TestFetchPayload
>(ETestingAction.TEST_FETCHED);

export const testStartRequest = loadedActionCreator<
  ETestingAction.TEST_START_REQUEST,
  TestStartRequestPayload
>(ETestingAction.TEST_START_REQUEST);

export const testCompleteRequest = loadedActionCreator<
  ETestingAction.TEST_COMPLETE_REQUEST,
  TestCompleteRequestPayload
>(ETestingAction.TEST_COMPLETE_REQUEST);

export const testStatusFetch = fetchActionCreator<
  ETestingAction.TEST_STATUS_FETCH,
  TestStatusFetchPayload
>(ETestingAction.TEST_STATUS_FETCH);

export const testStatusFetched = fetchedActionCreator<
  ETestingAction.TEST_STATUS_FETCHED,
  TestStatusInfo | null,
  TestStatusFetchPayload
>(ETestingAction.TEST_STATUS_FETCHED);

export const testStateFetch = fetchActionCreator<
  ETestingAction.TEST_STATE_FETCH,
  TestStateFetchPayload
>(ETestingAction.TEST_STATE_FETCH);

export const testStateFetched = fetchedActionCreator<
  ETestingAction.TEST_STATE_FETCHED,
  TestStateInfo,
  TestStateFetchPayload
>(ETestingAction.TEST_STATE_FETCHED);

export const testSaveAnswerRequest = loadedActionCreator<
  ETestingAction.TEST_SAVE_ANSWER_REQUEST,
  TestSaveAnswerRequestPayload
>(ETestingAction.TEST_SAVE_ANSWER_REQUEST);

export const testSaveAnswer = loadedActionCreator<
  ETestingAction.TEST_SAVE_ANSWER,
  TestSaveAnswerPayload
>(ETestingAction.TEST_SAVE_ANSWER);

export const testStateUpdate = fetchedActionCreator<
  ETestingAction.TEST_STATE_UPDATE,
  TestStateInfo,
  TestStateFetchPayload
>(ETestingAction.TEST_STATE_UPDATE);
