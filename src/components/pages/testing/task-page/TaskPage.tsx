import Page, {PageContent} from 'components/layout/Page';
import {
  useTest,
  useTestState,
  useTestTask,
} from 'modules/testing/testing.hooks';
import React from 'react';
import {
  RouteComponentPropsWithParentProps,
  TestTaskPageParams,
} from 'types/routes';

import {TaskPageContent} from './TaskPageContent';

export const TaskPage: React.FC<RouteComponentPropsWithParentProps<
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
    location,
  } = props;
  const testId = parseInt(param_test);
  const taskId = parseInt(param_question);
  const lessonId = parseInt(param_lesson);
  const courseId = parseInt(param_course);

  const {test} = useTest(testId);
  const {task, error: errorLoadingTask, reload: reloadTask} = useTestTask(
    testId,
    taskId,
  );
  const {
    state,
    error: errorLoadingTestState,
    reload: reloadTestState,
  } = useTestState(testId, lessonId, courseId);

  const isLoaded = !!(test && task && state);

  let title;
  let content;

  if (test && task && state) {
    const {name} = test;
    const {order} = task;
    const {is_completed: isCompleted} = state;

    title = `Вопрос ${order + 1} – ${name}`;
    content = (
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
    );
  }

  return (
    <Page
      isLoaded={isLoaded}
      title={title}
      className="test-page test-task-page"
      location={location}
      errors={[errorLoadingTask, errorLoadingTestState]}
      reloadCallbacks={[reloadTask, reloadTestState]}
      notFoundPageProps={{
        message: 'Вопрос теста не найден',
        url: '../../../',
        text: 'Вернуться к уроку',
      }}
    >
      {content}
    </Page>
  );
};
