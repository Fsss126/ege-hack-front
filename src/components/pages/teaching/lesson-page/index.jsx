import TabNav, {TabNavLink} from 'components/common/TabNav';
import {useHomeworks, useLesson, useTeacherCourse} from 'hooks/selectors';
import React from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';

import AssignmentPage from './AssignmentPage';
import HomeworksPage from './HomeworksPage';

const LessonPage = (props) => {
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

  const header = isLoaded && (
    <div className="layout__content-block tab-nav-container">
      <h2>{lesson.name}</h2>
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
      </TabNav>
    </div>
  );

  const parentSection = course && {
    name: course.name,
    url: '../../',
  };

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
        render={() => (
          <Redirect to={`${root}/${courseId}/${lessonId}/homeworks/`} />
        )}
      />
    </Switch>
  );
};

export default LessonPage;
