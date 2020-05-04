import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import Page, {PageContent} from 'components/layout/Page';
import {useTest, useTestState, useTestTask} from 'hooks/selectors';
import React from 'react';
import {RouteComponentPropsWithPath, TestTaskPageParams} from 'types/routes';

import {TestStatus} from '../../../../types/dtos';
import {TaskPageContent} from './TaskPageContent';

export const TaskPage: React.FC<RouteComponentPropsWithPath<
  TestTaskPageParams
>> = (props) => {
  const {
    match: {
      params: {
        testId: param_test,
        taskId: param_question,
        lessonId: param_lesson,
        courseId: param_course,
      },
    },
    path: root,
    location,
  } = props;
  const testId = parseInt(param_test);
  const taskId = parseInt(param_question);
  const lessonId = parseInt(param_lesson);
  const courseId = parseInt(param_course);

  const {test} = useTest(testId);
  const {task, error, reload} = useTestTask(testId, taskId);
  const {
    state,
    error: errorLoadingTestState,
    reload: reloadTestState,
  } = useTestState(testId, lessonId, courseId);

  if (test && task && state) {
    const {name} = test;
    const {order} = task;
    const {status} = state;

    const isCompleted = status === TestStatus.COMPLETED;

    return (
      <Page
        isLoaded={true}
        title={`Вопрос ${order + 1} – ${name}`}
        className="test-page test-task-page"
        location={location}
      >
        <PageContent
          parentSection={
            isCompleted
              ? {name: 'Вернуться к результатам', url: '../results/'}
              : {name: 'Вернуться к уроку', url: '../../../'}
          }
        >
          <TaskPageContent
            key={location.pathname}
            testId={testId}
            taskId={taskId}
            lessonId={lessonId}
            courseId={courseId}
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
        location={location}
      />
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};
