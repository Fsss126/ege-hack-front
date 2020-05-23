import {AxiosError} from 'axios';
import {
  dataActionCreator,
  fetchActionCreator,
  fetchedActionCreator,
  loadedActionCreator,
} from 'store/actions/actionCreatorHelper';
import {LessonInfo} from 'types/entities';

import {ELessonsAction} from './lessons.constants';

export type LessonsFetchPayload = {
  courseId: number;
};

export type LessonDeleteCallback = (courseId: number, lessonId: number) => void;

export type LessonDeleteErrorCallback = (
  courseId: number,
  lessonId: number,
  error: AxiosError,
) => void;

export type LessonDeleteRequestPayload = {
  courseId: number;
  lessonId: number;
  onDelete?: LessonDeleteCallback;
  onError?: LessonDeleteErrorCallback;
};

export type LessonDeletePayload = {
  courseId: number;
  lessonId: number;
};

export const lessonsFetch = fetchActionCreator<
  ELessonsAction.LESSONS_FETCH,
  LessonsFetchPayload
>(ELessonsAction.LESSONS_FETCH);

export const lessonsFetched = fetchedActionCreator<
  ELessonsAction.LESSONS_FETCHED,
  LessonInfo[],
  LessonsFetchPayload
>(ELessonsAction.LESSONS_FETCHED);

export const lessonsRevoke = dataActionCreator<
  ELessonsAction.LESSONS_REVOKE,
  LessonInfo,
  LessonsFetchPayload
>(ELessonsAction.LESSONS_REVOKE);

export const lessonDeleteRequest = loadedActionCreator<
  ELessonsAction.LESSON_DELETE_REQUEST,
  LessonDeleteRequestPayload
>(ELessonsAction.LESSON_DELETE_REQUEST);

export const lessonDelete = loadedActionCreator<
  ELessonsAction.LESSON_DELETE,
  LessonDeletePayload
>(ELessonsAction.LESSON_DELETE);
