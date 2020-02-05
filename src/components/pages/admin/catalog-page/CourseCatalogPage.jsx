import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useAdminCourses, useSubjects} from "store";
import {Link} from "react-router-dom";
import {ADMIN_ROLES, PERMISSIONS} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import {useCheckPermissions} from "components/ConditionalRender";

const filterBy = {
    search: true,
    subject: true,
    online: true
};

//TODO: Editing mode
const CourseCatalogPage = ({location, path, children: header}) => {
    const {catalog, error, retry} = useAdminCourses();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();

    const canEdit = useCheckPermissions(PERMISSIONS.COURSE_EDIT);

    const renderCourse = useCallback((course, {link, ...rest}) => {
        const courseLink = `${path}/${link}`;
        return (
            <Course
                course={course}
                selectable
                key={course.id}
                link={courseLink}
                noOnClickOnAction
                {...rest}>
                {canEdit && (
                    <DropdownMenu
                        className="user-nav"
                        content={<DropdownIconButton className="icon-ellipsis"/>}>
                        <DropdownMenuOption
                            tag={Link}
                            to={`${courseLink}edit/`}>
                            <i className="far fa-edit"/>Изменить
                        </DropdownMenuOption>
                        <DropdownMenuOption>
                            <i className="icon-close"/>Удалить
                        </DropdownMenuOption>
                        <DropdownMenuOption
                            tag={Link}
                            to={`${courseLink}create_lesson/`}>
                            <i className="icon-add"/>Добавить урок
                        </DropdownMenuOption>
                    </DropdownMenu>
                )}
            </Course>
        )
    }, [canEdit]);
    const isLoaded = catalog && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredRoles={ADMIN_ROLES}
            fullMatch={false}
            className="admin-page admin-page--courses"
            title="Управление курсами"
            location={location}>
            {isLoaded && (
                <PageContent>
                    <CourseCatalog.Body
                        subjects={subjects}
                        courses={catalog}>
                        {header}
                        {canEdit && (
                            <div className="layout__content-block layout__content-block--stacked d-flex">
                                <Button
                                    neutral
                                    tag={Link}
                                    to={`${path}/create/`}
                                    icon={<i className="icon-add"/>}>
                                    Добавить курс
                                </Button>
                            </div>
                        )}
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
