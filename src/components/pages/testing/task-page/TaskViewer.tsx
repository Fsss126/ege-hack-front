import {ImageViewer} from 'components/common/ImageViewer';
import Button from 'components/ui/Button';
import Link from 'components/ui/Link';
import {ProgressIndicator} from 'components/ui/ProgressIndicator';
import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TaskInfo,
  TestInfo,
  TestStateInfo,
} from 'types/entities';

import {AnswerInput} from './AnswerInput';

interface TaskViewerProps {
  testId: number;
  taskId: number;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  task: SanitizedTaskInfo;
}

export const TaskViewer: React.FC<TaskViewerProps> = (props) => {
  const {testId, taskId, test, state, task} = props;

  const {name} = test;
  const {
    id,
    text,
    order,
    image_link,
    answer: {type},
    weight,
  } = task;
  const {
    status,
    progress,
    answers: {[id]: taskAnswerInfo},
  } = state;
  const tasksCount = test.tasks.length;
  const isFirstTask = order === 0;
  const isLastTask = order === tasksCount - 1;
  const nextButtonLink = isLastTask
    ? '../results/'
    : `../${test.tasks[order + 1].id}`;
  const prevButtonLink = isFirstTask ? null : `../${test.tasks[order - 1].id}`;

  return (
    <div className="test-task layout__content-block">
      <h2 className="test-task__test-title">{name}</h2>
      <div className="container">
        <div className="row flex-nowrap align-items-center">
          <div className="col p-0">
            <h3 className="test-task__task-title">Задание {order + 1}</h3>
          </div>
          <div className="col-auto p-0">
            <ProgressIndicator progress={progress}>
              Вопрос {order + 1}/{tasksCount}
            </ProgressIndicator>
          </div>
        </div>
      </div>
      {image_link && (
        <div className="test-task__image-container">
          <ImageViewer className="test-task__image" image={image_link} />
        </div>
      )}
      <div className="test-task__task-text">{text}</div>
      <div className="test-task__task-answer">
        <h4>Ответ</h4>
        <div className="test-task__input-container">
          <AnswerInput
            testId={testId}
            taskId={taskId}
            onSubmitted={() => {
              // TODO
            }}
            type={type}
            value={undefined}
          />
        </div>
        <div className="test-task__nav">
          {prevButtonLink && (
            <Button<typeof Link>
              neutral
              dataAttribute
              className="test-task__nav-prev"
              tag={Link}
              to={prevButtonLink}
            >
              Предыдущий вопрос
            </Button>
          )}
          <Button<typeof Link>
            dataAttribute
            className="test-task__nav-next"
            tag={Link}
            to={nextButtonLink}
          >
            Следующий вопрос
          </Button>
        </div>
      </div>
    </div>
  );
};
