import {ETestsAction} from 'modules/tests/tests.constants';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {TestInfo, TestResultInfo} from 'types/entities';

const tests: Reducer<Dictionary<DataProperty<TestInfo>>, Action> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case ETestsAction.TEST_FETCHED:
    case ETestsAction.TEST_REVOKE: {
      const {lessonId, data} = action.payload;

      return {
        ...state,
        [lessonId]: data,
      };
    }
    case ETestsAction.TEST_DELETE: {
      const {lessonId} = action.payload;

      return {
        ...state,
        [lessonId]: null,
      };
    }
    default:
      return state;
  }
};

const testResults: Reducer<
  Dictionary<DataProperty<TestResultInfo[]>>,
  Action
> = (state = {}, action) => {
  switch (action.type) {
    case ETestsAction.TEST_RESULTS_FETCHED: {
      const {lessonId, data} = action.payload;

      return {
        ...state,
        [lessonId]: data,
      };
    }
    default:
      return state;
  }
};

export const testsReducer = combineReducers({
  tests,
  testResults,
});
