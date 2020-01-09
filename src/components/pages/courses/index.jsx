import React from 'react';
import { Switch, Route } from "react-router-dom";
import CatalogPage from "./catalog-page";
import CoursePage from "./course-page";
import LessonPage from "./lesson-page";
import CourseCreatingPage from "../admin/courses/CourseCreatingPage";
import LessonCreatingPage from "../admin/lessons/LessonCreatingPage";
import CourseEditingPage from "../admin/courses/CourseEditingPage";
import LessonEditingPage from "../admin/lessons/LessonEditingPage";

const MyCourses = ({match}) => {
    return (
        <Switch>
            <Route path={`${match.path}/create`} component={CourseCreatingPage}/>
            <Route path={`${match.path}/:courseId/:lessonId/edit`} component={LessonEditingPage}/>
            <Route path={`${match.path}/:courseId/edit`} component={CourseEditingPage}/>
            <Route path={`${match.path}/:courseId/create_lesson`} component={LessonCreatingPage}/>
            <Route path={`${match.path}/:courseId/:lessonId`} component={LessonPage}/>
            <Route path={`${match.path}/:id`} component={CoursePage}/>
            <Route exact path={`${match.path}`} component={CatalogPage}/>
        </Switch>
    );
};

export default MyCourses;
