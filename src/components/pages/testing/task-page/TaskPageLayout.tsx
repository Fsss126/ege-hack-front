import {ImageViewer} from 'components/common/ImageViewer';
import {ContentBlock} from 'components/layout/ContentBlock';
import {ProgressIndicator} from 'components/ui/ProgressIndicator';
import Tooltip from 'components/ui/Tooltip';
import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
} from 'types/entities';

export interface TaskPageLayoutProps {
  testId: number;
  taskId: number;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  task: SanitizedTaskInfo;
  nav: React.ReactNode;
  children: React.ReactNode;
}

export const TaskPageLayout: React.FC<TaskPageLayoutProps> = (props) => {
  const {test, state, task, nav, children} = props;

  const {name} = test;
  const {text, order, image_link, score, complexity} = task;
  const {is_completed: isCompleted, progress} = state;
  const tasksCount = test.tasks.length;

  let percentage;

  if ('percentage' in state) {
    percentage = state.percentage;
  }

  const showTaskInfo = !!(score || complexity);

  return (
    <>
      <ContentBlock title={`Тест: ${name}`}>
        <div className="container">
          <div className="row flex-nowrap align-items-center">
            <div className="col p-0">
              <h3 className="test-task__task-title">
                Задание {order + 1}
                {!isCompleted && showTaskInfo && (
                  <Tooltip
                    content={
                      <div className="test-task__task-tooltip-content text-left">
                        {complexity !== undefined && (
                          <div>Сложность: {complexity}</div>
                        )}
                        {score !== undefined && <div>Вес: {score}</div>}
                      </div>
                    }
                    position="bottom"
                  >
                    <i className="test-task__task-tooltip icon-info icon-grey align-middle" />
                  </Tooltip>
                )}
              </h3>
            </div>
            <div className="col-auto p-0">
              {percentage !== undefined ? (
                <ProgressIndicator progress={percentage}>
                  Результат {percentage * 100}%
                </ProgressIndicator>
              ) : (
                <ProgressIndicator progress={progress}>
                  Вопрос {order + 1}/{tasksCount}
                </ProgressIndicator>
              )}
            </div>
          </div>
          {isCompleted && (
            <div className="row description-block">
              <div className="col-auto">
                <i className="icon-info icon-grey" />
              </div>
              <div className="col p-0">
                {complexity !== undefined && <div>Сложность: {complexity}</div>}
                {score !== undefined && <div>Вес: {score}</div>}
              </div>
            </div>
          )}
        </div>
        {image_link && (
          <div className="test-task__image-container">
            <ImageViewer className="test-task__image" image={image_link} />
          </div>
        )}
        <div className="test-task__task-text">{text}</div>
        <div className="test-task__task-answer">{children}</div>
      </ContentBlock>
      {nav}
    </>
  );
};
