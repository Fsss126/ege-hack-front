import Lesson from 'components/common/Lesson';
import List, {ListItemRenderer} from 'components/common/List';
import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import Page, {PageContent} from 'components/layout/Page';
import {useHomework, useLessons, useUserCourses} from 'hooks/selectors';
import _ from 'lodash';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {LessonInfo} from 'types/entities';
import {LessonPageParams} from 'types/routes';

import LessonView from './LessonView';

const LessonPage: React.FC<RouteComponentProps<LessonPageParams>> = (props) => {
  const {
    match: {
      params: {courseId: param_course, lessonId: param_lesson},
    },
    location,
  } = props;
  const courseId = parseInt(param_course);
  const lessonId = parseInt(param_lesson);

  const {courses, error, reload} = useUserCourses();
  // const {teachers, error: errorLoadingTeachers, reload: reloadTeachers} = useTeachers();
  const {
    lessons,
    error: errorLoadingLessons,
    reload: reloadLessons,
  } = useLessons(courseId);
  const {
    homework,
    error: errorLoadingHomework,
    reload: reloadHomework,
  } = useHomework(lessonId);
  const renderLesson: ListItemRenderer<LessonInfo> = (lesson, renderProps) => {
    const {id, locked} = lesson;

    return (
      <Lesson
        lesson={lesson}
        locked={locked}
        selectable={!locked}
        key={id}
        link={`../${lesson.id}/`}
        {...renderProps}
      />
    );
  };

  if (courses && lessons && homework !== undefined) {
    const course = _.find(courses, {id: courseId});
    const selectedLesson = (course && _.find(lessons, {id: lessonId})) || null;

    if (course && selectedLesson && !selectedLesson.locked) {
      let nextVideo: LessonInfo | null = lessons[selectedLesson.num + 1];

      if (!nextVideo || nextVideo.locked) {
        nextVideo = null;
      }
      const otherLessons = _.sortBy(
        lessons.filter(
          (lesson) =>
            lesson.id !== selectedLesson.id &&
            (nextVideo ? lesson.id !== nextVideo.id : true),
        ),
        'num',
      );

      return (
        <Page
          isLoaded={true}
          title={`${selectedLesson.name}`}
          className="lesson-page"
          location={location}
        >
          <PageContent parentSection={{name: course.name}}>
            <div className="layout__content-block layout__content-block--transparent">
              <div className="container p-lg-0">
                <div className="row align-items-start">
                  <LessonView lesson={selectedLesson} homework={homework} />
                  <div className="col-12 col-xl-auto layout__content-block layout__content-block--transparent lesson-page__other-lessons">
                    {nextVideo && <h3>Следующее занятие</h3>}
                    {nextVideo && (
                      <List renderItem={renderLesson}>{[nextVideo]}</List>
                    )}
                    {otherLessons && otherLessons.length > 0 && (
                      <React.Fragment>
                        <h3>Другие занятия</h3>
                        <List renderItem={renderLesson}>{otherLessons}</List>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </PageContent>
        </Page>
      );
    } else {
      return <NotFoundErrorPage message="Урок не найден" location={location} />;
    }
  } else {
    return <Page isLoaded={false} location={location} />;
  }
};

export default LessonPage;
