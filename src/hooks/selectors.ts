import APIRequest, {getCancelToken} from 'api';
import {AxiosError, Canceler} from 'axios';
import {useCheckPermissions} from 'components/ConditionalRender';
import _ from 'lodash';
import {useCredentials} from 'modules/user/user.hooks';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Dispatch} from 'redux';
import {
  AccountsDeleteCallback,
  AccountsDeleteErrorCallback,
  Action,
  ActionType,
  KnowledgeLevelFetchCallback,
  KnowledgeLevelFetchErrorCallback,
  KnowledgeTaskDeleteCallback,
  KnowledgeTaskDeleteErrorCallback,
  KnowledgeTestDeleteCallback,
  KnowledgeTestDeleteErrorCallback,
  KnowledgeThemeDeleteCallback,
  KnowledgeThemeDeleteErrorCallback,
  LessonDeleteCallback,
  LessonDeleteErrorCallback,
  ParticipantDeleteCallback,
  ParticipantDeleteErrorCallback,
  TestCompleteCallback,
  TestCompleteErrorCallback,
  TestSaveAnswerCallback,
  TestSaveAnswerErrorCallback,
  TestStartCallback,
  TestStartErrorCallback,
  WebinarDeleteCallback,
  WebinarDeleteErrorCallback,
} from 'store/actions';
import {AppState} from 'store/reducers';
import {DataProperty, KnowledgeBaseSubject} from 'store/reducers/dataReducer';
import {
  selectAdminWebinars,
  selectHomeworks,
  selectKnowledgeMap,
  selectKnowledgeTasks,
  selectKnowledgeTests,
  selectKnowledgeThemes,
  selectLessons,
  selectLessonTests,
  selectParticipants,
  selectTest,
  selectTestResults,
  selectTestState,
  selectTestStatuses,
  selectUpcomingWebinars,
  selectUserHomeworks,
  selectUsers,
  selectWebinars,
} from 'store/selectors';
import {
  AccountInfo,
  CourseInfo,
  CourseParticipantInfo,
  DiscountInfo,
  HomeworkInfo,
  KnowledgeLevelInfo,
  LessonInfo,
  PersonWebinar,
  SanitizedTaskInfo,
  SanitizedTestInfo,
  SubjectInfo,
  TaskInfo,
  TestInfo,
  TestResultInfo,
  TestStateInfo,
  TestStatusInfo,
  ThemeInfo,
  UserHomeworkInfo,
  WebinarScheduleInfo,
} from 'types/entities';
import {AccountRole, Permission} from 'types/enums';
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

export type AccountsHookResult = {
  accounts?: AccountInfo[];
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useAccounts(role: AccountRole): AccountsHookResult {
  const selector = useCallback((state: AppState) => selectUsers(state)[role], [
    role,
  ]);
  const accounts = useSelector(selector);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.ACCOUNTS_FETCH, role});
  }, [dispatch, role]);
  useEffect(() => {
    if (!accounts) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, accounts]);
  return accounts instanceof Error
    ? {error: accounts, reload: dispatchFetchAction}
    : {accounts, reload: dispatchFetchAction};
}

export type RevokeAccountsHookResult = (
  responseAccounts: AccountInfo[],
) => void;

export function useRevokeAccounts(role: AccountRole): RevokeAccountsHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseAccounts) => {
      dispatch({
        type: ActionType.ACCOUNTS_REVOKE,
        role,
        responseAccounts,
      });
    },
    [dispatch, role],
  );
}

export type DeleteAccountHookResult = (accountId: number) => void;

export function useDeleteAccount(
  role: AccountRole,
  onDelete?: AccountsDeleteCallback,
  onError?: AccountsDeleteErrorCallback,
): DeleteAccountHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (accountId) => {
      dispatch({
        type: ActionType.ACCOUNTS_DELETE_REQUEST,
        role,
        accountIds: [accountId],
        onDelete,
        onError,
      });
    },
    [dispatch, onDelete, onError, role],
  );
}

export type LessonsHookResult = {
  lessons?: LessonInfo[];
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useLessons(courseId: number): LessonsHookResult {
  const lessons = useSelector(selectLessons)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.LESSONS_FETCH, courseId});
  }, [courseId, dispatch]);
  useEffect(() => {
    if (!lessons) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, lessons]);
  return lessons instanceof Error
    ? {error: lessons, reload: dispatchFetchAction}
    : {lessons, reload: dispatchFetchAction};
}

