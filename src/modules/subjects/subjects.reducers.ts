import _ from 'lodash';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty, StoreProperty} from 'store/reducers/types';
import {SubjectInfo} from 'types/entities';

import {ESubjectsAction} from './subjects.constants';

const subjects: Reducer<StoreProperty<SubjectInfo[]>, Action> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ESubjectsAction.SUBJECTS_FETCHED: {
      return action.payload.data;
    }
    case ESubjectsAction.SUBJECTS_REVOKE: {
      const responseSubject = action.payload.data;

      if (!(state instanceof Array)) {
        return state;
      }
      const courseIndex = _.findIndex<SubjectInfo>(state, {
        id: responseSubject.id,
      });
      const newCatalog = [...state];

      if (courseIndex !== -1) {
        const prevCourse = state[courseIndex];
        newCatalog[courseIndex] = {...prevCourse, ...responseSubject};
      } else {
        newCatalog.push(responseSubject);
      }
      return newCatalog;
    }
    case ESubjectsAction.SUBJECT_DELETE: {
      const {subjectId} = action.payload;

      return state instanceof Array
        ? state.filter(({id}) => id !== subjectId)
        : state;
    }
    default:
      return state;
  }
};

export const subjectsReducer = combineReducers({
  subjects,
});
