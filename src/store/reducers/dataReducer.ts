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
  TaskInfo,
  TeacherInfo,
  TestInfo,
  ThemeInfo,
  UserCourseInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {AccountRole} from 'types/enums';

import {Action, ActionType} from '../actions';

export type DataProperty<T> = Maybe<T | AxiosError>;

export type KnowledgeTreeLevel = {
  themeIds: number[];
  taskIds: number[];
};

export type KnowledgeBaseSubject = {
  [key in number | 'root']?: DataProperty<KnowledgeTreeLevel>;
};

export interface DataState {
  credentials?: DataProperty<Credentials>;
  userInfo?: DataProperty<AccountInfo>;
  shopCourses?: DataProperty<CourseInfo[]>;
  userCourses?: DataProperty<UserCourseInfo[]>;
  subjects?: DataProperty<SubjectInfo[]>;
  userTeachers?: DataProperty<TeacherInfo[]>;
  userHomeworks: {
    [courseId: number]: {
      [lessonId: number]: DataProperty<HomeworkInfo | null>;
    };
  };
  users: Record<AccountRole, DataProperty<AccountInfo[]>>;
  // TODO: normalize
  // courseLessons: {[courseId: number]: DataProperty<number[]>};
  // lessons: {[lessonId: number]: LessonInfo};
  lessons: {[courseId: number]: DataProperty<LessonInfo[]>};
  webinars: {
    [courseId: number]: DataProperty<PersonWebinar[]>;
    upcoming?: DataProperty<PersonWebinar[]>;
  };
  participants: {
    [courseId: number]: DataProperty<CourseParticipantInfo[]>;
  };
  adminCourses?: DataProperty<CourseInfo[]>;
  adminWebinars: {[courseId: number]: DataProperty<WebinarScheduleInfo>};
  teacherCourses?: DataProperty<CourseInfo[]>;
  homeworks: {[lessonId: number]: DataProperty<HomeworkInfo[]>};
  themes: {
    [themeId: number]: DataProperty<ThemeInfo>;
  };
  tasks: {
    [taskId: number]: DataProperty<TaskInfo>;
  };
  knowledgeTree: {
    [subjectId: number]: KnowledgeBaseSubject;
  };
  tests: {
    [testId: number]: DataProperty<TestInfo>;
  };
}

const defaultState: DataState = {
  credentials: Auth.getCredentials(),
  userInfo: undefined,
  shopCourses: undefined,
  userCourses: undefined,
  subjects: undefined,
  userTeachers: undefined,
  userHomeworks: {},
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
  themes: {},
  tasks: {},
  knowledgeTree: {},
  tests: {},
};

