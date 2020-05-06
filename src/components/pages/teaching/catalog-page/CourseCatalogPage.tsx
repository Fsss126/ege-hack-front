import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import Page, {PageContent} from 'components/layout/Page';
import {useSubjects, useTeacherCourses} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithPath} from 'types/routes';

const filterBy = {
  search: true,
  subject: true,
  online: true,
};

const CourseCatalogPage: React.FC<RouteComponentPropsWithPath> = (props) => {
  const {location, path, children: header} = props;
  const {
    catalog,
    error: errorLoadingCourses,
    reload: reloadCourses,
  } = useTeacherCourses();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const renderCourse = useCallback(
    (course, {link, ...rest}) => {
      const {id} = course;
      const courseLink = `${path}/${link}`;

      return (
        <Course
          course={course}
          selectable
          key={id}
          link={courseLink}
          noOnClickOnAction
          {...rest}
        />
      );
    },
    [path],
  );
  const isLoaded = !!(catalog && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredPermissions={Permission.HOMEWORK_CHECK}
      className="admin-page admin-page--courses"
      title="Проверка работ"
      errors={[errorLoadingCourses, errorLoadingSubjects]}
      reloadCallbacks={[reloadCourses, reloadSubjects]}
      location={location}
    >
      {isLoaded && catalog && subjects && (
        <PageContent>
          <CourseCatalog.Body subjects={subjects} courses={catalog}>
            {header}
            <CourseCatalog.Filter filterBy={filterBy} stacked />
            <CourseCatalog.Catalog plain renderCourse={renderCourse} />
          </CourseCatalog.Body>
        </PageContent>
      )}
    </Page>
  );
};

export default CourseCatalogPage;
