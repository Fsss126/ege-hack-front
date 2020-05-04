import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Redirect, Route, Switch} from 'react-router-dom';

import CourseCatalogPage from './CourseCatalogPage';

export type CoursesPageProps = RouteComponentProps & {
  path: string;
};
const CoursesPage: React.FC<CoursesPageProps> = (props) => {
  const {path} = props;
  const header = (
    <TabNavBlock title="Курсы">
      <TabNav>
        <TabNavLink to={`${path}/list/`}>Список</TabNavLink>
        <TabNavLink to={`${path}/calendar/`} disabled>
          Календарь
        </TabNavLink>
      </TabNav>
    </TabNavBlock>
  );

  return (
    <Switch>
      <Route
        path={[`${path}/list`, `${path}/calendar`]}
        render={(props) => (
          <CourseCatalogPage path={path} {...props}>
            {header}
          </CourseCatalogPage>
        )}
      />
      <Route render={() => <Redirect to={`${path}/list/`} />} />
    </Switch>
  );
};

export default CoursesPage;
