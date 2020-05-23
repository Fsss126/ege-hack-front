import _ from 'lodash';
import {
  EKnowledgeAction,
  KnowledgeBaseSubject,
} from 'modules/knowledge/knowledge.constants';
import {getParentLevelKey} from 'modules/knowledge/knowledge.utils';
import {Reducer} from 'redux';
import {Action} from 'store/actions';
import {DataProperty} from 'store/reducers/types';
import {TaskInfo, ThemeInfo} from 'types/entities';

export interface DataState {
  themes: Dictionary<DataProperty<ThemeInfo>, number>;
  tasks: Dictionary<DataProperty<TaskInfo>>;
  knowledgeMap: Dictionary<KnowledgeBaseSubject>;
}

const defaultState: DataState = {
  themes: {},
  tasks: {},
  knowledgeMap: {},
};

export const knowledgeReducer: Reducer<DataState, Action> = (
  state = defaultState,
  action,
): DataState => {
  switch (action.type) {
    case EKnowledgeAction.KNOWLEDGE_LEVEL_FETCHED: {
      const {subjectId, themeId, data: content} = action.payload;
      const themeKey = getParentLevelKey(themeId);

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
    case EKnowledgeAction.KNOWLEDGE_THEME_FETCHED: {
      const {themeId, data} = action.payload;

      return {
        ...state,
        themes: {
          ...state.themes,
          [themeId]: data,
        },
      };
    }
    case EKnowledgeAction.KNOWLEDGE_THEME_REVOKE: {
      const {data: responseTheme} = action.payload;
      const {subject_id, id, parent_theme_id} = responseTheme;

      const themeKey = getParentLevelKey(parent_theme_id);
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
    case EKnowledgeAction.KNOWLEDGE_THEME_DELETE: {
      const {subjectId, themeId, parentThemeId} = action.payload;

      const themeKey = getParentLevelKey(parentThemeId);
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
    case EKnowledgeAction.KNOWLEDGE_TASK_FETCHED: {
      const {taskId, data} = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: data,
        },
      };
    }
    case EKnowledgeAction.KNOWLEDGE_TASK_REVOKE: {
      const {data: responseTask} = action.payload;
      const {subject_id, id, theme_id} = responseTask;

      const themeKey = getParentLevelKey(theme_id);
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
    case EKnowledgeAction.KNOWLEDGE_TASK_DELETE: {
      const {subjectId, themeId, taskId} = action.payload;

      const themeKey = getParentLevelKey(themeId);
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
    default:
      return state;
  }
};
