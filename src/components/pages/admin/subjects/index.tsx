import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import CatalogPage from './catalog-page';
import SubjectCreatingPage from './catalog-page/SubjectCreatingPage';
import SubjectEditingPage from './catalog-page/SubjectEditingPage';

const Subjects: React.FC<RouteComponentProps<any>> = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.path}/create`} component={SubjectCreatingPage} />
      <Route
        path={`${match.path}/:subjectId/edit`}
        component={SubjectEditingPage}
      />
      <Route exact path={[match.path]} component={CatalogPage} />
      {/*<Route path={`${match.path}/:courseId/:lessonId`} component={LessonPage}/>*/}
    </Switch>
  );
};

export default Subjects;