export const dataReducer: Reducer<DataState, Action> = (
  state = defaultState,
  action,
): DataState => {
  switch (action.type) {
    case ActionType.LOG_IN_REQUEST: {
      return {
        ...state,
        credentials: undefined,
      };
    }
    case ActionType.LOG_IN_SUCCESS: {
      const {credentials} = action;

      return {
        ...state,
        credentials,
      };
    }
    case ActionType.LOG_IN_ERROR: {
      const {error} = action;

      return {
        ...state,
        credentials: error,
      };
    }
    case ActionType.LOG_OUT: {
      return {
        ...defaultState,
        credentials: undefined,
      };
    }
    case ActionType.USER_INFO_FETCH: {
      return {
        ...state,
        userInfo: undefined,
      };
    }
    case ActionType.USER_INFO_FETCHED: {
      const {userInfo} = action;

      return {
        ...state,
        userInfo,
      };
    }
    case ActionType.SHOP_COURSES_FETCH: {
      return {
        ...state,
        shopCourses: undefined,
      };
    }
    case ActionType.SHOP_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        shopCourses: courses,
      };
    }
    case ActionType.USER_COURSES_FETCH: {
      return {
        ...state,
        userCourses: undefined,
      };
    }
    case ActionType.USER_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        userCourses: courses,
      };
    }
    case ActionType.SUBJECTS_FETCH: {
      return {
        ...state,
        subjects: undefined,
      };
    }
    case ActionType.SUBJECTS_FETCHED: {
      const {subjects} = action;

      return {
        ...state,
        subjects,
      };
    }
    case ActionType.USER_TEACHERS_FETCH: {
      return {
        ...state,
        userTeachers: undefined,
      };
    }
    case ActionType.USER_TEACHERS_FETCHED: {
      const {teachers} = action;

      return {
        ...state,
        userTeachers: teachers,
      };
    }
    case ActionType.ACCOUNTS_FETCH: {
      const {role} = action;

      return {
        ...state,
        users: {
          ...state.users,
          [role]: undefined,
        },
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
    case ActionType.LESSONS_FETCH: {
      const {courseId} = action;

      return {
        ...state,
        lessons: {
          ...state.lessons,
          [courseId]: undefined,
        },
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
    case ActionType.COURSE_WEBINARS_FETCH: {
      const {courseId} = action;

      return {
        ...state,
        webinars: {
          ...state.webinars,
          [courseId]: undefined,
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
    case ActionType.UPCOMING_WEBINARS_FETCH: {
      return {
        ...state,
        webinars: {
          ...state.webinars,
          upcoming: undefined,
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
    case ActionType.PARTICIPANTS_FETCH: {
      const {courseId} = action;

      return {
        ...state,
        participants: {
          ...state.participants,
          [courseId]: undefined,
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
    case ActionType.ADMIN_COURSES_FETCH: {
      return {
        ...state,
        adminCourses: undefined,
      };
    }
    case ActionType.ADMIN_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        adminCourses: courses,
      };
    }
    case ActionType.ADMIN_WEBINARS_FETCH: {
      const {courseId} = action;

      return {
        ...state,
        adminWebinars: {
          ...state.adminWebinars,
          [courseId]: undefined,
        },
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
    case ActionType.TEACHER_COURSES_FETCH: {
      return {
        ...state,
        teacherCourses: undefined,
      };
    }
    case ActionType.TEACHER_COURSES_FETCHED: {
      const {courses} = action;

      return {
        ...state,
        teacherCourses: courses,
      };
    }
    case ActionType.LESSONS_REVOKE: {
      const {courseId, responseLesson} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      if (!courseLessons || courseLessons instanceof Error) {
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

      if (!courseLessons || courseLessons instanceof Error) {
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
    case ActionType.USER_HOMEWORKS_FETCH: {
      const {courseId, lessonId} = action;

      return {
        ...state,
        userHomeworks: {
          ...state.userHomeworks,
          [courseId]: {
            ...(state.userHomeworks[courseId] || {}),
            [lessonId]: undefined,
          },
        },
      };
    }
    case ActionType.USER_HOMEWORKS_FETCHED: {
      const {courseId, lessonId, homework} = action;

      return {
        ...state,
        userHomeworks: {
          ...state.userHomeworks,
          [courseId]: {
            ...(state.userHomeworks[courseId] || {}),
            [lessonId]: homework,
          },
        },
      };
    }
    case ActionType.USER_HOMEWORKS_REVOKE: {
      const {courseId, lessonId, responseHomework} = action;

      return {
        ...state,
        userHomeworks: {
          ...state.userHomeworks,
          [courseId]: {
            ...(state.userHomeworks[courseId] || {}),
            [lessonId]: responseHomework,
          },
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

      if (!courseParticipants || courseParticipants instanceof Error) {
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
    case ActionType.HOMEWORKS_FETCH: {
      const {lessonId} = action;

      return {
        ...state,
        homeworks: {
          ...state.homeworks,
          [lessonId]: undefined,
        },
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

      if (!lessonHomeworks || lessonHomeworks instanceof Error) {
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
    case ActionType.KNOWLEDGE_LEVEL_FETCHED: {
      const {subjectId, themeId, content} = action;
      const themeKey = themeId !== undefined ? themeId : 'root';

      let stateUpdate: Partial<DataState>;

      if (content instanceof Error) {
        stateUpdate = {
          knowledgeTree: {
            [subjectId]: {
              [themeKey]: content,
            },
          },
        };
      } else {
        const {themes, tasks} = content;
        const themesMap = _.keyBy(themes, 'id');
        const tasksMap = _.keyBy(tasks, 'id');

        const themeIds = _.map(themes, 'id');
        const taskIds = _.map(tasks, 'id');

        stateUpdate = {
          themes: themesMap,
          tasks: tasksMap,
          knowledgeTree: {
            [subjectId]: {
              [themeKey]: {
                themeIds,
                taskIds,
              },
            },
          },
        };
      }
      return _.cloneDeep(_.merge(state, stateUpdate));
    }
    case ActionType.KNOWLEDGE_THEME_FETCHED: {
      const {themeId, theme} = action;

      return {
        ...state,
        themes: {
          ...state.themes,
          [themeId]: theme,
        },
      };
    }
    case ActionType.KNOWLEDGE_THEME_REVOKE: {
      const {responseTheme} = action;
      const {subjectId, id, parentThemeId} = responseTheme;

      const themeKey = parentThemeId !== undefined ? parentThemeId : 'root';

      const stateUpdate: Partial<DataState> = {
        themes: {[id]: responseTheme},
        knowledgeTree: {
          [subjectId]: {
            [themeKey]: {
              themeIds: [id],
              taskIds: [],
            },
          },
        },
      };

      const customizer = (objValue: any, srcValue: any, key: string) => {
        if (_.isArray(objValue)) {
          if (key === 'themeIds') {
            return _.indexOf(objValue, id) < 0
              ? objValue.concat(srcValue)
              : objValue;
          } else if (key === 'taskIds') {
            return objValue.concat(srcValue);
          }
        }
      };

      return _.cloneDeep(_.mergeWith(state, stateUpdate, customizer));
    }
    case ActionType.KNOWLEDGE_TASK_FETCHED: {
      const {taskId, task} = action;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: task,
        },
      };
    }
    case ActionType.KNOWLEDGE_TASK_REVOKE: {
      const {responseTask} = action;
      const {subjectId, id, themeId} = responseTask;

      const themeKey = themeId !== undefined ? themeId : 'root';

      const stateUpdate: Partial<DataState> = {
        tasks: {[id]: responseTask},
        knowledgeTree: {
          [subjectId]: {
            [themeKey]: {
              themeIds: [],
              taskIds: [id],
            },
          },
        },
      };

      const customizer = (objValue: any, srcValue: any, key: string) => {
        if (_.isArray(objValue)) {
          if (key === 'taskIds') {
            return _.indexOf(objValue, id) < 0
              ? objValue.concat(srcValue)
              : objValue;
          } else if (key === 'themeIds') {
            return objValue.concat(srcValue);
          }
        }
      };

      return _.cloneDeep(_.mergeWith(state, stateUpdate, customizer));
    }
    case ActionType.KNOWLEDGE_TEST_FETCH: {
      const {testId} = action;

      return {
        ...state,
        tests: {
          ...state.tests,
          [testId]: undefined,
        },
      };
    }
    case ActionType.KNOWLEDGE_TEST_FETCHED: {
      const {testId, test} = action;

      return {
        ...state,
        tests: {
          ...state.tests,
          [testId]: test,
        },
      };
    }
    case ActionType.KNOWLEDGE_TEST_REVOKE: {
      const {lessonId, courseId, responseTest} = action;
      const {id: testId} = responseTest;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      const tests = {...state.tests, [testId]: responseTest};

      if (!courseLessons || courseLessons instanceof Error) {
        return {...state, tests};
      }

      const lessonIndex = _.findIndex(courseLessons, {id: lessonId});
      const newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        // TODO: change
        newLessons[lessonIndex] = {...prevLesson, test: responseTest.id as any};
      }

      return {
        ...state,
        lessons: {...loadedLessons, [courseId]: newLessons},
        tests,
      };
    }
    case ActionType.KNOWLEDGE_TEST_DELETE: {
      const {courseId, lessonId, testId} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      const tests = {...state.tests, [testId]: undefined};

      if (!courseLessons || courseLessons instanceof Error) {
        return {...state, tests};
      }

      const lessonIndex = _.findIndex(courseLessons, {id: lessonId});
      const newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        newLessons[lessonIndex] = {...prevLesson, test: undefined};
      }

      return {
        ...state,
        lessons: {...loadedLessons, [courseId]: newLessons},
        tests,
      };
    }
    default:
      return state;
  }
};
