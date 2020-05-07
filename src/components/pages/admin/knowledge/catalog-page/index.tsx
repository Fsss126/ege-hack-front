import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RouteComponentPropsWithParentProps} from 'types/routes';

import ThemeCatalogPage from './ThemeCatalogPage';

export type CoursesPageProps = RouteComponentPropsWithParentProps;
const CoursesPage: React.FC<CoursesPageProps> = (props) => {
  const {path, url} = props;
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
          <ThemeCatalogPage path={path} url={url} {...props}>
            {header}
          </ThemeCatalogPage>
        )}
      />
      <Route render={() => <Redirect to={`${path}/list/`} />} />
    </Switch>
  );
};

export default CoursesPage;
