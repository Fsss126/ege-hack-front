import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import CatalogPage from './catalog-page';
import TaskCreatingPage from './tasks/TaskCreatingPage';
import TaskEditingPage from './tasks/TaskEditingPage';
import ThemeCreatingPage from './themes/ThemeCreatingPage';
import ThemeEditingPage from './themes/ThemeEditingPage';

const Knowledge: React.FC<RouteComponentProps<any>> = ({match}) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/:subjectId?/:themeId?/theme/create`}
        component={ThemeCreatingPage}
      />
      <Route
        exact
        path={`${match.path}/:subjectId?/:themeId?/task/create`}
        component={TaskCreatingPage}
      />
      <Route
        exact
        path={`${match.path}/:subjectId/theme/:themeId/edit`}
        component={ThemeEditingPage}
      />
      <Route
        exact
        path={`${match.path}/:subjectId/task/:taskId/edit`}
        component={TaskEditingPage}
      />
      <Route
        exact
        path={[match.path, `${match.path}/list`]}
        render={(props) => (
          <CatalogPage path={match.path} url={match.url} {...props} />
        )}
      />
      <Route path={`${match.path}/:themeId`} component={Knowledge} />
    </Switch>
  );
};

export default Knowledge;
