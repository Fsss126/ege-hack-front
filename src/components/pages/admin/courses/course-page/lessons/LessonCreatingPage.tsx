import APIRequest from 'api';
import Page, {PageContent} from 'components/layout/Page';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {LessonDtoReq} from 'types/dtos';
import {LessonInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams} from 'types/routes';

import {ContentBlock} from '../../../../../layout/ContentBlock';
import LessonForm from './LessonForm';

const createRequest = (requestData: LessonDtoReq): Promise<LessonInfo> =>
  APIRequest.post('/lessons', requestData);

const LessonCreatingPage: React.FC<RouteComponentProps<CoursePageParams>> = (
  props,
) => {
  const {
    match: {
      params: {courseId: param_course},
    },
    location,
  } = props;
  const courseId = parseInt(param_course);

  const returnLink = `/admin/${courseId}/lessons/`;

  const onSubmitted = React.useCallback(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage('Урок создан', [
        {
          text: 'Новый урок',
          action: reset,
        },
        {
          text: 'Вернуться к курсу',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = true;

  return (
    <Page
      requiredPermissions={Permission.LESSON_EDIT}
      className="lesson-form-page"
      title="Создание урока"
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <LessonForm
              title="Новый урок"
              errorMessage="Ошибка при создании урока"
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

export default LessonCreatingPage;
