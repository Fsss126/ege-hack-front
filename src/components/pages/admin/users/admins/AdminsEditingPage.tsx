import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import {RevokeRelatedDataCallback} from 'components/ui/Form';
import {useRevokeParticipants} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {AddParticipantsReq} from 'types/dtos';
import {CourseParticipantInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams} from 'types/routes';

import AccountsForm from '../AccountsForm';

function getRequestData(accounts: string[]): AddParticipantsReq {
  return {
    accounts,
  };
}

const returnLink = '..';

const AdminsEditingPage: React.FC<RouteComponentProps<CoursePageParams>> = (
  props,
) => {
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
            <AccountsForm<AddParticipantsReq, CourseParticipantInfo>
              title="Добавление учеников"
              revokeRelatedData={revokeParticipants}
              cancelLink={returnLink}
              returnLink={returnLink}
              createRequest={createRequest}
              getRequestData={getRequestData}
              successMessage="Ученики добавлены"
              returnMessage="Вернуться к курсу"
              errorMessage="Ошибка при добавлении учеников"
            />
          </div>
        </PageContent>
      )}
    </Page>
  );
};

export default AdminsEditingPage;