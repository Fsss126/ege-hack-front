import APIRequest from 'api';
import Form, {useForm, useFormValidityChecker} from 'components/ui/Form';
import FieldsContainer from 'components/ui/form/FieldsContainer';
import * as Input from 'components/ui/input';
import {useRevokeHomeworks} from 'hooks/selectors';
import React, {useCallback, useRef, useState} from 'react';
import {HomeworkAssessmentDtoReq} from 'types/dtos';
import {HomeworkInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

interface HomeworkData {
  mark: string;
  comment: string;
}

const INITIAL_FORM_DATA: HomeworkData = {
  mark: '',
  comment: '',
};

function getRequestData(formData: HomeworkData): HomeworkAssessmentDtoReq {
  const {mark, comment} = formData;

  return {
    mark: parseInt(mark),
    comment,
  };
}

interface HomeworkFormProps {
  homework: HomeworkInfo;
  cancelAssess: SimpleCallback;
}

const HomeworkForm: React.FC<HomeworkFormProps> = (props) => {
  const {homework, cancelAssess} = props;
  const {
    pupil: {id: pupilId},
    lesson_id: lessonId,
  } = homework;

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<HomeworkData>(
    formElementRef.current,
  );

  const createRequest = useCallback(
    (requestData: HomeworkAssessmentDtoReq): Promise<HomeworkInfo> =>
      APIRequest.patch(
        `/lessons/${lessonId}/homeworks/pupil/${pupilId}`,
        requestData,
      ),
    [lessonId, pupilId],
  );
  // const createRequest = useCallback(async (requestData) => ({...homework, ...requestData}), [homework]);

  const {formData, isValid, onInputChange, reset} = useForm((state) => {
    if (state || !homework) {
      return INITIAL_FORM_DATA;
    } else {
      const {mark, comment} = homework;

      return {
        comment: comment || '',
        mark: mark?.toString() || '',
      };
    }
  }, checkValidity);
  const {mark, comment} = formData;

  const onSubmit = useCallback(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const onSubmitted = useCallback((response, showSuccessMessage, reset) => {
    setIsSubmitted(true);
    // showSuccessMessage("Изменения сохранены", [
    //     {
    //         text: 'Ок'
    //     },
    //     {
    //         text: 'Продолжить',
    //         action: cancelAssess
    //     }
    // ]);
  }, []);

  const onError = useCallback((error, showErrorMessage, reloadCallback) => {
    showErrorMessage('Ошибка при выполнении запроса', [
      {
        text: 'Закрыть',
      },
      {
        text: 'Заново',
        action: reloadCallback,
      },
    ]);
  }, []);

  const revokeHomeworks = useRevokeHomeworks(lessonId);

  return (
    <Form<HomeworkInfo>
      ref={formElementRef}
      className="homework-form container p-0"
      isValid={isValid}
      reset={reset}
      onSubmit={onSubmit}
      onSubmitted={onSubmitted}
      revokeRelatedData={revokeHomeworks}
      onError={onError}
      onCancelClick={cancelAssess}
      cancelButtonText={isSubmitted ? 'Закрыть' : 'Отменить'}
    >
      <FieldsContainer>
        <Input.Input
          name="mark"
          value={mark}
          placeholder="Оценка"
          required
          type="number"
          onChange={onInputChange}
        />
        <Input.TextArea
          name="comment"
          placeholder="Комментарий"
          value={comment}
          maxLength={300}
          onChange={onInputChange}
        />
      </FieldsContainer>
    </Form>
  );
};

export default HomeworkForm;
