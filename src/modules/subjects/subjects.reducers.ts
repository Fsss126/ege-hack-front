import _ from 'lodash';
import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {SubjectInfo} from 'types/entities';

import {ESubjectsAction} from './subjects.constants';

export type SubjectsAction = TypedAction<typeof import('./subjects.actions')>;

const subjects: Reducer<DataProperty<SubjectInfo[]>, SubjectsAction> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case ESubjectsAction.SUBJECTS_FETCHED: {
      return action.payload;
    }
    case ESubjectsAction.SUBJECTS_REVOKE: {
      const responseSubject = action.payload;

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
