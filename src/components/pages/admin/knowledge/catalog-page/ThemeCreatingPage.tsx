import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useSubjects} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {ThemeDtoReq} from 'types/dtos';
import {SubjectInfo, ThemeInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {ThemePageParams} from 'types/routes';

import ThemeForm from './ThemeForm';

const createRequest = (requestData: ThemeDtoReq): Promise<ThemeInfo> =>
  APIRequest.post('/knowledge/theme', requestData) as Promise<ThemeInfo>;

const returnLink = '/admin/knowledge/';

type ThemeCreatingPageParams = Partial<ThemePageParams>;

const ThemeCreatingPage: React.FC<RouteComponentProps<
  Partial<ThemeCreatingPageParams>
>> = (props) => {
  const {
    match: {
      params: {subjectId: param_subject, themeId: param_theme},
    },
    location,
  } = props;
  const subjectId = param_subject ? parseInt(param_subject) : undefined;
  const parentThemeId = param_theme ? parseInt(param_theme) : undefined;

  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();

  const onSubmitted = React.useCallback(
    (response, showSuccessMessage, reset) => {
      showSuccessMessage('Тема создана', [
        {
          text: 'Новый новая тема',
          action: reset,
        },
        {
          text: 'Вернуться к базе знаний',
          url: returnLink,
        },
      ]);
    },
    [],
  );

  const isLoaded = !!subjects;

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.COURSE_EDIT}
      className="theme-form-page"
      title="Создание темы"
      location={location}
      errors={[errorLoadingSubjects]}
      reloadCallbacks={[reloadSubjects]}
    >
      {isLoaded && (
        <PageContent>
          <ContentBlock>
            <ThemeForm
              subjectId={subjectId}
              parentThemeId={parentThemeId}
              subjects={subjects as SubjectInfo[]}
              title="Новая тема"
              errorMessage="Ошибка при создании темы"
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
