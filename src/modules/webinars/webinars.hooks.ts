import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/common';
import {
  adminWebinarsFetch,
  upcomingWebinarsFetch,
  WebinarDeleteCallback,
  WebinarDeleteErrorCallback,
  webinarDeleteRequest,
  webinarsFetch,
  webinarsRevoke,
} from 'modules/webinars/webinars.actions';
import {
  selectAdminWebinars,
  selectUpcomingWebinars,
  selectWebinars,
} from 'modules/webinars/webinars.selectors';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {WebinarScheduleInfo} from 'types/entities';
import {Permission} from 'types/enums';

export function useUpcomingWebinars() {
  const webinars = useSelector(selectUpcomingWebinars);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(upcomingWebinarsFetch());
  }, [dispatch]);
  useEffect(() => {
    if (!webinars) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, webinars]);
  return webinars instanceof Error
    ? ({error: webinars, reload: dispatchFetchAction} as const)
    : ({webinars, reload: dispatchFetchAction} as const);
}

export function useWebinars(courseId: number) {
  const webinars = useSelector(selectWebinars)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(webinarsFetch({courseId}));
  }, [courseId, dispatch]);
  useEffect(() => {
    if (!webinars) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, webinars]);
  return webinars instanceof Error
    ? ({error: webinars, reload: dispatchFetchAction} as const)
    : ({webinars, reload: dispatchFetchAction} as const);
}

export function useAdminWebinars(courseId: number) {
  const isAllowed = useCheckPermissions(Permission.WEBINAR_EDIT);
  const webinars = useSelector(selectAdminWebinars)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(adminWebinarsFetch({courseId}));
  }, [courseId, dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!webinars) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, webinars]);
  return webinars instanceof Error
    ? ({error: webinars, reload: dispatchFetchAction} as const)
    : ({
        webinars: !isAllowed ? false : webinars,
        reload: dispatchFetchAction,
      } as const);
}

export function useRevokeWebinars(courseId: number) {
  const dispatch = useDispatch();

  return useCallback(
    (data: WebinarScheduleInfo) => {
      dispatch(webinarsRevoke({courseId, data}));
    },
    [dispatch, courseId],
  );
}

export function useDeleteWebinar(
  redirectUrl?: string,
  onDelete?: WebinarDeleteCallback,
  onError?: WebinarDeleteErrorCallback,
) {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId, lessonId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId, lessonId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId: number, webinarId: number) => {
      dispatch(
        webinarDeleteRequest({
          courseId,
          webinarId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
