import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import CatalogPage from './catalog-page';
import CourseCreatingPage from './catalog-page/CourseCreatingPage';
import CourseEditingPage from './catalog-page/CourseEditingPage';

const Knowledge: React.FC<RouteComponentProps<any>> = ({match}) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/create`}
        component={CourseCreatingPage}
      />
      <Route exact path={`${match.path}/edit`} component={CourseEditingPage} />
      <Route
        exact
        path={[match.path, `${match.path}/list`]}
        render={(props) => <CatalogPage path={match.path} {...props} />}
      />
      <Route path={`${match.path}/:themeId`} component={Knowledge} />
    </Switch>
  );
};

export default Knowledge;
