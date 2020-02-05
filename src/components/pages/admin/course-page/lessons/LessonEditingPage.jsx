import React, {useCallback} from "react";
import APIRequest from "api";
import LessonForm from "./LessonForm";
import Page, {PageContent} from "components/Page";
import {PERMISSIONS} from "definitions/constants";
import {useLesson} from "store";

const LessonEditingPage = (props) => {
    const {match: {params: {courseId: param_course, lessonId: param_lesson}}, location} = props;
    const courseId = parseInt(param_course);
    const lessonId = parseInt(param_lesson);

    const createRequest = useCallback((requestData) => APIRequest.put(`/lessons/${lessonId}`, requestData), [lessonId]);

    const {lesson, error: errorLoadingLesson, retry: reloadLesson} = useLesson(courseId, lessonId);

    const returnLink = `/admin/${courseId}/lessons/`;

    const onSubmitted = useCallback((response, showSuccessMessage, reset) => {
        showSuccessMessage("Изменения сохранены", [
            {
                text: 'Ок'
            },
            {
                text: 'Вернуться к курсу',
                url: returnLink
            }
        ]);
    }, [returnLink]);


    const isLoaded = !!lesson;
    return (
        <Page
            requiredPermissions={PERMISSIONS.LESSON_EDIT}
            className="lesson-form-page"
            title="Изменение урока"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <LessonForm
                            lesson={lesson}
                            location={location}
                            title="Изменение урока"
                            errorMessage="Ошибка при сохранении изменений"
                            cancelLink={returnLink}
                            courseId={courseId}
                            isLoaded={isLoaded}
                            createRequest={createRequest}
                            onSubmitted={onSubmitted}/>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default LessonEditingPage;
