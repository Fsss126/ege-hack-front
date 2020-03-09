import React from 'react';
import _ from 'lodash';
import CoverImage from "components/common/CoverImage";
import {renderDate} from "definitions/helpers";
import List, {ListProps} from "./List";
import Teacher from "./Teacher";
import Page, {PageLink} from "../Page";
import {NotFoundErrorPage} from "../ErrorPage";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "./DropdownMenu";
import {Link} from "react-router-dom";
import ConditionalRenderer from "../ConditionalRender";
import {ADMIN_ROLES} from "definitions/constants";
import {CourseInfo, LessonInfo, TeacherInfo} from "types/entities";
import {RouteComponentProps} from "react-router";

type CourseOverviewConextState = {
    course: CourseInfo;
    teachers: TeacherInfo[];
    lessons: LessonInfo[];
};
export const CourseOverviewContext = React.createContext<CourseOverviewConextState>(undefined as any);
CourseOverviewContext.displayName = 'CourseOverviewContext';

const Description: React.FC = () => {
    const {course} = React.useContext(CourseOverviewContext);
    const now = new Date();
    const isEnded = course.date_end > now;
    const {
        date_start,
        date_end,
        description,
        // total_hours
    } = course;
    return (
        <React.Fragment>
            <CoverImage src={course.image_link} className="course-overview__cover"/>
            <div className="course-overview__info layout__content-block">
                <div className="title-with-menu">
                    <div className="title-with-menu__action">
                        <ConditionalRenderer requiredRoles={ADMIN_ROLES} fullMatch={false}>
                            <DropdownMenu
                                content={<DropdownIconButton className="icon-ellipsis"/>}>
                                <DropdownMenuOption
                                    tag={Link}
                                    to={`/admin/${course.id}/`}>
                                    <i className="icon-logout"/>Управление курсом
                                </DropdownMenuOption>
                            </DropdownMenu>
                        </ConditionalRenderer>
                    </div>
                    <div className="title-with-menu__title">
                        <h2>{course.name}</h2>
                    </div>
                </div>
                <div className="course-overview__summary">
                    <div className="col-auto course-overview__summary-item">
                        <i className="far fa-calendar-alt"/>
                        {
                            isEnded ? (
                                <div className="d-inline-block align-top">
                                    <div>Начался: {
                                        renderDate(date_start, now.getFullYear() > date_end.getFullYear() ? renderDate.dateWithYear : renderDate.date)
                                    }</div>
                                    <div>Закончился: {
                                        renderDate(date_end, now.getFullYear() > date_end.getFullYear() ? renderDate.dateWithYear : renderDate.date)
                                    }</div>
                                </div>
                            ) : (
                                <div className="d-inline-block align-top">
                                    <div>Начало: {renderDate(date_start, renderDate.date)}</div>
                                    <div>Окончание: {renderDate(date_end, renderDate.date)}</div>
                                </div>
                            )
                        }
                    </div>
                    {/*{*/}
                    {/*    total_hours && (*/}
                    {/*        <div className="col-auto course-overview__summary-item">*/}
                    {/*            <i className="far fa-clock"/>*/}
                    {/*            Длительность: {total_hours} часов*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                </div>
                <div className="description-text font-size-sm">{description}</div>
            </div>
        </React.Fragment>
    );
};

const Title: React.FC = () => {
    const {course} = React.useContext(CourseOverviewContext);
    return (
        <div className="course-overview__title layout__content-block">
            <h2>{course.name}</h2>
            <PageLink className="course-overview__link" to={`/shop/${course.id}`}>
                Страница курса
            </PageLink>
        </div>
    );
};

const Teachers: React.FC = () => {
    const {course, teachers} = React.useContext(CourseOverviewContext);
    return (
        <div className="layout__content-block">
            <h3>Преподаватели</h3>
            <div className="course-overview__teachers container negate-block-padding">
                <div className="row">
                    {course.teacher_ids.map((id, i) => (
                        <div className="col-12 col-md d-flex p-0" key={i}>
                            <Teacher
                                teacher={_.find(teachers, {id}) as TeacherInfo}
                                link={`/teachers/${id}/`}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export type LessonsProps = {
    renderLesson: ListProps<LessonInfo, {link: string}>['renderItem'];
}
const Lessons: React.FC<LessonsProps> = (props) => {
    const {renderLesson: renderFunc} = props;
    const {lessons} = React.useContext(CourseOverviewContext);
    const renderCourse = React.useCallback((item, renderProps, index) => {
        return renderFunc(item, {link: `${item.id}/`, ...renderProps}, index);
    }, [renderFunc]);
    return (
        <div className="layout__content-block">
            <h3>Уроки</h3>
            <List
                renderItem={renderCourse}>
                {lessons}
            </List>
        </div>
    );
};

export type CourseOverviewProps = RouteComponentProps & {
    course?: CourseInfo;
    teachers?: TeacherInfo[];
    lessons?: LessonInfo[];
    path: string;
    children: React.ReactNode;
    className?: string;
}
const CourseOverview: React.FC<CourseOverviewProps> = (props) => {
    const {path: root, course, teachers, lessons, children, className, location} = props;
    if (course && teachers && lessons) {
        return (
            <Page
                title={`${course.name}`}
                className={`course-overview ${className || ''}`}
                location={location}>
                <CourseOverviewContext.Provider
                    value={{
                        course,
                        teachers,
                        lessons
                    }}>
                    {children}
                </CourseOverviewContext.Provider>
            </Page>
        )
    } else
        return (
            <NotFoundErrorPage
                message="Курс не найден"
                url={root}/>);
};

export default {
    Description,
    Teachers,
    Lessons,
    Title,
    Body: CourseOverview
};
