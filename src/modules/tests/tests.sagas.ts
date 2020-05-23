import APIRequest from 'api';
import {
  testDelete,
  testDeleteRequest,
  testFetch,
  testFetched,
  testResultsFetch,
  testResultsFetched,
} from 'modules/tests/tests.actions';
import {ETestsAction} from 'modules/tests/tests.constants';
import {all, call, fork, put} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {TestInfo, TestResultInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type TestFetchAction = ReturnType<typeof testFetch>;
type TestResultsFetchAction = ReturnType<typeof testResultsFetch>;
type TestDeleteRequestAction = ReturnType<typeof testDeleteRequest>;

function* fetchTest() {
  yield* waitForLogin<TestFetchAction>(ETestsAction.TEST_FETCH, function* (
    channel,
  ) {
    yield takeLeadingPerKey(
      channel,
      function* (action: TestFetchAction) {
        const {courseId, lessonId} = action.payload;
        try {
          const data: TestInfo = yield call(
            APIRequest.get,
            `/knowledge/tests`,
            {
              params: {
                lessonId,
              },
            },
          );
          yield put(
            testFetched({
              courseId,
              lessonId,
              data,
            }),
          );
        } catch (error) {
          yield put(
            testFetched({
              courseId,
              lessonId,
              data: error,
            }),
          );
        }
      },
      (action) => action.payload.lessonId,
    );
  });
}

function* fetchTestResults() {
  yield* waitForLogin<TestResultsFetchAction>(
    ETestsAction.TEST_RESULTS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: TestResultsFetchAction) {
          const {testId, lessonId} = action.payload;
          try {
            const data: TestResultInfo[] = yield call(
              APIRequest.get,
              `/knowledge/tests/${testId}/results`,
            );
            yield put(
              testResultsFetched({
                testId,
                lessonId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              testResultsFetched({
                testId,
                lessonId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.testId,
      );
    },
  );
}

function* processTestDelete() {
  yield takeLeadingPerKey(
    ETestsAction.TEST_DELETE_REQUEST,
    function* (action: TestDeleteRequestAction) {
      const {courseId, lessonId, testId, onDelete, onError} = action.payload;
      try {
        yield call(APIRequest.delete, `/knowledge/tests/${testId}`);
        if (onDelete) {
          yield call(onDelete, courseId, lessonId, testId);
        }
        yield put(
          testDelete({
            courseId,
            lessonId,
            testId,
          }),
        );
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, lessonId, testId, error);
        }
      }
    },
    (action) => action.payload.testId,
  );
}

export function* testsSaga() {
  yield all([fork(fetchTest), fork(fetchTestResults), fork(processTestDelete)]);
}
