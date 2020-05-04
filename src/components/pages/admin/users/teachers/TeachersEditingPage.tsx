import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountRole} from 'types/enums';

import AccountsManagementPage from '../AccountsManagementPage';

const TeachersEditingPage: React.FC<RouteComponentProps> = (props) => {
  return (
    <AccountsManagementPage
      {...props}
      role={AccountRole.TEACHER}
      title="Добавление прав преподавателя"
      successMessage="Пользователям добавлены права преподавателя"
    />
  );
};

export default TeachersEditingPage;
