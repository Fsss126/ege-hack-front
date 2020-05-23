import APIRequest from 'api';
import {
  homeworkFetch,
  homeworkFetched,
  userHomeworkFetch,
  userHomeworkFetched,
} from 'modules/homeworks/homeworks.actions';
import {EHomeworksAction} from 'modules/homeworks/homeworks.constants';
import {all, call, fork, put} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {HomeworkInfo, UserHomeworkInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type UserHomeworksFetchAction = ReturnType<typeof userHomeworkFetch>;
type HomeworksFetchAction = ReturnType<typeof homeworkFetch>;

function* fetchUserHomeworks() {
  yield* waitForLogin<UserHomeworksFetchAction>(
    EHomeworksAction.USER_HOMEWORKS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: UserHomeworksFetchAction) {
          const {lessonId} = action.payload;
          try {
            const data: UserHomeworkInfo = yield call(
              APIRequest.get,
              `/lessons/${lessonId}/homeworks/pupil`,
            );
            yield put(
              userHomeworkFetched({
                lessonId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              userHomeworkFetched({
                lessonId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.lessonId,
      );
    },
  );
}

function* fetchHomeworks() {
  yield* waitForLogin<HomeworksFetchAction>(
    EHomeworksAction.HOMEWORKS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: HomeworksFetchAction) {
          const {lessonId} = action.payload;
          try {
            const data: HomeworkInfo[] = yield call(
              APIRequest.get,
              `/lessons/${lessonId}/homeworks`,
            );
            yield put(
              homeworkFetched({
                lessonId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              homeworkFetched({
                lessonId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.lessonId,
      );
    },
  );
}

export function* homeworksSaga() {
  yield all([fork(fetchUserHomeworks), fork(fetchHomeworks)]);
}
