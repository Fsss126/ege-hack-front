import Button from 'components/ui/Button';
import {
  LoadingIndicator,
  useLoadingState,
} from 'components/ui/LoadingIndicator';
import {ProgressIndicator} from 'components/ui/ProgressIndicator';
import {useStartTest} from 'hooks/selectors';
import React, {useCallback, useState} from 'react';
import {TestStatus} from 'types/dtos';
import {TestStatusInfo} from 'types/entities';

export interface TestStatusProps {
  courseId: number;
  lessonId: number;
  test: TestStatusInfo;
}

export const TestView: React.FC<TestStatusProps> = (props) => {
  const {
    test: {status, id, name, progress},
    courseId,
    lessonId,
  } = props;
  const [isFetchingTest, setIsFetchingTest] = useState<boolean | null>(null);
  const state = useLoadingState(isFetchingTest, isFetchingTest === false);
  const fetchCallback = useCallback(() => {
    setIsFetchingTest(false);
  }, []);

  const startTestCallback = useStartTest(fetchCallback, fetchCallback);

  const onClick = useCallback(() => {
    setIsFetchingTest(true);
    startTestCallback(courseId, lessonId, id);
  }, [courseId, id, lessonId, startTestCallback]);

  const isCompleted = status === TestStatus.COMPLETED;
  const isStarted = status === TestStatus.STARTED;

  return (
    <div className="test-view container p-0">
      <div className="row align-items-center">
        <div className="col">
          <div className="test-view__title">{name}</div>
        </div>
        <div className="col-auto">
          {!isCompleted && <ProgressIndicator progress={progress} />}
        </div>
        <div className="col-auto">
          <Button
            neutral={status === TestStatus.COMPLETED}
            icon={<LoadingIndicator state={state} />}
            onClick={onClick}
          >
            {isCompleted
              ? 'Смотреть результаты'
              : isStarted
              ? 'Продолжить'
              : 'Начать тест'}
          </Button>
        </div>
      </div>
    </div>
  );
};
