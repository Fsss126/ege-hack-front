import UserProfile from 'components/common/UserProfile';
import React from 'react';
import {PupilAccountInfo} from 'types/entities';

interface PupilProfileProps {
  accountInfo?: PupilAccountInfo;
}
export const PupilProfile = (props: PupilProfileProps) => {
  const {accountInfo} = props;

  let city, school, final_year;

  if (accountInfo) {
    ({city, school, final_year} = accountInfo.pupil);
  }

  return <UserProfile accountInfo={accountInfo as any} />;
};
