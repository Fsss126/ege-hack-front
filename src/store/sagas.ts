/*eslint-disable @typescript-eslint/unbound-method*/
import APIRequest from 'api';
import {coursesSaga} from 'modules/courses/courses.sagas';
import {homeworksSaga} from 'modules/homeworks/homeworks.sagas';
import {lessonsSaga} from 'modules/lessons/lessons.sagas';
import {participantsSaga} from 'modules/participants/participants.sagas';
import {subjectsSaga} from 'modules/subjects/subjects.sagas';
import {teachersSaga} from 'modules/teachers/teachers.sagas';
import {testingSaga} from 'modules/testing/testing.sagas';
import {testsSaga} from 'modules/tests/tests.sagas';
import {userSaga} from 'modules/user/user.sagas';
import {usersSaga} from 'modules/users/users.sagas';
import {webinarsSaga} from 'modules/webinars/webinars.sagas';
import {call, fork, put, spawn, takeLeading} from 'redux-saga/effects';
import {KnowledgeLevelInfo, TaskInfo, ThemeInfo} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {
  ActionType,
  KnowledgeLevelFetchAction,
  KnowledgeTaskDeleteRequestAction,
  KnowledgeTaskFetchAction,
  KnowledgeThemeDeleteRequestAction,
  KnowledgeThemeFetchAction,
} from './actions';
import {waitForLogin} from './sagas/watchers';

// TODO: move check into saga
function* fetchKnowledgeLevel() {
  yield* waitForLogin<KnowledgeLevelFetchAction>(
    ActionType.KNOWLEDGE_LEVEL_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeLevelFetchAction) {
          const {subjectId, themeId, onSuccess, onError} = action;
          try {
            const content: KnowledgeLevelInfo = yield call(
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
            yield put({
              type: ActionType.KNOWLEDGE_LEVEL_FETCHED,
              subjectId,
              themeId,
              content,
            });

            if (onSuccess) {
              yield call(onSuccess, subjectId, themeId, content);
            }
          } catch (e) {
            yield put({
              type: ActionType.KNOWLEDGE_LEVEL_FETCHED,
              subjectId,
              themeId,
              content: e,
            });

            if (onError) {
              yield call(onError, subjectId, themeId, e);
            }
          }
        },
        (action) => [action.subjectId, action.themeId],
      );
    },
  );
}

function* fetchKnowledgeTheme() {
  yield* waitForLogin<KnowledgeThemeFetchAction>(
    ActionType.KNOWLEDGE_THEME_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeThemeFetchAction) {
          const {subjectId, themeId} = action;
          try {
            const theme: ThemeInfo = yield call(
              APIRequest.get,
              `/knowledge/content/themes/${themeId}`,
            );
            yield put({
              type: ActionType.KNOWLEDGE_THEME_FETCHED,
              theme,
              subjectId,
              themeId,
            });
          } catch (error) {
            yield put({
              type: ActionType.KNOWLEDGE_THEME_FETCHED,
              theme: error,
              subjectId,
              themeId,
            });
          }
        },
        (action) => [action.subjectId, action.themeId],
      );
    },
  );
}

function* fetchKnowledgeTask() {
  yield* waitForLogin<KnowledgeTaskFetchAction>(
    ActionType.KNOWLEDGE_TASK_FETCH,
    function* (channel) {
      yield takeLeading(channel, function* (action: KnowledgeTaskFetchAction) {
        const {subjectId, taskId} = action;
        try {
          const task: TaskInfo = yield call(
            APIRequest.get,
            `/knowledge/content/tasks/${taskId}`,
          );
          yield put({
            type: ActionType.KNOWLEDGE_TASK_FETCHED,
            task,
            subjectId,
            taskId,
          });
        } catch (error) {
          yield put({
            type: ActionType.KNOWLEDGE_TASK_FETCHED,
            task: error,
            subjectId,
            taskId,
          });
        }
      });
    },
  );
}

function* processThemeDelete() {
  yield takeLeadingPerKey(
    ActionType.KNOWLEDGE_THEME_DELETE_REQUEST,
    function* (action: KnowledgeThemeDeleteRequestAction) {
      const {subjectId, themeId, parentThemeId, onDelete, onError} = action;
      try {
        yield call(APIRequest.delete, `/knowledge/content/themes/${themeId}`);
        if (onDelete) {
          yield call(onDelete, subjectId, themeId, parentThemeId);
        }
        yield put({
          type: ActionType.KNOWLEDGE_THEME_DELETE,
          subjectId,
          themeId,
          parentThemeId,
        });
      } catch (error) {
        if (onError) {
          yield call(onError, subjectId, themeId, parentThemeId, error);
        }
      }
    },
    (action) => action.themeId,
  );
}

function* processTaskDelete() {
  yield takeLeadingPerKey(
    ActionType.KNOWLEDGE_TASK_DELETE_REQUEST,
    function* (action: KnowledgeTaskDeleteRequestAction) {
      const {subjectId, taskId, themeId, onDelete, onError} = action;
      try {
        yield call(APIRequest.delete, `/knowledge/content/tasks/${taskId}`);
        if (onDelete) {
          yield call(onDelete, subjectId, taskId, themeId);
        }
        yield put({
          type: ActionType.KNOWLEDGE_TASK_DELETE,
          subjectId,
          taskId,
          themeId,
        });
      } catch (error) {
        if (onError) {
          yield call(onError, subjectId, taskId, themeId, error);
        }
      }
    },
    (action) => action.taskId,
  );
}

export default function* rootSaga() {
  yield fork(userSaga);
  yield fork(subjectsSaga);
  yield fork(coursesSaga);
  yield fork(teachersSaga);
  yield fork(testingSaga);
  yield fork(lessonsSaga);
  yield fork(usersSaga);
  yield fork(homeworksSaga);
  yield fork(webinarsSaga);
  yield fork(participantsSaga);
  yield fork(testsSaga);

  yield spawn(fetchKnowledgeLevel);
  yield spawn(fetchKnowledgeTheme);
  yield spawn(fetchKnowledgeTask);
  yield spawn(processThemeDelete);
  yield spawn(processTaskDelete);
}
