import React from "react";
import Page, {PageContent} from "components/Page";
import HomeworkAssignment from "components/common/HomeworkAssignment";
import {Permission} from "types/enums";

const AssignmentPage = (props) => {
    const {location, lesson, isLoaded, children: header, parentSection} = props;

    const title = lesson && `Задание к уроку ${lesson.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            requiredPermissions={Permission.HOMEWORK_CHECK}
            className="admin-page admin-page--participants"
            title={title}
            location={location}>
            {isLoaded && (
                <PageContent parentSection={parentSection}>
                    {header}
                    {lesson && lesson.assignment ? (
                        <div className="layout__content-block">
                            <HomeworkAssignment assignment={lesson.assignment}/>
                        </div>
                    ) : (
                        <div className="layout__content-block layout__content-block--transparent">
                            <div className="text-center font-size-sm">Нет домашнего задания</div>
                        </div>
                    )}
                </PageContent>
            )}
        </Page>
    );
};

export default AssignmentPage;
