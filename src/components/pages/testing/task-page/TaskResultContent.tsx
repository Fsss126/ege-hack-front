import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateAwaitingInfo,
  TestStatePassedInfo,
} from 'types/entities';

import {Results} from './Results';
import {TaskNav} from './TaskNav';
import {TaskPageLayout} from './TaskPageLayout';

interface TaskResultContentProps {
  testId: number;
  taskId: number;
  test: SanitizedTestInfo;
  state: TestStateAwaitingInfo | TestStatePassedInfo;
  task: SanitizedTaskInfo;
}

export const TaskResultContent: React.FC<TaskResultContentProps> = (props) => {
  const {taskId, ...layoutProps} = props;
  const {task, test, state} = layoutProps;
  const {answers} = state;

  const answer = answers[taskId];

  const nav = <TaskNav task={task} test={test} state={state} />;

  return (
    <TaskPageLayout {...layoutProps} taskId={taskId} nav={nav}>
      <Results
        task={task}
        userAnswer={answer?.user_answer}
        correctAnswer={answer?.correct_answer}
        isCorrect={answer?.is_correct}
        isRated={state?.is_rated}
      />
    </TaskPageLayout>
  );
};
