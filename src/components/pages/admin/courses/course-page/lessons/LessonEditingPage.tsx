import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useLesson} from 'modules/lessons/lessons.hooks';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {LessonDtoReq} from 'types/dtos';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {LessonPageParams} from 'types/routes';

import LessonForm from './LessonForm';

const LessonEditingPage: React.FC<RouteComponentProps<LessonPageParams>> = (
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

  const createRequest = useCallback(
    (requestData: LessonDtoReq): Promise<LessonInfo> =>
      APIRequest.put(`/lessons/${lessonId}`, requestData),
    [lessonId],
  );

  const {lesson, error: errorLoadingLesson, reload: reloadLesson} = useLesson(
    courseId,
    lessonId,
  );

  const returnLink = `/admin/courses/${courseId}/lessons/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage) => {
      showSuccessMessage('Изменения сохранены', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к курсу',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = !!lesson;

  return (
    <Page
      requiredPermissions={Permission.LESSON_EDIT}
      className="lesson-form-page"
      title="Изменение урока"
      location={location}
      errors={[errorLoadingLesson]}
      reloadCallbacks={[reloadLesson]}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <LessonForm
              lesson={lesson}
              title="Изменение урока"
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

export default LessonEditingPage;
