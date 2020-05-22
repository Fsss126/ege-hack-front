import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from '@material-ui/lab';
import classNames from 'classnames';
import ScrollContainer from 'components/common/ScrollContainer';
import Button from 'components/ui/Button';
import {LOADING_STATE, LoadingIndicator} from 'components/ui/LoadingIndicator';
import React, {useCallback, useEffect, useRef} from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {Link} from 'react-router-dom';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
} from 'types/entities';

export type LinkClickCallback = (
  link: string,
  submit: boolean,
  event: React.ChangeEvent<unknown>,
) => void;

type TaskNavProps = {
  task: SanitizedTaskInfo;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  onClick?: LinkClickCallback;
  loadingState?: LOADING_STATE;
  nextAccent?: boolean;
  navigateTo?: string;
};

export const TaskNav: React.FC<TaskNavProps> = (props) => {
  const {
    test,
    state,
    task,
    onClick,
    loadingState,
    navigateTo,
    nextAccent,
  } = props;

  const {tasks} = test;
  const {order} = task;
  const {answers, is_completed: isCompleted} = state;
  const tasksCount = tasks.length;
  const isFirstTask = order === 0;
  const isLastTask = order === tasksCount - 1;

  const next = isLastTask ? '../results/' : `../${test.tasks[order + 1].id}`;
  const prev = isFirstTask ? undefined : `../${test.tasks[order - 1].id}`;

  const onPaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      const task = page ? tasks[page - 1] : undefined;

      if (!(task && onClick)) {
        return;
      }

      const link = `../${task.id}/`;

      onClick(link, false, event);
    },
    [onClick, tasks],
  );

  const scrollbarsRef = useRef<Scrollbars>(null);

  useEffect(() => {
    const scrollbars = scrollbarsRef.current;

    if (!scrollbars) {
      return;
    }
    const current = scrollbars.view.querySelector<HTMLElement>('.Mui-selected');

    if (!current) {
      return;
    }

    const offset = current.offsetLeft;
    scrollbars.view.scroll({
      left: offset,
      behavior: 'smooth',
    });
  }, [task]);

  const renderItem = useCallback(
    (params: PaginationRenderItemParams) => {
      const {page, ...restParams} = params;
      const task = params.page ? tasks[params.page - 1] : undefined;

      if (!task) {
        return <PaginationItem {...params} />;
      }

      const link = `../${task.id}/`;
      const answer = answers[task.id]?.user_answer;

      return (
        <PaginationItem
          component={Link}
          className={classNames('test-task__nav-question', {
            'test-task__nav-question--answered': !!answer,
          })}
          to={link}
          {...restParams}
          page={
            loadingState &&
            navigateTo === link &&
            loadingState !== LOADING_STATE.DONE
              ? ((<LoadingIndicator state={loadingState} />) as any)
              : page
          }
        />
      );
    },
    [answers, loadingState, navigateTo, tasks],
  );

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
          <ScrollContainer withShadows ref={scrollbarsRef}>
            <Pagination
              size={'small'}
              onChange={onPaginationChange}
              hideNextButton
              hidePrevButton
              count={tasks.length}
              page={task.order + 1}
              renderItem={renderItem}
            />
          </ScrollContainer>
        </div>
        <Button<typeof Link>
          dataAttribute
          className={classNames('test-task__nav-btn', 'test-task__nav-next')}
          clickOnWrapper
          neutral={!nextAccent}
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
