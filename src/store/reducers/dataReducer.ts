import {AxiosError} from 'axios';
import Auth from 'definitions/auth';
import _ from 'lodash';
import {Reducer} from 'redux';
import {
  AccountInfo,
  CourseInfo,
  CourseParticipantInfo,
  Credentials,
  HomeworkInfo,
  LessonInfo,
  PersonWebinar,
  SubjectInfo,
  TeacherInfo,
  UserCourseInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {AccountRole} from 'types/enums';

import {Action, ActionType} from '../actions';

export interface DataState {
  credentials: Credentials | null | AxiosError;
  userInfo?: AccountInfo | AxiosError;
  shopCourses?: CourseInfo[] | AxiosError;
  userCourses?: UserCourseInfo[] | AxiosError;
  subjects?: SubjectInfo[] | AxiosError;
  userTeachers?: TeacherInfo[] | AxiosError;
  users: Record<AccountRole, AccountInfo[] | AxiosError | undefined>;
  lessons: {[courseId: number]: LessonInfo[] | AxiosError};
  webinars: {
    [courseId: number]: PersonWebinar[] | AxiosError;
    upcoming?: PersonWebinar[] | AxiosError;
  };
  participants: {[courseId: number]: CourseParticipantInfo[] | AxiosError};
  adminCourses?: CourseInfo[] | AxiosError;
  adminWebinars: {[courseId: number]: WebinarScheduleInfo | AxiosError};
  teacherCourses?: CourseInfo[] | AxiosError;
  homeworks: {[lessonId: number]: HomeworkInfo[] | AxiosError};
}

const defaultState: DataState = {
  credentials: Auth.getCredentials(),
  userInfo: undefined,
  shopCourses: undefined,
  userCourses: undefined,
  subjects: undefined,
  userTeachers: undefined,
  users: {
    [AccountRole.PUPIL]: undefined,
    [AccountRole.TEACHER]: undefined,
    [AccountRole.HELPER]: undefined,
    [AccountRole.ADMIN]: undefined,
    [AccountRole.MODERATOR]: undefined,
  },
  lessons: {},
  webinars: {},
  participants: {},
  adminCourses: undefined,
  adminWebinars: {},
  teacherCourses: undefined,
  homeworks: {},
};

export const dataReducer: Reducer<DataState, Action> = (
  state = defaultState,
  action,
): DataState => {
  switch (action.type) {
    case ActionType.LOG_IN_SUCCESS: {
      const {credentials} = action;

      return {
        ...state,
        credentials,
      };
    }
    case ActionType.LOG_OUT: {
      return {
        ...defaultState,
        credentials: null,
      };
    }
    case ActionType.USER_INFO_FETCHED: {
      const {userInfo} = action;

      return {
        ...state,
        userInfo,
      };
    }
    case ActionType.SHOP_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        shopCourses: courses,
      };
    }
    case ActionType.USER_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        userCourses: courses,
      };
    }
    case ActionType.SUBJECTS_FETCHED: {
      const {subjects} = action;

      return {
        ...state,
        subjects,
      };
    }
    case ActionType.USER_TEACHERS_FETCHED: {
      const {teachers} = action;

      return {
        ...state,
        userTeachers: teachers,
      };
    }
    case ActionType.ACCOUNTS_FETCHED: {
      const {accounts, role} = action;

      return {
        ...state,
        users: {
          ...state.users,
          [role]: accounts,
        },
      };
    }
    case ActionType.ACCOUNTS_DELETE:
    case ActionType.ACCOUNTS_REVOKE: {
      const {responseAccounts, role} = action;

      return {
        ...state,
        users: {...state.users, [role]: responseAccounts},
        userTeachers:
          role === AccountRole.TEACHER ? undefined : state.userTeachers,
      };
    }
    case ActionType.LESSONS_FETCHED: {
      const {courseId, lessons} = action;

      return {
        ...state,
        lessons: {
          ...state.lessons,
          [courseId]: lessons,
        },
      };
    }
    case ActionType.COURSE_WEBINARS_FETCHED: {
      const {courseId, webinars} = action;

      return {
        ...state,
        webinars: {
          ...state.webinars,
          [courseId]: webinars,
        },
      };
    }
    case ActionType.UPCOMING_WEBINARS_FETCHED: {
      const {webinars} = action;

      return {
        ...state,
        webinars: {
          ...state.webinars,
          upcoming: webinars,
        },
      };
    }
    case ActionType.PARTICIPANTS_FETCHED: {
      const {courseId, participants} = action;

      return {
        ...state,
        participants: {
          ...state.participants,
          [courseId]: participants,
        },
      };
    }
    case ActionType.ADMIN_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        adminCourses: courses,
      };
    }
    case ActionType.ADMIN_WEBINARS_FETCHED: {
      const {courseId, webinars} = action;

      return {
        ...state,
        adminWebinars: {
          ...state.adminWebinars,
          [courseId]: webinars,
        },
      };
    }
    case ActionType.TEACHER_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        teacherCourses: courses,
      };
    }
    case ActionType.HOMEWORKS_FETCHED: {
      const {lessonId, homeworks} = action;

      return {
        ...state,
        homeworks: {
          ...state.homeworks,
          [lessonId]: homeworks,
        },
      };
    }
    case ActionType.LESSONS_REVOKE: {
      const {courseId, responseLesson} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      if (courseLessons instanceof Error) {
        return state;
      }
      const lessonIndex = _.findIndex(courseLessons, {id: responseLesson.id});
      let newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        newLessons[lessonIndex] = {...prevLesson, ...responseLesson};
        newLessons = _.sortBy(newLessons, 'num');
      } else {
        newLessons.push(responseLesson);
      }

      return {
        ...state,
        lessons: {...loadedLessons, [courseId]: newLessons},
      };
    }
    case ActionType.LESSON_DELETE: {
      const {courseId, lessonId} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      if (courseLessons instanceof Error) {
        return state;
      }
      return {
        ...state,
        lessons: {
          ...loadedLessons,
          [courseId]: courseLessons.filter(({id}) => id !== lessonId),
        },
      };
    }
    case ActionType.PARTICIPANTS_REVOKE: {
      const {responseParticipants, courseId} = action;

      return {
        ...state,
        participants: {...state.participants, [courseId]: responseParticipants},
        userCourses: undefined,
      };
    }
    case ActionType.PARTICIPANTS_DELETE: {
      const {courseId, userId} = action;
      const {
        participants: {[courseId]: courseParticipants, ...loadedParticipants},
      } = state;

      if (courseParticipants instanceof Error) {
        return state;
      }
      return {
        ...state,
        participants: {
          ...loadedParticipants,
          [courseId]: courseParticipants.filter(({id}) => id !== userId),
        },
      };
    }
    case ActionType.HOMEWORKS_REVOKE: {
      const {lessonId, responseHomework} = action;
      const {
        pupil: {id: studentId},
        mark,
        comment,
      } = responseHomework;
      const {
        homeworks: {[lessonId]: lessonHomeworks, ...loadedHomeworks},
      } = state;

      if (lessonHomeworks instanceof Error) {
        return state;
      }
      const lessonIndex = _.findIndex(lessonHomeworks, {
        pupil: {id: studentId},
      });
      const homework = lessonHomeworks[lessonIndex];
      const newHomeworks = [...lessonHomeworks];
      newHomeworks[lessonIndex] = {...homework, mark, comment};
      return {
        ...state,
        homeworks: {[lessonId]: newHomeworks, ...loadedHomeworks},
      };
    }
    case ActionType.SUBJECTS_REVOKE: {
      const {responseSubject} = action;
      const updateCatalog = (
        catalog: SubjectInfo[] | AxiosError | undefined,
      ): SubjectInfo[] | AxiosError | undefined => {
        if (!(catalog instanceof Array)) {
          return catalog;
        }
        const courseIndex = _.findIndex<SubjectInfo>(catalog, {
          id: responseSubject.id,
        });
        const newCatalog = [...catalog];

        if (courseIndex !== -1) {
          const prevCourse = catalog[courseIndex];
          newCatalog[courseIndex] = {...prevCourse, ...responseSubject};
        } else {
          newCatalog.push(responseSubject);
        }
        return newCatalog;
      };
      const {subjects} = state;

      return {
        ...state,
        subjects: updateCatalog(subjects),
      };
    }
    case ActionType.SUBJECT_DELETE: {
      const {subjectId} = action;
      const removeSubject = (
        catalog: SubjectInfo[] | AxiosError | undefined,
      ): SubjectInfo[] | AxiosError | undefined =>
        catalog instanceof Array
          ? catalog.filter(({id}) => id !== subjectId)
          : catalog;
      const {subjects} = state;

      return {
        ...state,
        subjects: removeSubject(subjects),
      };
    }
    case ActionType.COURSES_REVOKE: {
      const {responseCourse} = action;
      const updateCatalog = <T extends CourseInfo>(
        catalog: T[] | AxiosError | undefined,
      ): T[] | AxiosError | undefined => {
        if (!(catalog instanceof Array)) {
          return catalog;
        }
        const courseIndex = _.findIndex<CourseInfo>(catalog, {
          id: responseCourse.id,
        });
        const newCatalog = [...catalog];

        if (courseIndex !== -1) {
          const prevCourse = catalog[courseIndex];
          newCatalog[courseIndex] = {...prevCourse, ...responseCourse};
        } else {
          newCatalog.push(responseCourse as T);
        }
        return newCatalog;
      };
      const {userCourses, adminCourses, shopCourses} = state;

      return {
        ...state,
        userCourses: updateCatalog(userCourses),
        adminCourses: updateCatalog(adminCourses),
        shopCourses: updateCatalog(shopCourses),
      };
    }
    case ActionType.COURSE_DELETE: {
      const {courseId} = action;
      const removeCourse = <T extends CourseInfo>(
        catalog: T[] | AxiosError | undefined,
      ): T[] | AxiosError | undefined =>
        catalog instanceof Array
          ? catalog.filter(({id}) => id !== courseId)
          : catalog;
      const {userCourses, adminCourses, shopCourses} = state;

      return {
        ...state,
        userCourses: removeCourse(userCourses),
        adminCourses: removeCourse(adminCourses),
        shopCourses: removeCourse(shopCourses),
      };
    }
    case ActionType.WEBINARS_REVOKE:
    case ActionType.WEBINAR_DELETE: {
      const {courseId, responseWebinars} = action;
      const {
        adminWebinars,
        webinars: {...loadedWebinars},
      } = state;
      delete loadedWebinars[courseId];
      delete loadedWebinars.upcoming;
      return {
        ...state,
        adminWebinars: {...adminWebinars, [courseId]: responseWebinars},
        webinars: loadedWebinars,
      };
    }
    default:
      return state;
  }
};
