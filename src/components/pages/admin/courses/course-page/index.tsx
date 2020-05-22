import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import Lesson from 'components/common/Lesson';
import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {useCheckPermissions} from 'components/ConditionalRender';
import {getIsFeatureEnabled, TOGGLE_FEATURES} from 'definitions/constants';
import {useAdminCourse, useDeleteCourse} from 'modules/courses/courses.hooks';
import {useAdminLessons} from 'modules/lessons/lessons.hooks';
import {useParticipants} from 'modules/participants/participants.hooks';
import {useAdminWebinars} from 'modules/webinars/webinars.hooks';
import React, {useCallback} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {Permission} from 'types/enums';
import {
  CoursePageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';

import LessonsPage, {LessonRenderer} from './lessons/LessonsPage';
import ParticipantsPage from './participants/ParticipantsPage';
import SchedulePage from './schedule/SchedulePage';
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

export type CoursePageProps = RouteComponentPropsWithParentProps<
  CoursePageParams
>;
const CoursePage: React.FC<CoursePageProps> = (props) => {
  const {path, url, match} = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useAdminCourse(courseId);
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

  const parentPage = `${path}/`;
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
        <TabNavLink
          to={`${match.url}/calendar/`}
          disabled={!getIsFeatureEnabled(TOGGLE_FEATURES.schedule)}
        >
          Календарь
        </TabNavLink>
        <TabNavLink to={`${match.url}/teachers/`} disabled>
          Преподаватели
        </TabNavLink>
      </TabNav>
    </TabNavBlock>
  );
  const parentSection = {
    name: 'Курсы',
    url: path,
  };

  const errors = [
    errorLoadingCourse,
    errorLoadingParticipants,
    errorLoadingLessons,
    errorLoadingWebinars,
  ];

  const reloadCallbacks = [
    reloadCourse,
    reloadParticipants,
    reloadLessons,
    reloadWebinars,
  ];

  return (
    <Switch>
      <Route
        path={`${match.path}/participants`}
        render={(props) => (
          <ParticipantsPage
            course={course ? course : undefined}
            participants={participants ? participants : undefined}
            isLoaded={isLoaded}
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
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
            path={path}
            url={url}
            parentSection={parentSection}
            errors={errors}
            reloadCallbacks={reloadCallbacks}
            {...props}
          >
            {header}
          </WebinarsPage>
        )}
      />
      {getIsFeatureEnabled(TOGGLE_FEATURES.schedule) && (
        <Route
          path={`${match.path}/calendar`}
          render={(props) => (
            <SchedulePage
              course={course ? course : undefined}
              webinars={webinars ? webinars : undefined}
              isLoaded={isLoaded}
              path={path}
              url={url}
              parentSection={parentSection}
              errors={errors}
              reloadCallbacks={reloadCallbacks}
              {...props}
            >
              {header}
            </SchedulePage>
          )}
        />
      )}
      <Route render={() => <Redirect to={`${path}/${courseId}/lessons/`} />} />
    </Switch>
  );
};

export default CoursePage;
