import APIRequest from 'api';
import {all, call, fork, put} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {LessonInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {
  lessonDelete,
  lessonDeleteRequest,
  lessonsFetch,
  lessonsFetched,
} from './lessons.actions';
import {ELessonsAction} from './lessons.constants';

export type LessonsFetchAction = ReturnType<typeof lessonsFetch>;

export type LessonDeleteRequestAction = ReturnType<typeof lessonDeleteRequest>;

function* fetchLessons() {
  yield* waitForLogin<LessonsFetchAction>(
    ELessonsAction.LESSONS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: LessonsFetchAction) {
          const {courseId} = action.payload;
          try {
            const data: LessonInfo[] = yield call(APIRequest.get, '/lessons', {
              params: {
                courseId,
              },
            });
            yield put(lessonsFetched({courseId, data}));
          } catch (error) {
            yield put(lessonsFetched({courseId, data: error}));
          }
        },
        (action) => action.payload.courseId,
      );
    },
  );
}

function* processLessonDelete() {
  yield takeLeadingPerKey(
    ELessonsAction.LESSON_DELETE_REQUEST,
    function* (action: LessonDeleteRequestAction) {
      const {courseId, lessonId, onDelete, onError} = action.payload;
      try {
        yield call(APIRequest.delete, `/lessons/${lessonId}`);
        if (onDelete) {
          yield call(onDelete, courseId, lessonId);
        }
        yield put(lessonDelete({courseId, lessonId}));
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, lessonId, error);
        }
      }
    },
    (action) => action.payload.lessonId,
  );
}

export function* lessonsSaga(): any {
  yield all([fork(fetchLessons), fork(processLessonDelete)]);
}
