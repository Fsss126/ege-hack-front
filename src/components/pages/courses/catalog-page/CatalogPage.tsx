import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import WebinarSchedule from 'components/common/WebinarSchedule';
import Page, {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {useUpcomingWebinars} from 'hooks/selectors';
import {useUserCourses} from 'modules/courses/courses.hooks';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import React from 'react';
import {LearningStatus} from 'types/enums';
import {RouteComponentPropsWithParentProps} from 'types/routes';

const CatalogPage: React.FC<RouteComponentPropsWithParentProps> = (props) => {
  const {location} = props;
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
  const renderCourse = React.useCallback(
    (course, renderProps) => (
      <Course
        course={course}
        selectable
        online={false}
        key={course.id}
        action={
          course.status === LearningStatus.LEARNING ? (
            <Button className="course__select-btn">Изучать</Button>
          ) : (
            <Button className="course__select-btn" active={false}>
              Пройден
            </Button>
          )
        }
        {...renderProps}
      />
    ),
    [],
  );
  const isLoaded = !!(courses && subjects && webinars);

  const title = 'Мои курсы';

  return (
    <Page
      isLoaded={isLoaded}
      className="user-courses"
      location={location}
      title={title}
      errors={[errorLoadingCourses, errorLoadingSubjects, errorLoadingWebinars]}
      reloadCallbacks={[reloadCourses, reloadSubjects, reloadWebinars]}
    >
      {!!(courses && subjects && webinars) && (
        <CourseCatalog.Body courses={courses} subjects={subjects}>
          <WebinarSchedule schedule={webinars} title="Ближайшие вебинары" />
          <PageContent>
            <CourseCatalog.Catalog
              renderCourse={renderCourse}
              title={title}
              filter={<CourseCatalog.Filter />}
            />
          </PageContent>
        </CourseCatalog.Body>
      )}
    </Page>
  );
};

export default CatalogPage;
