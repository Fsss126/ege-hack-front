import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/selectors';
import _ from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';

import {
  LessonDeleteCallback,
  LessonDeleteErrorCallback,
  lessonDeleteRequest,
  lessonsFetch,
  lessonsRevoke,
} from './lessons.actions';
import {selectLessons} from './lessons.selectors';

export function useLessons(courseId: number) {
  const lessons = useSelector(selectLessons)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(lessonsFetch({courseId}));
  }, [courseId, dispatch]);
  useEffect(() => {
    if (!lessons) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, lessons]);
  return lessons instanceof Error
    ? ({error: lessons, reload: dispatchFetchAction} as const)
    : ({lessons, reload: dispatchFetchAction} as const);
}

export function useLesson(courseId: number, lessonId: number) {
  const {lessons, error, reload} = useLessons(courseId);
  const lesson = lessons ? _.find(lessons, {id: lessonId}) : undefined;

  return {
    lesson,
    error: lessons && !lesson ? true : error,
    reload,
  } as const;
}

export function useAdminLessons(courseId: number) {
  const {lessons, error, reload} = useLessons(courseId);
  const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

  return {lessons: !isAllowed ? false : lessons, error, reload} as const;
}

export function useAdminLesson(courseId: number, lessonId: number) {
  const {lesson, error, reload} = useLesson(courseId, lessonId);
  const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

  return {lesson: !isAllowed ? false : lesson, error, reload} as const;
}

export function useRevokeLessons(courseId: number) {
  const dispatch = useDispatch();

  return useCallback(
    (data: LessonInfo) => {
      dispatch(lessonsRevoke({data, courseId}));
    },
    [dispatch, courseId],
  );
}

export function useDeleteLesson(
  redirectUrl?: string,
  onDelete?: LessonDeleteCallback,
  onError?: LessonDeleteErrorCallback,
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
    (courseId, lessonId) => {
      dispatch(
        lessonDeleteRequest({
          courseId,
          lessonId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
