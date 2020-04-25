import {addMockedTestAnswerResponses} from 'api/mocks';
import {
  FormSubmitHandler,
  useForm,
  useFormHandleError,
  useFormHandleSubmitted,
  useFormState,
  useFormValidityChecker,
} from 'components/ui/Form';
import {useLoadingState} from 'components/ui/LoadingIndicator';
import MessagePopup from 'components/ui/MessagePopup';
import {useCompleteTest, useSaveAnswer} from 'hooks/selectors';
import React, {useCallback, useRef} from 'react';
import {FileInfo} from 'types/dtos';
import {
  AnswerType,
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestAnswerValue,
  TestStateActiveInfo,
} from 'types/entities';
import {Deferred} from 'utils/promiseHelper';

import NavigationBlocker from '../../../common/NavigationBlocker';
import {AnswerInput} from './AnswerInput';
import {LinkClickCallback, TaskNav} from './TaskNav';
import {TaskPageLayout} from './TaskPageLayout';

interface InputData {
  value: string | FileInfo[];
}

interface TaskResultContentProps {
  testId: number;
  taskId: number;
  test: SanitizedTestInfo;
  state: TestStateActiveInfo;
  task: SanitizedTaskInfo;
}

function getValue(data: InputData) {
  const {value} = data;

  return value instanceof Array ? value[0] : value;
}

function getRequestData(data: InputData): string {
  const value = getValue(data);

  return typeof value === 'object' ? value?.file_id : value;
}

export const TaskInputContent: React.FC<TaskResultContentProps> = (props) => {
  const {testId, taskId, ...layoutProps} = props;
  const {task, test, state} = layoutProps;
  const {
    answers: {[taskId]: answer},
  } = state;
  const {
    order,
    answer: {type},
  } = task;
  const tasksCount = test.tasks.length;
  const isLastTask = order === tasksCount - 1;

  let initialValue: TestAnswerValue | undefined;

  if (answer) {
    ({
      user_answer: {value: initialValue},
    } = answer);
  }

  const formElementRef = useRef(null);
  const checkValidity = useFormValidityChecker(
    formElementRef.current,
    undefined,
  );

  const {formData, onInputChange, reset} = useForm<InputData>(
    () =>
      ({
        value:
          type === AnswerType.FILE
            ? initialValue
              ? [initialValue]
              : []
            : initialValue
            ? initialValue.toString()
            : '',
      } as any),
    checkValidity,
  );

  const {value} = formData;

  const saveAnswerCallback = useSaveAnswer();
  const completeCallback = useCompleteTest();

  const onSubmit = useCallback((promise: Promise<any>) => promise, []);

  const submitAnswer = useCallback(
    (complete: boolean, navigateTo: string) => {
      const answer = getRequestData(formData);
      const deferred = new Deferred<any>();

      addMockedTestAnswerResponses(task, getValue(formData));

      saveAnswerCallback({
        testId,
        taskId,
        answer,
        complete,
        navigateTo,
        onSuccess: deferred.resolve,
        onError: deferred.reject,
      });

      return deferred.promise;
    },
    [formData, saveAnswerCallback, taskId, testId, task],
  );

  const submitTest = useCallback(
    (navigateTo: string) => {
      const deferred = new Deferred<any>();

      completeCallback({
        testId,
        navigateTo,
        onSuccess: deferred.resolve,
        onError: deferred.reject,
      });

      return deferred.promise;
    },
    [completeCallback, testId],
  );

  const onError = React.useCallback(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage('Ошибка при сохранении ответа', [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
      console.log(error);
    },
    [],
  );

  const messagePopupRef = useRef<MessagePopup>(null);
  const messagePopup = messagePopupRef.current;

  const handleSubmitted = useFormHandleSubmitted({
    reset,
    messagePopup,
  });

  const handleError = useFormHandleError({
    onError,
    messagePopup,
  });

  const {submitting, handleSubmit, hasChanged, onChange} = useFormState(
    onSubmit,
    handleSubmitted,
    handleError,
  );
  const loadingState = useLoadingState(submitting, submitting === false);

  const onNextClick: LinkClickCallback = useCallback(
    (link, event) => {
      if (!hasChanged) {
        if (isLastTask) {
          event.preventDefault();
          event.stopPropagation();

          handleSubmit(submitTest(link));
        }
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      handleSubmit(submitAnswer(isLastTask, link));
    },
    [handleSubmit, hasChanged, isLastTask, submitAnswer, submitTest],
  );

  const onPrevClick: LinkClickCallback = useCallback(
    (link, event) => {
      if (!hasChanged) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handleSubmit(submitAnswer(false, link));
    },
    [handleSubmit, hasChanged, submitAnswer],
  );

  const nav = (
    <TaskNav
      task={task}
      test={test}
      state={state}
      loadingState={loadingState}
      onNextClick={onNextClick}
      onPrevClick={onPrevClick}
    />
  );

  return (
    <TaskPageLayout {...layoutProps} testId={testId} taskId={taskId} nav={nav}>
      <AnswerInput
        ref={formElementRef}
        onInputChange={onInputChange}
        onFormChange={onChange}
        type={type}
        value={value}
      />
      {hasChanged && <NavigationBlocker blockHistoryChange={false} />}
      <MessagePopup ref={messagePopupRef} />
    </TaskPageLayout>
  );
};