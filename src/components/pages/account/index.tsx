import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import AccountPage from './AccountPage';
import SettingsPage from './settings/SettingsPage';

const Account: React.FC<RouteComponentProps<any>> = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/settings`} component={SettingsPage} />
      <Route path={`${match.path}/`} component={AccountPage} />
    </Switch>
  );
};

export default Account;
