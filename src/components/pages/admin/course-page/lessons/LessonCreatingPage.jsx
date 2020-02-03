import React from "react";
import APIRequest from "api";
import LessonForm from "./LessonForm";
import Page, {PageContent} from "components/Page";
import {PERMISSIONS} from "definitions/constants";

const createRequest = (requestData) => APIRequest.post('/lessons', requestData);

const LessonCreatingPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const onSubmitted = React.useCallback((response, showSuccessMessage, reset) => {
        showSuccessMessage("Урок создан", [
            {
                text: 'Новый урок',
                action: reset
            },
            {
                text: 'Вернуться к курсу',
                url: `/shop/${courseId}/`
            }
        ]);
    }, [courseId]);


    const isLoaded = true;
    return (
        <Page
            requiredPermissions={PERMISSIONS.LESSON_EDIT}
            className="lesson-form-page"
            title="Создание урока"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <LessonForm
                            location={location}
                            title="Новый урок"
                            errorMessage="Ошибка при создании урока"
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

export default LessonCreatingPage;
