import React from "react";
import {PERMISSIONS} from "definitions/constants";
import Page, {PageContent} from "components/Page";
import {useAdminCourse, useAdminWebinars} from "store";

const WebinarsEditingPage = (props) => {
    const {match: {params: {courseId: param_course}}, location} = props;
    const courseId = parseInt(param_course);

    const {course, error, retry} = useAdminCourse(courseId);
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useAdminWebinars(courseId);

    const isLoaded = !!(course && webinars);

    const title = course && `Редактирование вебинаров курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={PERMISSIONS.WEBINAR_EDIT}
            className="admin-page admin-page--webinars"
            title={title}
            location={location}>
            <PageContent>
                <div className="layout__content-block description-text text-center">
                    Скоро
                </div>
            </PageContent>
        </Page>
    )
};

export default WebinarsEditingPage;
