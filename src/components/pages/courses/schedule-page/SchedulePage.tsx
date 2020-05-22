import CourseSchedule from 'components/common/CourseSchedule';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useUserCourses} from 'modules/courses/courses.hooks';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import {useUpcomingWebinars} from 'modules/webinars/webinars.hooks';
import React, {useCallback} from 'react';
import {CourseInfo, PersonWebinar} from 'types/entities';
import {RouteComponentPropsWithParentProps} from 'types/routes';

const SchedulePage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {location, url} = props;
  const {
    courses,
    error: errorLoadingCourses,
    reload: reloadCourses,
  } = useUserCourses();
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {
    webinars,
    error: errorLoadingWebinars,
    reload: reloadWebinars,
  } = useUpcomingWebinars();

  const getCourseLink = useCallback(
    (course: CourseInfo) => `${url}/${course.id}/`,
    [url],
  );
  const getWebinarLink = useCallback(
    (webinar: PersonWebinar) => `${url}/${webinar.course_id}/`,
    [url],
  );

  const isLoaded = !!(courses && subjects && webinars);

  return (
    <Page
      isLoaded={isLoaded}
      className="user-courses"
      location={location}
      title="Мои курсы"
      errors={[errorLoadingCourses, errorLoadingSubjects, errorLoadingWebinars]}
      reloadCallbacks={[reloadCourses, reloadSubjects, reloadWebinars]}
    >
      {!!(courses && subjects && webinars) && (
        <PageContent>
          <ContentBlock transparent>
            <CourseSchedule
              courses={courses}
              webinars={webinars}
              displayCourseSpan={false}
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
