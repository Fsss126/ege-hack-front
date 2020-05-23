import APIRequest, {getCancelToken} from 'api';
import {AxiosError, Canceler} from 'axios';
import {useCheckPermissions} from 'components/ConditionalRender';
import _ from 'lodash';
import {useCredentials} from 'modules/user/user.hooks';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  ActionType,
  KnowledgeLevelFetchCallback,
  KnowledgeLevelFetchErrorCallback,
  KnowledgeTaskDeleteCallback,
  KnowledgeTaskDeleteErrorCallback,
  KnowledgeThemeDeleteCallback,
  KnowledgeThemeDeleteErrorCallback,
} from 'store/actions';
import {DataProperty, KnowledgeBaseSubject} from 'store/reducers/dataReducer';
import {
  selectKnowledgeMap,
  selectKnowledgeTasks,
  selectKnowledgeThemes,
} from 'store/selectors';
import {
  CourseInfo,
  DiscountInfo,
  KnowledgeLevelInfo,
  SubjectInfo,
  TaskInfo,
  ThemeInfo,
} from 'types/entities';
import {Permission} from 'types/enums';
import {
  getKnowledgeSubjectContent,
  getKnowledgeTree,
  getSubjectNodeId,
  getThemeNodeId,
  KnowledgeTreeEntity,
} from 'types/knowledgeTree';
import {SimpleCallback} from 'types/utility/common';

export type DiscountHookResult = {
  discount?: DiscountInfo;
  error?: AxiosError;
  reload: SimpleCallback;
  isLoading: boolean;
};

export function useDiscount(
  selectedCourses: Set<CourseInfo> | number,
): DiscountHookResult {
  const {credentials} = useCredentials();
  const [discount, setDiscount] = React.useState<DiscountInfo>();
  const [error, setError] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const cancelRef = useRef<Canceler>();
  const fetchDiscount = useCallback(async () => {
    const courses =
      selectedCourses instanceof Set
        ? [...selectedCourses].map(({id}) => id)
        : [selectedCourses];

    if (courses.length === 0) {
      return;
    }
    const cancelPrev = cancelRef.current;

    if (cancelPrev) {
      cancelPrev();
    }
    const {token: cancelToken, cancel} = getCancelToken();
    cancelRef.current = cancel;
    try {
      if (error) {
        setError(undefined);
      }
      // setDiscount(null);
      setLoading(true);
      const discount: DiscountInfo = await APIRequest.get(
        '/payments/discounts',
        {
          params: {
            coursesIds: courses,
          },
          cancelToken,
        },
      );
      setDiscount(discount);
    } catch (e) {
      console.error('Error loading discount', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCourses, error]);

  React.useEffect(() => {
    if (credentials && !error) {
      fetchDiscount();
    }
  }, [credentials, selectedCourses, error, fetchDiscount]);

  return {discount, error, reload: fetchDiscount, isLoading};
}

export type RedirectHookResult = SimpleCallback;

export function useRedirect(redirectUrl?: string): RedirectHookResult {
  const history = useHistory();

  return useCallback(() => {
    if (redirectUrl) {
      history.replace(redirectUrl);
    }
  }, [history, redirectUrl]);
}

export type KnowledgeLevelFetchHookResult = (
  subjectId: number,
  themeId?: number,
  onSuccess?: KnowledgeLevelFetchCallback,
  onError?: KnowledgeLevelFetchErrorCallback,
) => void;

export function useKnowledgeLevelFetch(): KnowledgeLevelFetchHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (subjectId, themeId, onSuccess, onError) => {
      dispatch({
        type: ActionType.KNOWLEDGE_LEVEL_FETCH,
        subjectId,
        themeId,
        onSuccess,
        onError,
      });
    },
    [dispatch],
  );
}

export type KnowledgeLevelHookResult = {
  content?: KnowledgeLevelInfo | false;
  error?: AxiosError | true;
  reload: SimpleCallback;
};

