import {AppState} from 'store/reducers';

export const selectWebinarsReducer = (state: AppState) => state.webinarsReducer;

export const selectUpcomingWebinars = (state: AppState) =>
  selectWebinarsReducer(state).upcomingWebinars || undefined;

export const selectWebinars = (state: AppState) =>
  selectWebinarsReducer(state).webinars;

export const selectAdminWebinars = (state: AppState) =>
  selectWebinarsReducer(state).adminWebinars;
