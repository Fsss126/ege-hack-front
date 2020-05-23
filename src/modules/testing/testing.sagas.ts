import APIRequest from 'api';
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  take,
  takeLeading,
} from 'redux-saga/effects';
import {Action} from 'store/actions';
import {waitForLogin} from 'store/sagas/watchers';
import {UserAnswerDtoReq} from 'types/dtos';
import {
  TestInfo,
  TestStateInfo,
  TestStatePassedInfo,
  TestStatusInfo,
} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {
  testCompleteRequest,
  testFetch,
  testFetched,
  testSaveAnswer,
  testSaveAnswerRequest,
  testStartRequest,
  testStateFetch,
  testStateFetched,
  testStateUpdate,
  testStatusFetch,
  testStatusFetched,
} from './testing.actions';
import {ETestingAction} from './testing.constants';
import {selectTest, selectTestState} from './testing.selectors';

type TestFetchAction = ReturnType<typeof testFetch>;
type TestFetchedAction = ReturnType<typeof testFetched>;
type TestStatusFetchAction = ReturnType<typeof testStatusFetch>;
type TestStateFetchAction = ReturnType<typeof testStateFetch>;
type TestStateFetchedAction = ReturnType<typeof testStateFetched>;
type TestStartRequestAction = ReturnType<typeof testStartRequest>;
type TestCompleteRequestAction = ReturnType<typeof testCompleteRequest>;
type TestSaveAnswerRequestAction = ReturnType<typeof testSaveAnswerRequest>;
type TestSaveAnswerAction = ReturnType<typeof testSaveAnswer>;

function* fetchTest() {
  yield* waitForLogin<TestFetchAction>(ETestingAction.TEST_FETCH, function* (
    channel,
  ) {
    yield takeLeading(channel, function* (action) {
      const {testId} = action.payload;
      try {
        const data: TestInfo = yield call(
          APIRequest.get,
          `/knowledge/tests/${testId}/`,
        );
        yield put(testFetched({data, testId}));
      } catch (error) {
        yield put(testFetched({data: error, testId}));
      }
    });
  });
}

function* fetchTestStatus() {
  yield* waitForLogin<TestStatusFetchAction>(
    ETestingAction.TEST_STATUS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: TestStatusFetchAction) {
          const {lessonId, courseId} = action.payload;
          try {
            const data: TestStatusInfo = yield call(
              APIRequest.get,
              `/knowledge/tests/status`,
              {
                params: {
                  lessonId,
                },
              },
            );
            yield put(
              testStatusFetched({
                data,
                // testId,
                lessonId,
                courseId,
              }),
            );
          } catch (error) {
            yield put(
              testStatusFetched({
                data: error,
                // testId,
                lessonId,
                courseId,
              }),
            );
          }
        },
        (action) => action.payload.lessonId,
      );
    },
  );
}

function* fetchTestState() {
  yield* waitForLogin<TestStateFetchAction>(
    ETestingAction.TEST_STATE_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: TestStateFetchAction) {
          const {lessonId, courseId, testId} = action.payload;
          try {
            const data: TestStateInfo = yield call(
              APIRequest.get,
              `/knowledge/tests/${testId}/state`,
            );

            yield put(
              testStateFetched({
                data,
                testId,
                lessonId,
                courseId,
              }),
            );
          } catch (error) {
            yield put(
              testStateFetched({
                data: error,
                testId,
                lessonId,
                courseId,
              }),
            );
          }
        },
        (action) => action.payload.lessonId,
      );
    },
  );
}

function* processTestStart() {
  yield takeLeadingPerKey(
    ETestingAction.TEST_START_REQUEST,
    function* (action: TestStartRequestAction) {
      const {testId, lessonId, courseId, onSuccess, onError} = action.payload;
      yield put(testFetch({testId}));
      yield put(
        testStateFetch({
          testId,
          lessonId,
          courseId,
        }),
      );
      const {stateFetchedAction, testFetchedAction} = yield all({
        stateFetchedAction: take(
          (action: Action) =>
            action.type === ETestingAction.TEST_STATE_FETCHED &&
            action.payload.lessonId === lessonId,
        ),
        testFetchedAction: take(
          (action: Action) =>
            action.type === ETestingAction.TEST_FETCHED &&
            action.payload.testId === testId,
        ),
      });
      const {
        payload: {data: state},
      }: TestStateFetchedAction = stateFetchedAction;
      const {
        payload: {data: test},
      }: TestFetchedAction = testFetchedAction;

      if (state instanceof Error || test instanceof Error) {
        if (onError) {
          yield call(
            onError,
            testId,
            state instanceof Error ? state : (test as any),
          );
        }
      } else {
        if (onSuccess) {
          yield call(onSuccess, testId, state, test);
        }
      }
    },
    (action) => action.payload.testId,
  );
}

