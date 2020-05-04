import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountRole} from 'types/enums';

import AccountsManagementPage from '../AccountsManagementPage';

const ModeratorsEditingPage: React.FC<RouteComponentProps> = (props) => {
  return (
    <AccountsManagementPage
      {...props}
      role={AccountRole.MODERATOR}
      title="Добавление прав модератора"
      successMessage="Пользователям добавлены права модератора"
    />
  );
};

export default ModeratorsEditingPage;
