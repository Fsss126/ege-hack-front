import React, {useCallback} from "react";
import {Link} from "react-router-dom";
import {PERMISSIONS} from "definitions/constants";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import Page, {PageContent} from "components/Page";
import Lesson from "components/common/Lesson";
import Catalog from "components/common/Catalog";
import Button from "components/ui/Button";

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
    const renderLesson = useCallback((lesson, {link, ...rest}) => {
        const {id, locked} = lesson;
        const courseLink = `${path}/${courseId}/${link}`;

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
                {
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
                    </DropdownMenu>
                }
            </Lesson>
        );
    }, [path, courseId]);
    const title = course && `Уроки курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={PERMISSIONS.COURSE_EDIT}
            className="admin-page admin-page--lessons"
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={lessons}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        <div className="layout__content-block layout__content-block--stacked d-flex">
                            <Button
                                neutral
                                tag={Link}
                                to={`${path}/${courseId}/create_lesson/`}
                                icon={<i className="icon-add"/>}>
                                Добавить урок
                            </Button>
                        </div>
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
