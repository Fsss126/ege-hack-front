import {EWebinarssAction} from 'modules/webinars/webinars.constants';
import {WebinarDeleteCallback, WebinarDeleteErrorCallback} from 'store/actions';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  infoActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {PersonWebinar, WebinarScheduleInfo} from 'types/entities';

export type WebinarsFetchPayload = {
  courseId: number;
};

export type WebinarDeleteRequestPayload = {
  courseId: number;
  webinarId: number;
  onDelete?: WebinarDeleteCallback;
  onError?: WebinarDeleteErrorCallback;
};

export const upcomingWebinarsFetch = infoActionCreator(
  EWebinarssAction.UPCOMING_WEBINARS_FETCH,
);

export const upcomingWebinarsFetched = fetchedActionCreator<
  EWebinarssAction.UPCOMING_WEBINARS_FETCHED,
  PersonWebinar[]
>(EWebinarssAction.UPCOMING_WEBINARS_FETCHED);

export const webinarsFetch = fetchActionCreator<
  EWebinarssAction.WEBINARS_FETCH,
  WebinarsFetchPayload
>(EWebinarssAction.WEBINARS_FETCH);

export const webinarsFetched = fetchedActionCreator<
  EWebinarssAction.WEBINARS_FETCHED,
  PersonWebinar[],
  WebinarsFetchPayload
>(EWebinarssAction.WEBINARS_FETCHED);

export const adminWebinarsFetch = fetchActionCreator<
  EWebinarssAction.ADMIN_WEBINARS_FETCH,
  WebinarsFetchPayload
>(EWebinarssAction.ADMIN_WEBINARS_FETCH);

export const adminWebinarsFetched = fetchedActionCreator<
  EWebinarssAction.ADMIN_WEBINARS_FETCHED,
  WebinarScheduleInfo,
  WebinarsFetchPayload
>(EWebinarssAction.ADMIN_WEBINARS_FETCHED);

export const webinarsRevoke = dataActionCreator<
  EWebinarssAction.WEBINARS_REVOKE,
  WebinarScheduleInfo,
  WebinarsFetchPayload
>(EWebinarssAction.WEBINARS_REVOKE);

export const webinarDeleteRequest = loadedActionCreator<
  EWebinarssAction.WEBINAR_DELETE_REQUEST,
  WebinarDeleteRequestPayload
>(EWebinarssAction.WEBINAR_DELETE_REQUEST);

export const webinarDelete = dataActionCreator<
  EWebinarssAction.WEBINAR_DELETE,
  WebinarScheduleInfo,
  WebinarsFetchPayload
>(EWebinarssAction.WEBINAR_DELETE);
