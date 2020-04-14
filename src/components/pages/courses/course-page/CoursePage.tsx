import CourseOverview, {LessonRenderer} from 'components/common/CourseOverview';
import Lesson from 'components/common/Lesson';
import WebinarSchedule from 'components/common/WebinarSchedule';
import Page, {PageContent} from 'components/Page';
import Button from 'components/ui/Button';
import {
  useCourseWebinars,
  useLessons,
  useTeachers,
  useUserCourse,
} from 'hooks/selectors';
import React from 'react';
import {CoursePageParams, RouteComponentPropsWithPath} from 'types/routes';

const CoursePage: React.FC<RouteComponentPropsWithPath<CoursePageParams>> = ({
  path,
  match,
  location,
  history,
}) => {
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {course, error, reload} = useUserCourse(courseId);
  const {
    webinars,
    error: errorLoadingWebinars,
    reload: reloadWebinars,
  } = useCourseWebinars(courseId);
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useTeachers();
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

  if (course && lessons && teachers && webinars) {
    return (
      <CourseOverview.Body
        match={match}
        history={history}
        path={path}
        course={course}
        lessons={lessons}
        teachers={teachers}
        location={location}
      >
        <PageContent parentSection={{name: 'Мои курсы'}}>
          <CourseOverview.Title />
          <WebinarSchedule schedule={webinars} />
          <CourseOverview.Lessons renderLesson={renderLesson} />
        </PageContent>
      </CourseOverview.Body>
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default CoursePage;
