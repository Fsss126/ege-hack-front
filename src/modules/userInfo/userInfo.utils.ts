import {
  AccountInfo,
  PupilAccountInfo,
  TeacherAccountInfo,
} from 'types/entities';

export const isTeacherAccountInfo = (
  account: AccountInfo,
): account is TeacherAccountInfo => !!account.teacher;

export const isPupilAccountInfo = (
  account: AccountInfo,
): account is PupilAccountInfo => !!account.pupil;
