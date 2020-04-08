import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import CatalogPage from './catalog-page';
import CoursePage from './course-page';
import LessonPage from './lesson-page';

const Teaching: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <Switch>
      <Route
        path={`${match.path}/:courseId(\\d+)/:lessonId(\\d+)`}
        render={(props) => <LessonPage path={match.path} {...props} />}
      />
      <Route
        path={`${match.path}/:courseId(\\d+)`}
        render={(props) => <CoursePage path={match.path} {...props} />}
      />
      <Route render={(props) => <CatalogPage path={match.path} {...props} />} />
    </Switch>
  );
};

export default Teaching;
