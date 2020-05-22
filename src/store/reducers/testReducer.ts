import {Reducer} from 'redux';
import {
  CommonTestStatusInfo,
  SanitizedTestInfo,
  TestStateInfo,
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
      const {state: testState, lessonId} = action;
      let {
        statuses: {[lessonId]: testStatus},
      } = state;

      if (
        testStatus &&
        !(testStatus instanceof Error) &&
        !(testState instanceof Error)
      ) {
        const statusUpdate = _.omit(testState, 'answers');

        testStatus = {...testStatus, ...(statusUpdate as any)};
      }

      return {
        ...state,
        statuses: {...state.statuses, [lessonId]: testStatus},
        state: testState,
      };
    }
    case ActionType.TEST_SAVE_ANSWER: {
      if (
        !state.test ||
        state.test instanceof Error ||
        !state.state ||
        state.state instanceof Error ||
        state.state.is_completed
      ) {
        return state;
      }
      const {answerInfo, taskId, lessonId} = action;
      const {
        statuses: {[lessonId]: status},
        state: {answers},
        test: {tasks},
      } = state;
      const mergedAnswers = {
        ...answers,
        [taskId]: answerInfo,
      };
      const answersCount = _.values(mergedAnswers).length;
      const tasksCount = tasks.length;
      const statusUpdate = {
        answers: mergedAnswers,
        progress: answersCount / tasksCount,
      };

      return {
        ...state,
        statuses: {
          [lessonId]:
            status && !(status instanceof Error)
              ? {...status, ...statusUpdate}
              : status,
        },
        state: {
          ...state.state,
          ...statusUpdate,
        },
      };
    }
    default:
      return state;
  }
};
