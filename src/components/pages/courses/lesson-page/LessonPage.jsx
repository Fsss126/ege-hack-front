import React from "react";
import _ from "lodash";
import Page, {PageContent} from "components/Page";
import {NotFoundErrorPage} from "components/ErrorPage";
import Lesson from "components/common/Lesson";
import List from "components/common/List";
import LessonView from "./LessonView";
import {useHomework, useLessons, useUserCourses} from "store";

const LessonPage = (props) => {
    const {match: {params: {courseId: param_course, lessonId: param_lesson}}, location} = props;
    const courseId = parseInt(param_course);
    const lessonId = parseInt(param_lesson);

    const {courses, error, retry} = useUserCourses();
    // const {teachers, error: errorLoadingTeachers, reload: reloadTeachers} = useTeachers();
    const {lessons, error: errorLoadingLessons, retry: reloadLessons} = useLessons(courseId);
    const {homework, error: errorLoadingHomework, retry: reloadHomework} = useHomework(lessonId);
    const renderLesson = (lesson, renderProps) => {
        const {id, locked} = lesson;
        return (
            <Lesson
                lesson={lesson}
                locked={locked}
                selectable={!locked}
                key={id}
                link={`../${lesson.id}/`}
                {...renderProps}>
            </Lesson>
        );
    };

    if (courses && lessons && homework !== undefined) {
        const course = _.find(courses, {id: courseId});
        const selectedLesson = (course && _.find(lessons, {id: lessonId})) || null;
        if (selectedLesson && !selectedLesson.locked) {
            let nextVideo = lessons[selectedLesson.num];
            if (!nextVideo || nextVideo.locked)
                nextVideo = null;
            const otherLessons = _.sortBy(lessons.filter(lesson => (
                lesson.id !== selectedLesson.id && (nextVideo ? lesson.id !== nextVideo.id : true
                ))), 'num');
            return (
                <Page isLoaded={true} title={`${selectedLesson.name}`} className="lesson-page" location={location}>
                    <PageContent parentSection={{name: course.name}}>
                        <div className="layout__content-block">
                            <div className="container p-lg-0">
                                <div className="row">
                                    <LessonView lesson={selectedLesson} homework={homework}/>
                                    <div className="col-12 col-lg-auto layout__content-block lesson-page__other-lessons">
                                        {nextVideo && <h3>Следующее занятие</h3>}
                                        {nextVideo && (
                                            <List renderItem={renderLesson}>{[nextVideo]}</List>
                                        )}
                                        {(otherLessons && otherLessons.length > 0) && (
                                            <React.Fragment>
                                                <h3>Другие занятия</h3>
                                                <List
                                                    renderItem={renderLesson}>
                                                    {otherLessons}
                                                </List>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageContent>
                </Page>
            );
        } else
            return <NotFoundErrorPage message="Урок не найден"/>;
    } else {
        return (
            <Page isLoaded={false} location={location}/>
        );
    }
};

export default LessonPage;
