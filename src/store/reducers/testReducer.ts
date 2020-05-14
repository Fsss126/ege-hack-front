import {Reducer} from 'redux';
import {
  SanitizedTestInfo,
  TestStateInfo,
  TestStatus,
  TestStatusInfo,
} from 'types/entities';

import {Action, ActionType} from '../actions';
import {DataProperty} from './dataReducer';

export interface TestState {
  statuses: {[lessonId: number]: DataProperty<TestStatusInfo | null>};
  test?: DataProperty<SanitizedTestInfo>;
  state?: DataProperty<TestStateInfo>;
}

const defaultState: TestState = {
  statuses: {},
  test: undefined,
  state: undefined,
};

export const testReducer: Reducer<TestState, Action> = (
  state = defaultState,
  action,
): TestState => {
  switch (action.type) {
    case ActionType.TEST_STATUS_FETCHED: {
      const {lessonId, status} = action;

      return {
        ...state,
        statuses: {
          ...state.statuses,
          [lessonId]: status,
        },
      };
    }
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
    case ActionType.TEST_SAVE_ANSWER: {
      if (
        !state.test ||
        state.test instanceof Error ||
        !state.state ||
        state.state instanceof Error ||
        state.state.status === TestStatus.COMPLETED
      ) {
        return state;
      }
      const {answerInfo, taskId} = action;
      const {
        state: {answers},
        test: {tasks},
      } = state;
      const mergedAnswers = {
        ...answers,
        [taskId]: answerInfo,
      };
      const answersCount = Object.values(mergedAnswers).length;
      const tasksCount = tasks.length;

      return {
        ...state,
        state: {
          ...state.state,
          answers: mergedAnswers,
          progress: answersCount / tasksCount,
        },
      };
    }
    default:
      return state;
  }
};
