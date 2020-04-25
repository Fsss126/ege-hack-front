import Course from 'components/common/Course';
import CourseCatalog from 'components/common/CourseCatalog';
import WebinarSchedule from 'components/common/WebinarSchedule';
import Page, {PageContent} from 'components/Page';
import Button from 'components/ui/Button';
import {
  useSubjects,
  useUpcomingWebinars,
  useUserCourses,
} from 'hooks/selectors';
import React from 'react';
import {LearningStatus} from 'types/enums';
import {RouteComponentPropsWithPath} from 'types/routes';

const CatalogPage: React.FC<RouteComponentPropsWithPath> = (props) => {
  const {location} = props;
  const {courses, error, reload} = useUserCourses();
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

  return (
    <Page
      isLoaded={isLoaded}
      className="user-courses"
      location={location}
      title="Мои курсы"
    >
      {!!(courses && subjects && webinars) && (
        <CourseCatalog.Body courses={courses} subjects={subjects}>
          <PageContent>
            <CourseCatalog.Filter />
            <WebinarSchedule schedule={webinars} />
            <CourseCatalog.Catalog renderCourse={renderCourse} />
          </PageContent>
        </CourseCatalog.Body>
      )}
    </Page>
  );
};

export default CatalogPage;