import React from "react";
import Page, {PageContent} from "components/Page";
import {useSubjects, useTeachers} from "hooks/selectors";
import APIRequest from "api";
import CourseForm from "./CourseForm";
import {Permission} from "types/enums";
import {RouteComponentProps} from "react-router";
import {CourseDtoReq} from "types/dtos";
import {CourseInfo, SubjectInfo, TeacherInfo} from "types/entities";

const createRequest = (requestData: CourseDtoReq): Promise<CourseInfo> => APIRequest.post('/courses', requestData) as Promise<CourseInfo>;

const returnLink = '/admin/';

const CourseCreatingPage: React.FC<RouteComponentProps> = (props) => {
    const {location} = props;
    const {subjects, error: errorLoadingSubjects, reload: reloadSubjects} = useSubjects();
    const {teachers, error: errorLoadingTeachers, reload: reloadTeachers} = useTeachers();

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

    const isLoaded = !!(teachers && subjects);
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permission.COURSE_EDIT}
            className="course-form-page"
            title="Создание курса"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <CourseForm
                            subjects={subjects as SubjectInfo[]}
                            teachers={teachers as TeacherInfo[]}
                            title="Новый курс"
                            errorMessage="Ошибка при создании курса"
                            cancelLink={returnLink}
                            createRequest={createRequest}
                            onSubmitted={onSubmitted}/>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default CourseCreatingPage;