export function useKnowledgeLevel(
  subjectId: number,
  themeId?: number,
): KnowledgeLevelHookResult {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const themes = useSelector(selectKnowledgeThemes);
  const tasks = useSelector(selectKnowledgeTasks);
  const knowledgeTree = useSelector(selectKnowledgeMap);
  const knowledgeLevel =
    knowledgeTree[subjectId]?.[themeId === undefined ? 'root' : themeId];
  const knowledgeLevelFetch = useKnowledgeLevelFetch();
  const dispatchFetchAction = useCallback(() => {
    knowledgeLevelFetch(subjectId, themeId);
  }, [knowledgeLevelFetch, subjectId, themeId]);

  useEffect(() => {
    if (isAllowed) {
      if (!knowledgeLevel) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, knowledgeLevel]);

  const {content, errorInMap} = useMemo(() => {
    if (!knowledgeLevel || knowledgeLevel instanceof Error) {
      return {content: undefined};
    } else {
      let errorInMap: AxiosError | true | undefined;

      const filter = <T extends TaskInfo | ThemeInfo>(
        theme: DataProperty<T>,
      ): theme is T => {
        if (!theme) {
          errorInMap = true;
        } else if (theme instanceof Error) {
          errorInMap = theme;
        }

        return !!theme && !(theme instanceof Error);
      };

      const content: KnowledgeLevelInfo = {
        themes: knowledgeLevel.themeIds
          .map((themeId) => themes[themeId])
          .filter(filter),
        tasks: knowledgeLevel.taskIds
          .map((taskId) => tasks[taskId])
          .filter(filter),
      };

      return {content, errorInMap};
    }
  }, [knowledgeLevel, tasks, themes]);

  return knowledgeLevel instanceof Error || errorInMap
    ? {
        error: knowledgeLevel instanceof Error ? knowledgeLevel : errorInMap,
        reload: dispatchFetchAction,
      }
    : {
        content: !isAllowed ? false : content,
        reload: dispatchFetchAction,
      };
}

type KnowledgeSubjectMapHookResult = {
  content?: KnowledgeBaseSubject | false;
  error?: AxiosError;
  reload?: SimpleCallback;
};
function useKnowledgeSubjectMap(
  subjectId?: number,
): KnowledgeSubjectMapHookResult {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const knowledgeMap = useSelector(selectKnowledgeMap);
  const subjectContent = subjectId ? knowledgeMap[subjectId] : undefined;
  const knowledgeLevelFetch = useKnowledgeLevelFetch();

  const dispatchFetchAction = useCallback(
    (subjectId: number) => {
      knowledgeLevelFetch(subjectId);
    },
    [knowledgeLevelFetch],
  );

  useEffect(() => {
    if (isAllowed) {
      if (subjectId !== undefined && !(subjectContent && subjectContent.root)) {
        dispatchFetchAction(subjectId);
      }
    }
  }, [dispatchFetchAction, isAllowed, subjectContent, subjectId]);

  const reload = useMemo(
    () =>
      subjectId !== undefined
        ? () => dispatchFetchAction(subjectId)
        : undefined,
    [dispatchFetchAction, subjectId],
  );

  if (isAllowed === false) {
    return {content: false};
  }

  if (!subjectContent || !subjectContent.root) {
    return {content: undefined, reload};
  }

  if (subjectContent.root instanceof Error) {
    return {error: subjectContent.root, reload};
  }

  return {content: subjectContent, reload};
}

export type KnowledgeSubjectContentHookResult = {
  themes?: ThemeInfo[] | false;
  tasks?: TaskInfo[] | false;
  loadedThemes: number[];
  error?: AxiosError;
  reload?: SimpleCallback;
};

export function useKnowledgeSubjectContent(
  subjectId?: number,
): KnowledgeSubjectContentHookResult {
  const {content: subjectContent, error, reload} = useKnowledgeSubjectMap(
    subjectId,
  );
  const themes = useSelector(selectKnowledgeThemes);
  const tasks = useSelector(selectKnowledgeTasks);

  const {loadedThemes, subjectThemes, subjectTasks} = useMemo(() => {
    return getKnowledgeSubjectContent(subjectContent, themes, tasks);
  }, [subjectContent, tasks, themes]);

  return error
    ? {error, loadedThemes, reload}
    : {
        themes: subjectThemes,
        tasks: subjectTasks,
        loadedThemes,
        reload,
      };
}

export function useKnowLedgeTree<
  E extends KnowledgeTreeEntity = KnowledgeTreeEntity
>(subjects: SubjectInfo[], mapEntities?: (entity: KnowledgeTreeEntity) => E) {
  const map = useSelector(selectKnowledgeMap);
  const themes = useSelector(selectKnowledgeThemes);
  const tasks = useSelector(selectKnowledgeTasks);

  return useMemo(() => {
    const collectedThemes: (Maybe<ThemeInfo[]> | false)[] = [];
    const collectedTasks: (Maybe<TaskInfo[]> | false)[] = [];
    const loadedThemes: number[][] = [];
    const loadedSubjects: number[] = [];

    _.forEach(subjects, (subject) => {
      const subjectContent = map[subject.id];

      if (!subjectContent) {
        return;
      }
      loadedSubjects.push(subject.id);

      const {
        subjectThemes,
        subjectTasks,
        loadedThemes: loadedSubjectThemes,
      } = getKnowledgeSubjectContent(subjectContent, themes, tasks);
      collectedThemes.push(subjectThemes);
      collectedTasks.push(subjectTasks);
      loadedThemes.push(loadedSubjectThemes);
    });

    const filteredThemes = _(collectedThemes).compact().flatten().value();
    const filteredTasks = _(collectedTasks).compact().flatten().value();
    const loadedEntities = [
      ..._(loadedThemes)
        .flatten()
        .map((id) => getThemeNodeId(id))
        .value(),
      ..._(loadedSubjects)
        .map((id) => getSubjectNodeId(id))
        .value(),
    ];

    return {
      ...getKnowledgeTree({
        subjects,
        themes: filteredThemes,
        tasks: filteredTasks,
        mapEntities,
      }),
      loadedEntities,
    };
  }, [map, mapEntities, subjects, tasks, themes]);
}

export type KnowledgeThemeHookResult = {
  theme?: ThemeInfo | false;
  error?: AxiosError;
  reload?: SimpleCallback;
};

export function useKnowledgeTheme(
  subjectId?: number,
  themeId?: number,
): KnowledgeThemeHookResult {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const themes = useSelector(selectKnowledgeThemes);
  const theme = themeId ? themes[themeId] : undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(
    (subjectId: number, themeId: number) => {
      dispatch({type: ActionType.KNOWLEDGE_THEME_FETCH, subjectId, themeId});
    },
    [dispatch],
  );
  useEffect(() => {
    if (isAllowed) {
      if (subjectId !== undefined && themeId !== undefined && !theme) {
        dispatchFetchAction(subjectId, themeId);
      }
    }
  }, [dispatchFetchAction, isAllowed, subjectId, theme, themeId]);

  const reloadCallback = useMemo(
    () =>
      subjectId !== undefined && themeId !== undefined
        ? () => dispatchFetchAction(subjectId, themeId)
        : undefined,
    [dispatchFetchAction, subjectId, themeId],
  );

  return theme instanceof Error
    ? {error: theme, reload: reloadCallback}
    : {theme: !isAllowed ? false : theme, reload: reloadCallback};
}

export type RevokeKnowledgeThemeHookResult = (responseTheme: ThemeInfo) => void;

export function useRevokeKnowledgeTheme(): RevokeKnowledgeThemeHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseTheme: ThemeInfo) => {
      dispatch({type: ActionType.KNOWLEDGE_THEME_REVOKE, responseTheme});
    },
    [dispatch],
  );
}

