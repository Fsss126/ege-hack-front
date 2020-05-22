import {coursesReducer} from 'modules/courses/courses.reducers';
import {homeworksReducer} from 'modules/homeworks/homeworks.reducers';
import {lessonsReducer} from 'modules/lessons/lessons.reducers';
import {subjectsReducer} from 'modules/subjects/subjects.reducers';
import {teachersReducer} from 'modules/teachers/teachers.reducers';
import {testingReducer} from 'modules/testing/testing.reducers';
import {userReducer} from 'modules/user/user.reducers';
import {usersReducer} from 'modules/users/users.reducers';
import {webinarsReducer} from 'modules/webinars/webinars.reducers';
import {combineReducers} from 'redux';

import {dataReducer} from './dataReducer';

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
  dataReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
