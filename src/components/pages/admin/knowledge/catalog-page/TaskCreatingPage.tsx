import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useSubjects} from 'hooks/selectors';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import {TaskDtoReq} from 'types/dtos';
import {TaskInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {ThemePageParams} from 'types/routes';

import TaskForm from './TaskForm';

const createRequest = (requestData: TaskDtoReq): Promise<TaskInfo> =>
  APIRequest.post('/knowledge/tasks', requestData) as Promise<TaskInfo>;

const returnLink = '/admin/knowledge/';

type TaskCreatingPageParams = Partial<ThemePageParams>;

const TaskCreatingPage: React.FC<RouteComponentProps<
  TaskCreatingPageParams
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
      showSuccessMessage('Задание создано', [
        {
          text: 'Новое задание',
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
      requiredPermissions={Permission.KNOWLEDGE_BASE_EDIT}
      className="task-form-page"
      title="Создание курса"
      location={location}
      errors={[errorLoadingSubjects]}
      reloadCallbacks={[reloadSubjects]}
    >
      {!!subjects && (
        <PageContent>
          <ContentBlock>
            <TaskForm
              subjectId={subjectId}
              parentThemeId={parentThemeId}
              subjects={subjects}
              title="Новое задание"
              errorMessage="Ошибка при создании задания"
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

export default TaskCreatingPage;
