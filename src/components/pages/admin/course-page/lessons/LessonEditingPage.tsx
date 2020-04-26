import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import {useLesson} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {LessonDtoReq} from 'types/dtos';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';

import LessonForm from './LessonForm';

const LessonEditingPage: React.FC<RouteComponentProps<{
  courseId: string;
  lessonId: string;
}>> = (props) => {
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

  const returnLink = `/admin/${courseId}/lessons/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage, reset) => {
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
    >
      {isLoaded && (
        <PageContent>
          <div className="layout__content-block">
            <LessonForm
              lesson={lesson}
              title="Изменение урока"
              errorMessage="Ошибка при сохранении изменений"
              cancelLink={returnLink}
              courseId={courseId}
              createRequest={createRequest}
              onSubmitted={onSubmitted}
            />
          </div>
        </PageContent>
      )}
    </Page>
  );
};

export default LessonEditingPage;
