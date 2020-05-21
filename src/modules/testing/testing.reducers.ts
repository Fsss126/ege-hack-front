import _ from 'lodash';
import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {SanitizedTestInfo, TestStateInfo, TestStatusInfo} from 'types/entities';

import {ETestingAction} from './testing.constants';

export type TestingAction = TypedAction<typeof import('./testing.actions')>;

const statuses: Reducer<
  Dictionary<Maybe<DataProperty<TestStatusInfo>>, number>,
  TestingAction
> = (state = {}, action) => {
  switch (action.type) {
    case ETestingAction.TEST_STATUS_FETCHED: {
      const {lessonId, data} = action.payload;

      return {
        ...state,
        [lessonId]: data,
      };
    }
    case ETestingAction.TEST_STATE_FETCHED:
    case ETestingAction.TEST_STATE_UPDATE: {
      const {lessonId, data: testState} = action.payload;
      let {[lessonId]: testStatus} = state;

      if (
        testStatus &&
        !(testStatus instanceof Error) &&
        !(testState instanceof Error)
      ) {
        const statusUpdate = _.omit(testState, 'answers');

        testStatus = {...testStatus, ...(statusUpdate as any)};
      }

      return {...state, [lessonId]: testStatus};
    }
    default:
      return state;
  }
};

const test: Reducer<DataProperty<SanitizedTestInfo>, TestingAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ETestingAction.TEST_FETCHED: {
      return action.payload.data;
    }
    default:
      return state;
  }
};

const state: Reducer<DataProperty<TestStateInfo>, TestingAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ETestingAction.TEST_STATE_FETCHED:
    case ETestingAction.TEST_STATE_UPDATE: {
      return action.payload.data;
    }
    default:
      return state;
  }
};

export const testingReducer = combineReducers({
  statuses,
  test,
  state,
});
