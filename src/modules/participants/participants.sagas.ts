import APIRequest from 'api';
import {
  participantsDelete,
  participantsDeleteRequest,
  participantsFetch,
  participantsFetched,
} from 'modules/participants/participants.actions';
import {EParticipantsAction} from 'modules/participants/participants.constants';
import {all, call, fork, put} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {CourseParticipantInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type ParticipantsFetchAction = ReturnType<typeof participantsFetch>;
type ParticipantDeleteRequestAction = ReturnType<
  typeof participantsDeleteRequest
>;

function* fetchParticipants() {
  yield* waitForLogin<ParticipantsFetchAction>(
    EParticipantsAction.PARTICIPANTS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: ParticipantsFetchAction) {
          const {courseId} = action.payload;
          try {
            const data: CourseParticipantInfo[] = yield call(
              APIRequest.get,
              `/courses/${courseId}/participants`,
            );
            yield put(
              participantsFetched({
                courseId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              participantsFetched({
                courseId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.courseId,
      );
    },
  );
}

function* processParticipantDelete() {
  yield takeLeadingPerKey(
    EParticipantsAction.PARTICIPANTS_DELETE_REQUEST,
    function* (action: ParticipantDeleteRequestAction) {
      const {courseId, userId, onDelete, onError} = action.payload;
      try {
        yield call(
          APIRequest.delete,
          `courses/${courseId}/participants/${userId}`,
        );
        if (onDelete) {
          yield call(onDelete, courseId, userId);
        }
        yield put(
          participantsDelete({
            courseId,
            userId,
          }),
        );
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, userId, error);
        }
      }
    },
    (action) => [action.payload.courseId, action.payload.userId],
  );
}

export function* participantsSaga() {
  yield all([fork(fetchParticipants), fork(processParticipantDelete)]);
}
