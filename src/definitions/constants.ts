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
