import {PageParentSection} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {AccountInfo} from 'types/entities';
import {AccountRole} from 'types/enums';
import {SimpleCallback} from 'types/utility/common';

import UsersGroupPage from '../UsersGroupPage';

type TeachersPageProps = RouteComponentProps & {
  parentSection?: PageParentSection;
  accounts?: AccountInfo[];
  isLoaded: boolean;
  children: React.ReactNode;
  errors?: any[];
  reloadCallbacks?: SimpleCallback[];
};
const TeachersPage: React.FC<TeachersPageProps> = (props) => {
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