export type RevokeLessonsHookResult = (responseLesson: LessonInfo) => void;

export function useRevokeLessons(courseId: number): RevokeLessonsHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseLesson) => {
      dispatch({type: ActionType.LESSONS_REVOKE, courseId, responseLesson});
    },
    [dispatch, courseId],
  );
}

export type LessonHookResult = {
  lesson?: LessonInfo;
  error?: AxiosError | true;
  reload: SimpleCallback;
};

export function useLesson(
  courseId: number,
  lessonId: number,
): LessonHookResult {
  const {lessons, error, reload} = useLessons(courseId);
  const lesson = lessons ? _.find(lessons, {id: lessonId}) : undefined;

  return {
    lesson,
    error: lessons && !lesson ? true : error,
    reload,
  };
}

export type HomeworksHookResult = {
  homeworks?: HomeworkInfo[] | false;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useHomeworks(lessonId: number): HomeworksHookResult {
  const isAllowed = useCheckPermissions(Permission.HOMEWORK_CHECK);
  const homeworks = useSelector(selectHomeworks)[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.HOMEWORKS_FETCH, lessonId});
  }, [dispatch, lessonId]);
  useEffect(() => {
    if (isAllowed) {
      if (!homeworks) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, homeworks, isAllowed]);
  return homeworks instanceof Error
    ? {error: homeworks, reload: dispatchFetchAction}
    : {homeworks: !isAllowed ? false : homeworks, reload: dispatchFetchAction};
}

export type RevokeHomeworksHookResult = (
  responseHomework: HomeworkInfo,
) => void;

export function useRevokeHomeworks(
  lessonId: number,
): RevokeHomeworksHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseHomework) => {
      dispatch({type: ActionType.HOMEWORKS_REVOKE, lessonId, responseHomework});
    },
    [dispatch, lessonId],
  );
}

export type AdminLessonsHookResult = {
  lessons?: LessonInfo[] | false;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useAdminLessons(courseId: number): AdminLessonsHookResult {
  const {lessons, error, reload} = useLessons(courseId);
  const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

  return {lessons: !isAllowed ? false : lessons, error, reload};
}

export type AdminLessonHookResult = {
  lesson?: LessonInfo | false;
  error?: AxiosError | true;
  reload: SimpleCallback;
};

export function useAdminLesson(
  courseId: number,
  lessonId: number,
): AdminLessonHookResult {
  const {lesson, error, reload} = useLesson(courseId, lessonId);
  const isAllowed = useCheckPermissions(Permission.LESSON_EDIT);

  return {lesson: !isAllowed ? false : lesson, error, reload};
}

export type ParticipantsHookResult = {
  participants?: CourseParticipantInfo[] | false;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useParticipants(courseId: number): ParticipantsHookResult {
  const isAllowed = useCheckPermissions(Permission.PARTICIPANT_MANAGEMENT);
  const participants = useSelector(selectParticipants)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.PARTICIPANTS_FETCH, courseId});
  }, [courseId, dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!participants) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, participants]);
  return participants instanceof Error
    ? {error: participants, reload: dispatchFetchAction}
    : {
        participants: !isAllowed ? false : participants,
        reload: dispatchFetchAction,
      };
}

export type RevokeParticipantsHookResult = (
  responseParticipants: CourseParticipantInfo[],
) => void;

export function useRevokeParticipants(
  courseId: number,
): RevokeParticipantsHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseParticipants) => {
      dispatch({
        type: ActionType.PARTICIPANTS_REVOKE,
        courseId,
        responseParticipants,
      });
    },
    [dispatch, courseId],
  );
}

export type AdminWebinarsHookResult = {
  webinars?: WebinarScheduleInfo | false;
  error?: AxiosError | true;
  reload: SimpleCallback;
};

export function useAdminWebinars(courseId: number): AdminWebinarsHookResult {
  const isAllowed = useCheckPermissions(Permission.WEBINAR_EDIT);
  const webinars = useSelector(selectAdminWebinars)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.ADMIN_WEBINARS_FETCH, courseId});
  }, [courseId, dispatch]);
  useEffect(() => {
    if (isAllowed) {
      if (!webinars) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, webinars]);
  return webinars instanceof Error
    ? {error: webinars, reload: dispatchFetchAction}
    : {webinars: !isAllowed ? false : webinars, reload: dispatchFetchAction};
}

