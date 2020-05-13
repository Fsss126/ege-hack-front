import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useAdminCourse, useKnowledgeTest, useSubjects} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {TestDtoReq} from 'types/dtos';
import {TestInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {LessonPageParams} from 'types/routes';

import TestForm from './TestForm';

const TestEditingPage: React.FC<RouteComponentProps<LessonPageParams>> = (
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
  const {test, error: errorLoadingTest, reload: reloadTest} = useKnowledgeTest(
    lessonId,
  );

  const createRequest = useCallback(
    (requestData: TestDtoReq): Promise<TestInfo> =>
      APIRequest.put(`/knowledge/tests/${(test as TestInfo).id}`, requestData),
    [test],
  );

  const returnLink = `/admin/courses/${courseId}/lessons/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage) => {
      showSuccessMessage('Изменения сохранены', [
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

  const isLoaded = !!(course && subjects && test);

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.TEST_EDIT}
      className="test-form-page"
      title="Изменение теста"
      location={location}
      errors={[errorLoadingCourse, errorLoadingSubjects, errorLoadingTest]}
      reloadCallbacks={[reloadCourse, reloadSubjects, reloadTest]}
    >
      {!!(course && subjects && test) && (
        <PageContent>
          <ContentBlock>
            <TestForm
              test={test}
              subjectId={course.subject_id}
              lessonId={lessonId}
              subjects={subjects}
              title="Изменение тест"
              errorMessage="Ошибка при сохранении изменений"
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

export default TestEditingPage;
