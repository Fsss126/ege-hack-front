import CourseOverview from 'components/common/CourseOverview';
import Lesson from 'components/common/Lesson';
import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import Page, {PageContent} from 'components/layout/Page';
import {
  useDiscount,
  useLessons,
  useShopCourse,
  useTeachers,
} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {CourseInfo} from 'types/entities';
import {CoursePageParams, RouteComponentPropsWithPath} from 'types/routes';

import CoursePrice from './CoursePrice';

interface CoursePageProps
  extends RouteComponentPropsWithPath<CoursePageParams> {
  selectedCourses: Set<CourseInfo>;
  onCourseSelect: (course: CourseInfo) => void;
  children: React.ReactNode;
}

const CoursePage: React.FC<CoursePageProps> = (props) => {
  const {
    selectedCourses,
    onCourseSelect,
    children: selectedCoursesTab,
    path: root,
    location,
    match,
  } = props;
  const {
    params: {courseId: param_id},
  } = match;
  const courseId = parseInt(param_id);
  const {course, error, reload} = useShopCourse(courseId);
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
  const {
    discount,
    isLoading,
    error: errorLoadingDiscount,
    reload: reloadDiscount,
  } = useDiscount(courseId);
  const isSelected = !!(course && selectedCourses.has(course));

  const renderLesson = useCallback(
    (lesson) => {
      const {id, locked} = lesson;
      const isSelectable = course && course.purchased;
      const link = isSelectable ? `/courses/${courseId}/${id}` : undefined;

      return (
        <Lesson
          lesson={lesson}
          selectable={isSelectable && !locked}
          locked={isSelectable ? locked : false}
          link={link}
          key={id}
        />
      );
    },
    [course, courseId],
  );

  if (course && teachers && lessons) {
    return (
      <CourseOverview.Body
        path={root}
        course={course}
        teachers={teachers}
        lessons={lessons}
        location={location}
      >
        <div>
          <PageContent parentSection={{name: 'Магазин курсов'}}>
            <CourseOverview.Description />
            <CoursePrice
              isSelected={isSelected}
              discount={discount}
              onSelect={onCourseSelect}
              error={errorLoadingDiscount}
              reload={reloadDiscount}
            />
            <CourseOverview.Teachers />
            <CourseOverview.Lessons renderLesson={renderLesson} />
          </PageContent>
        </div>
        {selectedCoursesTab}
      </CourseOverview.Body>
    );
  } else if (error) {
    return (
      <NotFoundErrorPage
        message="Курс не найден"
        url={root}
        location={location}
      />
    );
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default CoursePage;
