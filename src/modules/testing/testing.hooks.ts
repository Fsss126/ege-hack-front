import _ from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Dispatch} from 'redux';
import {Action} from 'store/actions';
import {SanitizedTaskInfo} from 'types/entities';

import {
  TestCompleteCallback,
  TestCompleteErrorCallback,
  testCompleteRequest,
  testFetch,
  TestSaveAnswerCallback,
  TestSaveAnswerErrorCallback,
  testSaveAnswerRequest,
  TestStartCallback,
  TestStartErrorCallback,
  testStartRequest,
  testStateFetch,
  testStatusFetch,
} from './testing.actions';
import {
  selectTest,
  selectTestState,
  selectTestStatuses,
} from './testing.selectors';

export type StartTestParams = {
  courseId: number;
  lessonId: number;
  testId: number;
  onSuccess?: TestStartCallback;
  onError?: TestStartErrorCallback;
};

export function useStartTest() {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(
    (params: StartTestParams) => {
      const {courseId, lessonId, testId, onSuccess, onError} = params;
      const onSuccessCallback: TestStartCallback = (
        testId,
        testState,
        test,
      ) => {
        const {last_task_id, is_completed: isCompleted} = testState;
        const {tasks} = test;
        const testUrl = `/courses/${courseId}/${lessonId}/test/${testId}`;
        const taskId = last_task_id !== undefined ? last_task_id : tasks[0].id;

        if (onSuccess) {
          onSuccess(testId, testState, test);
        }

        history.push(
          isCompleted ? `${testUrl}/results/` : `${testUrl}/${taskId}/`,
        );
      };

      dispatch(
        testStartRequest({
          testId,
          courseId,
          lessonId,
          onSuccess: onSuccessCallback,
          onError,
        }),
      );
    },
    [dispatch, history],
  );
}

export type SaveAnswerParams = {
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answer: string;
  complete: boolean;
  navigateTo: string;
  onSuccess: TestSaveAnswerCallback;
  onError: TestSaveAnswerErrorCallback;
};

export function useSaveAnswer() {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(
    (params: SaveAnswerParams) => {
      const {
        testId,
        taskId,
        lessonId,
        courseId,
        answer,
        complete,
        navigateTo,
        onSuccess,
        onError,
      } = params;
      const onSuccessCallback: TestSaveAnswerCallback = (
        testId,
        taskId,
        savedAnswer,
      ) => {
        onSuccess(testId, taskId, savedAnswer);
        history.push(navigateTo);
      };

      dispatch(
        testSaveAnswerRequest({
          testId,
          taskId,
          lessonId,
          courseId,
          answer,
          complete,
          onSuccess: onSuccessCallback,
          onError,
        }),
      );
    },
    [dispatch, history],
  );
}

export type CompleteTestParams = {
  testId: number;
  lessonId: number;
  courseId: number;
  navigateTo: string;
  onSuccess: TestCompleteCallback;
  onError: TestCompleteErrorCallback;
};

export function useCompleteTest() {
  const dispatch = useDispatch();
  const history = useHistory();

  return useCallback(
    (params: CompleteTestParams) => {
      const {
        testId,
        lessonId,
        courseId,
        navigateTo,
        onSuccess,
        onError,
      } = params;
      const onSuccessCallback: TestCompleteCallback = (testId, results) => {
        onSuccess(testId, results);
        history.push(navigateTo);
      };

      dispatch(
        testCompleteRequest({
          testId,
          lessonId,
          courseId,
          onSuccess: onSuccessCallback,
          onError,
        }),
      );
    },
    [dispatch, history],
  );
}

export function useTestStatus(courseId: number, lessonId: number) {
  const status = useSelector(selectTestStatuses)[lessonId];
  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFetchAction = useCallback(() => {
    dispatch(testStatusFetch({courseId, lessonId}));
  }, [dispatch, courseId, lessonId]);
  useEffect(() => {
    if (!status) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, status]);
  return status instanceof Error
    ? {error: status, reload: dispatchFetchAction}
    : {status, reload: dispatchFetchAction};
}

export function useTest(testId: number) {
  const test = useSelector(selectTest);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(testFetch({testId}));
  }, [testId, dispatch]);
  useEffect(() => {
    if (!test) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, test]);
  return test instanceof Error
    ? {error: test, reload: dispatchFetchAction}
    : {test, reload: dispatchFetchAction};
}

export function useTestTask(testId: number, taskId: number) {
  const {test, error, reload} = useTest(testId);
  const task = test
    ? _.find<SanitizedTaskInfo>(test.tasks, {id: taskId})
    : undefined;

  return {
    task,
    error: test && !task ? true : error,
    reload,
  };
}

export function useTestState(
  testId: number,
  lessonId: number,
  courseId: number,
) {
  const state = useSelector(selectTestState);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(testStateFetch({testId, lessonId, courseId}));
  }, [dispatch, testId, lessonId, courseId]);
  useEffect(() => {
    if (!state) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, state]);
  return state instanceof Error
    ? {error: state, reload: dispatchFetchAction}
    : {state, reload: dispatchFetchAction};
}
