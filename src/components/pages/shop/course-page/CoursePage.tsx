import CourseOverview from 'components/common/CourseOverview';
import Lesson from 'components/common/Lesson';
import {PageContent} from 'components/layout/Page';
import {
  useDiscount,
  useLessons,
  useShopCourse,
  useUserTeachers,
} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {CourseInfo} from 'types/entities';
import {
  CoursePageParams,
  RouteComponentPropsWithParentProps,
} from 'types/routes';

import CoursePrice from './CoursePrice';

interface CoursePageProps
  extends RouteComponentPropsWithParentProps<CoursePageParams> {
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
  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useShopCourse(courseId);
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

  const isLoaded = !!(course && teachers && lessons);

  let content;

  if (course && teachers && lessons) {
    content = (
      <>
        <div>
          <PageContent parentSection={{name: 'Магазин курсов'}}>
            <CourseOverview.Description />
            <CoursePrice
              isLoading={isLoading}
              isSelected={isSelected}
              discount={discount}
              onSelect={onCourseSelect}
              error={errorLoadingDiscount}
              reload={reloadDiscount}
            />
          </PageContent>
          <CourseOverview.Teachers />
          <PageContent>
            <CourseOverview.Lessons renderLesson={renderLesson} />
          </PageContent>
        </div>
        {selectedCoursesTab}
      </>
    );
  }

  return (
    <CourseOverview.Body
      isLoaded={isLoaded}
      path={root}
      course={course}
      teachers={teachers}
      lessons={lessons}
      errors={[errorLoadingCourse, errorLoadingLessons, errorLoadingTeachers]}
      reloadCallbacks={[reloadCourse, reloadLessons, reloadTeachers]}
      location={location}
    >
      {content}
    </CourseOverview.Body>
  );
};

export default CoursePage;