export type DeleteKnowledgeThemeHookResult = (
  subjectId: number,
  themeId: number,
  parentThemeId?: number,
) => void;

export function useDeleteKnowledgeTheme(
  redirectUrl?: string,
  onDelete?: KnowledgeThemeDeleteCallback,
  onError?: KnowledgeThemeDeleteErrorCallback,
): DeleteKnowledgeThemeHookResult {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (subjectId, themeId, parentThemeId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(subjectId, themeId, parentThemeId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (subjectId, themeId, parentThemeId) => {
      dispatch({
        type: ActionType.KNOWLEDGE_THEME_DELETE_REQUEST,
        subjectId,
        themeId,
        parentThemeId,
        onDelete: deleteCallback,
        onError,
      });
    },
    [dispatch, deleteCallback, onError],
  );
}

export type KnowledgeTaskHookResult = {
  task?: TaskInfo | false;
  error?: AxiosError;
  reload?: SimpleCallback;
};

export function useKnowledgeTask(
  subjectId?: number,
  taskId?: number,
): KnowledgeTaskHookResult {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const tasks = useSelector(selectKnowledgeTasks);
  const task = taskId ? tasks[taskId] : undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(
    (subjectId: number, taskId: number) => {
      dispatch({type: ActionType.KNOWLEDGE_TASK_FETCH, subjectId, taskId});
    },
    [dispatch],
  );
  useEffect(() => {
    if (isAllowed) {
      if (subjectId !== undefined && taskId !== undefined && !task) {
        dispatchFetchAction(subjectId, taskId);
      }
    }
  }, [dispatchFetchAction, isAllowed, subjectId, task, taskId]);

  const reloadCallback = useMemo(
    () =>
      subjectId !== undefined && taskId !== undefined
        ? () => dispatchFetchAction(subjectId, taskId)
        : undefined,
    [dispatchFetchAction, subjectId, taskId],
  );

  return task instanceof Error
    ? {error: task, reload: reloadCallback}
    : {task: !isAllowed ? false : task, reload: reloadCallback};
}

export type RevokeKnowledgeTaskHookResult = (responseTask: TaskInfo) => void;

export function useRevokeKnowledgeTask(): RevokeKnowledgeTaskHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseTask: TaskInfo) => {
      dispatch({type: ActionType.KNOWLEDGE_TASK_REVOKE, responseTask});
    },
    [dispatch],
  );
}

export type DeleteKnowledgeTaskHookResult = (
  subjectId: number,
  taskId: number,
  themeId?: number,
) => void;

export function useDeleteKnowledgeTask(
  redirectUrl?: string,
  onDelete?: KnowledgeTaskDeleteCallback,
  onError?: KnowledgeTaskDeleteErrorCallback,
): DeleteKnowledgeTaskHookResult {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (subjectId, taskId, themeId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(subjectId, taskId, themeId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (subjectId, taskId, themeId) => {
      dispatch({
        type: ActionType.KNOWLEDGE_TASK_DELETE_REQUEST,
        subjectId,
        taskId,
        themeId,
        onDelete: deleteCallback,
        onError,
      });
    },
    [dispatch, deleteCallback, onError],
  );
}
