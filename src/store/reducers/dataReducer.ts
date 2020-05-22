import {AxiosError} from 'axios';
import _ from 'lodash';
import {Reducer} from 'redux';
import {
  CourseInfo,
  CourseParticipantInfo,
  TaskInfo,
  TestInfo,
  TestResultInfo,
  ThemeInfo,
} from 'types/entities';
import {KNOWLEDGE_TREE_ROOT, KnowledgeTreeLevel} from 'types/knowledgeTree';

import {Action, ActionType} from '../actions';

export type DataProperty<T> = Maybe<T | AxiosError>;

export type KnowledgeBaseSubject = {
  [key in number | typeof KNOWLEDGE_TREE_ROOT]?: DataProperty<
    KnowledgeTreeLevel
  >;
};

export interface DataState {
  // TODO: normalize
  // courseLessons: {[courseId: number]: DataProperty<number[]>};
  // lessons: {[lessonId: number]: LessonInfo};
  participants: {
    [courseId: number]: DataProperty<CourseParticipantInfo[]>;
  };
  teacherCourses?: DataProperty<CourseInfo[]>;
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
  participants: {},
  teacherCourses: undefined,
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
      const {lessonId, responseTest} = action;

      const tests = {...state.tests, [responseTest.id]: responseTest};

      return {
        ...state,
        tests,
        lessonsTests: {
          ...state.lessonsTests,
          [lessonId]: responseTest.id,
        },
      };
    }
    case ActionType.KNOWLEDGE_TEST_DELETE: {
      const {lessonId, testId} = action;

      const {[testId]: removedTest, ...tests} = state.tests;

      return {
        ...state,
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
