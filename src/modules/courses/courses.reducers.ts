import _ from 'lodash';
import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {CourseInfo, UserCourseInfo} from 'types/entities';

import {ECoursesAction} from './courses.constants';

export type CoursesAction = TypedAction<typeof import('./courses.actions')>;

const updateCatalog = <T extends CourseInfo>(
  catalog: DataProperty<T[]>,
  responseCourse: CourseInfo,
): DataProperty<T[]> => {
  if (!(catalog instanceof Array)) {
    return catalog;
  }
  const courseIndex = _.findIndex<CourseInfo>(catalog, {
    id: responseCourse.id,
  });
  const newCatalog = [...catalog];

  if (courseIndex !== -1) {
    const prevCourse = catalog[courseIndex];
    newCatalog[courseIndex] = {...prevCourse, ...responseCourse};
  } else {
    newCatalog.push(responseCourse as T);
  }
  return newCatalog;
};

const removeCourse = <T extends CourseInfo>(
  catalog: DataProperty<T[]>,
  courseId: number,
): DataProperty<T[]> =>
  catalog instanceof Array
    ? catalog.filter(({id}) => id !== courseId)
    : catalog;

const shopCourses: Reducer<DataProperty<CourseInfo[]>, CoursesAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ECoursesAction.SHOP_COURSES_FETCHED: {
      return action.payload;
    }
    case ECoursesAction.COURSES_REVOKE: {
      const responseCourse = action.payload;

      return updateCatalog(state, responseCourse);
    }
    case ECoursesAction.COURSE_DELETE: {
      const {courseId} = action.payload;

      return removeCourse(state, courseId);
    }
    default:
      return state;
  }
};

const userCourses: Reducer<DataProperty<UserCourseInfo[]>, CoursesAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ECoursesAction.USER_COURSES_FETCHED: {
      return action.payload;
    }
    case ECoursesAction.COURSES_REVOKE: {
      const responseCourse = action.payload;

      return updateCatalog(state, responseCourse);
    }
    case ECoursesAction.COURSE_DELETE: {
      const {courseId} = action.payload;

      return removeCourse(state, courseId);
    }
    default:
      return state;
  }
};

const adminCourses: Reducer<DataProperty<CourseInfo[]>, CoursesAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ECoursesAction.ADMIN_COURSES_FETCHED: {
      return action.payload;
    }
    case ECoursesAction.COURSES_REVOKE: {
      const responseCourse = action.payload;

      return updateCatalog(state, responseCourse);
    }
    case ECoursesAction.COURSE_DELETE: {
      const {courseId} = action.payload;

      return removeCourse(state, courseId);
    }
    default:
      return state;
  }
};

const teacherCourses: Reducer<DataProperty<CourseInfo[]>, CoursesAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ECoursesAction.TEACHER_COURSES_FETCHED: {
      return action.payload;
    }
    case ECoursesAction.COURSES_REVOKE: {
      const responseCourse = action.payload;

      return updateCatalog(state, responseCourse);
    }
    case ECoursesAction.COURSE_DELETE: {
      const {courseId} = action.payload;

      return removeCourse(state, courseId);
    }
    default:
      return state;
  }
};

export const coursesReducer = combineReducers({
  shopCourses,
  userCourses,
  teacherCourses,
  adminCourses,
});