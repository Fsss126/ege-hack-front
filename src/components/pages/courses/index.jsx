import React from 'react';
import _ from 'lodash';
import { Switch, Route } from "react-router-dom";
import {MY_COURSES} from "data/test_data";
import {LEARNING_STATUS} from "definitions/constants";
import CatalogPage from "./catalog-page";
import CoursePage from "./course-page";
import LessonPage from "./lesson-page";
import CourseCreatingPage from "../admin/courses/CourseCreatingPage";
import LessonCreatingPage from "../admin/lessons/LessonCreatingPage";

export default class MyCourses extends React.Component {
    state = {
        courses: _.sortBy(MY_COURSES, (course) => course.status === LEARNING_STATUS.finished ? 1 : 0)
    };

    render() {
        const {match} = this.props;
        const {courses} = this.state;
        return (
            <Switch>
                <Route path={`${match.path}/create`} component={CourseCreatingPage}/>
                <Route path={`${match.path}/:courseId/create_lesson`} component={LessonCreatingPage}/>
                <Route path={`${match.path}/:courseId/:lessonId`} render={(props) => (
                    <LessonPage catalog={courses}
                                {...props}/>
                )}/>
                <Route path={`${match.path}/:id`} render={(props) => (
                    <CoursePage
                        catalog={courses}
                        path={match.path}
                        {...props}/>
                )}/>
                <Route exact path={`${match.path}`} render={(props) => (
                    <CatalogPage catalog={courses} {...props}/>
                )}/>
            </Switch>
        )
    }
}
