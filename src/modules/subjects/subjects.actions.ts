import {AxiosError} from 'axios';
import {
  dataActionCreator,
  fetchedActionCreator,
  infoActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {SubjectInfo} from 'types/entities';

import {ESubjectsAction} from './subjects.constants';

export type SubjectDeleteCallback = (courseId: number) => void;

export type SubjectDeleteErrorCallback = (
  subjectId: number,
  error: AxiosError,
) => void;

export interface SubjectDeletePayload {
  subjectId: number;
}

export interface SubjectDeleteRequestPayload extends SubjectDeletePayload {
  onDelete?: SubjectDeleteCallback;
  onError?: SubjectDeleteErrorCallback;
}

export const subjectsFetch = infoActionCreator(ESubjectsAction.SUBJECTS_FETCH);

export const subjectsFetched = fetchedActionCreator<
  ESubjectsAction.SUBJECTS_FETCHED,
  SubjectInfo[]
>(ESubjectsAction.SUBJECTS_FETCHED);

export const subjectRevoke = dataActionCreator<
  ESubjectsAction.SUBJECTS_REVOKE,
  SubjectInfo
>(ESubjectsAction.SUBJECTS_REVOKE);

export const subjectDeleteRequest = loadedActionCreator<
  ESubjectsAction.SUBJECT_DELETE_REQUEST,
  SubjectDeleteRequestPayload
>(ESubjectsAction.SUBJECT_DELETE_REQUEST);

export const subjectDelete = loadedActionCreator<
  ESubjectsAction.SUBJECT_DELETE,
  SubjectDeletePayload
>(ESubjectsAction.SUBJECT_DELETE);
