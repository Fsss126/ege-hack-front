import {PageContent} from "../Page";
import CourseOverview from "../common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import React from "react";
import Lesson from "../common/Lesson";

const CoursePage = ({path, catalog, ...props}) => {
    const renderLesson = (lesson, props) => (
        <Lesson
            lesson={lesson}
            selectable={false}
            locked={false}
            key={lesson.id}/>
    );
    return (
        <CourseOverview.Body
            path={path}
            courses={catalog}
            {...props}>
            <PageContent parentSection={{name: "Магазин курсов"}}>
                <CourseOverview.Description/>
                <CourseOverview.Teachers/>
                <CourseOverview.Lessons renderLesson={renderLesson}/>
            </PageContent>
            <CoursePriceTab/>
        </CourseOverview.Body>
    );
};

export default CoursePage;
