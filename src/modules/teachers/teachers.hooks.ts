import _ from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {teachersFetch} from './teachers.actions';
import {selectTeachers} from './teachers.selectors';

export function useTeachers() {
  const teachers = useSelector(selectTeachers);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(teachersFetch());
  }, [dispatch]);
  useEffect(() => {
    if (!teachers) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, teachers]);
  return teachers instanceof Error
    ? {error: teachers, reload: dispatchFetchAction}
    : {teachers, reload: dispatchFetchAction};
}

export function useTeacher(teacherId: number) {
  const {teachers, error, reload} = useTeachers();
  const teacher = teachers ? _.find(teachers, {id: teacherId}) : undefined;

  return {
    teacher,
    error: teachers && !teacher ? true : error,
    reload,
  };
}
