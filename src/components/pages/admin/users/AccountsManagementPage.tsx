import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {RevokeRelatedDataCallback} from 'components/ui/Form';
import {useRevokeAccounts} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountsRoleReq, AddParticipantsReq} from 'types/dtos';
import {AccountInfo} from 'types/entities';
import {AccountRole, Permission} from 'types/enums';

import AccountsForm from './AccountsForm';

const returnLink = '..';

interface AccountsManagementPageProps extends RouteComponentProps {
  role: AccountRole;
  title: string;
  successMessage: string;
}

const AccountsManagementPage: React.FC<AccountsManagementPageProps> = (
  props,
) => {
  const {location, role, title, successMessage} = props;

  const getRequestData = useCallback(
    (accounts: string[]): AccountsRoleReq => {
      return {
        accounts,
        role,
      };
    },
    [role],
  );

  const createRequest = useCallback((requestData: AddParticipantsReq) => {
    return (APIRequest.post(
      '/accounts/management',
      requestData,
    ) as unknown) as Promise<AccountInfo[]>;
  }, []);

  const revokeAccounts: RevokeRelatedDataCallback<
    AccountInfo[]
  > = useRevokeAccounts(role);

  const isLoaded = true;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.PARTICIPANT_MANAGEMENT}
      title={title}
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <AccountsForm<AccountsRoleReq, AccountInfo>
              title={title}
              revokeRelatedData={revokeAccounts}
              cancelLink={returnLink}
              returnLink={returnLink}
              createRequest={createRequest}
              getRequestData={getRequestData}
              successMessage={successMessage}
              returnMessage="Назад"
              errorMessage="Ошибка при добавлении прав"
            />
          </ContentBlock>
        </PageContent>
      )}
    </Page>
  );
};

export default AccountsManagementPage;
