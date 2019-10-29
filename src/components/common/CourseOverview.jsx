import React from 'react';
import _ from 'lodash';
import CoverImage from "components/common/CoverImage";
import {renderDate} from "../../definitions/helpers";
import List from "./List";
import Teacher from "./Teacher";
import Page, {PageLink} from "../Page";
import ErrorPage from "../ErrorPage";

window._ = _;

export const CourseOverviewContext = React.createContext({});

const Description = () => {
    const {course} = React.useContext(CourseOverviewContext);
    return (
        <React.Fragment>
            <CoverImage src={course.cover} className="course-overview__cover"/>
            <div className="course-overview__info layout__content-block">
                <h2>{course.title}</h2>
                <div className="course-overview__summary">
                    <div className="col-auto course-overview__summary-item">
                        <i className="far fa-calendar-alt"/>
                        Начало: {renderDate(course.start, renderDate.date)}
                    </div>
                    <div className="col-auto course-overview__summary-item">
                        <i className="far fa-clock"/>
                        Длительность: {course.totalHours} часов
                    </div>
                </div>
                <div className="description-text font-size-sm">{course.description}</div>
            </div>
        </React.Fragment>
    );
};

const Title = () => {
    const {course} = React.useContext(CourseOverviewContext);
    return (
        <div className="course-overview__title layout__content-block">
            <h2>{course.title}</h2>
            <PageLink className="course-overview__link" to={`/shop/${course.id}`}>
                Страница курса
            </PageLink>
        </div>
    );
};

const Teachers = () => {
    const {course} = React.useContext(CourseOverviewContext);
    return (
        <div className="layout__content-block">
            <h3>Преподаватели</h3>
            <div className="course-overview__teachers container negate-block-padding">
                <div className="row">
                    {course.teachers.map((teacher, i) => (
                        <div className="col-12 col-md d-flex p-0" key={i}>
                            <Teacher
                                teacher={teacher}
                                link={`/teachers/${teacher.id}/`}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Lessons = ({renderLesson: renderFunc}) => {
    const {course} = React.useContext(CourseOverviewContext);
    const renderCourse = React.useCallback((item) => {
        return renderFunc(item, {link: `${item.id}/`});
    }, [renderFunc]);
    return (
        <div className="layout__content-block">
            <h3>Уроки</h3>
            <List
                renderItem={renderCourse}>
                {course.lessons}
            </List>
        </div>
    );
};

const CourseOverview = (props) => {
    const {match: {params: {id}}, path: root, courses, children, className} = props;
    const course = _.find(courses, {id});
    if (course) {
        return (
            <Page title={`${course.title}`} className={`course-overview ${className || ''}`}>
                <CourseOverviewContext.Provider
                    value={{
                        course
                    }}>
                    {children}
                </CourseOverviewContext.Provider>
            </Page>
        )
    } else
        return <ErrorPage errorCode={404} message="Курс не найден" link={{url: root}}/>;
};

export default {
    Description,
    Teachers,
    Lessons,
    Title,
    Body: CourseOverview
};
