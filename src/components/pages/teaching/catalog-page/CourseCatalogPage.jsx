import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useAdminCourses, useSubjects, useTeacherCourses} from "store";
import {Link} from "react-router-dom";
import {ADMIN_ROLES, PERMISSIONS, TEACHER_ROLES} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import {useCheckPermissions} from "components/ConditionalRender";
import {useDeleteCourse} from "store";

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
            requiredRoles={TEACHER_ROLES}
            fullMatch={false}
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
