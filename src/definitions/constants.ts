import {AccountRoles} from "types/common";

export const ADMIN_ROLES: AccountRoles[] = [AccountRoles.ADMIN, AccountRoles.MODERATOR];
export const TEACHER_ROLES: AccountRoles[] = [AccountRoles.TEACHER, AccountRoles.HELPER];

export const APP_BASE_URL: string = process.env.REACT_APP_BASE_URL;
export const DEFAULT_LOGIN_REDIRECT = '/shop/';
