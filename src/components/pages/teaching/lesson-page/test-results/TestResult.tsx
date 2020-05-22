import classNames from 'classnames';
import CoverImage from 'components/common/CoverImage';
import ListItem from 'components/common/ListItem';
import {ProgressIndicator} from 'components/ui/ProgressIndicator';
import React from 'react';
import {TestResultInfo} from 'types/entities';

type TestResultProps<P> = P & {
  result: TestResultInfo;
};

const TestResult = <P extends any>(
  props: TestResultProps<P>,
): React.ReactElement => {
  const {result, ...renderProps} = props;
  const {
    status: {passed, is_rated, is_completed, percentage},
    pupil: {
      id,
      vk_info: {first_name, last_name, photo},
      contacts: {vk},
    },
  } = result;

  return (
    <ListItem
      key={id}
      link={vk}
      noOnClickOnAction
      truncate={false}
      item={result}
      className={classNames('user', 'user-test-result')}
      title={`${last_name} ${first_name}`}
      preview={<CoverImage src={photo} round />}
      description={
        is_rated ? (
          <div className="d-flex">
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
        ) : is_completed ? (
          <span className="badge">Нет оценки</span>
        ) : (
          'Нет работы'
        )
      }
      {...renderProps}
    />
  );
};

export default TestResult;
