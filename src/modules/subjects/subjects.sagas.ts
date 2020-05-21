import APIRequest from 'api';
import {all, call, fork, put, takeLeading} from 'redux-saga/effects';
import {SubjectInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {
  subjectDelete,
  subjectDeleteRequest,
  subjectsFetched,
} from './subjects.actions';
import {ESubjectsAction} from './subjects.constants';

function* fetchSubjects() {
  yield takeLeading([ESubjectsAction.SUBJECTS_FETCH], function* () {
    try {
      const subjects: SubjectInfo[] = yield call(APIRequest.get, '/subjects');
      yield put(subjectsFetched(subjects));
    } catch (error) {
      yield put(subjectsFetched(error));
    }
  });
}

function* processSubjectDelete() {
  yield takeLeadingPerKey(
    ESubjectsAction.SUBJECT_DELETE_REQUEST,
    function* (action: ReturnType<typeof subjectDeleteRequest>) {
      const {subjectId, onDelete, onError} = action.payload;
      try {
        yield call(APIRequest.delete, `/subjects/${subjectId}`);
        if (onDelete) {
          yield call(onDelete, subjectId);
        }
        yield put(subjectDelete({subjectId}));
      } catch (error) {
        if (onError) {
          yield call(onError, subjectId, error);
        }
      }
    },
    (action) => action.payload.subjectId,
  );
}

export function* subjectsSaga(): any {
  yield all([fork(fetchSubjects), fork(processSubjectDelete)]);
}
