import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import {useTeachers} from 'modules/teachers/teachers.hooks';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {CourseDtoReq} from 'types/dtos';
import {CourseInfo, SubjectInfo, TeacherProfileInfo} from 'types/entities';
import {Permission} from 'types/enums';

import CourseForm from './CourseForm';

const createRequest = (requestData: CourseDtoReq): Promise<CourseInfo> =>
  APIRequest.post('/courses', requestData) as Promise<CourseInfo>;

const returnLink = '/admin/courses/';

const CourseCreatingPage: React.FC<RouteComponentProps> = (props) => {
  const {location} = props;
  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {
    teachers,
    error: errorLoadingTeachers,
    reload: reloadTeachers,
  } = useTeachers();

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
            <CourseForm
              subjects={subjects as SubjectInfo[]}
              teachers={teachers as TeacherProfileInfo[]}
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

export default CourseCreatingPage;
