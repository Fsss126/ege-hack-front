import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Route, Switch} from 'react-router-dom';

import {ResultsPage} from './results-page/ResultsPage';
import {StartPage} from './start-page/StartPage';
import {TaskPage} from './task-page/TaskPage';

const Testing: React.FC<RouteComponentProps> = ({match}) => {
  return (
    <Switch>
      <Route
        path={`${match.path}/:testId/start`}
        render={(props) => (
          <StartPage path={match.path} url={match.url} {...props} />
        )}
      />
      <Route
        path={`${match.path}/:testId/results`}
        render={(props) => (
          <ResultsPage path={match.path} url={match.url} {...props} />
        )}
      />
      <Route
        path={`${match.path}/:testId/:taskId`}
        render={(props) => (
          <TaskPage path={match.path} url={match.url} {...props} />
        )}
      />
      <Route
        exact
        path={`${match.path}`}
        render={(props) => (
          <StartPage path={match.path} url={match.url} {...props} />
        )}
      />
    </Switch>
  );
};

export default Testing;
