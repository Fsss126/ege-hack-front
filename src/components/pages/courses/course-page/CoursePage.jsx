import React from "react";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import Lesson from "components/common/Lesson";
import Button from "components/ui/Button";
import {renderDate} from "definitions/helpers";
import {useCourseWebinars, useLessons, useUpcomingWebinars, useUserCourses} from "store";
import WebinarSchedule from "../../../common/WebinarSchedule";

const CoursePage = ({path, match, location, ...props}) => {
    const {params: {id: courseId}} = match;
    const {courses, error, retry} = useUserCourses();
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useCourseWebinars(courseId);
    // const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const renderLesson = (lesson, props) => {
        const {date, id, locked} = lesson;
        return (
            <Lesson
                lesson={lesson}
                locked={locked}
                selectable={!locked}
                key={id}
                {...props}>
                {/*<div className="list__item-action-info">{renderDate(date, renderDate.shortDate)}</div>*/}
                {!locked
                    ? <Button>Изучать</Button>
                    : <Button active={false}>Скоро</Button>}
            </Lesson>
        );
    };
    if (courses && lessons && webinars) {
        return (
            <CourseOverview.Body
                match={match}
                path={path}
                courses={courses}
                lessons={lessons}
                location={location}>
                <PageContent parentSection={{name: "Мои курсы"}}>
                    <CourseOverview.Title/>
                    <WebinarSchedule
                        schedule={webinars}
                        courseId={courseId}/>
                    <CourseOverview.Lessons renderLesson={renderLesson}/>
                </PageContent>
            </CourseOverview.Body>
        );
    } else {
        return (
            <Page
                location={location}>
                <PageLoadingPlaceholder/>
            </Page>
        );
    }
};

export default CoursePage;
