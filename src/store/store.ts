import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Action} from './actions';
import {reducer} from './reducer';

export interface PopupState {
    // tab?: chrome.tabs.Tab;
    // tabState?: TabState | null;
    // init: boolean;
    // editingMode: EditingMode;
}

const sagaMiddleware = createSagaMiddleware();

export type PopupStore = Store<PopupState, Action>;

export const createPopupStore = (): PopupStore => {
    return createStore(reducer, applyMiddleware(sagaMiddleware));
};
