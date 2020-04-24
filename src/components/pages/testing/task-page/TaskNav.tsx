import Button from 'components/ui/Button';
import Link from 'components/ui/Link';
import {LOADING_STATE, LoadingIndicator} from 'components/ui/LoadingIndicator';
import React, {useCallback} from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
  TestStatus,
} from 'types/entities';

export type LinkClickCallback = (
  link: string,
  event: React.MouseEvent<HTMLAnchorElement>,
) => void;

type TaskNavProps = {
  task: SanitizedTaskInfo;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  onNextClick?: LinkClickCallback;
  onPrevClick?: LinkClickCallback;
  loadingState?: LOADING_STATE;
  navigateTo?: string;
};

export const TaskNav: React.FC<TaskNavProps> = (props) => {
  const {
    test,
    state,
    task,
    onNextClick,
    onPrevClick,
    loadingState,
    navigateTo,
  } = props;

  const {order} = task;
  const {status} = state;
  const tasksCount = test.tasks.length;
  const isFirstTask = order === 0;
  const isLastTask = order === tasksCount - 1;
  const isCompleted = status === TestStatus.COMPLETED;

  const next = isLastTask ? '../results/' : `../${test.tasks[order + 1].id}`;
  const prev = isFirstTask ? null : `../${test.tasks[order - 1].id}`;

  const nextClickCallback: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      if (onNextClick) {
        onNextClick(next, event);
      }
    },
    [next, onNextClick],
  );

  const prevClickCallback: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      if (prev && onPrevClick) {
        onPrevClick(prev, event);
      }
    },
    [prev, onPrevClick],
  );

  return (
    <div className="test-task__nav">
      {prev && (
        <Button<typeof Link>
          neutral
          dataAttribute
          className="test-task__nav-prev"
          component={Link}
          to={prev}
          onClick={prevClickCallback}
          icon={
            loadingState &&
            navigateTo === prev &&
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
        component={Link}
        to={next}
        onClick={nextClickCallback}
        icon={
          loadingState &&
          navigateTo === next &&
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
