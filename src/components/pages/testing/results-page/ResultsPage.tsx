import List, {ListItemRenderer} from 'components/common/List';
import ListItem from 'components/common/ListItem';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useTest, useTestState} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Redirect} from 'react-router';
import {TestStatus} from 'types/dtos';
import {TestStatePassedAnswerInfo} from 'types/entities';
import {RouteComponentPropsWithPath, TestPageParams} from 'types/routes';

import {CorrectBadge, IncorrectBadge} from '../task-page/Results';
import {ResultBar} from './ResultBar';

export const ResultsPage: React.FC<RouteComponentPropsWithPath<
  TestPageParams
>> = (props) => {
  const {
    match: {
      params: {
        testId: param_test,
        lessonId: param_lesson,
        courseId: param_course,
      },
    },
    path: root,
    location,
  } = props;
  const testId = parseInt(param_test);
  const lessonId = parseInt(param_lesson);
  const courseId = parseInt(param_lesson);

  const {test} = useTest(testId);
  const {
    state,
    error: errorLoadingTestState,
    reload: reloadTestState,
  } = useTestState(testId, lessonId, courseId);

  const renderAnswer: ListItemRenderer<TestStatePassedAnswerInfo> = useCallback(
    (answer, renderProps, index) => {
      const {is_correct, task_id: id} = answer;

      return (
        <ListItem
          key={id}
          item={answer}
          className="user"
          title={`Вопрос ${index + 1}`}
          selectable
          noOnClickOnAction
          preview={is_correct ? <CorrectBadge /> : <IncorrectBadge />}
          link={`../${id}`}
          action={<i className="icon-btn icon-angle-right" />}
          {...renderProps}
        />
      );
    },
    [],
  );

  if (test && state) {
    const {name, tasks, percentage: minPercentage} = test;

    if (state.status !== TestStatus.COMPLETED) {
      const {last_task_id} = state;

      return <Redirect to={`../${last_task_id}/`} />;
    }

    const {percentage, passed, answers} = state;
    const tasksCount = tasks.length;
    let correctCount = 0;
    const answersList = tasks.map(({id}) => {
      const answer = answers[id];

      if (answer && answer.is_correct) {
        correctCount++;
      }
      return answer || null;
    });

    return (
      <Page
        isLoaded={true}
        title={`Результаты – ${name}`}
        className="test-page test-results-page"
        location={location}
      >
        <PageContent
          parentSection={{name: 'Вернуться к уроку', url: '../../../'}}
        >
          <ContentBlock>
            <h2 className="test__test-title">{name}</h2>
            <h3 className="test-passage">
              {passed ? 'Тест пройден' : 'Тест не пройден'}
            </h3>
            <ResultBar percentage={percentage} minPercentage={minPercentage} />
            <div className="tasks-count">
              Вопросов: {correctCount}/{tasksCount}
            </div>
            <List renderItem={renderAnswer} plain className="test-results">
              {answersList}
            </List>
          </ContentBlock>
        </PageContent>
      </Page>
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};
