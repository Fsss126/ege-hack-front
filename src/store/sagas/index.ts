import {coursesSaga} from 'modules/courses/courses.sagas';
import {homeworksSaga} from 'modules/homeworks/homeworks.sagas';
import {knowledgeSaga} from 'modules/knowledge/knowledge.sagas';
import {lessonsSaga} from 'modules/lessons/lessons.sagas';
import {participantsSaga} from 'modules/participants/participants.sagas';
import {subjectsSaga} from 'modules/subjects/subjects.sagas';
import {teachersSaga} from 'modules/teachers/teachers.sagas';
import {testingSaga} from 'modules/testing/testing.sagas';
import {testsSaga} from 'modules/tests/tests.sagas';
import {userSaga} from 'modules/user/user.sagas';
import {usersSaga} from 'modules/users/users.sagas';
import {webinarsSaga} from 'modules/webinars/webinars.sagas';
import {fork} from 'redux-saga/effects';

export default function* rootSaga() {
  yield fork(userSaga);
  yield fork(subjectsSaga);
  yield fork(coursesSaga);
  yield fork(teachersSaga);
  yield fork(testingSaga);
  yield fork(lessonsSaga);
  yield fork(usersSaga);
  yield fork(homeworksSaga);
  yield fork(webinarsSaga);
  yield fork(participantsSaga);
  yield fork(testsSaga);
  yield fork(knowledgeSaga);
}
