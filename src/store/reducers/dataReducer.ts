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
  TeacherProfileInfo,
  TestInfo,
  TestResultInfo,
  ThemeInfo,
  UserCourseInfo,
  UserHomeworkInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {AccountRole} from 'types/enums';
import {KNOWLEDGE_TREE_ROOT, KnowledgeTreeLevel} from 'types/knowledgeTree';

import {Action, ActionType} from '../actions';

export type DataProperty<T> = Maybe<T | AxiosError>;

export type KnowledgeBaseSubject = {
  [key in number | typeof KNOWLEDGE_TREE_ROOT]?: DataProperty<
    KnowledgeTreeLevel
  >;
};

export interface DataState {
  userTeachers?: DataProperty<TeacherProfileInfo[]>;
  userHomeworks: {
    [courseId: number]: {
      [lessonId: number]: DataProperty<UserHomeworkInfo | null>;
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
  adminWebinars: {[courseId: number]: DataProperty<WebinarScheduleInfo>};
  teacherCourses?: DataProperty<CourseInfo[]>;
  homeworks: {[lessonId: number]: DataProperty<HomeworkInfo[]>};
  themes: {
    [themeId: number]: DataProperty<ThemeInfo>;
  };
  tasks: {
    [taskId: number]: DataProperty<TaskInfo>;
  };
  knowledgeMap: {
    [subjectId: number]: Maybe<KnowledgeBaseSubject>;
  };
  tests: {
    [testId: number]: TestInfo;
  };
  testResults: {
    [testId: number]: DataProperty<TestResultInfo[]>;
  };
  lessonsTests: {
    [lessonId: number]: DataProperty<number | null>;
  };
}

const defaultState: DataState = {
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
  adminWebinars: {},
  teacherCourses: undefined,
  homeworks: {},
  themes: {},
  tasks: {},
  knowledgeMap: {},
  tests: {},
  lessonsTests: {},
  testResults: {},
};

export const dataReducer: Reducer<DataState, Action> = (
  state = defaultState,
  action,
): DataState => {
  switch (action.type) {
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
        // userCourses: undefined,
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
      const themeKey = themeId !== undefined ? themeId : KNOWLEDGE_TREE_ROOT;

      let stateUpdate: Partial<DataState>;

      if (content instanceof Error) {
        stateUpdate = {
          knowledgeMap: {
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
          knowledgeMap: {
            [subjectId]: {
              [themeKey]: {
                id: themeKey,
                themeIds,
                taskIds,
              },
            },
          },
        };
      }
      return _.merge(stateUpdate, state);
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
      const {subject_id, id, parent_theme_id} = responseTheme;

      const themeKey =
        parent_theme_id !== undefined ? parent_theme_id : KNOWLEDGE_TREE_ROOT;
      const containingLevel = state.knowledgeMap[subject_id]?.[themeKey];
      const updatedLevel =
        containingLevel instanceof Error
          ? containingLevel
          : containingLevel
          ? {
              ...containingLevel,
              themeIds: _.includes(containingLevel.themeIds, id)
                ? containingLevel.themeIds
                : _.concat(containingLevel.themeIds, id),
            }
          : {id: themeKey, taskIds: [], themeIds: [id]};

      const parentTheme =
        parent_theme_id !== undefined
          ? state.themes[parent_theme_id]
          : undefined;
      const parentThemeUpdate =
        !parentTheme || parentTheme instanceof Error
          ? undefined
          : {
              ...parentTheme,
              has_sub_themes: true,
            };

      return {
        ...state,
        themes: {
          ...state.themes,
          [id]: responseTheme,
          ...(parentThemeUpdate
            ? {[parentThemeUpdate.id]: parentThemeUpdate}
            : {}),
        },
        knowledgeMap: {
          ...state.knowledgeMap,
          [subject_id]: {
            ...(state.knowledgeMap[subject_id] || {}),
            [themeKey]: updatedLevel,
          },
        },
      };
    }
    case ActionType.KNOWLEDGE_THEME_DELETE: {
      const {subjectId, themeId, parentThemeId} = action;

      const themeKey =
        parentThemeId !== undefined ? parentThemeId : KNOWLEDGE_TREE_ROOT;
      const containingLevel = state.knowledgeMap[subjectId]?.[themeKey];
      const updatedLevel =
        !containingLevel || containingLevel instanceof Error
          ? undefined
          : {
              ...containingLevel,
              themeIds: _.without(containingLevel.themeIds, themeId),
            };

      const parentTheme =
        parentThemeId !== undefined ? state.themes[parentThemeId] : undefined;
      const parentThemeUpdate =
        !parentTheme || parentTheme instanceof Error || !updatedLevel
          ? undefined
          : {
              ...parentTheme,
              has_sub_themes: updatedLevel.themeIds.length > 0,
            };

      return {
        ...state,
        themes: {
          ...state.themes,
          [themeId]: undefined,
          ...(parentThemeUpdate
            ? {[parentThemeUpdate.id]: parentThemeUpdate}
            : undefined),
        },
        knowledgeMap: {
          ...state.knowledgeMap,
          [subjectId]: {
            ...(state.knowledgeMap[subjectId] || {}),
            ...(updatedLevel ? {[themeKey]: updatedLevel} : {}),
          },
        },
      };
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
      const {subject_id, id, theme_id} = responseTask;

      const themeKey = theme_id !== undefined ? theme_id : KNOWLEDGE_TREE_ROOT;
      const containingLevel = state.knowledgeMap[subject_id]?.[themeKey];
      const updatedLevel =
        containingLevel instanceof Error
          ? containingLevel
          : containingLevel
          ? {
              ...containingLevel,
              taskIds: _.includes(containingLevel.taskIds, id)
                ? containingLevel.taskIds
                : _.concat(containingLevel.taskIds, id),
            }
          : {id: themeKey, taskIds: [id], themeIds: []};

      const parentTheme =
        theme_id !== undefined ? state.themes[theme_id] : undefined;
      const parentThemeUpdate =
        !parentTheme || parentTheme instanceof Error
          ? undefined
          : {
              ...parentTheme,
              has_sub_tasks: true,
            };

      return {
        ...state,
        themes: {
          ...state.themes,
          ...(parentThemeUpdate
            ? {[parentThemeUpdate.id]: parentThemeUpdate}
            : {}),
        },
        tasks: {
          ...state.tasks,
          [id]: responseTask,
        },
        knowledgeMap: {
          ...state.knowledgeMap,
          [subject_id]: {
            ...(state.knowledgeMap[subject_id] || {}),
            [themeKey]: updatedLevel,
          },
        },
      };
    }
    case ActionType.KNOWLEDGE_TASK_DELETE: {
      const {subjectId, themeId, taskId} = action;

      const themeKey = themeId !== undefined ? themeId : KNOWLEDGE_TREE_ROOT;
      const containingLevel = state.knowledgeMap[subjectId]?.[themeKey];
      const updatedLevel =
        !containingLevel || containingLevel instanceof Error
          ? undefined
          : {
              ...containingLevel,
              taskIds: _.without(containingLevel.taskIds, taskId),
            };

      const parentTheme =
        themeId !== undefined ? state.themes[themeId] : undefined;
      const parentThemeUpdate =
        !parentTheme || parentTheme instanceof Error || !updatedLevel
          ? undefined
          : {
              ...parentTheme,
              has_sub_tasks: updatedLevel.taskIds.length > 0,
            };

      return {
        ...state,
        themes: {
          ...state.themes,
          ...(parentThemeUpdate
            ? {[parentThemeUpdate.id]: parentThemeUpdate}
            : {}),
        },
        tasks: {
          ...state.tasks,
          [taskId]: undefined,
        },
        knowledgeMap: {
          ...state.knowledgeMap,
          [subjectId]: {
            ...(state.knowledgeMap[subjectId] || {}),
            ...(updatedLevel ? {[themeKey]: updatedLevel} : {}),
          },
        },
      };
    }
    case ActionType.KNOWLEDGE_TEST_FETCHED: {
      const {lessonId, test} = action;

      if (test instanceof Error || test === null) {
        return {
          ...state,
          lessonsTests: {
            ...state.lessonsTests,
            [lessonId]: test,
          },
        };
      } else {
        return {
          ...state,
          tests: {
            ...state.tests,
            [test.id]: test,
          },
          lessonsTests: {
            ...state.lessonsTests,
            [lessonId]: test.id,
          },
        };
      }
    }
    case ActionType.KNOWLEDGE_TEST_REVOKE: {
      const {lessonId, courseId, responseTest} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      const tests = {...state.tests, [responseTest.id]: responseTest};

      if (!courseLessons || courseLessons instanceof Error) {
        return {...state, tests};
      }

      const lessonIndex = _.findIndex(courseLessons, {id: lessonId});
      const newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        newLessons[lessonIndex] = {...prevLesson, test_id: responseTest.id};
      }

      return {
        ...state,
        lessons: {...loadedLessons, [courseId]: newLessons},
        tests,
        lessonsTests: {
          ...state.lessonsTests,
          [lessonId]: responseTest.id,
        },
      };
    }
    case ActionType.KNOWLEDGE_TEST_DELETE: {
      const {courseId, lessonId, testId} = action;
      const {
        lessons: {[courseId]: courseLessons, ...loadedLessons},
      } = state;

      const {[testId]: removedTest, ...tests} = state.tests;

      if (!courseLessons || courseLessons instanceof Error) {
        return {...state, tests};
      }

      const lessonIndex = _.findIndex(courseLessons, {id: lessonId});
      const newLessons = [...courseLessons];

      if (lessonIndex !== -1) {
        const prevLesson = courseLessons[lessonIndex];
        newLessons[lessonIndex] = {...prevLesson, test_id: undefined};
      }

      return {
        ...state,
        lessons: {...loadedLessons, [courseId]: newLessons},
        lessonsTests: {...state.lessonsTests, [lessonId]: null},
        tests,
      };
    }
    case ActionType.TEST_RESULTS_FETCHED: {
      const {testId, results} = action;

      return {
        ...state,
        testResults: {
          ...state.testResults,
          [testId]: results,
        },
      };
    }
    default:
      return state;
  }
};
