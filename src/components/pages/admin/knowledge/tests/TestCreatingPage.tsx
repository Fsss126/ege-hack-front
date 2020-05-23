import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useAdminCourse} from 'modules/courses/courses.hooks';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {TestDtoReq} from 'types/dtos';
import {TestInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {LessonPageParams} from 'types/routes';

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
      showSuccessMessage('Тест создан', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к уроку',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = !!course;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.TEST_EDIT}
      className="test-form-page"
      title="Создание теста"
      location={location}
      errors={[errorLoadingCourse]}
      reloadCallbacks={[reloadCourse]}
    >
      {!!course && (
        <PageContent>
          <ContentBlock>
            <TestForm
              subjectId={course.subject_id}
              lessonId={lessonId}
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
