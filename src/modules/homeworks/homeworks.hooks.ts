import {useCheckPermissions} from 'components/ConditionalRender';
import {
  homeworkFetch,
  homeworkRevoke,
  userHomeworkFetch,
  userHomeworkRevoke,
} from 'modules/homeworks/homeworks.actions';
import {
  selectHomeworks,
  selectUserHomeworks,
} from 'modules/homeworks/homeworks.selectors';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {HomeworkInfo, UserHomeworkInfo} from 'types/entities';
import {Permission} from 'types/enums';

export function useUserHomework(lessonId: number) {
  const homework = useSelector(selectUserHomeworks)[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(userHomeworkFetch({lessonId}));
  }, [dispatch, lessonId]);
  useEffect(() => {
    if (!homework && homework !== null) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, homework]);
  return homework instanceof Error
    ? ({error: homework, reload: dispatchFetchAction} as const)
    : ({homework, reload: dispatchFetchAction} as const);
}

export type RevokeUserHomeworkHookResult = (
  responseHomework: HomeworkInfo,
) => void;

export function useRevokeUserHomework(
  lessonId: number,
): RevokeUserHomeworkHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (data: UserHomeworkInfo) => {
      dispatch(userHomeworkRevoke({lessonId, data}));
    },
    [dispatch, lessonId],
  );
}

export function useHomeworks(lessonId: number) {
  const isAllowed = useCheckPermissions(Permission.HOMEWORK_CHECK);
  const homeworks = useSelector(selectHomeworks)[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(homeworkFetch({lessonId}));
  }, [dispatch, lessonId]);
  useEffect(() => {
    if (isAllowed) {
      if (!homeworks) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, homeworks, isAllowed]);
  return homeworks instanceof Error
    ? ({error: homeworks, reload: dispatchFetchAction} as const)
    : ({
        homeworks: !isAllowed ? false : homeworks,
        reload: dispatchFetchAction,
      } as const);
}

export function useRevokeHomeworks(lessonId: number) {
  const dispatch = useDispatch();

  return useCallback(
    (data: HomeworkInfo) => {
      dispatch(homeworkRevoke({lessonId, data}));
    },
    [dispatch, lessonId],
  );
}
