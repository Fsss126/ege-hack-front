import React, {useCallback} from "react";
import classnames from 'classnames';
import {Link} from "react-router-dom";
import DropdownMenu, {DropdownIconButton, DropdownMenuOption} from "components/common/DropdownMenu";
import Page, {PageContent, PageParentSection} from "components/Page";
import Catalog, {CatalogFilter, CatalogItemRenderer} from "components/common/Catalog";
import Button from "components/ui/Button";
import {RequiredPermissions, useCheckPermissions} from "components/ConditionalRender";
import {useDeleteLesson} from "store/selectors";
import {Permission} from "types/enums";
import {CourseInfo, LessonInfo} from "types/entities";
import {RouteComponentProps} from "react-router";

const filterBy = {
    search: true,
    subject: false,
    online: false
};

const filter: CatalogFilter<LessonInfo> = (lesson, {subject, online, search}) => {
    const name = lesson.name.toLowerCase().replace(/\s/g, '');
    const searchKey = search.toLowerCase().replace(/\s/g, '');
    return search ? name.includes(searchKey) : true
};

export type LessonRenderer = CatalogItemRenderer<LessonInfo, {action?: React.ReactElement}>;
export type LessonsPageProps = RouteComponentProps<{courseId: string}> & {
    path: string;
    parentSection?: PageParentSection;
    children: React.ReactNode;
    course?: CourseInfo;
    lessons?: LessonInfo[];
    requiredPermissions?: RequiredPermissions;
    renderLesson: LessonRenderer;
    className?: string;
    isLoaded: boolean;
}
const LessonsPage: React.FC<LessonsPageProps> = (props) => {
    const {location, path, match, children: header, course, lessons, isLoaded, parentSection, requiredPermissions, renderLesson: render, className} = props;
    const {params: {courseId: param_id}} = match;
    const courseId = parseInt(param_id);

    const canEdit = useCheckPermissions(Permission.LESSON_EDIT);

    const onDelete = useDeleteLesson();

    const renderLesson: CatalogItemRenderer<LessonInfo> = useCallback((lesson, {link, ...rest}, index) => {
        const {id, course_id} = lesson;
        const lessonLink = `${path}/${course_id}/${link}`;

        const deleteCallback = (): void => { onDelete(course_id, id); };
        return render(lesson, {
            ...rest,
            link: lessonLink,
            action: canEdit ? (
                <DropdownMenu
                    content={<DropdownIconButton className="icon-ellipsis"/>}>
                    <DropdownMenuOption
                        tag={Link}
                        to={`/admin/${course_id}/${link}edit/`}>
                        <i className="far fa-edit"/>Изменить
                    </DropdownMenuOption>
                    <DropdownMenuOption onClick={deleteCallback}>
                        <i className="icon-close"/>Удалить
                    </DropdownMenuOption>
                </DropdownMenu>
            ) : undefined
        }, index);
    }, [path, canEdit, onDelete, render]);
    const title = course && `Уроки курса ${course.name}`;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            requiredPermissions={requiredPermissions}
            className={classnames('admin-page', 'admin-page--lessons', className)}
            title={title}
            location={location}>
            {isLoaded && (
                <Catalog.Body
                    items={lessons as LessonInfo[]}
                    filter={filter}>
                    <PageContent parentSection={parentSection}>
                        {header}
                        {canEdit && (
                            <div className="layout__content-block layout__content-block--stacked d-flex">
                                <Button
                                    neutral
                                    tag={Link}
                                    to={`/admin/${courseId}/lessons/create/`}
                                    icon={<i className="icon-add"/>}>
                                    Добавить урок
                                </Button>
                            </div>
                        )}
                        <Catalog.Filter filterBy={filterBy}/>
                        <Catalog.Catalog
                            className="users-list"
                            emptyPlaceholder="Нет уроков"
                            noMatchPlaceholder="Нет совпадающих уроков"
                            plain
                            renderItem={renderLesson}/>
                    </PageContent>
                </Catalog.Body>
            )}
        </Page>
    );
};

export default LessonsPage;
