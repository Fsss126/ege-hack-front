import UserProfile from 'components/common/UserProfile';
import Page, {PageContent} from 'components/layout/Page';
import {useUserInfo} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';

const AccountPage: React.FC<RouteComponentProps> = (props) => {
  const {location} = props;
  const {userInfo} = useUserInfo();
  let photo, first_name, last_name;

  if (userInfo) {
    ({
      vk_info: {photo, first_name, last_name},
    } = userInfo);
  }

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
        <UserProfile
          first_name={first_name}
          last_name={last_name}
          photo={photo}
        />
      </PageContent>
    </Page>
  );
};

export default AccountPage;
