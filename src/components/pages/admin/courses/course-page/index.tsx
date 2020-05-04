import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import Lesson from 'components/common/Lesson';
import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {useCheckPermissions} from 'components/ConditionalRender';
import {
  useAdminCourse,
  useAdminLessons,
  useAdminWebinars,
  useDeleteCourse,
  useParticipants,
} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {Permission} from 'types/enums';
import {CoursePageParams, RouteComponentPropsWithPath} from 'types/routes';

import LessonsPage, {LessonRenderer} from './lessons/LessonsPage';
import ParticipantsPage from './participants/ParticipantsPage';
import WebinarsPage from './webinars/WebinarsPage';

const renderLesson: LessonRenderer = (lesson, {link: lessonLink, ...rest}) => {
  const {id, locked} = lesson;
  const link = `${lessonLink}edit/`;

  return (
    <Lesson
      lesson={lesson}
      locked={locked}
      selectable={true}
      key={id}
      noOnClickOnAction
      link={link}
      {...rest}
    />
  );
};

export type CoursePageProps = RouteComponentPropsWithPath<CoursePageParams>;
const CoursePage: React.FC<CoursePageProps> = (props) => {
  const {path: root, match} = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {course, error, reload} = useAdminCourse(courseId);
  const {
    participants,
    error: errorLoadingParticipants,
    reload: reloadParticipants,
  } = useParticipants(courseId);
  const {
    lessons,
    error: errorLoadingLessons,
    reload: reloadLessons,
  } = useAdminLessons(courseId);
  const {
    webinars,
    error: errorLoadingWebinars,
    reload: reloadWebinars,
  } = useAdminWebinars(courseId);
  const isLoaded = !!(course && participants && lessons && webinars);

  const canEditCourse = useCheckPermissions(Permission.COURSE_EDIT);
  // const canEditLessons = useCheckPermissions(Permissions.LESSON_EDIT);
  // const canEditParticipants = useCheckPermissions(Permissions.PARTICIPANT_MANAGEMENT);
  // const canEditWebinars = useCheckPermissions(Permissions.WEBINAR_EDIT);

  const parentPage = `${root}/`;
  const onDelete = useDeleteCourse(parentPage);
  const deleteCallback = useCallback(() => {
    onDelete(courseId);
  }, [courseId, onDelete]);

  const courseLink = `${match.url}/`;
  const header = isLoaded && course && (
    <TabNavBlock>
      <div className="title-with-menu">
        <div className="title-with-menu__action">
          {canEditCourse && (
            <DropdownMenu
              content={<DropdownIconButton className="icon-ellipsis" />}
            >
              <DropdownMenuOption component={Link} to={`${courseLink}edit/`}>
                <i className="far fa-edit" />
                Изменить курс
              </DropdownMenuOption>
              <DropdownMenuOption onClick={deleteCallback}>
                <i className="icon-close" />
                Удалить курс
              </DropdownMenuOption>
              {!course.hide_from_market && (
                <DropdownMenuOption component={Link} to={`/shop/${courseId}/`}>
                  <i className="icon-logout" />
                  Открыть в магазине
                </DropdownMenuOption>
              )}
            </DropdownMenu>
          )}
        </div>
        <div className="title-with-menu__title">
          <h2>{course.name}</h2>
        </div>
      </div>
      <TabNav>
        <TabNavLink to={`${match.url}/lessons/`} disabled={lessons === false}>
          Уроки {lessons && <span className="badge">{lessons.length}</span>}
        </TabNavLink>
        <TabNavLink
          to={`${match.url}/participants/`}
          disabled={participants === false}
        >
          Ученики{' '}
          {participants && <span className="badge">{participants.length}</span>}
        </TabNavLink>
        <TabNavLink to={`${match.url}/webinars/`} disabled={webinars === false}>
          Вебинары{' '}
          {webinars && (
            <span className="badge">{webinars.webinars.length}</span>
          )}
        </TabNavLink>
        <TabNavLink to={`${match.url}/teachers/`} disabled>
          Преподаватели
        </TabNavLink>
        <TabNavLink to={`${match.url}/teachers/`} disabled>
          Календарь
        </TabNavLink>
      </TabNav>
    </TabNavBlock>
  );
  const parentSection = {
    name: 'Курсы',
    url: root,
  };

  return (
    <Switch>
      <Route
        path={`${match.path}/participants`}
        render={(props) => (
          <ParticipantsPage
            course={course ? course : undefined}
            participants={participants ? participants : undefined}
            isLoaded={isLoaded}
            path={root}
            parentSection={parentSection}
            {...props}
          >
            {header}
          </ParticipantsPage>
        )}
      />
      <Route
        path={`${match.path}/lessons`}
        render={(props) => (
          <LessonsPage
            requiredPermissions={Permission.LESSON_EDIT}
            renderLesson={renderLesson}
            course={course ? course : undefined}
            lessons={lessons ? lessons : undefined}
            isLoaded={isLoaded}
            path={root}
            parentSection={parentSection}
            {...props}
          >
            {header}
          </LessonsPage>
        )}
      />
      <Route
        path={`${match.path}/webinars`}
        render={(props) => (
          <WebinarsPage
            course={course ? course : undefined}
            webinars={webinars ? webinars : undefined}
            isLoaded={isLoaded}
            path={root}
            parentSection={parentSection}
            {...props}
          >
            {header}
          </WebinarsPage>
        )}
      />
      <Route render={() => <Redirect to={`${root}/${courseId}/lessons/`} />} />
    </Switch>
  );
};

export default CoursePage;
