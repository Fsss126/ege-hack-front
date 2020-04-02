import React, {useCallback} from "react";
import {useAdminCourse, useAdminWebinars} from "hooks/selectors";
import APIRequest from "api";
import Page, {PageContent} from "components/Page";
import WebinarsForm from "./WebinarsForm";
import {Permission} from "types/enums";
import {RouteComponentProps} from "react-router";
import {WebinarScheduleInfo} from "types/entities";
import {WebinarScheduleDtoReq} from "types/dtos";

const WebinarsEditingPage: React.FC<RouteComponentProps<{courseId: string}>> = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const {course, error, reload} = useAdminCourse(courseId);
    const {webinars, error: errorLoadingWebinars, reload: reloadWebinars} = useAdminWebinars(courseId);

    const createRequest = useCallback((requestData: WebinarScheduleDtoReq): Promise<WebinarScheduleInfo> => APIRequest.put(`/courses/${courseId}/schedule`, requestData), [courseId]);

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
            isLoaded={isLoaded}
            requiredPermissions={Permission.WEBINAR_EDIT}
            className="lesson-form-page"
            title={title}
            location={location}>
            {isLoaded && (
                <PageContent>
                    <div className="layout__content-block">
                        <WebinarsForm
                            webinars={webinars as WebinarScheduleInfo}
                            title={title}
                            errorMessage="Ошибка при сохранении изменений"
                            cancelLink={returnLink}
                            courseId={courseId}
                            createRequest={createRequest}
                            onSubmitted={onSubmitted}/>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default WebinarsEditingPage;
