import React from 'react';
import {
  SanitizedTaskInfo,
  SanitizedTestInfo,
  TestStateInfo,
} from 'types/entities';

import {TaskInputContent} from './TaskInputContent';
import {TaskResultContent} from './TaskResultContent';

interface TaskViewerProps {
  testId: number;
  taskId: number;
  lessonId: number;
  courseId: number;
  test: SanitizedTestInfo;
  state: TestStateInfo;
  task: SanitizedTaskInfo;
}

export const TaskPageContent: React.FC<TaskViewerProps> = (props) => {
  const {testId, taskId, lessonId, courseId, test, state, task} = props;

  if (state.is_completed) {
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
        lessonId={lessonId}
        courseId={courseId}
        test={test}
        state={state}
        task={task}
      />
    );
  }
};
