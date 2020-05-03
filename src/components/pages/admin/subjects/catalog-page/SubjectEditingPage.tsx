import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import {useSubject} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {SubjectDtoReq} from 'types/dtos';
import {SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';

import SubjectForm from './SubjectForm';

const SubjectEditingPage: React.FC<RouteComponentProps<{subjectId: string}>> = (
  props,
) => {
  const {
    match: {
      params: {subjectId: param_subject},
    },
    location,
  } = props;
  const subjectId = parseInt(param_subject);

  const createRequest = React.useCallback(
    (requestData: SubjectDtoReq): Promise<SubjectInfo> =>
      APIRequest.put(`/subjects/${subjectId}`, requestData),
    [subjectId],
  );

  const {
    subject,
    error: errorLoadingSubject,
    reload: reloadSubject,
  } = useSubject(subjectId);

  const returnLink = `/admin/subjects/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage) => {
      showSuccessMessage('Изменения сохранены', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к курсу',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = !!subject;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.SUBJECT_EDIT}
      className="subject-form-page"
      title="Изменение предмента"
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <div className="layout__content-block">
            <SubjectForm
              subject={subject}
              title="Изменение предмета"
              errorMessage="Ошибка при сохранении изменений"
              cancelLink={returnLink}
              createRequest={createRequest}
              onSubmitted={onSubmitted}
            />
          </div>
        </PageContent>
      )}
    </Page>
  );
};

export default SubjectEditingPage;
