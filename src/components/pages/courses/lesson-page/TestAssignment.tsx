import classNames from 'classnames';
import Button from 'components/ui/Button';
import {
  LoadingIndicator,
  useLoadingState,
} from 'components/ui/LoadingIndicator';
import {ProgressIndicator} from 'components/ui/ProgressIndicator';
import {renderDate} from 'definitions/helpers';
import {useStartTest} from 'hooks/selectors';
import React, {useCallback, useState} from 'react';
import {TestStatus} from 'types/dtos';
import {TestStatusInfo} from 'types/entities';

export interface TestStatusProps {
  courseId: number;
  lessonId: number;
  test: TestStatusInfo;
}

export const TestAssignment: React.FC<TestStatusProps> = (props) => {
  const {test, courseId, lessonId} = props;
  const [isFetchingTest, setIsFetchingTest] = useState<boolean | null>(null);
  const state = useLoadingState(isFetchingTest, isFetchingTest === false);
  const fetchCallback = useCallback(() => {
    setIsFetchingTest(false);
  }, []);

  const startTestCallback = useStartTest();

  const {status, id, name, deadline} = test;

  const onClick = useCallback(() => {
    setIsFetchingTest(true);
    startTestCallback({
      courseId,
      lessonId,
      testId: id,
      onSuccess: fetchCallback,
      onError: fetchCallback,
    });
  }, [courseId, fetchCallback, id, lessonId, startTestCallback]);

  if (test.status === TestStatus.COMPLETED) {
    const {percentage, passed} = test;

    return (
      <div className="test-view container p-0">
        <div className="row align-items-center">
          <div className="col">
            <div className="test-view__title">{name}</div>
          </div>
          <div className="col-auto">
            <ProgressIndicator
              className={classNames('test-result', {
                'test-result--passed': passed,
                'test-result--failed': !passed,
              })}
              progress={percentage}
            >
              Результат {percentage * 100}%
            </ProgressIndicator>
          </div>
          <div className="col-auto">
            <Button
              neutral
              icon={<LoadingIndicator state={state} />}
              onClick={onClick}
            >
              Смотреть результаты
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    const {progress} = test;
    const isStarted = status === TestStatus.STARTED;

    return (
      <div className="test-view container p-0">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="test-view__title">{name}</h4>
          </div>
          <div className="col-auto">
            {isStarted && (
              <ProgressIndicator progress={progress}>
                Пройдено {progress * 100}%
              </ProgressIndicator>
            )}
          </div>
          <div className="col-auto">
            <Button icon={<LoadingIndicator state={state} />} onClick={onClick}>
              {isStarted ? 'Продолжить' : 'Начать тест'}
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {deadline && (
              <div className="assignment__deadline">
                Дедлайн: {renderDate(deadline, renderDate.dateWithHour)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};