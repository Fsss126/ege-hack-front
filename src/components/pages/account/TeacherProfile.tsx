import UserProfile from 'components/common/UserProfile';
import React from 'react';
import {TeacherAccountInfo} from 'types/entities';

export interface TeacherProfileProps {
  accountInfo?: TeacherAccountInfo;
}

export const TeacherProfile = (props: TeacherProfileProps) => {
  const {accountInfo} = props;

  return (
    <UserProfile accountInfo={accountInfo}>
      {accountInfo?.teacher.bio && (
        <div className="description-block font-size-sm align-self-lg-start">
          {accountInfo.teacher.bio}
        </div>
      )}
    </UserProfile>
  );
};
