import classNames from 'classnames';
import Catalog, {
  CatalogItemRenderer,
  FilterFunc,
} from 'components/common/Catalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import ConditionalRenderer, {
  RequiredPermissions,
  useCheckPermissions,
} from 'components/ConditionalRender';
import {ButtonsBlock} from 'components/layout/ButtonsBlock';
import Page, {PageContent, PageParentSection} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {useDeleteKnowledgeTest} from 'hooks/selectors';
import {useDeleteLesson} from 'modules/lessons/lessons.hooks';
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

  const onDeleteLesson = useDeleteLesson();
  const onDeleteTest = useDeleteKnowledgeTest();

  const courseLink = `/admin/courses/${courseId}`;

  const renderLesson: CatalogItemRenderer<LessonInfo> = useCallback(
    (lesson, {link, ...rest}, index) => {
      const {id, course_id, test_id} = lesson;
      const lessonLink = `${path}/${course_id}/${link}`;
      const adminLink = `${courseLink}/${link}`;

      const deleteLessonCallback = (): void => {
        onDeleteLesson(course_id, id);
      };

      const deleteTestCallback =
        test_id !== undefined
          ? (): void => {
              onDeleteTest(course_id, id, test_id);
            }
          : undefined;

      return render(
        lesson,
        {
          ...rest,
          link: lessonLink,
          action: canEdit ? (
            <DropdownMenu
              content={<DropdownIconButton className="icon-ellipsis" />}
            >
              <DropdownMenuOption component={Link} to={`${adminLink}edit/`}>
                <i className="far fa-edit" />
                Изменить
              </DropdownMenuOption>
              <DropdownMenuOption onClick={deleteLessonCallback}>
                <i className="icon-close" />
                Удалить
              </DropdownMenuOption>
              <ConditionalRenderer requiredPermissions={Permission.TEST_EDIT}>
                {test_id !== undefined ? (
                  <>
                    <DropdownMenuOption
                      component={Link}
                      to={`${adminLink}test/edit`}
                    >
                      <i className="far fa-edit" />
                      Изменить тест
                    </DropdownMenuOption>
                    <DropdownMenuOption onClick={deleteTestCallback}>
                      <i className="icon-close" />
                      Удалить тест
                    </DropdownMenuOption>
                  </>
                ) : (
                  <DropdownMenuOption
                    component={Link}
                    to={`${adminLink}test/create/`}
                  >
                    <i className="icon-add" />
                    Добавить тест
                  </DropdownMenuOption>
                )}
              </ConditionalRenderer>
            </DropdownMenu>
          ) : undefined,
        },
        index,
      );
    },
    [path, courseLink, render, canEdit, onDeleteLesson, onDeleteTest],
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
