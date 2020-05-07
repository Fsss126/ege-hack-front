import classNames from 'classnames';
import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {
  RequiredPermissions,
  useCheckPermissions,
} from 'components/ConditionalRender';
import {ButtonsBlock} from 'components/layout/ButtonsBlock';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {useDeleteLesson} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {CourseInfo, LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {
  CoursePageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';
import {SimpleCallback} from 'types/utility/common';

const filterBy = {
  search: true,
  subject: false,
  online: false,
};

const filter: FilterFunc<LessonInfo> = (lesson, {search}) => {
  const name = lesson.name.toLowerCase().replace(/\s/g, '');
  const searchKey = search.toLowerCase().replace(/\s/g, '');

  return search ? name.includes(searchKey) : true;
};

export type LessonRenderer = CatalogItemRenderer<
  LessonInfo,
  {action?: React.ReactElement}
>;

export type LessonsPageProps = RouteComponentPropsWithParentProps<
  CoursePageParams
> & {
  parentSection?: PageParentSection;
  children: React.ReactNode;
  course?: CourseInfo;
  lessons?: LessonInfo[];
  requiredPermissions?: RequiredPermissions;
  renderLesson: LessonRenderer;
  className?: string;
  isLoaded: boolean;
  errors?: any[];
  reloadCallbacks: SimpleCallback[];
};
const LessonsPage: React.FC<LessonsPageProps> = (props) => {
  const {
    location,
    path,
    match,
    children: header,
    course,
    lessons,
    isLoaded,
    parentSection,
    requiredPermissions,
    renderLesson: render,
    className,
    errors,
    reloadCallbacks,
  } = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);

  const canEdit = useCheckPermissions(Permission.LESSON_EDIT);

  const onDelete = useDeleteLesson();

  const courseLink = `/admin/courses/${courseId}`;

  const renderLesson: CatalogItemRenderer<LessonInfo> = useCallback(
    (lesson, {link, ...rest}, index) => {
      const {id, course_id} = lesson;
      const lessonLink = `${path}/${course_id}/${link}`;

      const deleteCallback = (): void => {
        onDelete(course_id, id);
      };

      return render(
        lesson,
        {
          ...rest,
          link: lessonLink,
          action: canEdit ? (
            <DropdownMenu
              content={<DropdownIconButton className="icon-ellipsis" />}
            >
              <DropdownMenuOption component={Link} to={`${lessonLink}edit/`}>
                <i className="far fa-edit" />
                Изменить
              </DropdownMenuOption>
              <DropdownMenuOption onClick={deleteCallback}>
                <i className="icon-close" />
                Удалить
              </DropdownMenuOption>
            </DropdownMenu>
          ) : undefined,
        },
        index,
      );
    },
    [path, render, canEdit, onDelete],
  );
  const title = course && `Уроки курса ${course.name}`;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredPermissions={requiredPermissions}
      className={classNames('admin-page', 'admin-page--lessons', className)}
      title={title}
      errors={errors}
      reloadCallbacks={reloadCallbacks}
      location={location}
    >
      {isLoaded && (
        <Catalog.Body items={lessons as LessonInfo[]} filter={filter}>
          <PageContent parentSection={parentSection}>
            {header}
            {canEdit && (
              <ButtonsBlock stacked>
                <Button
                  neutral
                  component={Link}
                  to={`${courseLink}/lessons/create/`}
                  after={<i className="icon-add" />}
                >
                  Добавить урок
                </Button>
              </ButtonsBlock>
            )}
            <Catalog.Filter filterBy={filterBy} />
            <Catalog.Catalog
              className="users-list"
              emptyPlaceholder="Нет уроков"
              noMatchPlaceholder="Нет совпадающих уроков"
              plain
              renderItem={renderLesson}
            />
          </PageContent>
        </Catalog.Body>
      )}
    </Page>
  );
};

export default LessonsPage;
