import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RouteComponentPropsWithParentProps} from 'types/routes';

import CatalogPage from './CatalogPage';

export type CoursesPageProps = RouteComponentPropsWithParentProps;
const CoursesPage: React.FC<CoursesPageProps> = (props) => {
  const {path, url} = props;

  return (
    <Switch>
      <Route
        path={[`${path}/list`, `${path}/calendar`]}
        render={(props) => <CatalogPage path={path} url={url} {...props} />}
      />
      <Route render={() => <Redirect to={`${path}/list/`} />} />
    </Switch>
  );
};

export default CoursesPage;
