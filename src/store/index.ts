import { createStore, applyMiddleware, Store  } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {Action} from './actions';
import rootSaga from "./sagas";
import {AppState, rootReducer} from "./reducers";

const sagaMiddleware = createSagaMiddleware();

export type AppStore = Store<AppState, Action>;

export const createAppStore = (): AppStore => {
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
    sagaMiddleware.run(rootSaga);
    return store;
};
