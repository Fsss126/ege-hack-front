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

export const GRADE_SWITCH_MONTH = 6;

export const LAST_GRADE = 11;

export const MIDDLE_SCHOOL_FIRST_GRADE = 8;

export const getGradeByGraduationYear = (year: number) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const semester = date.getMonth() + 1 > GRADE_SWITCH_MONTH ? 1 : 0;
  const yearsTillEnd =
    semester === 1 ? year - currentYear - 1 : year - currentYear;

  return Math.min(LAST_GRADE - yearsTillEnd, LAST_GRADE);
};

export const getGraduationYearByGrade = (grade: number) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const yearsTillEnd = LAST_GRADE - grade;

  return currentYear + yearsTillEnd;
};
