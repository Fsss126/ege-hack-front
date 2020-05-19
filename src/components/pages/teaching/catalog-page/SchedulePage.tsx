import CourseSchedule from 'components/common/CourseSchedule';
import {useCheckPermissions} from 'components/ConditionalRender';
import {ButtonsBlock} from 'components/layout/ButtonsBlock';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {ADMIN_ROLES} from 'definitions/constants';
import {useAdminCourses, useSubjects, useTeacherCourses} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {CourseInfo, PersonWebinar} from 'types/entities';
import {Permission} from 'types/enums';
import {RouteComponentPropsWithParentProps} from 'types/routes';

export type CourseCatalogPageProps = RouteComponentPropsWithParentProps & {
  children: React.ReactElement;
};

const SchedulePage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {location, path, children: header, url} = props;
  const {
    catalog,
    error: errorLoadingCatalog,
    reload: reloadCatalog,
  } = useTeacherCourses();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const getCourseLink = useCallback(
    (course: CourseInfo) => `${url}/${course.id}/lessons/`,
    [url],
  );
  const getWebinarLink = useCallback(
    (webinar: PersonWebinar) => `${url}/${webinar.course_id}/webinars/`,
    [url],
  );

  const isLoaded = !!catalog;

  return (
    <Page
      isLoaded={isLoaded}
      loadUserInfo
      requiredPermissions={Permission.HOMEWORK_CHECK}
      fullMatch={false}
      className="admin-page admin-page--courses"
      title="Управление курсами"
      location={location}
      errors={[errorLoadingCatalog, errorLoadingSubjects]}
      reloadCallbacks={[reloadCatalog, reloadSubjects]}
    >
      {!!catalog && (
        <PageContent>
          {header}
          <ContentBlock>
            <CourseSchedule
              courses={catalog}
              weekMode={false}
              getCourseLink={getCourseLink}
              getWebinarLink={getWebinarLink}
            />
          </ContentBlock>
        </PageContent>
      )}
    </Page>
  );
};

export default SchedulePage;
