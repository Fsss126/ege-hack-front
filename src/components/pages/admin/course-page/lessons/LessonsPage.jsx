import React, {useCallback} from "react";
import {Link} from "react-router-dom";
import {ADMIN_ROLES, PERMISSIONS} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import Page, {PageContent} from "components/Page";
import Lesson from "components/common/Lesson";
import Catalog from "components/common/Catalog";
import Button from "components/ui/Button";
import {useCheckPermissions} from "components/ConditionalRender";
import {useDeleteLesson} from "store";
import {PermissionsDeniedErrorPage} from "../../../../ErrorPage";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter = (lesson, {subject, online, search}) => {
    const name = lesson.name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? name.includes(searchKey) : true
};

const LessonsPage = ({location, path, match, children: header, course, lessons, isLoaded, parentSection}) => {
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);

    const canEdit = useCheckPermissions(PERMISSIONS.LESSON_EDIT);

    const onDelete = useDeleteLesson();

    const renderLesson = useCallback((lesson, {link, ...rest}) => {
        const {id, locked} = lesson;
        const courseLink = `${path}/${courseId}/${link}`;

        const deleteCallback = () => { onDelete(courseId, id); };
        return (
            <Lesson
                lesson={lesson}
                locked={locked}
                selectable={true}
                key={id}
                noOnClickOnAction
                link={link}
                {...rest}>
                {/*<div className="list__item-action-info">{renderDate(date, renderDate.shortDate)}</div>*/}
                {canEdit && (
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
                    </DropdownMenu>
                )}
            </Lesson>
        );
    }, [path, courseId, canEdit, onDelete]);
    const title = course && `Уроки курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={PERMISSIONS.LESSON_EDIT}
            className="admin-page admin-page--lessons"
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={lessons}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        {canEdit && (
                            <div className="layout__content-block layout__content-block--stacked d-flex">
                                <Button
                                    neutral
                                    tag={Link}
                                    to={`${path}/${courseId}/lessons/create/`}
                                    icon={<i className="icon-add"/>}>
                                    Добавить урок
                                </Button>
                            </div>
                        )}
                        <Catalog.Filter filterBy={filterBy}/>
                        <Catalog.Catalog
                            className="users-list"
                            emptyPlaceholder="Нет уроков"
                            noMatchplaceholder="Нет совпадающих уроков"
                            adaptive={false}
                            plain
                            renderItem={renderLesson}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default LessonsPage;
