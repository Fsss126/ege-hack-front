import {EHomeworksAction} from 'modules/homeworks/homeworks.constants';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {HomeworkInfo, UserHomeworkInfo} from 'types/entities';

export type HomeworksFetchPayload = {
  lessonId: number;
};

export const userHomeworkFetch = fetchActionCreator<
  EHomeworksAction.USER_HOMEWORKS_FETCH,
  HomeworksFetchPayload
>(EHomeworksAction.USER_HOMEWORKS_FETCH);

export const userHomeworkFetched = fetchedActionCreator<
  EHomeworksAction.USER_HOMEWORKS_FETCHED,
  UserHomeworkInfo | null,
  HomeworksFetchPayload
>(EHomeworksAction.USER_HOMEWORKS_FETCHED);

export const userHomeworkRevoke = dataActionCreator<
  EHomeworksAction.USER_HOMEWORKS_REVOKE,
  UserHomeworkInfo,
  HomeworksFetchPayload
>(EHomeworksAction.USER_HOMEWORKS_REVOKE);

export const homeworkFetch = fetchActionCreator<
  EHomeworksAction.HOMEWORKS_FETCH,
  HomeworksFetchPayload
>(EHomeworksAction.HOMEWORKS_FETCH);

export const homeworkFetched = fetchedActionCreator<
  EHomeworksAction.HOMEWORKS_FETCHED,
  HomeworkInfo[],
  HomeworksFetchPayload
>(EHomeworksAction.HOMEWORKS_FETCHED);

export const homeworkRevoke = dataActionCreator<
  EHomeworksAction.HOMEWORKS_REVOKE,
  HomeworkInfo,
  HomeworksFetchPayload
>(EHomeworksAction.HOMEWORKS_REVOKE);
