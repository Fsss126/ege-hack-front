import React from 'react';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';

import AdminsEditingPage from './admins/AdminsEditingPage';
import AssistantsEditingPage from './assistants/AssistantsEditingPage';
import ModeratorsEditingPage from './moderators/ModeratorsEditingPage';
import TeachersEditingPage from './teachers/TeachersEditingPage';
import UsersPage from './UsersPage';

const Users: React.FC<RouteComponentProps> = (props) => {
  const {match} = props;

  return (
    <Switch>
      <Route
        path={`${match.path}/teachers/edit`}
        component={TeachersEditingPage}
      />
      <Route
        path={`${match.path}/assistants/edit`}
        component={AssistantsEditingPage}
      />
      <Route path={`${match.path}/admins/edit`} component={AdminsEditingPage} />
      <Route
        path={`${match.path}/moderators/edit`}
        component={ModeratorsEditingPage}
      />
      <Route path={`${match.path}`} component={UsersPage} />
    </Switch>
  );
};

export default Users;
