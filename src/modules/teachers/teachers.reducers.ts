import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {TeacherProfileInfo} from 'types/entities';

import {ETeachersAction} from './teachers.constants';

export type TeachersAction = TypedAction<typeof import('./teachers.actions')>;

const teachers: Reducer<DataProperty<TeacherProfileInfo[]>, TeachersAction> = (
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
