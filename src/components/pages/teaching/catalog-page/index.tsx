import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RouteComponentPropsWithParentProps} from 'types/routes';

import CourseCatalogPage from './CourseCatalogPage';

const CoursesPage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {path, url} = props;
  const header = (
    <TabNavBlock title="Преподавание">
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
          <CourseCatalogPage path={path} url={url} {...props}>
            {header}
          </CourseCatalogPage>
        )}
      />
      <Route render={() => <Redirect to={`${url}/list/`} />} />
    </Switch>
  );
};

export default CoursesPage;
