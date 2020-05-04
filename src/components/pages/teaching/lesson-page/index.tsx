import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {ContentBlock} from 'components/layout/ContentBlock';
import {useHomeworks, useLesson, useTeacherCourse} from 'hooks/selectors';
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {LessonPageParams, RouteComponentPropsWithPath} from 'types/routes';

import AssignmentPage from './AssignmentPage';
import HomeworksPage from './HomeworksPage';
import TestPage from './TestPage';

const LessonPage: React.FC<RouteComponentPropsWithPath<LessonPageParams>> = (
  props,
) => {
  const {path: root, match} = props;
  const {
    params: {courseId: param_course, lessonId: param_lesson},
  } = match;
  const courseId = parseInt(param_course);
  const lessonId = parseInt(param_lesson);

  const {lesson, error, reload} = useLesson(courseId, lessonId);
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
        {lesson.test && <TabNavLink to={`${match.url}/test/`}>Тест</TabNavLink>}
      </TabNav>
    </TabNavBlock>
  );

  const parentSection = course
    ? {
        name: course.name,
        url: '../../',
      }
    : undefined;

  return (
    <Switch>
      <Route
        path={`${match.path}/homeworks`}
        render={(props) => (
          <HomeworksPage
            lesson={lesson}
            homeworks={homeworks}
            isLoaded={isLoaded}
            path={root}
            parentSection={parentSection}
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
            path={root}
            parentSection={parentSection}
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
            lesson={lesson}
            isLoaded={isLoaded}
            path={root}
            parentSection={parentSection}
            {...props}
          >
            {header}
          </TestPage>
        )}
      />
      <Route
        render={() => (
          <Redirect to={`${root}/${courseId}/${lessonId}/homeworks/`} />
        )}
      />
    </Switch>
  );
};

export default LessonPage;
