import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import CatalogPage from './catalog-page';
import CoursePage from './course-page';
import LessonPage from './lesson-page';

const MyCourses: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <Switch>
      <Route
        path={`${match.path}/:courseId/:lessonId`}
        component={LessonPage}
      />
      <Route path={`${match.path}/:id`} component={CoursePage} />
      <Route exact path={`${match.path}`} component={CatalogPage} />
    </Switch>
  );
};

export default MyCourses;
