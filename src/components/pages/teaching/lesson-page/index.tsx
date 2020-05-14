import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {
  useHomeworks,
  useKnowledgeTest,
  useLesson,
  useTeacherCourse,
} from 'hooks/selectors';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {
  LessonPageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';

import AssignmentPage from './AssignmentPage';
import HomeworksPage from './HomeworksPage';
import TestPage from './TestPage';

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
  const isLoaded = !!(lesson && homeworks && courseId);

  const header = isLoaded && lesson && (
    <TabNavBlock title={lesson.name}>
      <TabNav>
        <TabNavLink to={`${match.url}/homeworks/`}>
          Работы{' '}
          {homeworks && (
            <span className="badge">
              {homeworks.filter((homework) => !!homework.files).length}
            </span>
          )}
        </TabNavLink>
        <TabNavLink to={`${match.url}/assignment/`}>Задание</TabNavLink>
        {lesson.test_id && (
          <TabNavLink to={`${match.url}/test/${lesson.test_id}/`}>
            Тест
          </TabNavLink>
        )}
      </TabNav>
    </TabNavBlock>
  );

  const parentSection = course
    ? {
        name: course.name,
        url: '../../',
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
        path={`${match.path}/test`}
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
        render={() => (
          <Redirect to={`${path}/${courseId}/${lessonId}/homeworks/`} />
        )}
      />
    </Switch>
  );
};

export default LessonPage;
