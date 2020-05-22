import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountRole} from 'types/enums';

import AccountsManagementPage from '../AccountsManagementPage';

const AdminsEditingPage: React.FC<RouteComponentProps> = (props) => {
  return (
    <AccountsManagementPage
      {...props}
      role={AccountRole.ADMIN}
      title="Добавление прав администратора"
      successMessage="Пользователям добавлены права администратора"
    />
  );
};

export default AdminsEditingPage;
