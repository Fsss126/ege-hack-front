import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/selectors';
import _ from 'lodash';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CourseInfo} from 'types/entities';
import {Permission} from 'types/enums';

import {
  adminCoursesFetch,
  CourseDeleteCallback,
  CourseDeleteErrorCallback,
  courseDeleteRequest,
  courseRevoke,
  shopCoursesFetch,
  teacherCoursesFetch,
  userCoursesFetch,
} from './courses.actions';
import {
  selectAdminCourses,
  selectShopCourses,
  selectTeacherCourses,
  selectUserCourses,
} from './courses.selectors';

export function useShopCatalog() {
  const shopCourses = useSelector(selectShopCourses);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(shopCoursesFetch());
  }, [dispatch]);
  useEffect(() => {
    if (!shopCourses) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, shopCourses]);
  return shopCourses instanceof Error
    ? ({error: shopCourses, reload: dispatchFetchAction} as const)
    : ({catalog: shopCourses, reload: dispatchFetchAction} as const);
}

export function useShopCourse(courseId: number) {
  const {catalog, error, reload} = useShopCatalog();
  const course = catalog ? _.find(catalog, {id: courseId}) : undefined;

  return {
    course,
    error: catalog && !course ? true : error,
    reload,
  } as const;
}

export function useUserCourses() {
  const userCourses = useSelector(selectUserCourses);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(userCoursesFetch());
  }, [dispatch]);
  useEffect(() => {
    if (!userCourses) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, userCourses]);
  return userCourses instanceof Error
    ? {error: userCourses, reload: dispatchFetchAction}
    : {courses: userCourses, reload: dispatchFetchAction};
}

export function useUserCourse(courseId: number) {
  const {courses, error, reload} = useUserCourses();
  const course = courses ? _.find(courses, {id: courseId}) : undefined;

  return {
    course,
    error: courses && !course ? true : error,
    reload,
  };
}

export function useAdminCourses() {
  const isAllowed = useCheckPermissions(Permission.COURSE_EDIT);
  const adminCourses = useSelector(selectAdminCourses);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(adminCoursesFetch());
  }, [dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!adminCourses) {
        dispatchFetchAction();
      }
    }
  }, [adminCourses, dispatchFetchAction, isAllowed]);
  return adminCourses instanceof Error
    ? ({error: adminCourses, reload: dispatchFetchAction} as const)
    : ({
        catalog: !isAllowed ? false : adminCourses,
        reload: dispatchFetchAction,
      } as const);
}

export function useAdminCourse(courseId: number) {
  const {catalog, error, reload} = useAdminCourses();
  const course = catalog ? _.find(catalog, {id: courseId}) : undefined;

  return {
    course: catalog === false ? false : course,
    error: catalog && !course ? true : error,
    reload,
  } as const;
}

export function useTeacherCourses() {
  const isAllowed = useCheckPermissions(Permission.HOMEWORK_CHECK);
  const teacherCourses = useSelector(selectTeacherCourses);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch(teacherCoursesFetch());
  }, [dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!teacherCourses) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, teacherCourses]);
  return teacherCourses instanceof Error
    ? ({error: teacherCourses, reload: dispatchFetchAction} as const)
    : ({
        catalog: !isAllowed ? false : teacherCourses,
        reload: dispatchFetchAction,
      } as const);
}

export function useTeacherCourse(courseId: number) {
  const {catalog, error, reload} = useTeacherCourses();
  const course = catalog ? _.find(catalog, {id: courseId}) : undefined;

  return {
    course,
    error: catalog && !course ? true : error,
    reload,
  } as const;
}

export function useRevokeCourses() {
  const dispatch = useDispatch();

  return useCallback(
    (responseCourse: CourseInfo) => {
      dispatch(courseRevoke(responseCourse));
    },
    [dispatch],
  );
}

export function useDeleteCourse(
  redirectUrl?: string,
  onDelete?: CourseDeleteCallback,
  onError?: CourseDeleteErrorCallback,
) {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId: number) => {
      dispatch(
        courseDeleteRequest({
          courseId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
