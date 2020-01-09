import React from "react";
import Page, {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import Lesson from "components/common/Lesson";
import {useTeachers, useLessons, useDiscount, useShopCourse} from "store";
import Button from "components/ui/Button";
import {Link} from "react-router-dom";
import ConditionalRenderer, {useCheckPermissions} from "components/ConditionalRender";
import {PERMISSIONS} from "definitions/constants";

//TODO: fix 404 error screen
const CoursePage = ({path, location, match}) => {
    const {params: {id: param_id}} = match;
    const courseId = parseInt(param_id);
    const {course, error, retry} = useShopCourse(courseId);
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {discount, error: errorLoadingDiscount, retry: reloadDiscount} = useDiscount(courseId);
    const canEdit = useCheckPermissions(PERMISSIONS.LESSON_EDIT);
    const renderLesson = (lesson) => (
        <Lesson
            lesson={lesson}
            selectable={canEdit}
            locked={false}
            key={lesson.id}
            link={`/courses/${courseId}/${lesson.id}/edit/`}>
            {canEdit
                ? <Button>Изменить</Button>
                : null}
        </Lesson>
    );
    if (course && teachers && lessons) {
        return (
            <CourseOverview.Body
                path={path}
                course={course}
                teachers={teachers}
                lessons={lessons}
                location={location}>
                <PageContent parentSection={{name: "Магазин курсов"}}>
                    <CourseOverview.Description/>
                    <CourseOverview.Teachers/>
                    <ConditionalRenderer
                        requiredPermissions={PERMISSIONS.LESSON_EDIT}>
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
