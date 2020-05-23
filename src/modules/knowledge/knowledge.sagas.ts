import APIRequest from 'api';
import {
  knowledgeLevelFetch,
  knowledgeLevelFetched,
  taskDelete,
  taskDeleteRequest,
  taskFetch,
  taskFetched,
  themeDelete,
  themeDeleteRequest,
  themeFetch,
  themeFetched,
} from 'modules/knowledge/knowledge.actions';
import {EKnowledgeAction} from 'modules/knowledge/knowledge.constants';
import {all, call, fork, put} from 'redux-saga/effects';
import {waitForLogin} from 'store/sagas/watchers';
import {KnowledgeLevelInfo, TaskInfo, ThemeInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

type KnowledgeLevelFetchAction = ReturnType<typeof knowledgeLevelFetch>;
type KnowledgeThemeFetchAction = ReturnType<typeof themeFetch>;
type KnowledgeTaskFetchAction = ReturnType<typeof taskFetch>;
type KnowledgeThemeDeleteRequestAction = ReturnType<typeof themeDeleteRequest>;
type KnowledgeTaskDeleteRequestAction = ReturnType<typeof taskDeleteRequest>;

// TODO: move check into saga
function* fetchKnowledgeLevel() {
  yield* waitForLogin<KnowledgeLevelFetchAction>(
    EKnowledgeAction.KNOWLEDGE_LEVEL_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeLevelFetchAction) {
          const {subjectId, themeId, onSuccess, onError} = action.payload;
          try {
            const data: KnowledgeLevelInfo = yield call(
              APIRequest.get,
              '/knowledge/content',
              {
                params: themeId
                  ? {
                      subjectId,
                      themeId,
                    }
                  : {subjectId},
              },
            );
            yield put(
              knowledgeLevelFetched({
                subjectId,
                themeId,
                data,
              }),
            );

            if (onSuccess) {
              yield call(onSuccess, subjectId, themeId, data);
            }
          } catch (error) {
            yield put(
              knowledgeLevelFetched({
                subjectId,
                themeId,
                data: error,
              }),
            );

            if (onError) {
              yield call(onError, subjectId, themeId, error);
            }
          }
        },
        (action) => [action.payload.subjectId, action.payload.themeId],
      );
    },
  );
}

function* fetchTheme() {
  yield* waitForLogin<KnowledgeThemeFetchAction>(
    EKnowledgeAction.KNOWLEDGE_THEME_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeThemeFetchAction) {
          const {subjectId, themeId} = action.payload;
          try {
            const data: ThemeInfo = yield call(
              APIRequest.get,
              `/knowledge/content/themes/${themeId}`,
            );
            yield put(
              themeFetched({
                subjectId,
                themeId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              themeFetched({
                subjectId,
                themeId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.themeId,
      );
    },
  );
}

function* fetchTask() {
  yield* waitForLogin<KnowledgeTaskFetchAction>(
    EKnowledgeAction.KNOWLEDGE_TASK_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeTaskFetchAction) {
          const {subjectId, taskId} = action.payload;
          try {
            const data: TaskInfo = yield call(
              APIRequest.get,
              `/knowledge/content/tasks/${taskId}`,
            );
            yield put(
              taskFetched({
                subjectId,
                taskId,
                data,
              }),
            );
          } catch (error) {
            yield put(
              taskFetched({
                subjectId,
                taskId,
                data: error,
              }),
            );
          }
        },
        (action) => action.payload.taskId,
      );
    },
  );
}

function* processThemeDelete() {
  yield takeLeadingPerKey(
    EKnowledgeAction.KNOWLEDGE_THEME_DELETE_REQUEST,
    function* (action: KnowledgeThemeDeleteRequestAction) {
      const {
        subjectId,
        themeId,
        parentThemeId,
        onDelete,
        onError,
      } = action.payload;
      try {
        yield call(APIRequest.delete, `/knowledge/content/themes/${themeId}`);
        if (onDelete) {
          yield call(onDelete, subjectId, themeId, parentThemeId);
        }
        yield put(
          themeDelete({
            subjectId,
            themeId,
            parentThemeId,
          }),
        );
      } catch (error) {
        if (onError) {
          yield call(onError, subjectId, themeId, parentThemeId, error);
        }
      }
    },
    (action) => action.payload.themeId,
  );
}

function* processTaskDelete() {
  yield takeLeadingPerKey(
    EKnowledgeAction.KNOWLEDGE_TASK_DELETE_REQUEST,
    function* (action: KnowledgeTaskDeleteRequestAction) {
      const {subjectId, taskId, themeId, onDelete, onError} = action.payload;
      try {
        yield call(APIRequest.delete, `/knowledge/content/tasks/${taskId}`);
        if (onDelete) {
          yield call(onDelete, subjectId, taskId, themeId);
        }
        yield put(
          taskDelete({
            subjectId,
            taskId,
            themeId,
          }),
        );
      } catch (error) {
        if (onError) {
          yield call(onError, subjectId, taskId, themeId, error);
        }
      }
    },
    (action) => action.payload.taskId,
  );
}

export function* knowledgeSaga() {
  yield all([
    fork(fetchKnowledgeLevel),
    fork(fetchTheme),
    fork(fetchTask),
    fork(processThemeDelete),
    fork(processTaskDelete),
  ]);
}
