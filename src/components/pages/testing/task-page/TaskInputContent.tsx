import APIRequest from 'api';
import {
  useForm,
  useFormHandleError,
  useFormHandleSubmitted,
  useFormState,
  useFormValidityChecker,
} from 'components/ui/Form';
import {useLoadingState} from 'components/ui/LoadingIndicator';
import MessagePopup from 'components/ui/MessagePopup';
import React, {useCallback, useRef} from 'react';
import {FileInfo, UserAnswerDtoReq} from 'types/dtos';
import {
  AnswerType,
  AnswerValue,
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateActiveInfo,
  UserAnswerInfo,
} from 'types/entities';

import {AnswerInput} from './AnswerInput';
import {TaskNav} from './TaskNav';
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

function getRequestData(data: InputData, taskId: number): UserAnswerDtoReq {
  const {value} = data;

  return {
    task_id: taskId,
    user_answer: value instanceof Array ? value[0]?.file_id : value,
  };
}

export const TaskInputContent: React.FC<TaskResultContentProps> = (props) => {
  const {testId, taskId, ...layoutProps} = props;
  const {task, test, state} = layoutProps;
  const {
    answers: {[taskId]: answer},
  } = state;
  const {
    answer: {type},
  } = task;

  let initialValue: AnswerValue | undefined;

  if (answer) {
    ({
      user_answer: {value: initialValue},
    } = answer);
  }

  const createRequest = useCallback(
    (requestData: UserAnswerDtoReq): Promise<UserAnswerInfo> =>
      APIRequest.put(`/knowledge/tests/${testId}/answer`, requestData),
    [testId],
  );

  const formElementRef = useRef(null);
  const checkValidity = useFormValidityChecker(
    formElementRef.current,
    undefined,
  );

  const {formData, isValid, onInputChange, reset} = useForm<InputData>(
    () =>
      ({
        value:
          type === AnswerType.FILE
            ? initialValue
              ? [initialValue]
              : []
            : initialValue || '',
      } as any),
    checkValidity,
  );

  const {value} = formData;

  const onSubmit = useCallback(() => {
    return createRequest(getRequestData(formData, taskId));
  }, [createRequest, formData, taskId]);

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

  const onSubmitted = useCallback(() => {
    // TODO
  }, []);

  const messagePopupRef = useRef<MessagePopup>(null);
  const messagePopup = messagePopupRef.current;

  const handleSubmitted = useFormHandleSubmitted({
    reset,
    onSubmitted,
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

  const nav = (
    <TaskNav
      task={task}
      test={test}
      state={state}
      loadingState={loadingState}
    />
  );

  return (
    <TaskPageLayout {...layoutProps} testId={testId} taskId={taskId} nav={nav}>
      <AnswerInput
        onInputChange={onInputChange}
        onFormChange={onChange}
        type={type}
        value={value}
      />
      <MessagePopup ref={messagePopupRef} />
    </TaskPageLayout>
  );
};
