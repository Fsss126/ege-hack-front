import React from "react";
import Page, {PageContent} from "components/Page";
import {useSubjects, useTeachers} from "store";
import APIRequest from "api";
import CourseForm from "./CourseForm";
import {Permissions} from "types/common";

const createRequest = (requestData) => APIRequest.post('/courses', requestData);

const returnLink = '/admin/';

const CourseCreatingPage = (props) => {
    const {location} = props;
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();
    const {teachers, error: errorLoadingTeachers, retry: reloadTeachers} = useTeachers();

    const onSubmitted = React.useCallback((response, showSuccessMessage, reset) => {
        showSuccessMessage("Курс создан", [
            {
                text: 'Новый курс',
                action: reset
            },
            {
                text: 'Вернуться к курсам',
                url: returnLink
            }
        ]);
    }, []);

    const isLoaded = teachers && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permissions.COURSE_EDIT}
            className="course-form-page"
            title="Создание курса"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <CourseForm
                            subjects={subjects}
                            teachers={teachers}
                            location={location}
                            title="Новый курс"
                            errorMessage="Ошибка при создании курса"
                            cancelLink={returnLink}
                            isLoaded={isLoaded}
                            createRequest={createRequest}
                            onSubmitted={onSubmitted}/>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default CourseCreatingPage;
