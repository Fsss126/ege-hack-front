import {AppState} from 'store/reducers';

export const selectCoursesReducer = (state: AppState) => state.coursesReducer;

export const selectShopCourses = (state: AppState) =>
  selectCoursesReducer(state).shopCourses || undefined;

export const selectUserCourses = (state: AppState) =>
  selectCoursesReducer(state).userCourses;

export const selectAdminCourses = (state: AppState) =>
  selectCoursesReducer(state).adminCourses;

export const selectTeacherCourses = (state: AppState) =>
  selectCoursesReducer(state).teacherCourses;
