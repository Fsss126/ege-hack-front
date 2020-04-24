import {NotFoundErrorPage} from 'components/ErrorPage';
import Page, {PageContent} from 'components/Page';
import {useTest, useTestState, useTestTask} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentPropsWithPath, TestTaskPageParams} from 'types/routes';

import {TaskPageContent} from './TaskPageContent';

export const TaskPage: React.FC<RouteComponentPropsWithPath<
  TestTaskPageParams
>> = (props) => {
  const {
    match: {
      params: {testId: param_test, taskId: param_question},
    },
    path: root,
    location,
  } = props;
  const testId = parseInt(param_test);
  const taskId = parseInt(param_question);

  const {test} = useTest(testId);
  const {task, error, reload} = useTestTask(testId, taskId);
  const {
    state,
    error: errorLoadingTestState,
    reload: reloadTestState,
  } = useTestState(testId);

  if (test && task && state) {
    const {name} = test;
    const {order} = task;

    return (
      <Page
        isLoaded={true}
        title={`Вопрос ${order + 1} – ${name}`}
        className="test-page test-task-page"
        location={location}
      >
        <PageContent
          parentSection={{name: 'Вернуться к уроку', url: '../../../'}}
        >
          <TaskPageContent
            key={location.pathname}
            testId={testId}
            taskId={taskId}
            test={test}
            state={state}
            task={task}
          />
        </PageContent>
      </Page>
    );
  } else if (error) {
    return (
      <NotFoundErrorPage
        message="Вопрос теста не найден"
        url={root}
        text="Вернуться к уроку"
      />
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};