function* processTestComplete() {
  yield takeLeadingPerKey(
    ETestingAction.TEST_COMPLETE_REQUEST,
    function* (action: TestCompleteRequestAction) {
      const {testId, lessonId, courseId, onSuccess, onError} = action.payload;
      try {
        const data: TestStatePassedInfo = yield call(
          APIRequest.post,
          `/knowledge/tests/${testId}/complete`,
        );
        yield put(
          testStateFetched({
            data,
            testId,
            lessonId,
            courseId,
          }),
        );

        if (onSuccess) {
          yield call(onSuccess, testId, data);
        }
      } catch (e) {
        if (onError) {
          yield call(onError, testId, e);
        }
      }
    },
    (action) => action.payload.testId,
  );
}

function* processTestSaveAnswer() {
  yield takeLeadingPerKey(
    ETestingAction.TEST_SAVE_ANSWER_REQUEST,
    function* (action: TestSaveAnswerRequestAction) {
      const {
        testId,
        taskId,
        lessonId,
        courseId,
        answer,
        complete,
        onSuccess,
        onError,
      } = action.payload;

      const requestData: UserAnswerDtoReq = {
        task_id: taskId,
        user_answer: answer,
      };

      try {
        const answerInfo = yield call(
          APIRequest.post,
          `/knowledge/tests/${testId}/answer`,
          requestData,
        );
        yield delay(300);
        yield put(
          testSaveAnswer({
            taskId,
            testId,
            lessonId,
            courseId,
            answerInfo,
          }),
        );
        yield select();

        if (complete) {
          yield put(
            testCompleteRequest({
              testId,
              lessonId,
              courseId,
              onSuccess: () => {
                if (onSuccess) {
                  onSuccess(testId, taskId, answerInfo);
                }
              },
              onError: (testId, error) => {
                if (onError) {
                  onError(testId, taskId, error);
                }
              },
            }),
          );
        }

        if (onSuccess) {
          yield call(onSuccess, testId, taskId, answerInfo);
        }
      } catch (e) {
        if (onError) {
          yield call(onError, testId, taskId, e);
        }
      }
    },
    (action) => [action.payload.testId, action.payload.taskId],
  );
}

function* processSavedAnswer() {
  yield takeLeadingPerKey(
    ETestingAction.TEST_SAVE_ANSWER,
    function* (action: TestSaveAnswerAction) {
      const {testId, lessonId, courseId, answerInfo, taskId} = action.payload;
      const test = (yield select(selectTest)) as Yield<typeof selectTest>;
      const state = (yield select(selectTestState)) as Yield<
        typeof selectTestState
      >;

      if (
        !test ||
        test instanceof Error ||
        !state ||
        state instanceof Error ||
        state.is_completed
      ) {
        return;
      }
      const {answers} = state;
      const {tasks} = test;

      const mergedAnswers = {
        ...answers,
        [taskId]: answerInfo,
      };
      const answersCount = _.values(mergedAnswers).length;
      const tasksCount = tasks.length;
      const statusUpdate = {
        answers: mergedAnswers,
        progress: answersCount / tasksCount,
      };

      yield put(
        testStateUpdate({
          data: {
            ...state,
            ...statusUpdate,
          },
          courseId,
          lessonId,
          testId,
        }),
      );
    },
    (action) => action.payload.testId,
  );
}

export function* testingSaga() {
  yield all([
    fork(fetchTest),
    fork(fetchTestStatus),
    fork(fetchTestState),
    fork(processTestStart),
    fork(processTestComplete),
    fork(processTestSaveAnswer),
    fork(processSavedAnswer),
  ]);
}
