import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import Form, {
  ErrorHandler,
  FormSubmitHandler,
  RevokeRelatedDataCallback,
  SubmittedHandler,
  useForm,
  useFormValidityChecker,
} from 'components/ui/Form';
import * as Input from 'components/ui/input';
import {useRevokeParticipants} from 'hooks/selectors';
import React, {useCallback, useRef} from 'react';
import {RouteComponentProps} from 'react-router';
import {AddParticipantsReq} from 'types/dtos';
import {CourseParticipantInfo} from 'types/entities';
import {Permission} from 'types/enums';

interface ParticipantsFormData {
  accounts: string;
}

const INITIAL_FORM_DATA: ParticipantsFormData = {
  accounts: '',
};

function getRequestData(formData: ParticipantsFormData): AddParticipantsReq {
  const {accounts} = formData;

  return {
    accounts: accounts.split(/\s/),
  };
}

const returnLink = '..';

const ParticipantsEditingPage: React.FC<RouteComponentProps<{
  courseId: string;
}>> = (props) => {
  const {
    match: {
      params: {courseId: param_course},
    },
    location,
  } = props;
  const courseId = parseInt(param_course);

  const createRequest = useCallback(
    (requestData: AddParticipantsReq) => {
      return (APIRequest.post(
        `/courses/${courseId}/participants`,
        requestData,
      ) as unknown) as Promise<CourseParticipantInfo[]>;
    },
    [courseId],
  );

  const formElementRef = useRef<HTMLFormElement>(null);

  const checkValidity = useFormValidityChecker<ParticipantsFormData>(
    formElementRef.current,
  );

  const {formData, isValid, onInputChange, reset} = useForm<
    ParticipantsFormData
  >(() => INITIAL_FORM_DATA, checkValidity);
  const {accounts} = formData;

  const onSubmit = useCallback<
    FormSubmitHandler<[undefined], Promise<CourseParticipantInfo[]>>
  >(() => {
    return createRequest(getRequestData(formData));
  }, [formData, createRequest]);

  const onSubmitted = useCallback<SubmittedHandler<CourseParticipantInfo[]>>(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage('Изменения сохранены', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к ученикам',
          url: returnLink,
        },
      ]);
    },
    [],
  );

  const onError = React.useCallback<ErrorHandler>(
    (error, showErrorMessage, reloadCallback) => {
      showErrorMessage('Ошибка при выполнении запроса', [
        {
          text: 'Закрыть',
        },
        {
          text: 'Заново',
          action: reloadCallback,
        },
      ]);
    },
    [],
  );

  const revokeParticipants: RevokeRelatedDataCallback<
    CourseParticipantInfo[]
  > = useRevokeParticipants(courseId);

  const isLoaded = true;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.PARTICIPANT_MANAGEMENT}
      className="participants-form-page"
      title="Добавление учеников"
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <div className="layout__content-block">
            <Form<CourseParticipantInfo[]>
              ref={formElementRef}
              title="Добавление учеников"
              className="course-form container p-0"
              isValid={isValid}
              reset={reset}
              onSubmit={onSubmit}
              onSubmitted={onSubmitted}
              revokeRelatedData={revokeParticipants}
              onError={onError}
              cancelLink={returnLink}
            >
              <Input.TextArea
                name="accounts"
                required
                placeholder="Ссылки на страницы"
                value={accounts}
                onChange={onInputChange}
              />
            </Form>
          </div>
        </PageContent>
      )}
    </Page>
  );
};

export default ParticipantsEditingPage;
