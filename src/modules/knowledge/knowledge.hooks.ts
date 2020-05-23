import {AxiosError} from 'axios';
import {useCheckPermissions} from 'components/ConditionalRender';
import {useRedirect} from 'hooks/common';
import _ from 'lodash';
import {
  knowledgeLevelFetch,
  KnowledgeLevelFetchCallback,
  KnowledgeLevelFetchErrorCallback,
  KnowledgeTaskDeleteCallback,
  KnowledgeTaskDeleteErrorCallback,
  KnowledgeThemeDeleteCallback,
  KnowledgeThemeDeleteErrorCallback,
  taskDeleteRequest,
  taskFetch,
  taskRevoke,
  themeDeleteRequest,
  themeFetch,
  themeRevoke,
} from 'modules/knowledge/knowledge.actions';
import {KnowledgeTreeEntity} from 'modules/knowledge/knowledge.constants';
import {
  selectKnowledgeMap,
  selectKnowledgeTasks,
  selectKnowledgeThemes,
} from 'modules/knowledge/knowledge.selectors';
import {
  getKnowledgeSubjectContent,
  getKnowledgeTree,
  getSubjectNodeId,
  getThemeNodeId,
} from 'modules/knowledge/knowledge.utils';
import {useCallback, useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DataProperty} from 'store/reducers/types';
import {
  KnowledgeLevelInfo,
  SubjectInfo,
  TaskInfo,
  ThemeInfo,
} from 'types/entities';
import {Permission} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

export type KnowledgeLevelFetchParams = {
  subjectId: number;
  themeId?: number;
  onSuccess?: KnowledgeLevelFetchCallback;
  onError?: KnowledgeLevelFetchErrorCallback;
};

export function useKnowledgeLevelFetch() {
  const dispatch = useDispatch();

  return useCallback(
    ({subjectId, themeId, onSuccess, onError}: KnowledgeLevelFetchParams) => {
      dispatch(
        knowledgeLevelFetch({
          subjectId,
          themeId,
          onSuccess,
          onError,
        }),
      );
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
    knowledgeLevelFetch({subjectId, themeId});
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

function useKnowledgeSubjectMap(subjectId?: number) {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const knowledgeMap = useSelector(selectKnowledgeMap);
  const subjectContent = subjectId ? knowledgeMap[subjectId] : undefined;
  const knowledgeLevelFetch = useKnowledgeLevelFetch();

  const dispatchFetchAction = useCallback(
    (subjectId: number) => {
      knowledgeLevelFetch({subjectId});
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
    return {content: false} as const;
  }

  if (!subjectContent || !subjectContent.root) {
    return {content: undefined, reload} as const;
  }

  if (subjectContent.root instanceof Error) {
    return {error: subjectContent.root, reload} as const;
  }

  return {content: subjectContent, reload} as const;
}

export function useKnowledgeSubjectContent(subjectId?: number) {
  const {content: subjectContent, error, reload} = useKnowledgeSubjectMap(
    subjectId,
  );
  const themes = useSelector(selectKnowledgeThemes);
  const tasks = useSelector(selectKnowledgeTasks);

  const {loadedThemes, subjectThemes, subjectTasks} = useMemo(() => {
    return getKnowledgeSubjectContent(subjectContent, themes, tasks);
  }, [subjectContent, tasks, themes]);

  return error
    ? ({error, loadedThemes, reload} as const)
    : ({
        themes: subjectThemes,
        tasks: subjectTasks,
        loadedThemes,
        reload,
      } as const);
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
    } as const;
  }, [map, mapEntities, subjects, tasks, themes]);
}

export function useKnowledgeTheme(subjectId?: number, themeId?: number) {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const themes = useSelector(selectKnowledgeThemes);
  const theme = themeId ? themes[themeId] : undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(
    (subjectId: number, themeId: number) => {
      dispatch(themeFetch({subjectId, themeId}));
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
    ? ({error: theme, reload: reloadCallback} as const)
    : ({theme: !isAllowed ? false : theme, reload: reloadCallback} as const);
}

export function useRevokeKnowledgeTheme() {
  const dispatch = useDispatch();

  return useCallback(
    (data: ThemeInfo) => {
      dispatch(themeRevoke({data}));
    },
    [dispatch],
  );
}

export function useDeleteKnowledgeTheme(
  redirectUrl?: string,
  onDelete?: KnowledgeThemeDeleteCallback,
  onError?: KnowledgeThemeDeleteErrorCallback,
) {
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
    (subjectId: number, themeId: number, parentThemeId?: number) => {
      dispatch(
        themeDeleteRequest({
          subjectId,
          themeId,
          parentThemeId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}

export function useKnowledgeTask(subjectId?: number, taskId?: number) {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const tasks = useSelector(selectKnowledgeTasks);
  const task = taskId ? tasks[taskId] : undefined;
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(
    (subjectId: number, taskId: number) => {
      dispatch(taskFetch({subjectId, taskId}));
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
    ? ({error: task, reload: reloadCallback} as const)
    : ({task: !isAllowed ? false : task, reload: reloadCallback} as const);
}

export function useRevokeKnowledgeTask() {
  const dispatch = useDispatch();

  return useCallback(
    (data: TaskInfo) => {
      dispatch(taskRevoke({data}));
    },
    [dispatch],
  );
}

export function useDeleteKnowledgeTask(
  redirectUrl?: string,
  onDelete?: KnowledgeTaskDeleteCallback,
  onError?: KnowledgeTaskDeleteErrorCallback,
) {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (subjectId: number, taskId: number, themeId?: number) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(subjectId, taskId, themeId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (subjectId, taskId, themeId) => {
      dispatch(
        taskDeleteRequest({
          subjectId,
          taskId,
          themeId,
          onDelete: deleteCallback,
          onError,
        }),
      );
    },
    [dispatch, deleteCallback, onError],
  );
}
