import APIRequest from 'api';
import {all, call, fork, put, takeLeading} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {TeacherProfileInfo} from 'types/entities';

import {teachersFetched} from './teachers.actions';
import {ETeachersAction} from './teachers.constants';

function* fetchTeachers() {
  yield* waitForLogin(ETeachersAction.TEACHERS_FETCH, function* (channel) {
    yield takeLeading(channel, function* () {
      try {
        const data: TeacherProfileInfo[] = yield call(
          APIRequest.get,
          '/accounts/teachers',
        );
        yield put(teachersFetched({data}));
      } catch (error) {
        yield put(teachersFetched({data: error}));
      }
    });
  });
}

export function* teachersSaga(): any {
  yield all([fork(fetchTeachers)]);
}
