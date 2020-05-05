import classNames from 'classnames';
import ScrollContainer from 'components/common/ScrollContainer';
import Button from 'components/ui/Button';
import Link from 'components/ui/Link';
import {LOADING_STATE, LoadingIndicator} from 'components/ui/LoadingIndicator';
import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
  TestStatus,
} from 'types/entities';

export type LinkClickCallback = (
  link: string,
  submit: boolean,
  event: React.MouseEvent<HTMLAnchorElement>,
) => void;

type TaskNavProps = {
  task: SanitizedTaskInfo;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  onClick?: LinkClickCallback;
  loadingState?: LOADING_STATE;
  navigateTo?: string;
};

export const TaskNav: React.FC<TaskNavProps> = (props) => {
  const {test, state, task, onClick, loadingState, navigateTo} = props;

  const {tasks} = test;
  const {order} = task;
  const {status, answers} = state;
  const tasksCount = tasks.length;
  const isFirstTask = order === 0;
  const isLastTask = order === tasksCount - 1;
  const isCompleted = status === TestStatus.COMPLETED;

  const next = isLastTask ? '../results/' : `../${test.tasks[order + 1].id}`;
  const prev = isFirstTask ? undefined : `../${test.tasks[order - 1].id}`;

  return (
    <div className="test-task__nav">
      <div className="test-task__nav-inner">
        <Button<typeof Link>
          neutral
          dataAttribute
          className={classNames('test-task__nav-btn', 'test-task__nav-prev', {
            hidden: !prev,
          })}
          component={Link}
          to={prev || '.'}
          onClick={
            prev && onClick ? (event) => onClick(prev, false, event) : undefined
          }
          before={
            loadingState &&
            navigateTo === prev &&
            loadingState !== LOADING_STATE.DONE ? (
              <LoadingIndicator state={loadingState} />
            ) : (
              <i className="icon-angle-left" />
            )
          }
        >
          Назад
        </Button>
        <div className="test-task__nav-questions">
          <ScrollContainer withShadows withArrows arrowScrollOffset={15}>
            {tasks.map((task, index) => {
              const link = `../${task.id}/`;

              return (
                <Button<typeof Link>
                  component={Link}
                  to={link}
                  onClick={onClick && ((event) => onClick(link, false, event))}
                  neutral={task.order !== order}
                  className={classNames('test-task__nav-question', {
                    'test-task__nav-question--answered': !!answers[task.id]
                      ?.user_answer,
                  })}
                  key={task.id}
                >
                  {index + 1}
                </Button>
              );
            })}
          </ScrollContainer>
        </div>
        <Button<typeof Link>
          dataAttribute
          className={classNames('test-task__nav-btn', 'test-task__nav-next')}
          clickOnWrapper
          component={Link}
          to={next}
          onClick={onClick && ((event) => onClick(next, true, event))}
          after={
            loadingState &&
            navigateTo === next &&
            loadingState !== LOADING_STATE.DONE ? (
              <LoadingIndicator state={loadingState} />
            ) : (
              <i className="icon-angle-right" />
            )
          }
        >
          {isLastTask ? (isCompleted ? 'Результаты' : 'Завершить') : 'Далее'}
        </Button>
      </div>
    </div>
  );
};
