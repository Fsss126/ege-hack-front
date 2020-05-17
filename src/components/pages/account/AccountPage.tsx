import UserProfile from 'components/common/UserProfile';
import Page, {PageContent} from 'components/layout/Page';
import {useUserInfo} from 'hooks/selectors';
import {
  isPupilAccountInfo,
  isTeacherAccountInfo,
} from 'modules/userInfo/userInfo.utils';
import React from 'react';
import {RouteComponentProps} from 'react-router';

import {PupilProfile} from './PupilProfile';
import {TeacherProfile} from './TeacherProfile';

const AccountPage: React.FC<RouteComponentProps> = (props) => {
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
    >
      <PageContent>
        {userInfo ? (
          isTeacherAccountInfo(userInfo) ? (
            <TeacherProfile accountInfo={userInfo} />
          ) : isPupilAccountInfo(userInfo) ? (
            <PupilProfile accountInfo={userInfo} />
          ) : (
            <UserProfile accountInfo={userInfo} />
          )
        ) : (
          <UserProfile accountInfo={userInfo} />
        )}
      </PageContent>
    </Page>
  );
};

export default AccountPage;
