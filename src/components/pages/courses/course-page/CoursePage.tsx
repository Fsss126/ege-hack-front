import CourseOverview, {LessonRenderer} from 'components/common/CourseOverview';
import Lesson from 'components/common/Lesson';
import WebinarSchedule from 'components/common/WebinarSchedule';
import {PageContent} from 'components/layout/Page';
import Button from 'components/ui/Button';
import {
  useCourseWebinars,
  useLessons,
  useUserCourse,
  useUserTeachers,
} from 'hooks/selectors';
import React from 'react';
import {CoursePageParams, RouteComponentPropsWithPath} from 'types/routes';

const CoursePage: React.FC<RouteComponentPropsWithPath<CoursePageParams>> = ({
  path,
  match,
  location,
}) => {
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useUserCourse(courseId);
  const {
    webinars,
    error: errorLoadingWebinars,
    reload: reloadWebinars,
  } = useCourseWebinars(courseId);
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useUserTeachers();
  const {
    lessons,
    error: errorLoadingLessons,
    reload: reloadLessons,
  } = useLessons(courseId);
  const renderLesson: LessonRenderer = (lesson, {link, ...props}) => {
    const {id, locked} = lesson;

    return (
      <Lesson
        lesson={lesson}
        locked={locked}
        selectable={!locked}
        key={id}
        action={
          !locked ? (
            <Button>Изучать</Button>
          ) : (
            <Button active={false}>Скоро</Button>
          )
        }
        link={locked ? undefined : link}
        {...props}
      />
    );
  };

  const isLoaded = !!(course && lessons && teachers && webinars);

  let content;

  if (course && lessons && teachers && webinars) {
    content = (
      <>
        <PageContent parentSection={{name: 'Мои курсы'}}>
          <CourseOverview.Title />
        </PageContent>
        <WebinarSchedule schedule={webinars} title="Вебинары" />
        <PageContent>
          <CourseOverview.Lessons renderLesson={renderLesson} />
        </PageContent>
      </>
    );
  }
  return (
    <CourseOverview.Body
      isLoaded={isLoaded}
      path={path}
      course={course}
      lessons={lessons}
      teachers={teachers}
      location={location}
      errors={[
        errorLoadingCourse,
        errorLoadingLessons,
        errorLoadingTeachers,
        errorLoadingWebinars,
      ]}
      reloadCallbacks={[
        reloadCourse,
        reloadLessons,
        reloadTeachers,
        reloadWebinars,
      ]}
    >
      {content}
    </CourseOverview.Body>
  );
};

export default CoursePage;
