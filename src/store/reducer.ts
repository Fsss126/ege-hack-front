import {Reducer} from 'redux';
import {PopupState} from './store';
import {Action, ActionType} from './actions';

const defaultState: PopupState = {
};

export const reducer: Reducer<PopupState, Action> = (state = defaultState, action): PopupState => {
    return state;
};
