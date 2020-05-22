import {AccountRole} from 'types/enums';

export const ADMIN_ROLES: AccountRole[] = [
  AccountRole.ADMIN,
  AccountRole.MODERATOR,
];

export const TEACHER_ROLES: AccountRole[] = [
  AccountRole.TEACHER,
  AccountRole.HELPER,
];

export const APP_BASE_URL: string = process.env.REACT_APP_BASE_URL;

export const DEFAULT_LOGIN_REDIRECT = '/shop/';

export const DEBUG_MODE = process.env.NODE_ENV !== 'production';

export enum TOGGLE_FEATURES {
  schedule = 'schedule',
}

const FEATURE_TOGGLE_CONFIG: Record<TOGGLE_FEATURES, boolean> = {
  [TOGGLE_FEATURES.schedule]:
    DEBUG_MODE || !!process.env.REACT_APP_ENABLE_SCHEDULE,
};

export const getIsFeatureEnabled = (feature: TOGGLE_FEATURES) =>
  FEATURE_TOGGLE_CONFIG[feature];
