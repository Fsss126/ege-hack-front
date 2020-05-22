import {PageParentSection} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

import UsersGroupPage from '../UsersGroupPage';

type ModeratorsPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks?: SimpleCallback[];
};
const ModeratorsPage: React.FC<ModeratorsPageProps> = (props) => {
  return (
    <UsersGroupPage
      {...props}
      role={AccountRole.MODERATOR}
      addButtonText="Добавить модераторов"
      emptyPlaceholder="Нет модераторов"
      noMatchPlaceholder="Нет совпадающих модераторов"
    />
  );
};

export default ModeratorsPage;
