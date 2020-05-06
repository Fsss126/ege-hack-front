import {PageParentSection} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

import UsersGroupPage from '../UsersGroupPage';

type AdminsPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks?: SimpleCallback[];
};
const AdminsPage: React.FC<AdminsPageProps> = (props) => {
  return (
    <UsersGroupPage
      {...props}
      role={AccountRole.ADMIN}
      addButtonText="Добавить администраторов"
      emptyPlaceholder="Нет администраторов"
      noMatchPlaceholder="Нет совпадающих администраторов"
    />
  );
};

export default AdminsPage;
