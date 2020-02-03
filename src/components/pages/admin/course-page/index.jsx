import React from "react";
import {useAdminCourse, useAdminWebinars, useLessons, useParticipants, useSubjects} from "store";
import {Redirect, Route, Switch} from "react-router-dom";
import TabNav, {TabNavLink} from "components/common/TabNav";
import ParticipantsPage from "./participants/ParticipantsPage";
import LessonsPage from "./lessons/LessonsPage";
import WebinarsPage from "./webinars/WebinarsPage";

const CoursePage = (props) => {
    const {path: root, match} = props;
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);
    const {course, error, retry} = useAdminCourse(courseId);
    const {participants, error: errorLoadingParticipants, reload: reloadParticipants} = useParticipants(courseId);
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useAdminWebinars(courseId);

    const isLoaded = !!(course && participants && lessons && webinars);

    const header = isLoaded && (
        <div className="layout__content-block tab-nav-container">
            <h2>{course.name}</h2>
            <TabNav>
                <TabNavLink to={`${match.url}/lessons/`}>Уроки <span className="badge">{lessons.length}</span></TabNavLink>
                <TabNavLink to={`${match.url}/participants/`}>Ученики <span className="badge">{participants.length}</span></TabNavLink>
                <TabNavLink to={`${match.url}/webinars/`}>Вебинары <span className="badge">{webinars.webinars.length}</span></TabNavLink>
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
