import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePriceTab from "./CoursePriceTab";
import Lesson from "components/common/Lesson";
import {useTeachers, useLessons, useDiscount, useShopCourse} from "store";
import Button from "components/ui/Button";
import {Link} from "react-router-dom";
import ConditionalRenderer from "components/ConditionalRender";
import {PERMISSIONS} from "definitions/constants";
import {useToggle} from "hooks/common";

//TODO: fix 404 error screen
const CoursePage = ({path, location, match}) => {
    const {params: {id: param_id}} = match;
    const courseId = parseInt(param_id);
    const {course, error, retry} = useShopCourse(courseId);
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {discount, error: errorLoadingDiscount, retry: reloadDiscount} = useDiscount(courseId);
    const [isEditing, toggleEditing] = useToggle(false);
    const renderLesson = useCallback((lesson) => (
        <Lesson
            lesson={lesson}
            selectable={isEditing}
            locked={false}
            key={lesson.id}
            link={`/courses/${courseId}/${lesson.id}/edit/`}>
            {isEditing
                ? <Button>Изменить</Button>
                : null}
        </Lesson>
    ), [isEditing, courseId]);
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
                        <div className="layout__content-block btn-container">
                            <Button
                                tag={Link}
                                to={`/courses/${courseId}/edit/`}>
                                Изменить
                            </Button>
                            {' '}
                            <Button
                                tag={Link}
                                to={`/courses/${courseId}/create_lesson`}
                                icon={<i className="icon-add"/>}>
                                Добавить урок
                            </Button>
                            {' '}
                            {lessons.length > 0 && (
                                <Button
                                    onClick={toggleEditing}>
                                    {isEditing ? 'Сохранить уроки' : 'Редактировать уроки'}
                                </Button>
                            )}
                            {' '}
                            <Button
                                tag={Link}
                                to={`/courses/${courseId}/participants`}
                                icon={<i className="icon-add"/>}>
                                Добавить учеников
                            </Button>
                        </div>
                    </ConditionalRenderer>
                    <CourseOverview.Lessons renderLesson={renderLesson}/>
                </PageContent>
                {!isEditing && (
                    <CoursePriceTab
                        discount={discount}
                        error={error}
                        retry={reloadDiscount}/>
                )}
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
