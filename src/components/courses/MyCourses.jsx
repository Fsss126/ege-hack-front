import React from 'react';
import { Switch, Route } from "react-router-dom";
import CourseOverview from "components/common/CourseOverview";
import Course from "components/common/Course";
import {MY_COURSES} from "data/test_data";
import Page, {PageContent} from "../Page";
import CourseCatalog from "../common/CourseCatalog";
import {USER_COURSE_STATUS} from "../../definitions/constants";
import _ from 'lodash';
import {renderDate} from "../../definitions/helpers";
import Lesson from "../common/Lesson";

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

    openClass = (lesson, course) => {
        const {match, history} = this.props;
        console.log(lesson, course);
        history.push({
            pathname: `${match.path}/${course.id}/${lesson.id}`
            // search: `?${query}`
        });
    };

    renderCourse = (course, props) => (
        <Course
            course={course}
            selectable
            online={false}
            key={course.id}
            onClick={this.openCourse}
            onActionClick={this.openCourse}
            {...props}>
            {course.status === USER_COURSE_STATUS.learning
                ? <div className="course__select-btn button">Изучать</div>
                : <div className="course__select-btn button button-inactive">Пройден</div>}
        </Course>
    );

    renderLesson = (lesson, props) => {
        const {date, id} = lesson;
        const selectable = date < new Date();
        return (
            <Lesson
                lesson={lesson}
                locked={!selectable}
                selectable={selectable}
                onClick={this.openClass}
                onActionClick={this.openClass}
                key={id}
                {...props}>
                <div className="list__item-action-info">{renderDate(date, renderDate.shortDate)}</div>
                {selectable
                    ? <div className="button">Изучать</div>
                    : <div className="button button-inactive">Скоро</div>}
            </Lesson>
        );
    };

    render() {
        const {match} = this.props;
        const {courses} = this.state;
        return (
            <Switch>
                <Route exact path={`${match.path}`} render={(props) => (
                    <CourseCatalog.Body
                        className="course-shop"
                        title="Магазин курсов"
                        courses={courses}
                        {...props}>
                        <PageContent>
                            <CourseCatalog.Filter/>
                            <CourseCatalog.Catalog
                                renderCourse={this.renderCourse}
                                onItemClick={this.openCourse}/>
                        </PageContent>
                    </CourseCatalog.Body>
                )}/>
                <Route path={`${match.path}/:courseId/:lessonId`} component={Page}/>
                <Route path={`${match.path}/:id`} component={props => (
                    <CourseOverview.Body
                        path={match.path}
                        courses={courses}
                        {...props}>
                        <PageContent>
                            <CourseOverview.Title/>
                            <CourseOverview.Lessons renderLesson={this.renderLesson} onItemClick={this.openClass}/>
                        </PageContent>
                    </CourseOverview.Body>
                )}/>
            </Switch>
        )
    }
}
