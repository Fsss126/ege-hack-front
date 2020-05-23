import APIRequest, {getCancelToken} from 'api';
import {Canceler} from 'axios';
import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/common';
import _ from 'lodash';
import {useCredentials} from 'modules/user/user.hooks';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CourseInfo, DiscountInfo} from 'types/entities';
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

export function useDiscount(selectedCourses: Set<CourseInfo> | number) {
  const {credentials} = useCredentials();
  const [discount, setDiscount] = React.useState<DiscountInfo>();
  const [error, setError] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const cancelRef = useRef<Canceler>();
  const fetchDiscount = useCallback(async () => {
    const courses =
      selectedCourses instanceof Set
        ? [...selectedCourses].map(({id}) => id)
        : [selectedCourses];

    if (courses.length === 0) {
      return;
    }
    const cancelPrev = cancelRef.current;

    if (cancelPrev) {
      cancelPrev();
    }
    const {token: cancelToken, cancel} = getCancelToken();
    cancelRef.current = cancel;
    try {
      if (error) {
        setError(undefined);
      }
      // setDiscount(null);
      setLoading(true);
      const discount: DiscountInfo = await APIRequest.get(
        '/payments/discounts',
        {
          params: {
            coursesIds: courses,
          },
          cancelToken,
        },
      );
      setDiscount(discount);
    } catch (e) {
      console.error('Error loading discount', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCourses, error]);

  React.useEffect(() => {
    if (credentials && !error) {
      fetchDiscount();
    }
  }, [credentials, selectedCourses, error, fetchDiscount]);

  return {discount, error, reload: fetchDiscount, isLoading} as const;
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
    (data: CourseInfo) => {
      dispatch(courseRevoke({data}));
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
