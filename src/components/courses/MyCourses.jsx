import React from 'react';
import { Switch, Route } from "react-router-dom";
import CourseOverview from "components/shop/CourseOverview";
import Course from "components/common/Course";
import {MY_COURSES} from "data/test_data";
import Page, {PageContent} from "../Page";
import CourseCatalog from "../common/CourseCatalog";
import {USER_COURSE_STATUS} from "../../definitions/constants";
import _ from 'lodash';

export default class MyCourses extends React.Component {
    state = {
        courses: _.sortBy(MY_COURSES, (course) => course.status === USER_COURSE_STATUS.finished ? 1 : 0)
    };

    openCourse = (course) => {
        const {match, history} = this.props;
        history.push({
            pathname: `${match.path}/${course.id}`
            // search: `?${query}`
        });
    };

    renderCourse = (course) => {
        return (
            <Course
                course={course}
                selectable
                online={false}
                onClick={this.openCourse}
                key={course.id}>
                {course.status === USER_COURSE_STATUS.learning
                    ? <div className="course__select-btn button" onClick={this.openCourse}>Изучать</div>
                    : <div className="course__select-btn button button-inactive" onClick={this.openCourse}>Пройден</div>}
            </Course>
        )
    };

    render() {
        const {match, location, history} = this.props;
        const {courses} = this.state;
        return (
            <Switch>
                <Route exact path={`${match.path}`} render={() => (
                    <Page title="Мои курсы">
                        <PageContent>
                            <CourseCatalog
                                className="course-shop"
                                courses={courses}
                                location={location}
                                history={history}
                                renderCourse={this.renderCourse}/>
                        </PageContent>
                    </Page>
                )}/>
                <Route path={`${match.path}/:id`} component={props => (
                    <CourseOverview {...props} path={match.path}>
                        {courses.courses}
                    </CourseOverview>
                )}/>
            </Switch>
        )
    }
}
