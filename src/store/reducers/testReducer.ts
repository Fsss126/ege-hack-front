import {AxiosError} from 'axios';
import {Reducer} from 'redux';
import {SanitizedTestInfo, TestStateInfo} from 'types/entities';

import {Action, ActionType} from '../actions';

export interface TestState {
  test?: SanitizedTestInfo | AxiosError;
  state?: TestStateInfo | AxiosError;
}

const defaultState: TestState = {
  test: undefined,
  state: undefined,
};

export const testReducer: Reducer<TestState, Action> = (
  state = defaultState,
  action,
): TestState => {
  switch (action.type) {
    case ActionType.TEST_FETCHED: {
      const {test} = action;

      return {
        ...state,
        test,
      };
    }
    case ActionType.TEST_STATE_FETCHED: {
      const {state} = action;

      return {
        ...defaultState,
        state,
      };
    }
    default:
      return state;
  }
};
