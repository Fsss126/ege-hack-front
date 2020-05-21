import APIRequest from 'api';
import {all, call, fork, put, takeLeading} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {CourseInfo, UserCourseInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {
  adminCoursesFetched,
  courseDelete,
  courseDeleteRequest,
  shopCoursesFetched,
  teacherCoursesFetched,
  userCoursesFetched,
} from './courses.actions';
import {ECoursesAction} from './courses.constants';

function* fetchShopCourses() {
  yield* waitForLogin(ECoursesAction.SHOP_COURSES_FETCH, function* (channel) {
    yield takeLeading(channel, function* () {
      try {
        const data: CourseInfo[] = yield call(APIRequest.get, '/courses', {
          params: {
            group: 'MARKET',
          },
        });
        yield put(shopCoursesFetched({data}));
      } catch (error) {
        yield put(shopCoursesFetched({data: error}));
      }
    });
  });
}

function* fetchUserCourses() {
  yield* waitForLogin(ECoursesAction.USER_COURSES_FETCH, function* (channel) {
    yield takeLeading(channel, function* () {
      try {
        const data: UserCourseInfo[] = yield call(APIRequest.get, '/courses', {
          params: {
            group: 'PERSON',
          },
        });
        yield put(userCoursesFetched({data}));
      } catch (error) {
        yield put(userCoursesFetched({data: error}));
      }
    });
  });
}

function* fetchAdminCourses() {
  yield* waitForLogin(ECoursesAction.ADMIN_COURSES_FETCH, function* (channel) {
    yield takeLeading(channel, function* () {
      try {
        const data: CourseInfo[] = yield call(APIRequest.get, '/courses', {
          params: {
            group: 'ALL',
          },
        });
        yield put(adminCoursesFetched({data}));
      } catch (error) {
        yield put(adminCoursesFetched({data: error}));
      }
    });
  });
}

function* fetchTeacherCourses() {
  yield* waitForLogin(ECoursesAction.TEACHER_COURSES_FETCH, function* (
    channel,
  ) {
    yield takeLeading(channel, function* () {
      try {
        const data: CourseInfo[] = yield call(
          APIRequest.get,
          '/courses/homeworkCheck',
        );
        yield put(teacherCoursesFetched({data}));
      } catch (error) {
        yield put(teacherCoursesFetched({data: error}));
      }
    });
  });
}

function* processCourseDelete() {
  yield takeLeadingPerKey(
    ECoursesAction.COURSE_DELETE_REQUEST,
    function* (action: ReturnType<typeof courseDeleteRequest>) {
      const {courseId, onDelete, onError} = action.payload;
      try {
        yield call(APIRequest.delete, `/courses/${courseId}`);
        if (onDelete) {
          yield call(onDelete, courseId);
        }
        yield put(courseDelete({courseId}));
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, error);
        }
      }
    },
    (action) => action.payload.courseId,
  );
}

export function* coursesSaga(): any {
  yield all([
    fork(fetchShopCourses),
    fork(fetchUserCourses),
    fork(fetchAdminCourses),
    fork(fetchTeacherCourses),
    fork(processCourseDelete),
  ]);
}
