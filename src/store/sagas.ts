/*eslint-disable @typescript-eslint/unbound-method*/
import APIRequest from 'api';
import {coursesSaga} from 'modules/courses/courses.sagas';
import {subjectsSaga} from 'modules/subjects/subjects.sagas';
import {teachersSaga} from 'modules/teachers/teachers.sagas';
import {userSaga} from 'modules/user/user.sagas';
import {
  ActionPattern,
  call,
  fork,
  put as putEffect,
  PutEffect,
  spawn,
  take as takeEffect,
  TakeEffect,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import {AccountsRoleReq} from 'types/dtos';
import {
  AccountInfo,
  CourseParticipantInfo,
  HomeworkInfo,
  KnowledgeLevelInfo,
  LessonInfo,
  PersonWebinar,
  TaskInfo,
  TestInfo,
  TestResultInfo,
  ThemeInfo,
  UserHomeworkInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {takeLeadingPerKey} from 'utils/sagaHelpers';

import {testingSaga} from '../modules/testing/testing.sagas';
import {
  AccountsDeleteRequestAction,
  AccountsFetchAction,
  Action,
  ActionType,
  AdminWebinarsFetchAction,
  CourseWebinarsFetchAction,
  HomeworksFetchAction,
  KnowledgeLevelFetchAction,
  KnowledgeTaskDeleteRequestAction,
  KnowledgeTaskFetchAction,
  KnowledgeTestDeleteRequestAction,
  KnowledgeTestFetchAction,
  KnowledgeThemeDeleteRequestAction,
  KnowledgeThemeFetchAction,
  LessonDeleteRequestAction,
  LessonsFetchAction,
  ParticipantDeleteRequestAction,
  ParticipantsFetchAction,
  TestResultsFetchAction,
  UpcomingWebinarsFetchAction,
  UserHomeworksFetchAction,
  WebinarDeleteRequestAction,
} from './actions';
import {waitForLogin} from './sagas/watchers';

const take = (pattern?: ActionPattern<Action>): TakeEffect =>
  takeEffect<Action>(pattern);
const put = (action: Action): PutEffect<Action> => putEffect<Action>(action);

function* fetchAccounts() {
  yield* waitForLogin<AccountsFetchAction>(
    ActionType.ACCOUNTS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: AccountsFetchAction) {
          const {role} = action;
          try {
            const accounts: AccountInfo[] = yield call(
              APIRequest.get,
              '/accounts/management',
              {
                params: {
                  role,
                },
              },
            );
            yield put({
              type: ActionType.ACCOUNTS_FETCHED,
              accounts,
              role,
            });
          } catch (error) {
            yield put({
              type: ActionType.ACCOUNTS_FETCHED,
              accounts: error,
              role,
            });
          }
        },
        (action) => action.role,
      );
    },
  );
}

function* fetchLessons() {
  yield* waitForLogin<LessonsFetchAction>(ActionType.LESSONS_FETCH, function* (
    channel,
  ) {
    yield takeLeadingPerKey(
      channel,
      function* (action: LessonsFetchAction) {
        const {courseId} = action;
        try {
          const lessons: LessonInfo[] = yield call(APIRequest.get, '/lessons', {
            params: {
              courseId,
            },
          });
          yield put({type: ActionType.LESSONS_FETCHED, lessons, courseId});
        } catch (error) {
          yield put({
            type: ActionType.LESSONS_FETCHED,
            lessons: error,
            courseId,
          });
        }
      },
      (action) => action.courseId,
    );
  });
}

function* fetchUserHomeworks() {
  yield* waitForLogin<UserHomeworksFetchAction>(
    ActionType.USER_HOMEWORKS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: UserHomeworksFetchAction) {
          const {courseId, lessonId} = action;
          try {
            const homework: UserHomeworkInfo = yield call(
              APIRequest.get,
              `/lessons/${lessonId}/homeworks/pupil`,
            );
            yield put({
              type: ActionType.USER_HOMEWORKS_FETCHED,
              homework,
              courseId,
              lessonId,
            });
          } catch (error) {
            yield put({
              type: ActionType.USER_HOMEWORKS_FETCHED,
              homework: error,
              courseId,
              lessonId,
            });
          }
        },
        (action) => action.lessonId,
      );
    },
  );
}

function* fetchCourseWebinars() {
  yield* waitForLogin<CourseWebinarsFetchAction>(
    ActionType.COURSE_WEBINARS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: CourseWebinarsFetchAction) {
          const {courseId} = action;
          try {
            const webinars: PersonWebinar[] = yield call(
              APIRequest.get,
              `/courses/${courseId}/schedule/person`,
            );
            yield put({
              type: ActionType.COURSE_WEBINARS_FETCHED,
              webinars,
              courseId,
            });
          } catch (error) {
            yield put({
              type: ActionType.COURSE_WEBINARS_FETCHED,
              webinars: error,
              courseId,
            });
          }
        },
        (action) => action.courseId,
      );
    },
  );
}

