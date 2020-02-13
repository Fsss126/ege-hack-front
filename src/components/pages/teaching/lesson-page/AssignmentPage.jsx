import React from "react";
import Page, {PageContent} from "components/Page";
import {PERMISSIONS} from "definitions/constants";
import HomeworkAssignment from "components/common/HomeworkAssignment";


const AssignmentPage = (props) => {
    const {location, lesson, isLoaded, children: header, parentSection} = props;

    const title = lesson && `Задание к уроку ${lesson.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={PERMISSIONS.HOMEWORK_CHECK}
            className="admin-page admin-page--participants"
            title={title}
            location={location}>
            {isLoaded && (
                <PageContent parentSection={parentSection}>
                    {header}
                    <div className="layout__content-block">
                        <HomeworkAssignment assignment={lesson.assignment}/>
                    </div>
                </PageContent>
            )}
        </Page>
    );
};

export default AssignmentPage;
