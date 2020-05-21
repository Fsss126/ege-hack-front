import {coursesReducer} from 'modules/courses/courses.reducers';
import {subjectsReducer} from 'modules/subjects/subjects.reducers';
import {teachersReducer} from 'modules/teachers/teachers.reducers';
import {userReducer} from 'modules/user/user.reducers';
import {combineReducers} from 'redux';

import {dataReducer} from './dataReducer';
import {testReducer} from './testReducer';

export const rootReducer = combineReducers({
  userReducer,
  subjectsReducer,
  coursesReducer,
  teachersReducer,
  dataReducer,
  testReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
