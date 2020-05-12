import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useAdminCourse, useAdminWebinars, useSubjects} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {TestDtoReq, WebinarScheduleDtoReq} from 'types/dtos';
import {TestInfo, WebinarScheduleInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams, LessonPageParams} from 'types/routes';

import TestForm from './TestForm';

const TestCreatingPage: React.FC<RouteComponentProps<LessonPageParams>> = (
  props,
) => {
  const {
    match: {
      params: {courseId: param_course, lessonId: param_lesson},
    },
    location,
  } = props;
  const courseId = parseInt(param_course);
  const lessonId = parseInt(param_lesson);

  const {
    course,
    error: errorLoadingCourse,
    reload: reloadCourse,
  } = useAdminCourse(courseId);
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const createRequest = useCallback(
    (requestData: TestDtoReq): Promise<TestInfo> =>
      APIRequest.post(`/knowledge/tests`, requestData, {
        params: {
          lessonId,
        },
      }),
    [lessonId],
  );

  const returnLink = `/admin/courses/${courseId}/lessons/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage) => {
      showSuccessMessage('Изменения сохранены', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к вебинарам',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = !!(course && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.WEBINAR_EDIT}
      className="lesson-form-page"
      title="Создание теста"
      location={location}
      errors={[errorLoadingCourse, errorLoadingSubjects]}
      reloadCallbacks={[reloadCourse, reloadSubjects]}
    >
      {!!(course && subjects) && (
        <PageContent>
          <ContentBlock>
            <TestForm
              subjectId={course.subject_id}
              lessonId={lessonId}
              subjects={subjects}
              title="Новый тест"
              errorMessage="Ошибка при создании теста"
              cancelLink={returnLink}
              courseId={courseId}
              createRequest={createRequest}
              onSubmitted={onSubmitted}
            />
          </ContentBlock>
        </PageContent>
      )}
    </Page>
  );
};

export default TestCreatingPage;