function* fetchUpcomingWebinars() {
  yield* waitForLogin<UpcomingWebinarsFetchAction>(
    ActionType.UPCOMING_WEBINARS_FETCH,
    function* (channel) {
      yield takeLeading(channel, function* () {
        try {
          const webinars: PersonWebinar[] = yield call(
            APIRequest.get,
            '/courses/schedule/person',
          );
          yield put({type: ActionType.UPCOMING_WEBINARS_FETCHED, webinars});
        } catch (error) {
          yield put({
            type: ActionType.UPCOMING_WEBINARS_FETCHED,
            webinars: error,
          });
        }
      });
    },
  );
}

function* fetchParticipants() {
  yield* waitForLogin<ParticipantsFetchAction>(
    ActionType.PARTICIPANTS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: ParticipantsFetchAction) {
          const {courseId} = action;
          try {
            const participants: CourseParticipantInfo[] = yield call(
              APIRequest.get,
              `/courses/${courseId}/participants`,
            );
            yield put({
              type: ActionType.PARTICIPANTS_FETCHED,
              participants,
              courseId,
            });
          } catch (error) {
            yield put({
              type: ActionType.PARTICIPANTS_FETCHED,
              participants: error,
              courseId,
            });
          }
        },
        (action) => action.courseId,
      );
    },
  );
}

function* fetchAdminWebinars() {
  yield* waitForLogin<AdminWebinarsFetchAction>(
    ActionType.ADMIN_WEBINARS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: AdminWebinarsFetchAction) {
          const {courseId} = action;
          try {
            const webinars: WebinarScheduleInfo = yield call(
              APIRequest.get,
              `/courses/${courseId}/schedule`,
            );
            yield put({
              type: ActionType.ADMIN_WEBINARS_FETCHED,
              webinars,
              courseId,
            });
          } catch (error) {
            yield put({
              type: ActionType.ADMIN_WEBINARS_FETCHED,
              webinars: error,
              courseId,
            });
          }
        },
        (action) => action.courseId,
      );
    },
  );
}

function* fetchHomeworks() {
  yield* waitForLogin<HomeworksFetchAction>(
    ActionType.HOMEWORKS_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: HomeworksFetchAction) {
          const {lessonId} = action;
          try {
            const homeworks: HomeworkInfo[] = yield call(
              APIRequest.get,
              `/lessons/${lessonId}/homeworks`,
            );
            yield put({
              type: ActionType.HOMEWORKS_FETCHED,
              homeworks,
              lessonId,
            });
          } catch (error) {
            yield put({
              type: ActionType.HOMEWORKS_FETCHED,
              homeworks: error,
              lessonId,
            });
          }
        },
        (action) => action.lessonId,
      );
    },
  );
}

function* processLessonDelete() {
  yield takeLeadingPerKey(
    ActionType.LESSON_DELETE_REQUEST,
    function* (action: LessonDeleteRequestAction) {
      const {courseId, lessonId, onDelete, onError} = action;
      try {
        yield call(APIRequest.delete, `/lessons/${lessonId}`);
        if (onDelete) {
          yield call(onDelete, courseId, lessonId);
        }
        yield put({type: ActionType.LESSON_DELETE, courseId, lessonId});
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, lessonId, error);
        }
      }
    },
    (action) => action.lessonId,
  );
}

function* processParticipantDelete() {
  yield takeLeadingPerKey(
    ActionType.PARTICIPANTS_DELETE_REQUEST,
    function* (action: ParticipantDeleteRequestAction) {
      const {courseId, userId, onDelete, onError} = action;
      try {
        yield call(
          APIRequest.delete,
          `courses/${courseId}/participants/${userId}`,
        );
        if (onDelete) {
          yield call(onDelete, courseId, userId);
        }
        yield put({type: ActionType.PARTICIPANTS_DELETE, courseId, userId});
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, userId, error);
        }
      }
    },
    (action) => [action.courseId, action.userId],
  );
}

function* processAccountsDelete() {
  yield takeEvery(ActionType.ACCOUNTS_DELETE_REQUEST, function* (
    action: AccountsDeleteRequestAction,
  ) {
    const {accountIds, role, onDelete, onError} = action;
    try {
      const request: AccountsRoleReq = {
        accounts: accountIds.map((id) => id.toString()),
        role,
      };
      const accounts: AccountInfo[] = yield call(
        APIRequest.delete,
        '/accounts/management',
        {
          data: request,
        },
      );

      if (onDelete) {
        yield call(onDelete, accountIds);
      }
      yield put({
        type: ActionType.ACCOUNTS_DELETE,
        role,
        responseAccounts: accounts,
      });
    } catch (error) {
      if (onError) {
        yield call(onError, accountIds, error);
      }
    }
  });
}

