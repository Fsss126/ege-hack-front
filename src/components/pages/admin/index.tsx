import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Redirect, Route, Switch} from 'react-router-dom';

import Courses from './courses';
import Knowledge from './knowledge';
import Subjects from './subjects';
import Users from './users';

const Admin: React.FC<RouteComponentProps<any>> = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/courses`} component={Courses} />
      <Route path={`${match.path}/subjects`} component={Subjects} />
      <Route path={`${match.path}/users`} component={Users} />
      <Route path={`${match.path}/knowledge`} component={Knowledge} />
      <Route render={() => <Redirect to={`${match.path}/subjects/`} />} />
    </Switch>
  );
};

export default Admin;
