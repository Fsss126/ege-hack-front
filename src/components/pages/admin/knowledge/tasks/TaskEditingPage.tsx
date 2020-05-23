import APIRequest from 'api';
import {ContentBlock} from 'components/layout/ContentBlock';
import Page, {PageContent} from 'components/layout/Page';
import {useKnowledgeTask} from 'modules/knowledge/knowledge.hooks';
import {useSubjects} from 'modules/subjects/subjects.hooks';
import React, {useCallback} from 'react';
import {RouteComponentProps} from 'react-router';
import {TaskDtoReq} from 'types/dtos';
import {TaskInfo} from 'types/entities';
import {Permission} from 'types/enums';
import {TaskPageParams} from 'types/routes';

import TaskForm from './TaskForm';

const TaskEditingPage: React.FC<RouteComponentProps<TaskPageParams>> = (
  props,
) => {
  const {
    match: {
      params: {subjectId: param_subject, taskId: param_task},
    },
    location,
  } = props;
  const subjectId = param_subject ? parseInt(param_subject) : undefined;
  const taskId = param_task ? parseInt(param_task) : undefined;

  const createRequest = React.useCallback(
    (requestData: TaskDtoReq): Promise<TaskInfo> =>
      APIRequest.put(`/knowledge/content/tasks/${taskId}`, requestData),
    [taskId],
  );

  const {
    subjects,
    error: errorLoadingSubjects,
    reload: reloadSubjects,
  } = useSubjects();
  const {task, error: errorLoadingTask, reload: reloadTask} = useKnowledgeTask(
    subjectId,
    taskId,
  );

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

  const isLoaded = !!(task && subjects);

  return (
    <Page
      isLoaded={isLoaded}
      requiredPermissions={Permission.KNOWLEDGE_CONTENT_EDIT}
      className="task-form-page"
      title="Изменение задания"
      location={location}
      errors={[errorLoadingSubjects, errorLoadingTask]}
      reloadCallbacks={[reloadSubjects, reloadTask]}
    >
      {!!(task && subjects) && (
        <PageContent>
          <ContentBlock>
            <TaskForm
              task={task}
              subjects={subjects}
              title="Изменение задания"
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

export default TaskEditingPage;
