import {AppState} from 'store/reducers';

export const selectParticipantsReducer = (state: AppState) =>
  state.participantsReducer;

export const selectParticipants = (state: AppState) =>
  selectParticipantsReducer(state).participants;
