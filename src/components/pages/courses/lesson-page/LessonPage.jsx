import React from "react";
import _ from "lodash";
import Page, {PageContent} from "components/Page";
import ErrorPage from "components/ErrorPage";
import Lesson from "components/common/Lesson";
import List from "components/common/List";
import LessonView from "./LessonView";

const LessonPage = (props) => {
    const {match: {params: {courseId: param_course, lessonId: param_lesson}}, catalog, location} = props;
    const courseId = parseInt(param_course);
    const lessonId = parseInt(param_lesson);
    const course = _.find(catalog, {id: courseId});
    const selectedLesson = (course &&_.find(course.lessons, {id: lessonId})) || null;
    const renderLesson = (lesson) => {
        const {id, locked} = lesson;
        return (
            <Lesson
                lesson={lesson}
                locked={locked}
                selectable={!locked}
                key={id}
                link={`../${lesson.id}/`}>
            </Lesson>
        );
    };
    if (selectedLesson && !selectedLesson.locked) {
        let nextVideo = course.lessons[selectedLesson.num];
        if (nextVideo.locked)
            nextVideo = null;
        const otherLessons = _.sortBy(course.lessons.filter(lesson => (
            lesson.id !== selectedLesson.id && (nextVideo ? lesson.id !== nextVideo.id : true
            ))), 'num');
        return (
            <Page title={`${selectedLesson.title}`} className="lesson-page" location={location}>
                <PageContent parentSection={{name: course.name}}>
                    <div className="layout__content-block">
                        <div className="container p-lg-0">
                            <div className="row">
                                <LessonView lesson={selectedLesson}/>
                                <div className="col-12 col-lg-auto layout__content-block lesson-page__other-lessons">
                                    {nextVideo && <h3>Следующее занятие</h3>}
                                    {nextVideo && (
                                        <List renderItem={renderLesson}>{[nextVideo]}</List>
                                    )}
                                    <h3>Другие занятия</h3>
                                    <List
                                        renderItem={renderLesson}>
                                        {otherLessons}
                                    </List>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContent>
            </Page>
        );
    } else
        return <ErrorPage errorCode={404} message="Урок не найден" />;
};

export default LessonPage;
