import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import {useSubjects, useTeacherCourses} from "store";
import {PERMISSIONS} from "definitions/constants";

const filterBy = {
    search: true,
    subject: true,
    online: true
};

const CourseCatalogPage = ({location, path, children: header}) => {
    const {catalog, error, retry} = useTeacherCourses();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();

    const renderCourse = useCallback((course, {link, ...rest}) => {
        const {id} = course;
        const courseLink = `${path}/${link}`;
        return (
            <Course
                course={course}
                selectable
                key={id}
                link={courseLink}
                noOnClickOnAction
                {...rest}>
            </Course>
        )
    }, [path]);
    const isLoaded = catalog && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={PERMISSIONS.HOMEWORK_CHECK}
            className="admin-page admin-page--courses"
            title="Проверка работ"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <CourseCatalog.Body
                        subjects={subjects}
                        courses={catalog}>
                        {header}
                        <CourseCatalog.Filter filterBy={filterBy}/>
                        <CourseCatalog.Catalog
                            adaptive={false}
                            plain
                            renderCourse={renderCourse}/>
                    </CourseCatalog.Body>
                </PageContent>
            )}
        </Page>
    );
};

export default CourseCatalogPage;
