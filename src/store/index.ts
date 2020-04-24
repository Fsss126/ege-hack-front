import {applyMiddleware, createStore, Store} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import {Action} from './actions';
import {AppState, rootReducer} from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export type AppStore = Store<AppState, Action>;

export const createAppStore = (): AppStore => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
