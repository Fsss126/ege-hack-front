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
import {SimpleCallback} from 'types/utility/common';

type TaskNavProps = {
  task: SanitizedTaskInfo;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  onNextClick?: SimpleCallback;
  onPrevClick?: SimpleCallback;
  loadingState?: LOADING_STATE;
  to?: string;
};

export const TaskNav: React.FC<TaskNavProps> = (props) => {
  const {test, state, task, onNextClick, onPrevClick, loadingState, to} = props;

  const {order} = task;
  const {status} = state;
  const tasksCount = test.tasks.length;
  const isFirstTask = order === 0;
  const isLastTask = order === tasksCount - 1;
  const isCompleted = status === TestStatus.COMPLETED;

  const next = isLastTask ? '../results/' : `../${test.tasks[order + 1].id}`;
  const prev = isFirstTask ? null : `../${test.tasks[order - 1].id}`;

  return (
    <div className="test-task__nav">
      {prev && (
        <Button<typeof Link>
          neutral
          dataAttribute
          className="test-task__nav-prev"
          tag={Link}
          to={prev}
          onClick={onPrevClick}
          icon={
            loadingState &&
            to === prev &&
            loadingState !== LOADING_STATE.DONE && (
              <LoadingIndicator state={loadingState} />
            )
          }
        >
          Предыдущий вопрос
        </Button>
      )}
      <Button<typeof Link>
        dataAttribute
        className="test-task__nav-next"
        tag={Link}
        to={next}
        onClick={onNextClick}
        icon={
          loadingState &&
          to === next &&
          loadingState !== LOADING_STATE.DONE && (
            <LoadingIndicator state={loadingState} />
          )
        }
      >
        {isLastTask
          ? isCompleted
            ? 'Результаты'
            : 'Завершить'
          : 'Следующий вопрос'}
      </Button>
    </div>
  );
};
