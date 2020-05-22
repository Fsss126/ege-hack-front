import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {TeacherProfileInfo} from 'types/entities';

import {ETeachersAction} from './teachers.constants';

const teachers: Reducer<DataProperty<TeacherProfileInfo[]>, Action> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ETeachersAction.TEACHERS_FETCHED: {
      return action.payload.data;
    }
    default:
      return state;
  }
};

export const teachersReducer = combineReducers({
  teachers,
});
