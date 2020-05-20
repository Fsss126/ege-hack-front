import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import {useHomeworks, useKnowledgeTest, useLesson} from 'hooks/selectors';
import {useTeacherCourse} from 'modules/courses/courses.hooks';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {
  LessonPageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';

import AssignmentPage from './assignment/AssignmentPage';
import HomeworksPage from './homeworks/HomeworksPage';
import TestResultsPage from './test-results/TestResultsPage';
import TestPage from './test/TestPage';

const LessonPage: React.FC<RouteComponentPropsWithParentProps<
  LessonPageParams
>> = (props) => {
  const {path, url, match} = props;
  const {
    params: {courseId: param_course, lessonId: param_lesson},
  } = match;
  const courseId = parseInt(param_course);
  const lessonId = parseInt(param_lesson);

  const {lesson, error: errorLoadingLesson, reload: reloadLesson} = useLesson(
    courseId,
    lessonId,
  );
  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useTeacherCourse(courseId);
  const {
    homeworks,
    error: errorLoadingHomeworks,
    reload: reloadHomeworks,
  } = useHomeworks(lessonId);
  const {test, error: errorLoadingTest, reload: reloadTest} = useKnowledgeTest(
    lessonId,
  );
  const isLoaded = !!(lesson && homeworks && courseId && test !== undefined);

  const header = isLoaded && lesson && (
    <TabNavBlock title={lesson.name}>
      <TabNav>
        {lesson && lesson.assignment && (
          <TabNavLink to={`${match.url}/homeworks/`}>
            Работы{' '}
            {homeworks && (
              <span className="badge">
                {homeworks.filter((homework) => !!homework.files).length}
              </span>
            )}
          </TabNavLink>
        )}
        <TabNavLink to={`${match.url}/assignment/`}>Задание</TabNavLink>
        {test && (
          <TabNavLink exact to={`${match.url}/test/${lesson.test_id}/`}>
            Тест
          </TabNavLink>
        )}
        {test && (
          <TabNavLink to={`${match.url}/test/${lesson.test_id}/results/`}>
            Результаты теста
          </TabNavLink>
        )}
      </TabNav>
    </TabNavBlock>
  );

  const parentSection = course
    ? {
        name: course.name,
        url: `${path}/${courseId}/`,
      }
    : undefined;

  const errors = [
    errorLoadingLesson,
    errorLoadingCourse,
    errorLoadingHomeworks,
    errorLoadingTest,
  ];

  const reloadCallbacks = [
    reloadLesson,
    reloadCourse,
    reloadHomeworks,
    reloadTest,
  ];

  return (
    <Switch>
      <Route
        path={`${match.path}/homeworks`}
        render={(props) => (
          <HomeworksPage
            lesson={lesson}
            homeworks={homeworks}
            isLoaded={isLoaded}
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
            {...props}
          >
            {header}
          </HomeworksPage>
        )}
      />
      <Route
        path={`${match.path}/assignment`}
        render={(props) => (
          <AssignmentPage
            lesson={lesson}
            isLoaded={isLoaded}
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
            {...props}
          >
            {header}
          </AssignmentPage>
        )}
      />
      <Route
        exact
        path={`${match.path}/test/:testId(\\d+)`}
        render={(props) => (
          <TestPage
            test={test}
            lesson={lesson}
            isLoaded={isLoaded}
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
            {...props}
          >
            {header}
          </TestPage>
        )}
      />
      <Route
        path={`${match.path}/test/:testId(\\d+)/results/`}
        render={(props) => (
          <TestResultsPage
            test={test}
            lesson={lesson}
            isLoaded={isLoaded}
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
            {...props}
          >
            {header}
          </TestResultsPage>
        )}
      />
      <Route
        render={({location}) => {
          if (lesson && lesson.test_id) {
            return (
              <Redirect
                to={`${path}/${courseId}/${lessonId}/test/${lesson.test_id}/results/`}
              />
            );
          }

          if (!lesson || lesson.assignment) {
            return (
              <Redirect to={`${path}/${courseId}/${lessonId}/homeworks/`} />
            );
          }

          return <NotFoundErrorPage location={location} />;
        }}
      />
    </Switch>
  );
};

export default LessonPage;
