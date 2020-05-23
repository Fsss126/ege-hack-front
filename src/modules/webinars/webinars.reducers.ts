import {EWebinarssAction} from 'modules/webinars/webinars.constants';
import {combineReducers, Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty, StoreProperty} from 'store/reducers/types';
import {PersonWebinar, WebinarScheduleInfo} from 'types/entities';

const upcomingWebinars: Reducer<StoreProperty<PersonWebinar[]>, Action> = (
  state = null,
  action,
) => {
  switch (action.type) {
    case EWebinarssAction.UPCOMING_WEBINARS_FETCHED: {
      const {data} = action.payload;

      return data;
    }
    case EWebinarssAction.WEBINARS_REVOKE:
    case EWebinarssAction.WEBINAR_DELETE: {
      return null;
    }
    default:
      return state;
  }
};

const webinars: Reducer<Dictionary<DataProperty<PersonWebinar[]>>, Action> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case EWebinarssAction.WEBINARS_FETCHED: {
      const {courseId, data} = action.payload;

      return {
        ...state,
        [courseId]: data,
      };
    }
    case EWebinarssAction.WEBINARS_REVOKE:
    case EWebinarssAction.WEBINAR_DELETE: {
      const {courseId} = action.payload;
      const {...loadedWebinars} = state;
      delete loadedWebinars[courseId];

      return loadedWebinars;
    }
    default:
      return state;
  }
};

const adminWebinars: Reducer<
  Dictionary<DataProperty<WebinarScheduleInfo>>,
  Action
> = (state = {}, action) => {
  switch (action.type) {
    case EWebinarssAction.ADMIN_WEBINARS_FETCHED:
    case EWebinarssAction.WEBINARS_REVOKE:
    case EWebinarssAction.WEBINAR_DELETE: {
      const {courseId, data} = action.payload;

      return {
        ...state,
        [courseId]: data,
      };
    }
    default:
      return state;
  }
};

export const webinarsReducer = combineReducers({
  upcomingWebinars,
  webinars,
  adminWebinars,
});
