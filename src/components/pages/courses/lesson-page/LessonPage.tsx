import Lesson from 'components/common/Lesson';
import List, {ListItemRenderer} from 'components/common/List';
import {ContentBlock} from 'components/layout/ContentBlock';
import {NotFoundErrorPage} from 'components/layout/ErrorPage';
import Page, {PageContent} from 'components/layout/Page';
import {useUserHomework} from 'hooks/selectors';
import _ from 'lodash';
import {useUserCourses} from 'modules/courses/courses.hooks';
import {useLessons} from 'modules/lessons/lessons.hooks';
import {useTestStatus} from 'modules/testing/testing.hooks';
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

  const {
    courses,
    error: errorLoadingCourses,
    reload: reloadCourses,
  } = useUserCourses();
  const {
    lessons,
    error: errorLoadingLessons,
    reload: reloadLessons,
  } = useLessons(courseId);
  const {
    homework,
    error: errorLoadingHomework,
    reload: reloadHomework,
  } = useUserHomework(courseId, lessonId);
  const {status, error: errorLoadingTest, reload: reloadTest} = useTestStatus(
    courseId,
    lessonId,
  );
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

  if (courses && lessons && homework !== undefined && status !== undefined) {
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
            <ContentBlock
              transparent
              className="lesson-page__top-content-block"
            >
              <div className="container p-lg-0">
                <div className="row align-items-start">
                  <LessonView
                    lesson={selectedLesson}
                    testStatus={status}
                    homework={homework}
                  />
                  <ContentBlock
                    transparent
                    className="col-12 col-xl-auto lesson-page__other-lessons"
                  >
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
                  </ContentBlock>
                </div>
              </div>
            </ContentBlock>
          </PageContent>
        </Page>
      );
    } else {
      return <NotFoundErrorPage message="Урок не найден" location={location} />;
    }
  } else {
    return (
      <Page
        isLoaded={false}
        location={location}
        errors={[
          errorLoadingCourses,
          errorLoadingLessons,
          errorLoadingHomework,
          errorLoadingTest,
        ]}
        reloadCallbacks={[
          reloadCourses,
          reloadLessons,
          reloadHomework,
          reloadTest,
        ]}
      />
    );
  }
};

export default LessonPage;
