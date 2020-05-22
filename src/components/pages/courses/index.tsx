import {getIsFeatureEnabled, TOGGLE_FEATURES} from 'definitions/constants';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import Testing from '../testing';
import CatalogPage from './catalog-page';
import CoursePage from './course-page';
import LessonPage from './lesson-page';
import SchedulePage from './schedule-page';

const MyCourses: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <Switch>
      {getIsFeatureEnabled(TOGGLE_FEATURES.schedule) && (
        <Route
          exact
          path={`${match.path}/schedule`}
          render={(props) => (
            <SchedulePage path={match.path} url={match.url} {...props} />
          )}
        />
      )}
      <Route
        path={`${match.path}/:courseId/:lessonId/test`}
        component={Testing}
      />
      <Route
        path={`${match.path}/:courseId/:lessonId`}
        component={LessonPage}
      />
      <Route path={`${match.path}/:courseId`} component={CoursePage} />
      <Route exact path={`${match.path}`} component={CatalogPage} />
    </Switch>
  );
};

export default MyCourses;
