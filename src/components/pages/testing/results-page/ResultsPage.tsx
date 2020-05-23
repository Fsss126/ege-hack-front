import List, {ListItemRenderer} from 'components/common/List';
import ListItem from 'components/common/ListItem';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useTest, useTestState} from 'modules/testing/testing.hooks';
import React, {useCallback} from 'react';
import {Redirect} from 'react-router';
import {
  SanitizedTaskInfo,
  TestStateAwaitingInfo,
  TestStatePassedInfo,
} from 'types/entities';
import {RouteComponentPropsWithParentProps, TestPageParams} from 'types/routes';

import {CorrectBadge, IncorrectBadge} from '../task-page/Results';
import {ResultBar} from './ResultBar';

export const ResultsPage: React.FC<RouteComponentPropsWithParentProps<
  TestPageParams
>> = (props) => {
  const {
    match: {
      params: {testId: param_test, lessonId: param_lesson},
    },
    location,
  } = props;
  const testId = parseInt(param_test);
  const lessonId = parseInt(param_lesson);
  const courseId = parseInt(param_lesson);

  const {test, error: errorLoadingTest, reload: reloadTest} = useTest(testId);
  const {
    state,
    error: errorLoadingTestState,
    reload: reloadTestState,
  } = useTestState(testId, lessonId, courseId);

  const renderAnswer: ListItemRenderer<SanitizedTaskInfo> = useCallback(
    (task, renderProps, index) => {
      const {id} = task;
      const {answers, is_rated} =
        (state as Maybe<TestStateAwaitingInfo | TestStatePassedInfo>) || {};
      const {[id]: answer} = answers || {};
      const {is_correct} = answer || {};

      return (
        <ListItem
          key={id}
          item={answer}
          className="user"
          title={`Вопрос ${index + 1}`}
          selectable
          noOnClickOnAction
          preview={
            is_rated ? (
              is_correct ? (
                <CorrectBadge />
              ) : (
                <IncorrectBadge />
              )
            ) : undefined
          }
          link={`../${id}`}
          action={<i className="icon-btn icon-angle-right" />}
          {...renderProps}
        />
      );
    },
    [state],
  );

  const isLoaded = !!(test && state);

  let content;
  let title;

  if (test && state) {
    const {name, tasks, pass_criteria: minPercentage} = test;

    if (!state.is_completed) {
      const {last_task_id} = state;
      const firstTaskId = tasks[0].id;

      const taskId = last_task_id !== undefined ? last_task_id : firstTaskId;

      return <Redirect to={`../${taskId}/`} />;
    }

    const {percentage, passed, is_rated, answers} = state;
    const tasksCount = tasks.length;
    const correctCount = _.reduce(
      tasks,
      (result, task) => {
        const answer = answers[task.id];

        if (answer && answer.is_correct) {
          result++;
        }

        return result;
      },
      0,
    );

    title = `Результаты – ${name}`;
    content = (
      <PageContent
        parentSection={{name: 'Вернуться к уроку', url: '../../../'}}
      >
        <ContentBlock>
          <h2 className="test__test-title">{name}</h2>
          <h3 className="test-passage">
            {is_rated
              ? passed
                ? 'Тест пройден'
                : 'Тест не пройден'
              : 'Тест ожидает оценки'}
          </h3>
          {percentage !== undefined && (
            <ResultBar percentage={percentage} minPercentage={minPercentage} />
          )}
          {is_rated && (
            <div className="tasks-count">
              Вопросов: {correctCount}/{tasksCount}
            </div>
          )}
          <List renderItem={renderAnswer} plain className="test-results">
            {tasks}
          </List>
        </ContentBlock>
      </PageContent>
    );
  }

  return (
    <Page
      isLoaded={isLoaded}
      title={title}
      className="test-page test-results-page"
      errors={[errorLoadingTest, errorLoadingTestState]}
      reloadCallbacks={[reloadTest, reloadTestState]}
      location={location}
    >
      {content}
    </Page>
  );
};
