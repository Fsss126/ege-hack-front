import React from "react";
import Page, {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import Lesson from "components/common/Lesson";
import {useShopCatalog, useTeachers, useLessons, useDiscount} from "store";

//TODO: fix 404 error screen
const CoursePage = ({path, location, match}) => {
    const {params: {id: courseId}} = match;
    const {catalog, subjects, error, retry} = useShopCatalog();
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {discount, error: errorLoadingDiscount, retry: reloadDiscount} = useDiscount(courseId);
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
                <CoursePriceTab
                    discount={discount}
                    error={error}
                    retry={reloadDiscount}/>
            </CourseOverview.Body>
        );
    }
    else {
        return (
            <Page isLoaded={false} location={location}/>
        );
    }
};

export default CoursePage;
