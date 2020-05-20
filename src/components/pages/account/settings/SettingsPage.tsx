import Page, {PageContent} from 'components/layout/Page';
import {useUserInfo} from 'modules/user/user.hooks';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountRole} from 'types/enums';

import {SettingsForm} from './SettingsForm';

const SettingsPage: React.FC<RouteComponentProps> = (props) => {
  const {location} = props;
  const {userInfo} = useUserInfo();

  const isLoaded = !!userInfo;

  return (
    <Page
      title="Аккаунт"
      className="account-page"
      isLoaded={isLoaded}
      withShimmer={true}
      location={location}
      requiredRoles={[AccountRole.PUPIL, AccountRole.TEACHER]}
    >
      <PageContent>
        {userInfo && <SettingsForm accountInfo={userInfo} />}
      </PageContent>
    </Page>
  );
};

export default SettingsPage;
