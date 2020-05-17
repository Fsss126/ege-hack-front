import {ContentBlock} from 'components/layout/ContentBlock';
import React from 'react';
import {ProfileInfo} from 'types/entities';

import Contacts from './Contacts';
import CoverImage from './CoverImage';

export type UserProfileProps = {
  accountInfo?: ProfileInfo;
  text?: string;
  children?: React.ReactNode;
};
const UserProfile: React.FC<UserProfileProps> = (props) => {
  const {accountInfo, text, children} = props;
  let photo, first_name, last_name, contacts;

  if (accountInfo) {
    ({
      vk_info: {photo, first_name, last_name},
      contacts,
    } = accountInfo);
  }

  const fullName =
    first_name && last_name ? `${first_name} ${last_name}` : undefined;

  return (
    <React.Fragment>
      <div className="user-profile__avatar-container">
        <div className="user-profile__avatar-wrap">
          <CoverImage
            src={photo}
            className="user-profile__avatar"
            placeholder
            round
            square
          />
        </div>
      </div>
      <ContentBlock className="user-profile__info">
        <div className="d-flex flex-column align-items-center">
          {fullName ? (
            <h2>{fullName}</h2>
          ) : (
            <h2 className="ph-item">
              <div className="ph-text" />
            </h2>
          )}
          {text && <div className="font-size-sm">{text}</div>}
          {contacts && <Contacts contacts={contacts} />}
          {children}
        </div>
      </ContentBlock>
    </React.Fragment>
  );
};

export default UserProfile;