export type RevokeWebinarssHookResult = (
  responseWebinars: WebinarScheduleInfo,
) => void;

export function useRevokeWebinars(courseId: number): RevokeWebinarssHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseWebinars) => {
      dispatch({type: ActionType.WEBINARS_REVOKE, courseId, responseWebinars});
    },
    [dispatch, courseId],
  );
}

export type UserHomeworkHookResult = {
  homework?: UserHomeworkInfo | null;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useUserHomework(
  courseId: number,
  lessonId: number,
): UserHomeworkHookResult {
  const homework = (useSelector(selectUserHomeworks)[courseId] || {})[lessonId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.USER_HOMEWORKS_FETCH, courseId, lessonId});
  }, [courseId, dispatch, lessonId]);
  useEffect(() => {
    if (!homework && homework !== null) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, homework]);
  return homework instanceof Error
    ? {error: homework, reload: dispatchFetchAction}
    : {homework, reload: dispatchFetchAction};
}

export type RevokeUserHomeworkHookResult = (
  responseHomework: HomeworkInfo,
) => void;

export function useRevokeUserHomework(
  courseId: number,
  lessonId: number,
): RevokeUserHomeworkHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseHomework) => {
      dispatch({
        type: ActionType.USER_HOMEWORKS_REVOKE,
        courseId,
        lessonId,
        responseHomework,
      });
    },
    [courseId, dispatch, lessonId],
  );
}

export type UpcomingWebinarsHookResult = {
  webinars?: PersonWebinar[];
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useUpcomingWebinars(): UpcomingWebinarsHookResult {
  const webinars = useSelector(selectUpcomingWebinars);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.UPCOMING_WEBINARS_FETCH});
  }, [dispatch]);
  useEffect(() => {
    if (!webinars) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, webinars]);
  return webinars instanceof Error
    ? {error: webinars, reload: dispatchFetchAction}
    : {webinars, reload: dispatchFetchAction};
}

export type CourseWebinarsHookResult = {
  webinars?: PersonWebinar[] | false;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useCourseWebinars(courseId: number): CourseWebinarsHookResult {
  const webinars = useSelector(selectWebinars)[courseId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.COURSE_WEBINARS_FETCH, courseId});
  }, [courseId, dispatch]);
  useEffect(() => {
    if (!webinars) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, webinars]);
  return webinars instanceof Error
    ? {error: webinars, reload: dispatchFetchAction}
    : {webinars, reload: dispatchFetchAction};
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

export type DeleteLessonHookResult = (
  courseId: number,
  lessonId: number,
) => void;

export function useDeleteLesson(
  redirectUrl?: string,
  onDelete?: ParticipantDeleteCallback,
  onError?: ParticipantDeleteErrorCallback,
): DeleteLessonHookResult {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId, lessonId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId, lessonId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId, lessonId) => {
      dispatch({
        type: ActionType.LESSON_DELETE_REQUEST,
        courseId,
        lessonId,
        onDelete: deleteCallback,
        onError,
      });
    },
    [dispatch, deleteCallback, onError],
  );
}

export type DeleteParticipantHookResult = (
  courseId: number,
  userId: number,
) => void;

export function useDeleteParticipant(
  onDelete?: LessonDeleteCallback,
  onError?: LessonDeleteErrorCallback,
): DeleteParticipantHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (courseId, userId) => {
      dispatch({
        type: ActionType.PARTICIPANTS_DELETE_REQUEST,
        courseId,
        userId,
        onDelete,
        onError,
      });
    },
    [dispatch, onDelete, onError],
  );
}

export type DeleteWebinarHookResult = (
  courseId: number,
  webinarId: number,
  webinarsSchedule: WebinarScheduleInfo,
) => void;

export function useDeleteWebinar(
  redirectUrl?: string,
  onDelete?: WebinarDeleteCallback,
  onError?: WebinarDeleteErrorCallback,
): DeleteWebinarHookResult {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId, lessonId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId, lessonId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId, webinarId, webinarsSchedule) => {
      dispatch({
        type: ActionType.WEBINAR_DELETE_REQUEST,
        courseId,
        webinarId,
        webinarsSchedule,
        onDelete: deleteCallback,
        onError,
      });
    },
    [dispatch, deleteCallback, onError],
  );
}

export type StartTestHookResult = (params: {
  courseId: number;
  lessonId: number;
  testId: number;
  onSuccess?: TestStartCallback;
  onError?: TestStartErrorCallback;
}) => void;

