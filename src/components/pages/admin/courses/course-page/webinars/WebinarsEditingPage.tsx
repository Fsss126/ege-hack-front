import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useAdminCourse, useAdminWebinars} from 'hooks/selectors';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {WebinarScheduleDtoReq} from 'types/dtos';
import {WebinarScheduleInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {CoursePageParams} from 'types/routes';

import WebinarsForm from './WebinarsForm';

const WebinarsEditingPage: React.FC<RouteComponentProps<CoursePageParams>> = (
  props,
) => {
  const {
    match: {
      params: {courseId: param_course},
    },
    location,
  } = props;
  const courseId = parseInt(param_course);

  const {course, error, reload} = useAdminCourse(courseId);
  const {
    webinars,
    error: errorLoadingWebinars,
    reload: reloadWebinars,
  } = useAdminWebinars(courseId);

  const createRequest = useCallback(
    (requestData: WebinarScheduleDtoReq): Promise<WebinarScheduleInfo> =>
      APIRequest.put(`/courses/${courseId}/schedule`, requestData),
    [courseId],
  );

  const returnLink = `/admin/${courseId}/webinars/`;

  const onSubmitted = useCallback(
    (response, showSuccessMessage, reset) => {
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

  const isLoaded = !!(course && webinars);

  const title =
    webinars === null
      ? 'Создание графика вебинаров'
      : 'Изменение графика вебинаров';

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.WEBINAR_EDIT}
      className="lesson-form-page"
      title={title}
      location={location}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <WebinarsForm
              webinars={webinars as WebinarScheduleInfo}
              title={title}
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

export default WebinarsEditingPage;