function* processWebinarDelete() {
  yield takeLeadingPerKey(
    ActionType.WEBINAR_DELETE_REQUEST,
    function* (action: WebinarDeleteRequestAction) {
      const {courseId, webinarId, webinarsSchedule, onDelete, onError} = action;
      const {
        course_id,
        click_meeting_link,
        image_link,
        webinars,
      } = webinarsSchedule;
      const requestData = {
        course_id,
        click_meeting_link,
        image: image_link.split('/').pop(),
        webinars: webinars
          .filter(({id}) => id !== webinarId)
          .map(({date_start, ...rest}) => ({
            ...rest,
            date_start: date_start.getTime(),
          })),
      };
      try {
        const responseWebinars: WebinarScheduleInfo = yield call(
          APIRequest.put,
          `/courses/${courseId}/schedule`,
          requestData,
        );

        if (onDelete) {
          yield call(onDelete, courseId, webinarId);
        }
        yield put({
          type: ActionType.WEBINAR_DELETE,
          courseId,
          webinarId,
          responseWebinars,
        });
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, webinarId, error);
        }
      }
    },
    (action) => [action.courseId, action.webinarId],
  );
}

function* fetchTestResults() {
  yield* waitForLogin<TestResultsFetchAction>(
    ActionType.TEST_RESULTS_FETCH,
    function* (channel) {
      yield takeLeading(channel, function* (action: TestResultsFetchAction) {
        const {testId, lessonId} = action;
        try {
          const results: TestResultInfo[] = yield call(
            APIRequest.get,
            `/knowledge/tests/${testId}/results`,
          );
          yield put({
            type: ActionType.TEST_RESULTS_FETCHED,
            results,
            testId,
            lessonId,
          });
        } catch (error) {
          yield put({
            type: ActionType.TEST_RESULTS_FETCHED,
            results: error,
            testId,
            lessonId,
          });
        }
      });
    },
  );
}

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

function* fetchKnowledgeTest() {
  yield* waitForLogin<KnowledgeTestFetchAction>(
    ActionType.KNOWLEDGE_TEST_FETCH,
    function* (channel) {
      yield takeLeadingPerKey(
        channel,
        function* (action: KnowledgeTestFetchAction) {
          const {lessonId} = action;
          try {
            const test: TestInfo = yield call(
              APIRequest.get,
              `/knowledge/tests`,
              {
                params: {
                  lessonId,
                },
              },
            );
            yield put({
              type: ActionType.KNOWLEDGE_TEST_FETCHED,
              test,
              lessonId,
            });
          } catch (error) {
            yield put({
              type: ActionType.KNOWLEDGE_TEST_FETCHED,
              test: error,
              lessonId,
            });
          }
        },
        (action) => action.lessonId,
      );
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

function* processTestDelete() {
  yield takeLeadingPerKey(
    ActionType.KNOWLEDGE_TEST_DELETE_REQUEST,
    function* (action: KnowledgeTestDeleteRequestAction) {
      const {courseId, lessonId, testId, onDelete, onError} = action;
      try {
        yield call(APIRequest.delete, `/knowledge/tests/${testId}`);
        if (onDelete) {
          yield call(onDelete, courseId, lessonId, testId);
        }
        yield put({
          type: ActionType.KNOWLEDGE_TEST_DELETE,
          courseId,
          lessonId,
          testId,
        });
      } catch (error) {
        if (onError) {
          yield call(onError, courseId, lessonId, testId, error);
        }
      }
    },
    (action) => action.testId,
  );
}

export default function* rootSaga() {
  yield fork(userSaga);
  yield fork(subjectsSaga);
  yield fork(coursesSaga);
  yield fork(teachersSaga);
  yield fork(testingSaga);

  yield spawn(fetchUserHomeworks);
  yield spawn(fetchAccounts);
  yield spawn(fetchLessons);
  yield spawn(fetchCourseWebinars);
  yield spawn(fetchUpcomingWebinars);
  yield spawn(fetchParticipants);
  yield spawn(fetchAdminWebinars);
  yield spawn(fetchHomeworks);
  yield spawn(fetchTestResults);
  yield spawn(fetchKnowledgeLevel);
  yield spawn(fetchKnowledgeTheme);
  yield spawn(fetchKnowledgeTask);
  yield spawn(fetchKnowledgeTest);

  yield spawn(processLessonDelete);
  yield spawn(processParticipantDelete);
  yield spawn(processAccountsDelete);
  yield spawn(processWebinarDelete);
  yield spawn(processThemeDelete);
  yield spawn(processTaskDelete);
  yield spawn(processTestDelete);
}
