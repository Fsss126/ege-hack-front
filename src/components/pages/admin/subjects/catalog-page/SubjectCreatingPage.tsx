import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {SubjectDtoReq} from 'types/dtos';
import {SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';

import SubjectForm from './SubjectForm';

const createRequest = (requestData: SubjectDtoReq): Promise<SubjectInfo> =>
  APIRequest.post('/subjects', requestData) as Promise<SubjectInfo>;

const returnLink = '/admin/';

const SubjectCreatingPage: React.FC<RouteComponentProps> = (props) => {
  const {location} = props;

  const onSubmitted = React.useCallback(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage('Предмет создан', [
        {
          text: 'Новый предмет',
          action: reset,
        },
        {
          text: 'Вернуться к предметам',
          url: returnLink,
        },
      ]);
    },
    [],
  );

  return (
    <Page
      isLoaded={true}
      requiredPermissions={Permission.SUBJECT_EDIT}
      className="course-form-page"
      title="Создание предмета"
      location={location}
    >
      <PageContent>
        <div className="layout__content-block">
          <SubjectForm
            title="Новый предмет"
            errorMessage="Ошибка при создании предмета"
            cancelLink={returnLink}
            createRequest={createRequest}
            onSubmitted={onSubmitted}
          />
        </div>
      </PageContent>
    </Page>
  );
};

export default SubjectCreatingPage;
