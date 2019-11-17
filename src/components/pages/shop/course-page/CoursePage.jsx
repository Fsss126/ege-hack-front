import React from "react";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import Lesson from "components/common/Lesson";
import {useShopCatalog, useTeachers, useLessons} from "store";

const CoursePage = ({path, location, match}) => {
    const {params: {id: courseId}} = match;
    const {catalog, subjects, error, retry} = useShopCatalog();
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    console.log(lessons);
    const renderLesson = (lesson, props) => (
        <Lesson
            lesson={lesson}
            selectable={false}
            locked={false}
            key={lesson.id}/>
    );
    if (catalog && teachers && lessons) {
        return (
            <CourseOverview.Body
                match={match}
                path={path}
                courses={catalog}
                teachers={teachers}
                lessons={lessons}
                location={location}>
                <PageContent parentSection={{name: "Магазин курсов"}}>
                    <CourseOverview.Description/>
                    <CourseOverview.Teachers/>
                    <CourseOverview.Lessons renderLesson={renderLesson}/>
                </PageContent>
                <CoursePriceTab/>
            </CourseOverview.Body>
        );
    }
    else {
        return (
            <Page
                location={location}>
                <PageLoadingPlaceholder/>
            </Page>
        );
    }
};

export default CoursePage;
