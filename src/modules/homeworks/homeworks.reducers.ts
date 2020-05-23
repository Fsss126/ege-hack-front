import _ from 'lodash';
import {EHomeworksAction} from 'modules/homeworks/homeworks.constants';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {HomeworkInfo, UserHomeworkInfo} from 'types/entities';

const userHomeworks: Reducer<
  Dictionary<DataProperty<UserHomeworkInfo>>,
  Action
> = (state = {}, action) => {
  switch (action.type) {
    case EHomeworksAction.USER_HOMEWORKS_FETCHED:
    case EHomeworksAction.USER_HOMEWORKS_REVOKE: {
      const {lessonId, data} = action.payload;

      return {...state, [lessonId]: data};
    }
    default:
      return state;
  }
};

const homeworks: Reducer<Dictionary<DataProperty<HomeworkInfo[]>>, Action> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case EHomeworksAction.HOMEWORKS_FETCHED: {
      const {lessonId, data} = action.payload;

      return {...state, [lessonId]: data};
    }
    case EHomeworksAction.HOMEWORKS_REVOKE: {
      const {lessonId, data} = action.payload;
      const {
        pupil: {id: studentId},
        mark,
        comment,
      } = data;
      const {[lessonId]: lessonHomeworks, ...loadedHomeworks} = state;

      if (!lessonHomeworks || lessonHomeworks instanceof Error) {
        return state;
      }
      const lessonIndex = _.findIndex(lessonHomeworks, {
        pupil: {id: studentId},
      });
      const homework = lessonHomeworks[lessonIndex];
      const newHomeworks = [...lessonHomeworks];
      newHomeworks[lessonIndex] = {...homework, mark, comment};
      return {[lessonId]: newHomeworks, ...loadedHomeworks};
    }
    default:
      return state;
  }
};

export const homeworksReducer = combineReducers({
  userHomeworks,
  homeworks,
});
