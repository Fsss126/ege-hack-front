import _ from 'lodash';
import {combineReducers, Reducer} from 'redux';
import {DataProperty} from 'store/reducers/types';
import {LessonInfo} from 'types/entities';

import {ELessonsAction} from './lessons.constants';

export type LessonsAction = TypedAction<typeof import('./lessons.actions')>;

const lessons: Reducer<
  Dictionary<DataProperty<LessonInfo[]>>,
  LessonsAction
> = (state = {}, action) => {
  switch (action.type) {
    case ELessonsAction.LESSONS_FETCHED: {
      const {courseId, data} = action.payload;

      return {
        ...state,
        [courseId]: data,
      };
    }
    case ELessonsAction.LESSONS_REVOKE: {
      const {courseId, data: responseLesson} = action.payload;
      const {[courseId]: courseLessons, ...loadedLessons} = state;

      if (!courseLessons || courseLessons instanceof Error) {
        return state;
      }
      const lessonIndex = _.findIndex(courseLessons, {id: responseLesson.id});
      let newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        newLessons[lessonIndex] = {...prevLesson, ...responseLesson};
        newLessons = _.sortBy(newLessons, 'num');
      } else {
        newLessons.push(responseLesson);
      }

      return {...loadedLessons, [courseId]: newLessons};
    }
    case ELessonsAction.LESSON_DELETE: {
      const {courseId, lessonId} = action.payload;
      const {[courseId]: courseLessons, ...loadedLessons} = state;

      if (!courseLessons || courseLessons instanceof Error) {
        return state;
      }
      return {
        ...loadedLessons,
        [courseId]: courseLessons.filter(({id}) => id !== lessonId),
      };
    }
    default:
      return state;
  }
};

export const lessonsReducer = combineReducers({
  lessons,
});
