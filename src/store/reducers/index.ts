import {coursesReducer} from 'modules/courses/courses.reducers';
import {homeworksReducer} from 'modules/homeworks/homeworks.reducers';
import {knowledgeReducer} from 'modules/knowledge/knowledge.reducers';
import {lessonsReducer} from 'modules/lessons/lessons.reducers';
import {participantsReducer} from 'modules/participants/participants.reducers';
import {subjectsReducer} from 'modules/subjects/subjects.reducers';
import {teachersReducer} from 'modules/teachers/teachers.reducers';
import {testingReducer} from 'modules/testing/testing.reducers';
import {testsReducer} from 'modules/tests/tests.reducers';
import {userReducer} from 'modules/user/user.reducers';
import {usersReducer} from 'modules/users/users.reducers';
import {webinarsReducer} from 'modules/webinars/webinars.reducers';
import {combineReducers} from 'redux';

export const rootReducer = combineReducers({
  userReducer,
  subjectsReducer,
  coursesReducer,
  teachersReducer,
  testingReducer,
  lessonsReducer,
  usersReducer,
  homeworksReducer,
  webinarsReducer,
  participantsReducer,
  testsReducer,
  knowledgeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
