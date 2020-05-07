import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useSubjects, useUserTeachers} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {CourseDtoReq} from 'types/dtos';
import {CourseInfo, SubjectInfo, TeacherInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {SubjectPageParams} from 'types/routes';

import ThemeForm from './ThemeForm';

const createRequest = (requestData: CourseDtoReq): Promise<CourseInfo> =>
  APIRequest.post('/courses', requestData) as Promise<CourseInfo>;

const returnLink = '/admin/';

const ThemeCreatingPage: React.FC<RouteComponentProps<
  Partial<SubjectPageParams>
>> = (props) => {
  const {
    match: {
      params: {subjectId: param_subject},
    },
    location,
  } = props;
  const subjectId = param_subject ? parseInt(param_subject) : undefined;

  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useUserTeachers();

  const onSubmitted = React.useCallback(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage('Курс создан', [
        {
          text: 'Новый курс',
          action: reset,
        },
        {
          text: 'Вернуться к курсам',
          url: returnLink,
        },
      ]);
    },
    [],
  );

  const isLoaded = !!(teachers && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.COURSE_EDIT}
      className="course-form-page"
      title="Создание курса"
      location={location}
      errors={[errorLoadingTeachers, errorLoadingSubjects]}
      reloadCallbacks={[reloadTeachers, reloadSubjects]}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <ThemeForm
              subjectId={subjectId}
              subjects={subjects as SubjectInfo[]}
              teachers={teachers as TeacherInfo[]}
              title="Новый курс"
              errorMessage="Ошибка при создании курса"
              cancelLink={returnLink}
              createRequest={createRequest}
              onSubmitted={onSubmitted}
            />
          </ContentBlock>
        </PageContent>
      )}
    </Page>
  );
};

export default ThemeCreatingPage;
