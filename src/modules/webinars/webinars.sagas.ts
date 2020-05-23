import APIRequest from 'api';
import {
  adminWebinarsFetch,
  adminWebinarsFetched,
  upcomingWebinarsFetch,
  upcomingWebinarsFetched,
  webinarDelete,
  webinarDeleteRequest,
  webinarsFetch,
  webinarsFetched,
} from 'modules/webinars/webinars.actions';
import {EWebinarssAction} from 'modules/webinars/webinars.constants';
import {selectAdminWebinars} from 'modules/webinars/webinars.selectors';
import {all, call, fork, put, select, takeLeading} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {PersonWebinar, WebinarScheduleInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type UpcomingWebinarsFetchAction = ReturnType<typeof upcomingWebinarsFetch>;
type WebinarsFetchAction = ReturnType<typeof webinarsFetch>;
type AdminWebinarsFetchAction = ReturnType<typeof adminWebinarsFetch>;
type WebinarDeleteRequestAction = ReturnType<typeof webinarDeleteRequest>;

function* fetchUpcomingWebinars() {
  yield* waitForLogin<UpcomingWebinarsFetchAction>(
    EWebinarssAction.UPCOMING_WEBINARS_FETCH,
    function* (channel) {
      yield takeLeading(channel, function* () {
        try {
          const data: PersonWebinar[] = yield call(
            APIRequest.get,
            '/courses/schedule/person',
          );
          yield put(upcomingWebinarsFetched({data}));
        } catch (error) {
          yield put(upcomingWebinarsFetched({data: error}));
        }
      });
    },
  );
}

function* fetchWebinars() {
  yield* waitForLogin<WebinarsFetchAction>(
    EWebinarssAction.WEBINARS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: WebinarsFetchAction) {
          const {courseId} = action.payload;
          try {
            const data: PersonWebinar[] = yield call(
              APIRequest.get,
              `/courses/${courseId}/schedule/person`,
            );
            yield put(
              webinarsFetched({
                courseId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              webinarsFetched({
                courseId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.courseId,
      );
    },
  );
}

function* fetchAdminWebinars() {
  yield* waitForLogin<AdminWebinarsFetchAction>(
    EWebinarssAction.ADMIN_WEBINARS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: AdminWebinarsFetchAction) {
          const {courseId} = action.payload;
          try {
            const data: WebinarScheduleInfo = yield call(
              APIRequest.get,
              `/courses/${courseId}/schedule`,
            );
            yield put(
              adminWebinarsFetched({
                courseId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              adminWebinarsFetched({
                courseId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.courseId,
      );
    },
  );
}

function* processWebinarDelete() {
  yield takeLeadingPerKey(
    EWebinarssAction.WEBINAR_DELETE_REQUEST,
    function* (action: WebinarDeleteRequestAction) {
      const {courseId, webinarId, onDelete, onError} = action.payload;

      try {
        const schedules = (yield select(selectAdminWebinars)) as Yield<
          typeof selectAdminWebinars
        >;

        const webinarsSchedule = schedules[courseId];

        if (!webinarsSchedule || webinarsSchedule instanceof Error) {
          throw new Error();
        }

        const {
          course_id,
          click_meeting_link,
          image_link,
          webinars,
        } = webinarsSchedule;
        const requestData = {
          course_id,
          click_meeting_link,
          image: image_link.split('/').pop(),
          webinars: webinars
            .filter(({id}) => id !== webinarId)
            .map(({date_start, ...rest}) => ({
              ...rest,
              date_start: date_start.getTime(),
            })),
        };

        const data: WebinarScheduleInfo = yield call(
          APIRequest.put,
          `/courses/${courseId}/schedule`,
          requestData,
        );

        if (onDelete) {
          yield call(onDelete, courseId, webinarId);
        }
        yield put(
          webinarDelete({
            courseId,
            data,
          }),
        );
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, webinarId, error);
        }
      }
    },
    (action) => [action.payload.courseId, action.payload.webinarId],
  );
}

export function* webinarsSaga() {
  yield all([
    fork(fetchWebinars),
    fork(fetchUpcomingWebinars),
    fork(fetchAdminWebinars),
    fork(processWebinarDelete),
  ]);
}
