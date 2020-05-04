import {ContentBlock} from 'components/layout/ContentBlock';
import React from 'react';
import {ContactInfo, VkUserInfo} from 'types/entities';

import Contacts from './Contacts';
import CoverImage from './CoverImage';

export type UserProfileProps = Partial<
  Pick<VkUserInfo, 'first_name' | 'last_name' | 'photo'>
> & {
  contacts?: ContactInfo;
  about?: React.ReactNode;
  role?: React.ReactNode;
};
const UserProfile: React.FC<UserProfileProps> = (props) => {
  const {first_name, last_name, photo, contacts, about, role} = props;
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
          {role && <div className="font-size-sm">{role}</div>}
          {contacts && <Contacts contacts={contacts} />}
          <div className="description-block font-size-sm align-self-lg-start">
            {about}
          </div>
        </div>
      </ContentBlock>
    </React.Fragment>
  );
};

export default UserProfile;
