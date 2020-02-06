import React, {useCallback} from "react";
import {
    useAdminCourse,
    useAdminLessons,
    useAdminWebinars,
    useDeleteCourse,
    useParticipants
} from "store";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import TabNav, {TabNavLink} from "components/common/TabNav";
import ParticipantsPage from "./participants/ParticipantsPage";
import LessonsPage from "./lessons/LessonsPage";
import WebinarsPage from "./webinars/WebinarsPage";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import {useCheckPermissions} from "components/ConditionalRender";
import {PERMISSIONS} from "definitions/constants";


const CoursePage = (props) => {
    const {path: root, match} = props;
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);
    const {course, error, retry} = useAdminCourse(courseId);
    const {participants, error: errorLoadingParticipants, reload: reloadParticipants} = useParticipants(courseId);
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useAdminLessons(courseId);
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useAdminWebinars(courseId);
    const isLoaded = !!(course !== undefined && participants !== undefined && lessons !== undefined && webinars !== undefined);

    const canEditCourse = useCheckPermissions(PERMISSIONS.COURSE_EDIT);
    // const canEditLessons = useCheckPermissions(PERMISSIONS.LESSON_EDIT);
    // const canEditParticipants = useCheckPermissions(PERMISSIONS.PARTICIPANT_MANAGEMENT);
    // const canEditWebinars = useCheckPermissions(PERMISSIONS.WEBINAR_EDIT);

    const parentPage = `${root}/`;
    const onDelete = useDeleteCourse(parentPage);
    const deleteCallback = useCallback(() => {
        onDelete(courseId);
    }, [courseId, onDelete]);

    const courseLink = `${match.url}/`;
    const header = isLoaded && (
        <div className="layout__content-block tab-nav-container">
            <div className="title-with-menu">
                <div className="title-with-menu__action">
                    {canEditCourse && (
                        <DropdownMenu
                            content={<DropdownIconButton className="icon-ellipsis"/>}>
                            <DropdownMenuOption
                                tag={Link}
                                to={`${courseLink}edit/`}>
                                <i className="far fa-edit"/>Изменить курс
                            </DropdownMenuOption>
                            <DropdownMenuOption onClick={deleteCallback}>
                                <i className="icon-close"/>Удалить курс
                            </DropdownMenuOption>
                            {!course.hide_from_market && (
                                <DropdownMenuOption
                                    tag={Link}
                                    to={`/shop/${courseId}/`}>
                                    <i className="icon-logout"/>Открыть в магазине
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
                <TabNavLink to={`${match.url}/participants/`} disabled={participants === false}>
                    Ученики {participants && <span className="badge">{participants.length}</span>}
                </TabNavLink>
                <TabNavLink to={`${match.url}/webinars/`} disabled={webinars === false}>
                    Вебинары {webinars && <span className="badge">{webinars.webinars.length}</span>}
                </TabNavLink>
                <TabNavLink to={`${match.url}/teachers/`} disabled>Преподаватели</TabNavLink>
                <TabNavLink to={`${match.url}/teachers/`} disabled>Календарь</TabNavLink>
            </TabNav>
        </div>
    );
    const parentSection = {
        name: 'Курсы',
        url: root
    };

    return (
        <Switch>
            <Route path={`${match.path}/participants`} render={props => (
                <ParticipantsPage
                    course={course}
                    participants={participants}
                    isLoaded={isLoaded}
                    path={root}
                    parentSection={parentSection}
                    {...props}>
                    {header}
                </ParticipantsPage>
            )}/>
            <Route path={`${match.path}/lessons`} render={props => (
                <LessonsPage
                    course={course}
                    lessons={lessons}
                    isLoaded={isLoaded}
                    path={root}
                    parentSection={parentSection}
                    {...props}>
                    {header}
                </LessonsPage>
            )}/>
            <Route path={`${match.path}/webinars`} render={props => (
                <WebinarsPage
                    course={course}
                    webinars={webinars}
                    isLoaded={isLoaded}
                    path={root}
                    parentSection={parentSection}
                    {...props}>
                    {header}
                </WebinarsPage>
            )}/>
            <Route render={() => <Redirect to={`${match.url}/lessons/`}/>}/>
        </Switch>
    )
};

export default CoursePage;