export function useStartTest(): StartTestHookResult {
  const dispatch = useDispatch<Dispatch<Action>>();
  const history = useHistory();

  return useCallback(
    (params) => {
      const {courseId, lessonId, testId, onSuccess, onError} = params;
      const onSuccessCallback: TestStartCallback = (
        testId,
        testState,
        test,
      ) => {
        const {last_task_id, is_completed: isCompleted} = testState;
        const {tasks} = test;
        const testUrl = `/courses/${courseId}/${lessonId}/test/${testId}`;
        const taskId = last_task_id !== undefined ? last_task_id : tasks[0].id;

        if (onSuccess) {
          onSuccess(testId, testState, test);
        }

        history.push(
          isCompleted ? `${testUrl}/results/` : `${testUrl}/${taskId}/`,
        );
      };

      dispatch({
        type: ActionType.TEST_START_REQUEST,
        testId,
        courseId,
        lessonId,
        onSuccess: onSuccessCallback,
        onError,
      });
    },
    [dispatch, history],
  );
}

export type SaveAnswerHookResult = (params: {
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  answer: string;
  complete: boolean;
  navigateTo: string;
  onSuccess: TestSaveAnswerCallback;
  onError: TestSaveAnswerErrorCallback;
}) => void;

export function useSaveAnswer(): SaveAnswerHookResult {
  const dispatch = useDispatch<Dispatch<Action>>();
  const history = useHistory();

  return useCallback(
    (params) => {
      const {
        testId,
        taskId,
        lessonId,
        courseId,
        answer,
        complete,
        navigateTo,
        onSuccess,
        onError,
      } = params;
      const onSuccessCallback: TestSaveAnswerCallback = (
        testId,
        taskId,
        savedAnswer,
      ) => {
        onSuccess(testId, taskId, savedAnswer);
        history.push(navigateTo);
      };

      dispatch({
        type: ActionType.TEST_SAVE_ANSWER_REQUEST,
        testId,
        taskId,
        lessonId,
        courseId,
        answer,
        complete,
        onSuccess: onSuccessCallback,
        onError,
      });
    },
    [dispatch, history],
  );
}

export type CompleteTestHookResult = (params: {
  testId: number;
  lessonId: number;
  courseId: number;
  navigateTo: string;
  onSuccess: TestCompleteCallback;
  onError: TestCompleteErrorCallback;
}) => void;

export function useCompleteTest(): CompleteTestHookResult {
  const dispatch = useDispatch<Dispatch<Action>>();
  const history = useHistory();

  return useCallback(
    (params) => {
      const {
        testId,
        lessonId,
        courseId,
        navigateTo,
        onSuccess,
        onError,
      } = params;
      const onSuccessCallback: TestCompleteCallback = (testId, results) => {
        onSuccess(testId, results);
        history.push(navigateTo);
      };

      dispatch({
        type: ActionType.TEST_COMPLETE_REQUEST,
        testId,
        lessonId,
        courseId,
        onSuccess: onSuccessCallback,
        onError,
      });
    },
    [dispatch, history],
  );
}

export type TestStatusHookResult = {
  status?: TestStatusInfo | null;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useTestStatus(
  courseId: number,
  lessonId: number,
): TestStatusHookResult {
  const status = useSelector(selectTestStatuses)[lessonId];
  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.TEST_STATUS_FETCH, courseId, lessonId});
  }, [dispatch, courseId, lessonId]);
  useEffect(() => {
    if (!status) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, status]);
  return status instanceof Error
    ? {error: status, reload: dispatchFetchAction}
    : {status, reload: dispatchFetchAction};
}

export type TestHookResult = {
  test?: SanitizedTestInfo;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useTest(testId: number): TestHookResult {
  const test = useSelector(selectTest);
  const dispatch = useDispatch<Dispatch<Action>>();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.TEST_FETCH, testId});
  }, [testId, dispatch]);
  useEffect(() => {
    if (!test) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, test]);
  return test instanceof Error
    ? {error: test, reload: dispatchFetchAction}
    : {test, reload: dispatchFetchAction};
}

export type TestTaskHookResult = {
  task?: SanitizedTaskInfo;
  error?: AxiosError | true;
  reload: SimpleCallback;
};

export function useTestTask(
  testId: number,
  taskId: number,
): TestTaskHookResult {
  const {test, error, reload} = useTest(testId);
  const task = test
    ? _.find<SanitizedTaskInfo>(test.tasks, {id: taskId})
    : undefined;

  return {
    task,
    error: test && !task ? true : error,
    reload,
  };
}

