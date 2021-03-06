import Auth from 'definitions/auth';
import {all, call, fork, put, select, takeLeading} from 'redux-saga/effects';
import {AccountInfo} from 'types/entities';

import {login, userInfoFetch, userInfoFetched} from './user.actions';
import {EUserAction} from './user.constants';
import {selectCredentials} from './user.selectors';

export function* loginSaga() {
  const credentials = yield select(selectCredentials);

  if (credentials) {
    yield put(login());
    yield put(userInfoFetch());
  }
}

function* fetchUserInfo() {
  yield takeLeading([EUserAction.USER_INFO_FETCH], function* () {
    try {
      const data: AccountInfo = yield call(Auth.getUserInfo);
      yield put(userInfoFetched({data}));
    } catch (error) {
      yield put(userInfoFetched({data: error}));
    }
  });
}

export function* userSaga() {
  yield all([fork(loginSaga), fork(fetchUserInfo)]);
}
