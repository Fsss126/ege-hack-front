import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountRole} from 'types/enums';

import AccountsManagementPage from '../AccountsManagementPage';

const AssistantsEditingPage: React.FC<RouteComponentProps> = (props) => {
  return (
    <AccountsManagementPage
      {...props}
      role={AccountRole.HELPER}
      title="Добавление прав ассистента"
      successMessage="Пользователям добавлены права ассистента"
    />
  );
};

export default AssistantsEditingPage;
