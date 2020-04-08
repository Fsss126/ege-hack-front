import CourseOverview from 'components/common/CourseOverview';
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

const CoursePage = ({path, match, location, ...props}) => {
  const {
    params: {id: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {course, error, retry} = useUserCourse(courseId);
  const {
    webinars,
    error: errorLoadingWebinars,
    retry: reloadWebinars,
  } = useCourseWebinars(courseId);
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useTeachers();
  const {
    lessons,
    error: errorLoadingLessons,
    retry: reloadLessons,
  } = useLessons(courseId);
  const renderLesson = (lesson, {link, ...props}) => {
    const {date, id, locked} = lesson;

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
      ></Lesson>
    );
  };

  if (course && lessons && teachers && webinars) {
    return (
      <CourseOverview.Body
        path={path}
        course={course}
        lessons={lessons}
        teachers={teachers}
        location={location}
      >
        <PageContent parentSection={{name: 'Мои курсы'}}>
          <CourseOverview.Title />
          <WebinarSchedule schedule={webinars} courseId={courseId} />
          <CourseOverview.Lessons renderLesson={renderLesson} />
        </PageContent>
      </CourseOverview.Body>
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default CoursePage;
