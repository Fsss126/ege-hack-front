import {useRedirect} from 'hooks/selectors';
import _ from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CourseDeleteCallback, CourseDeleteErrorCallback} from 'store/actions';
import {SubjectInfo} from 'types/entities';

import {
  subjectDeleteRequest,
  subjectInfoRevoke,
  subjectsInfoFetch,
} from './subjects.actions';
import {selectSubjects} from './subjects.selectors';

export function useSubjects() {
  const subjects = useSelector(selectSubjects);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(subjectsInfoFetch());
  }, [dispatch]);
  useEffect(() => {
    if (!subjects) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, subjects]);
  return subjects instanceof Error
    ? {error: subjects, reload: dispatchFetchAction}
    : {subjects, reload: dispatchFetchAction};
}

export function useSubject(teacherId: number) {
  const {subjects, error, reload} = useSubjects();
  const subject = subjects ? _.find(subjects, {id: teacherId}) : undefined;

  return {
    subject,
    error: subjects && !subject ? true : error,
    reload,
  };
}

export function useRevokeSubjects() {
  const dispatch = useDispatch();

  return useCallback(
    (responseSubject: SubjectInfo) => {
      dispatch(subjectInfoRevoke(responseSubject));
    },
    [dispatch],
  );
}

export function useDeleteSubject(
  redirectUrl?: string,
  onDelete?: CourseDeleteCallback,
  onError?: CourseDeleteErrorCallback,
) {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (subjectId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(subjectId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (subjectId) => {
      dispatch(
        subjectDeleteRequest({
          subjectId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
