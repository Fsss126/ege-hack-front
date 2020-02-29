import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import {useAdminCourse, useSubjects, useTeachers} from "store/selectors";
import APIRequest from "api";
import CourseForm from "./CourseForm";
import {Permission} from "types/enums";

const CourseEditingPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const createRequest = React.useCallback((requestData) => APIRequest.put(`/courses/${courseId}`, requestData), [courseId]);

    const {subjects, error: errorLoadingSubjects, reload: reloadSubjects} = useSubjects();
    const {teachers, error: errorLoadingTeachers, reload: reloadTeachers} = useTeachers();
    const {course, error: errorLoadingCourses, reload: reloadCourses} = useAdminCourse(courseId);

    const returnLink = `/admin/${courseId}/`;

    const onSubmitted = useCallback((response, showSuccessMessage) => {
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

    const isLoaded = !!(teachers && subjects && course);
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permission.COURSE_EDIT}
            className="course-form-page"
            title="Изменение курса"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <CourseForm
                            course={course}
                            subjects={subjects}
                            teachers={teachers}
                            location={location}
                            title="Изменение курса"
                            errorMessage="Ошибка при сохранении изменений"
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

export default CourseEditingPage;
