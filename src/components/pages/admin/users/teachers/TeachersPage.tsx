import {PageParentSection} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';

import UsersGroupPage from '../UsersGroupPage';

type ModeratorsPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
};
const TeachersPage: React.FC<ModeratorsPageProps> = (props) => {
  return (
    <UsersGroupPage
      {...props}
      role={AccountRole.TEACHER}
      addButtonText="Добавить преподавателей"
      emptyPlaceholder="Нет преподавателей"
      noMatchPlaceholder="Нет совпадающих преподавателей"
    />
  );
};

export default TeachersPage;
