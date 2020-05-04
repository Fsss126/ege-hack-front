import {PageParentSection} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

import UsersGroupPage from '../UsersGroupPage';

type AssistantsPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
};
const AssistantsPage: React.FC<AssistantsPageProps> = (props) => {
  return (
    <UsersGroupPage
      {...props}
      role={AccountRole.HELPER}
      addButtonText="Добавить ассистентов"
      emptyPlaceholder="Нет ассистентов"
      noMatchPlaceholder="Нет совпадающих ассистентов"
    />
  );
};

export default AssistantsPage;
