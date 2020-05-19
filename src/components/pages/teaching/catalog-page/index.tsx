import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {getIsFeatureEnabled, TOGGLE_FEATURES} from 'definitions/constants';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RouteComponentPropsWithParentProps} from 'types/routes';

import CourseCatalogPage from './CourseCatalogPage';
import SchedulePage from './SchedulePage';

const CoursesPage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {path, url} = props;
  const header = (
    <TabNavBlock title="Преподавание">
      <TabNav>
        <TabNavLink to={`${path}/list/`}>Список</TabNavLink>
        <TabNavLink
          to={`${path}/calendar/`}
          disabled={!getIsFeatureEnabled(TOGGLE_FEATURES.schedule)}
        >
          Календарь
        </TabNavLink>
      </TabNav>
    </TabNavBlock>
  );

  return (
    <Switch>
      <Route
        path={`${path}/list`}
        render={(props) => (
          <CourseCatalogPage path={path} url={url} {...props}>
            {header}
          </CourseCatalogPage>
        )}
      />
      {getIsFeatureEnabled(TOGGLE_FEATURES.schedule) && (
        <Route
          path={`${path}/calendar`}
          render={(props) => (
            <SchedulePage path={path} url={url} {...props}>
              {header}
            </SchedulePage>
          )}
        />
      )}
      <Route render={() => <Redirect to={`${url}/list/`} />} />
    </Switch>
  );
};

export default CoursesPage;
