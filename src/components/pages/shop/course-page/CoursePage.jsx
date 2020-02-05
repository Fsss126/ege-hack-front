import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import CoursePrice from "./CoursePrice";
import Lesson from "components/common/Lesson";
import {useTeachers, useLessons, useDiscount, useShopCourse} from "store";
import Button from "components/ui/Button";
import {useToggle} from "hooks/common";
import {NotFoundErrorPage} from "components/ErrorPage";

const CoursePage = ({selectedCourses, onCourseSelect, children: selectedCoursesTab, path: root, location, match}) => {
    const {params: {id: param_id}} = match;
    const courseId = parseInt(param_id);
    const {course, error, retry} = useShopCourse(courseId);
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {discount, error: errorLoadingDiscount, retry: reloadDiscount} = useDiscount(courseId);
    const isSelected = selectedCourses.has(course);

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
                path={root}
                course={course}
                teachers={teachers}
                lessons={lessons}
                location={location}>
                <PageContent parentSection={{name: "Магазин курсов"}}>
                    <CourseOverview.Description/>
                    {!isEditing && (
                        <CoursePrice
                            isSelected={isSelected}
                            discount={discount}
                            onSelect={onCourseSelect}
                            error={error}
                            retry={reloadDiscount}/>
                    )}
                    <CourseOverview.Teachers/>
                    <CourseOverview.Lessons renderLesson={renderLesson}/>
                </PageContent>
                {!isEditing && selectedCoursesTab}
            </CourseOverview.Body>
        );
    }
    else if (error) {
        return <NotFoundErrorPage message="Курс не найден" link={{url: root}}/>;
    }
    else {
        return (
            <Page isLoaded={false} location={location}/>
        );
    }
};

export default CoursePage;
