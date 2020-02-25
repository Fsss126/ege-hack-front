import React, {useCallback} from "react";
import {useAdminCourse, useAdminWebinars} from "store";
import APIRequest from "api";
import Page, {PageContent} from "components/Page";
import WebinarsForm from "./WebinarsForm";
import {Permissions} from "types/common";

const WebinarsEditingPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const {course, error, retry} = useAdminCourse(courseId);
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useAdminWebinars(courseId);

    const createRequest = useCallback((requestData) => APIRequest.put(`/courses/${courseId}/schedule`, requestData), [courseId]);

    const returnLink = `/admin/${courseId}/webinars/`;

    const onSubmitted = useCallback((response, showSuccessMessage, reset) => {
        showSuccessMessage("Изменения сохранены", [
            {
                text: 'Ок'
            },
            {
                text: 'Вернуться к вебинарам',
                url: returnLink
            }
        ]);
    }, [returnLink]);

    const isLoaded = !!(course && webinars);

    const title = webinars === null ? 'Создание графика вебинаров' : 'Изменение графика вебинаров';
    return (
        <Page
            requiredPermissions={Permissions.WEBINAR_EDIT}
            className="lesson-form-page"
            title={title}
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <WebinarsForm
                            webinars={webinars}
                            location={location}
                            title={title}
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

export default WebinarsEditingPage;
