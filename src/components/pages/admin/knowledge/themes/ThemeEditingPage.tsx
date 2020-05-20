import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useKnowledgeTheme} from 'hooks/selectors';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {ThemeDtoReq} from 'types/dtos';
import {ThemeInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {ThemePageParams} from 'types/routes';

import ThemeForm from './ThemeForm';

const ThemeEditingPage: React.FC<RouteComponentProps<ThemePageParams>> = (
  props,
) => {
  const {
    match: {
      params: {subjectId: param_subject, themeId: param_theme},
    },
    location,
  } = props;
  const subjectId = parseInt(param_subject);
  const themeId = parseInt(param_theme);

  const createRequest = React.useCallback(
    (requestData: ThemeDtoReq): Promise<ThemeInfo> =>
      APIRequest.put(`/knowledge/content/themes/${themeId}`, requestData),
    [themeId],
  );

  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {
    theme,
    error: errorLoadingTheme,
    reload: reloadTheme,
  } = useKnowledgeTheme(subjectId, themeId);

  const returnLink = '/admin/knowledge/';

  const onSubmitted = useCallback(
    (response, showSuccessMessage) => {
      showSuccessMessage('Изменения сохранены', [
        {
          text: 'Ок',
        },
        {
          text: 'Вернуться к базе знаний',
          url: returnLink,
        },
      ]);
    },
    [returnLink],
  );

  const isLoaded = !!(theme && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.KNOWLEDGE_CONTENT_EDIT}
      className="theme-form-page"
      title="Изменение темы"
      location={location}
      errors={[errorLoadingSubjects, errorLoadingTheme]}
      reloadCallbacks={[reloadSubjects, reloadTheme]}
    >
      {!!(theme && subjects) && (
        <PageContent>
          <ContentBlock>
            <ThemeForm
              theme={theme}
              subjects={subjects}
              title="Изменение темы"
              errorMessage="Ошибка при сохранении изменений"
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

export default ThemeEditingPage;
