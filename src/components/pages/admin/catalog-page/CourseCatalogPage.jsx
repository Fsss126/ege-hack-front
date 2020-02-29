import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useAdminCourses, useSubjects} from "store/selectors";
import {Link} from "react-router-dom";
import {ADMIN_ROLES} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import {useCheckPermissions} from "components/ConditionalRender";
import {useDeleteCourse} from "store/selectors";
import {Permission} from "../../../../types/enums";

const filterBy = {
    search: true,
    subject: true,
    online: true
};

const CourseCatalogPage = ({location, path, children: header}) => {
    const {catalog, error, retry} = useAdminCourses();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();

    const onDelete = useDeleteCourse();

    const canEdit = useCheckPermissions(Permission.COURSE_EDIT);

    const renderCourse = useCallback((course, {link, ...rest}) => {
        const {id, hide_from_market} = course;
        const courseLink = `${path}/${link}`;
        const deleteCallback = () => { onDelete(id) };
        return (
            <Course
                course={course}
                selectable
                key={id}
                link={courseLink}
                noOnClickOnAction
                action={canEdit && (
                    <DropdownMenu
                        content={<DropdownIconButton className="icon-ellipsis"/>}>
                        <DropdownMenuOption
                            tag={Link}
                            to={`${courseLink}edit/`}>
                            <i className="far fa-edit"/>Изменить
                        </DropdownMenuOption>
                        <DropdownMenuOption onClick={deleteCallback}>
                            <i className="icon-close"/>Удалить
                        </DropdownMenuOption>
                        <DropdownMenuOption
                            tag={Link}
                            to={`${courseLink}lessons/create/`}>
                            <i className="icon-add"/>Добавить урок
                        </DropdownMenuOption>
                        {!hide_from_market && (
                            <DropdownMenuOption
                                tag={Link}
                                to={`/shop/${id}/`}>
                                <i className="icon-logout"/>Открыть в магазине
                            </DropdownMenuOption>
                        )}
                    </DropdownMenu>
                )}
                {...rest}/>
        )
    }, [canEdit, onDelete, path]);
    const isLoaded = !!(catalog && subjects);
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
