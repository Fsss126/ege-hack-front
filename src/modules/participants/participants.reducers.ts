import {EParticipantsAction} from 'modules/participants/participants.constants';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {CourseParticipantInfo} from 'types/entities';

const participants: Reducer<
  Dictionary<DataProperty<CourseParticipantInfo[]>>,
  Action
> = (state = {}, action) => {
  switch (action.type) {
    case EParticipantsAction.PARTICIPANTS_FETCHED:
    case EParticipantsAction.PARTICIPANTS_REVOKE: {
      const {courseId, data} = action.payload;

      return {
        ...state,
        [courseId]: data,
      };
    }
    case EParticipantsAction.PARTICIPANTS_DELETE: {
      const {courseId, userId} = action.payload;
      const {[courseId]: courseParticipants, ...loadedParticipants} = state;

      if (!courseParticipants || courseParticipants instanceof Error) {
        return state;
      }
      return {
        ...loadedParticipants,
        [courseId]: courseParticipants.filter(({id}) => id !== userId),
      };
    }
    default:
      return state;
  }
};

export const participantsReducer = combineReducers({
  participants,
});
