import {combineReducers} from 'redux';

import {dataReducer} from './dataReducer';
import {testReducer} from './testReducer';

export const rootReducer = combineReducers({
  dataReducer,
  testReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
