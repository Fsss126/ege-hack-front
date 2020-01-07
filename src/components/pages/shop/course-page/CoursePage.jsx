import React from "react";
import Page, {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import Lesson from "components/common/Lesson";
import {useShopCatalog, useTeachers, useLessons, useDiscount} from "store";
import Button from "../../../ui/Button";
import {Link} from "react-router-dom";
import ConditionalRenderer from "../../../ConditionalRender";
import {LESSON_EDIT_PERMISSIONS} from "../../admin/lessons/LessonCreatingPage";

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
                    <ConditionalRenderer
                        requiredPermissions={LESSON_EDIT_PERMISSIONS}>
                        <div className="layout__content-block d-flex justify-content-end">
                            <Button
                                tag={Link}
                                to={`/courses/${courseId}/create_lesson`}
                                icon={<i className="icon-add"/>}>
                                Добавить урок
                            </Button>
                        </div>
                    </ConditionalRenderer>
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
