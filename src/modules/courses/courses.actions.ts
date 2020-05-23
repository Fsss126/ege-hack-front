import {AxiosError} from 'axios';
import {
  dataActionCreator,
  fetchedActionCreator,
  infoActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {CourseInfo, UserCourseInfo} from 'types/entities';

import {ECoursesAction} from './courses.constants';

export type CourseDeleteCallback = (courseId: number) => void;

export type CourseDeleteErrorCallback = (
  courseId: number,
  error: AxiosError,
) => void;

export interface CourseDeletePayload {
  courseId: number;
}

export interface CourseDeleteRequestPayload extends CourseDeletePayload {
  onDelete?: CourseDeleteCallback;
  onError?: CourseDeleteErrorCallback;
}

export const shopCoursesFetch = infoActionCreator(
  ECoursesAction.SHOP_COURSES_FETCH,
);

export const shopCoursesFetched = fetchedActionCreator<
  ECoursesAction.SHOP_COURSES_FETCHED,
  CourseInfo[]
>(ECoursesAction.SHOP_COURSES_FETCHED);

export const userCoursesFetch = infoActionCreator(
  ECoursesAction.USER_COURSES_FETCH,
);

export const userCoursesFetched = fetchedActionCreator<
  ECoursesAction.USER_COURSES_FETCHED,
  UserCourseInfo[]
>(ECoursesAction.USER_COURSES_FETCHED);

export const adminCoursesFetch = infoActionCreator(
  ECoursesAction.ADMIN_COURSES_FETCH,
);

export const adminCoursesFetched = fetchedActionCreator<
  ECoursesAction.ADMIN_COURSES_FETCHED,
  CourseInfo[]
>(ECoursesAction.ADMIN_COURSES_FETCHED);

export const teacherCoursesFetch = infoActionCreator(
  ECoursesAction.TEACHER_COURSES_FETCH,
);

export const teacherCoursesFetched = fetchedActionCreator<
  ECoursesAction.TEACHER_COURSES_FETCHED,
  CourseInfo[]
>(ECoursesAction.TEACHER_COURSES_FETCHED);

export const courseRevoke = dataActionCreator<
  ECoursesAction.COURSES_REVOKE,
  CourseInfo
>(ECoursesAction.COURSES_REVOKE);

export const courseDeleteRequest = loadedActionCreator<
  ECoursesAction.COURSE_DELETE_REQUEST,
  CourseDeleteRequestPayload
>(ECoursesAction.COURSE_DELETE_REQUEST);

export const courseDelete = loadedActionCreator<
  ECoursesAction.COURSE_DELETE,
  CourseDeletePayload
>(ECoursesAction.COURSE_DELETE);
