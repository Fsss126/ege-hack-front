import APIRequest from 'api';
import {
  SubmittedHandler,
  useForm,
  useFormHandleError,
  useFormHandleSubmitted,
  useFormState,
  useFormValidityChecker,
} from 'components/ui/Form';
import * as Input from 'components/ui/input';
import {useLoadingState} from 'components/ui/LoadingIndicator';
import MessagePopup from 'components/ui/MessagePopup';
import React, {useCallback, useEffect, useRef} from 'react';
import {FileInfo, UserAnswerDtoReq} from 'types/dtos';
import {AnswerType, UserAnswerInfo} from 'types/entities';

interface InputData {
  value: string | FileInfo[];
}

export interface AnswerInputProps {
  testId: number;
  taskId: number;
  type: AnswerType;
  value?: string | FileInfo;
  onSubmitted: SubmittedHandler<UserAnswerInfo>;
  submitButtonText?: string;
}

function getRequestData(data: InputData, taskId: number): UserAnswerDtoReq {
  const {value} = data;

  return {
    task_id: taskId,
    user_answer: value instanceof Array ? value[0]?.file_id : value,
  };
}

export const AnswerInput: React.FC<AnswerInputProps> = (props) => {
  const {type, value: initialValue, taskId, testId, onSubmitted} = props;

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

  const onSubmit = React.useCallback(() => {
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
  const state = useLoadingState(submitting, submitting === false);

  return (
    <form onChange={onChange} autoComplete="off">
      {type === AnswerType.TEXT && <Input.Input type="text" />}
      {type === AnswerType.NUMBER && <Input.Input type="number" />}
      {type === AnswerType.FILE && (
        <Input.FileInput
          name="value"
          filesName=""
          inputContent="Загрузить решение"
          value={value as FileInfo[]}
          maxFiles={1}
          initialFiles={initialValue ? [initialValue as FileInfo] : undefined}
          onChange={onInputChange}
          maxSizeBytes={1024 * 1024}
        />
      )}
      <MessagePopup ref={messagePopupRef} />
    </form>
  );
};
