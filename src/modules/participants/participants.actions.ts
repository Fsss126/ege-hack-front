import {AxiosError} from 'axios';
import {EParticipantsAction} from 'modules/participants/participants.constants';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {CourseParticipantInfo} from 'types/entities';

export type ParticipantsFetchPayload = {
  courseId: number;
};

export type ParticipantDeleteCallback = (
  courseId: number,
  userId: number,
) => void;

export type ParticipantDeleteErrorCallback = (
  courseId: number,
  userId: number,
  error: AxiosError,
) => void;

export type ParticipantDeleteRequestPayload = {
  courseId: number;
  userId: number;
  onDelete?: ParticipantDeleteCallback;
  onError?: ParticipantDeleteErrorCallback;
};

export type ParticipantDeletePayload = {
  courseId: number;
  userId: number;
};

export const participantsFetch = fetchActionCreator<
  EParticipantsAction.PARTICIPANTS_FETCH,
  ParticipantsFetchPayload
>(EParticipantsAction.PARTICIPANTS_FETCH);

export const participantsFetched = fetchedActionCreator<
  EParticipantsAction.PARTICIPANTS_FETCHED,
  CourseParticipantInfo[],
  ParticipantsFetchPayload
>(EParticipantsAction.PARTICIPANTS_FETCHED);

export const participantsRevoke = dataActionCreator<
  EParticipantsAction.PARTICIPANTS_REVOKE,
  CourseParticipantInfo[],
  ParticipantsFetchPayload
>(EParticipantsAction.PARTICIPANTS_REVOKE);

export const participantsDeleteRequest = loadedActionCreator<
  EParticipantsAction.PARTICIPANTS_DELETE_REQUEST,
  ParticipantDeleteRequestPayload
>(EParticipantsAction.PARTICIPANTS_DELETE_REQUEST);

export const participantsDelete = loadedActionCreator<
  EParticipantsAction.PARTICIPANTS_DELETE,
  ParticipantDeletePayload
>(EParticipantsAction.PARTICIPANTS_DELETE);
