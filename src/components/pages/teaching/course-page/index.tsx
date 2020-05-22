import {CatalogItemRenderer} from 'components/common/Catalog';
// import WebinarsPage from "./../../admin/course-page/webinars/WebinarsPage";
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import Lesson from 'components/common/Lesson';
import TabNav, {TabNavBlock, TabNavLink} from 'components/common/TabNav';
import {useCheckPermissions} from 'components/ConditionalRender';
import {
  useAdminLessons,
  useDeleteCourse,
  useParticipants,
  useTeacherCourse,
  // useAdminWebinars
} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {
  CoursePageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';

import LessonsPage from '../../admin/courses/course-page/lessons/LessonsPage';
import ParticipantsPage from '../../admin/courses/course-page/participants/ParticipantsPage';

const renderLesson: CatalogItemRenderer<LessonInfo> = (
  lesson,
  {link, ...rest},
) => {
  const {id, locked, assignment, test_id} = lesson;
  const isSelectable = !!assignment || test_id !== undefined;

  return (
    <Lesson
      lesson={lesson}
      locked={locked}
      selectable={isSelectable}
      key={id}
      noOnClickOnAction
      link={isSelectable ? link : undefined}
      {...rest}
    />
  );
};

const CoursePage: React.FC<RouteComponentPropsWithParentProps<
  CoursePageParams
>> = (props) => {
  const {path, url, match} = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useTeacherCourse(courseId);
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
  // const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useAdminWebinars(courseId);
  const isLoaded = !!(course && participants && lessons);

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
        {/*<TabNavLink navigateTo={`${match.url}/webinars/`} disabled={webinars === false}>*/}
        {/*    Вебинары {webinars && <span className="badge">{webinars.webinars.length}</span>}*/}
        {/*</TabNavLink>*/}
        <TabNavLink to={`${match.url}/teachers/`} disabled>
          Преподаватели
        </TabNavLink>
        <TabNavLink to={`${match.url}/calendar/`} disabled>
          Календарь
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
    errorLoadingLessons,
    errorLoadingParticipants,
  ];

  const reloadCallbacks = [reloadCourse, reloadLessons, reloadParticipants];

  return (
    <Switch>
      <Route
        path={`${match.path}/participants`}
        render={(props) => (
          <ParticipantsPage
            course={course || undefined}
            participants={participants || undefined}
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
            className="teaching-page"
            renderLesson={renderLesson}
            course={course || undefined}
            lessons={lessons || undefined}
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
      {/*<Route path={`${match.path}/webinars`} render={props => (*/}
      {/*    <WebinarsPage*/}
      {/*        course={course}*/}
      {/*        webinars={webinars}*/}
      {/*        isLoaded={isLoaded}*/}
      {/*        path={root}*/}
      {/*        parentSection={parentSection}*/}
      {/*        {...props}>*/}
      {/*        {header}*/}
      {/*    </WebinarsPage>*/}
      {/*)}/>*/}
      <Route render={() => <Redirect to={`${path}/${courseId}/lessons/`} />} />
    </Switch>
  );
};

export default CoursePage;
