import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
  TestStatus,
} from 'types/entities';

import {TaskInputContent} from './TaskInputContent';
import {TaskResultContent} from './TaskResultContent';

interface TaskViewerProps {
  testId: number;
  taskId: number;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  task: SanitizedTaskInfo;
}

export const TaskPageContent: React.FC<TaskViewerProps> = (props) => {
  const {testId, taskId, test, state, task} = props;

  if (state.status === TestStatus.COMPLETED) {
    return (
      <TaskResultContent
        testId={testId}
        taskId={taskId}
        test={test}
        state={state}
        task={task}
      />
    );
  } else {
    return (
      <TaskInputContent
        testId={testId}
        taskId={taskId}
        test={test}
        state={state}
        task={task}
      />
    );
  }
};
