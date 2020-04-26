import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import DropdownMenu, {
  DropdownIconButton,
  DropdownMenuOption,
} from 'components/common/DropdownMenu';
import {useCheckPermissions} from 'components/ConditionalRender';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {ADMIN_ROLES} from 'definitions/constants';
import {useAdminCourses, useDeleteCourse, useSubjects} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {CourseInfo, SubjectInfo} from 'types/entities';
import {Permission} from 'types/enums';

const filterBy = {
  search: true,
  subject: true,
  online: true,
};

export type CourseCatalogPageProps = RouteComponentProps & {
  path: string;
  children: React.ReactElement;
};
const CourseCatalogPage: React.FC<CourseCatalogPageProps> = (props) => {
  const {location, path, children: header} = props;
  const {catalog, error, reload} = useAdminCourses();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const onDelete = useDeleteCourse();

  const canEdit = useCheckPermissions(Permission.COURSE_EDIT);

  const renderCourse = useCallback(
    (course, {link, ...rest}) => {
      const {id, hide_from_market} = course;
      const courseLink = `${path}/${link}`;
      const deleteCallback = (): void => {
        onDelete(id);
      };

      return (
        <Course
          course={course}
          selectable
          key={id}
          link={courseLink}
          noOnClickOnAction
          action={
            canEdit && (
              <DropdownMenu
                content={<DropdownIconButton className="icon-ellipsis" />}
              >
                <DropdownMenuOption component={Link} to={`${courseLink}edit/`}>
                  <i className="far fa-edit" />
                  Изменить
                </DropdownMenuOption>
                <DropdownMenuOption onClick={deleteCallback}>
                  <i className="icon-close" />
                  Удалить
                </DropdownMenuOption>
                <DropdownMenuOption
                  component={Link}
                  to={`${courseLink}lessons/create/`}
                >
                  <i className="icon-add" />
                  Добавить урок
                </DropdownMenuOption>
                {!hide_from_market && (
                  <DropdownMenuOption component={Link} to={`/shop/${id}/`}>
                    <i className="icon-logout" />
                    Открыть в магазине
                  </DropdownMenuOption>
                )}
              </DropdownMenu>
            )
          }
          {...rest}
        />
      );
    },
    [canEdit, onDelete, path],
  );
  const isLoaded = !!(catalog && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredRoles={ADMIN_ROLES}
      fullMatch={false}
      className="admin-page admin-page--courses"
      title="Управление курсами"
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <CourseCatalog.Body
            subjects={subjects as SubjectInfo[]}
            courses={catalog as CourseInfo[]}
          >
            {header}
            {canEdit && (
              <div className="layout__content-block layout__content-block--stacked d-flex">
                <Button
                  neutral
                  component={Link}
                  to={`${path}/create/`}
                  after={<i className="icon-add" />}
                >
                  Добавить курс
                </Button>
              </div>
            )}
            <CourseCatalog.Filter filterBy={filterBy} />
            <CourseCatalog.Catalog plain renderCourse={renderCourse} />
          </CourseCatalog.Body>
        </PageContent>
      )}
    </Page>
  );
};

export default CourseCatalogPage;
