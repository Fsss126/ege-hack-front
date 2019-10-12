import React from "react";
import _ from "lodash";
import Page, {PageContent} from "../Page";
import {Link} from "react-router-dom";
import ErrorPage from "components/ErrorPage";
import CoverImage from "../common/CoverImage";
import Lesson from "components/common/Lesson";
import List from "components/common/List";
import {renderDate} from "../../definitions/helpers";
import VideoCover from "components/common/VideoCover";
import Button from "../ui/Button";
import LessonView from "./LessonView";


const LessonPage = (props) => {
    const {match: {params: {courseId, lessonId}}, catalog} = props;
    const course = _.find(catalog, {id: courseId});
    const lessonIndex = course ? _.findIndex(course.lessons, {id: lessonId}) : null;
    const selectedLesson = lessonIndex !== null ? course.lessons[lessonIndex] : null;
    const renderLesson = (lesson, props) => {
        return (
            <Lesson
                lesson={lesson}
                locked={false}
                selectable={true}
                key={lesson.id}
                link={`../${lesson.id}/`}>
            </Lesson>
        );
    };
    if (selectedLesson) {
        const now = new Date();
        const otherLessons = course.lessons.filter(lesson => lesson.date < now && lesson.id !== selectedLesson.id);
        return (
            <Page title={`${selectedLesson.title}`} className="lesson-page">
                <PageContent parentSection={{name: course.title}}>
                    <div className="layout__content-block">
                        <div className="container p-lg-0">
                            <div className="row">
                                <LessonView lesson={selectedLesson}/>
                                <div className="col-12 col-lg-auto layout__content-block lesson-page__other-lessons">
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
