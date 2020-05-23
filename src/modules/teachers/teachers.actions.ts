import {
  fetchedActionCreator,
  infoActionCreator,
} from 'store/actions/actionCreatorHelper';
import {TeacherProfileInfo} from 'types/entities';

import {ETeachersAction} from './teachers.constants';

export const teachersFetch = infoActionCreator(ETeachersAction.TEACHERS_FETCH);

export const teachersFetched = fetchedActionCreator<
  ETeachersAction.TEACHERS_FETCHED,
  TeacherProfileInfo[]
>(ETeachersAction.TEACHERS_FETCHED);
