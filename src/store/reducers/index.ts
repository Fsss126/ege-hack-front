import {userReducer} from 'modules/user/user.reducers';
import {combineReducers} from 'redux';

import {dataReducer} from './dataReducer';
import {testReducer} from './testReducer';

export const rootReducer = combineReducers({
  userReducer,
  dataReducer,
  testReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
