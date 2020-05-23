import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/selectors';
import {
  TestDeleteCallback,
  TestDeleteErrorCallback,
  testDeleteRequest,
  testFetch,
  testResultsFetch,
  testRevoke,
} from 'modules/tests/tests.actions';
import {selectTestResults, selectTests} from 'modules/tests/tests.selectors';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TestInfo} from 'types/entities';
import {Permission} from 'types/enums';

export function useTest(courseId: number, lessonId: number) {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const test = useSelector(selectTests)[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(testFetch({courseId, lessonId}));
  }, [courseId, dispatch, lessonId]);
  useEffect(() => {
    if (isAllowed && !test) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, isAllowed, lessonId, test]);

  return test instanceof Error
    ? ({error: test, reload: dispatchFetchAction} as const)
    : ({
        test: !isAllowed ? false : test,
        reload: dispatchFetchAction,
      } as const);
}

export function useTestResults(lessonId: number, testId: number) {
  const isAllowed = useCheckPermissions(Permission.TEST_CHECK);
  const results = useSelector(selectTestResults)[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(testResultsFetch({lessonId, testId}));
  }, [dispatch, lessonId, testId]);
  useEffect(() => {
    if (isAllowed) {
      if (!results) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, results]);

  return results instanceof Error
    ? ({error: results, reload: dispatchFetchAction} as const)
    : ({
        results: !isAllowed ? false : results,
        reload: dispatchFetchAction,
      } as const);
}

export function useRevokeTest(courseId: number, lessonId: number) {
  const dispatch = useDispatch();

  return useCallback(
    (data: TestInfo) => {
      dispatch(
        testRevoke({
          courseId,
          lessonId,
          data,
        }),
      );
    },
    [courseId, dispatch, lessonId],
  );
}

export function useDeleteTest(
  redirectUrl?: string,
  onDelete?: TestDeleteCallback,
  onError?: TestDeleteErrorCallback,
) {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId, lessonId, testId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId, lessonId, testId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId: number, lessonId: number, testId: number) => {
      dispatch(
        testDeleteRequest({
          courseId,
          lessonId,
          testId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