export type TestStateHookResult = {
  state?: TestStateInfo;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useTestState(
  testId: number,
  lessonId: number,
  courseId: number,
): TestStateHookResult {
  const state = useSelector(selectTestState);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.TEST_STATE_FETCH, testId, lessonId, courseId});
  }, [dispatch, testId, lessonId, courseId]);
  useEffect(() => {
    if (!state) {
      dispatchFetchAction();
    }
  }, [dispatchFetchAction, state]);
  return state instanceof Error
    ? {error: state, reload: dispatchFetchAction}
    : {state, reload: dispatchFetchAction};
}

export type TestResultsHookResult = {
  results?: TestResultInfo[] | false;
  error?: AxiosError;
  reload?: SimpleCallback;
};

export function useTestResults(
  lessonId: number,
  testId: number,
): TestResultsHookResult {
  const isAllowed = useCheckPermissions(Permission.TEST_CHECK);
  const results = useSelector(selectTestResults)[testId];
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.TEST_RESULTS_FETCH, lessonId, testId});
  }, [dispatch, lessonId, testId]);
  useEffect(() => {
    if (isAllowed) {
      if (!results) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, results]);

  return results instanceof Error
    ? {error: results, reload: dispatchFetchAction}
    : {results: !isAllowed ? false : results, reload: dispatchFetchAction};
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

  let errorInMap: AxiosError | true | undefined;

  const content = useMemo(() => {
    if (!knowledgeLevel || knowledgeLevel instanceof Error) {
      return undefined;
    } else {
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

      return content;
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

export type KnowledgeTestHookResult = {
  test?: TestInfo | null | false;
  error?: AxiosError;
  reload: SimpleCallback;
};

export function useKnowledgeTest(lessonId: number): KnowledgeTestHookResult {
  const isAllowed = useCheckPermissions(Permission.KNOWLEDGE_CONTENT_EDIT);
  const testId = useSelector(selectLessonTests)[lessonId];
  const tests = useSelector(selectKnowledgeTests);
  const dispatch = useDispatch();
  const dispatchFetchAction = useCallback(() => {
    dispatch({type: ActionType.KNOWLEDGE_TEST_FETCH, lessonId});
  }, [dispatch, lessonId]);
  useEffect(() => {
    if (isAllowed) {
      if (testId === undefined) {
        dispatchFetchAction();
      }
    }
  }, [dispatchFetchAction, isAllowed, lessonId, testId]);

  return testId instanceof Error
    ? {error: testId, reload: dispatchFetchAction}
    : {
        test: !isAllowed
          ? false
          : testId === null || testId === undefined
          ? testId
          : tests[testId],
        reload: dispatchFetchAction,
      };
}

type RevokeKnowledgeTestHookResult = (responseTest: TestInfo) => void;

export function useRevokeKnowledgeTest(
  courseId: number,
  lessonId: number,
): RevokeKnowledgeTestHookResult {
  const dispatch = useDispatch();

  return useCallback(
    (responseTest: TestInfo) => {
      dispatch({
        type: ActionType.KNOWLEDGE_TEST_REVOKE,
        responseTest,
        courseId,
        lessonId,
      });
    },
    [courseId, dispatch, lessonId],
  );
}

export type DeleteKnowledgeTestHookResult = (
  courseId: number,
  lessonId: number,
  testId: number,
) => void;

export function useDeleteKnowledgeTest(
  redirectUrl?: string,
  onDelete?: KnowledgeTestDeleteCallback,
  onError?: KnowledgeTestDeleteErrorCallback,
): DeleteKnowledgeTestHookResult {
  const dispatch = useDispatch();
  const redirectIfSupplied = useRedirect(redirectUrl);

  const deleteCallback = useCallback(
    (courseId, lessonId, testId) => {
      redirectIfSupplied();
      if (onDelete) {
        onDelete(courseId, lessonId, testId);
      }
    },
    [redirectIfSupplied, onDelete],
  );

  return useCallback(
    (courseId, lessonId, testId) => {
      dispatch({
        type: ActionType.KNOWLEDGE_TEST_DELETE_REQUEST,
        courseId,
        lessonId,
        testId,
        onDelete: deleteCallback,
        onError,
      });
    },
    [dispatch, deleteCallback, onError],
  );
}
