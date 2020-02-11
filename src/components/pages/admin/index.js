import React from 'react';
import { Switch, Route } from "react-router-dom";
import CatalogPage from "./catalog-page";
import CoursePage from "./course-page";
import CourseCreatingPage from "./catalog-page/CourseCreatingPage";
import LessonCreatingPage from "./course-page/lessons/LessonCreatingPage";
import CourseEditingPage from "./catalog-page/CourseEditingPage";
import LessonEditingPage from "./course-page/lessons/LessonEditingPage";
import ParticipantsEditingPage from "./course-page/participants/ParticipantsEditingPage";
import WebinarsEditingPage from "./course-page/webinars/WebinarsEditingPage";

const Admin = ({match}) => {
    return (
        <Switch>
            <Route path={`${match.path}/create`} component={CourseCreatingPage}/>
            <Route
                exact
                path={[match.path, `${match.path}/list`, `${match.path}/calendar`]}
                render={props => <CatalogPage path={match.path} {...props}/>}/>
            <Route path={`${match.path}/:courseId/participants/edit`} component={ParticipantsEditingPage}/>
            <Route path={`${match.path}/:courseId/lessons/create`} component={LessonCreatingPage}/>
            <Route path={`${match.path}/:courseId/webinars/edit`} component={WebinarsEditingPage}/>
            <Route path={`${match.path}/:courseId/edit`} component={CourseEditingPage}/>
            <Route path={`${match.path}/:courseId/:lessonId/edit`} component={LessonEditingPage}/>
            <Route
                path={`${match.path}/:courseId`}
                render={props => <CoursePage path={match.path} {...props}/>}/>
            {/*<Route path={`${match.path}/:courseId/:lessonId`} component={LessonPage}/>*/}
        </Switch>
    );
};

export default Admin;
