import classNames from 'classnames';
import VideoPlayer from 'components/common/VideoPlayer';
import Button from 'components/ui/Button';
import {File} from 'components/ui/input';
import {useToggle} from 'hooks/common';
import React from 'react';
import {FileInfo} from 'types/dtos';
import {AnswerType, CorrectAnswerInfo, UserAnswerInfo} from 'types/entities';

export const CorrectBadge = () => {
  return (
    <span className="test-task__badge test-task__correct-badge accent badge">
      <i className="icon-check align-middle" />
    </span>
  );
};

export const IncorrectBadge = () => {
  return (
    <span className="test-task__badge test-task__incorrect-badge accent badge">
      <i className="icon-close align-middle" />
    </span>
  );
};

interface ResultsProps {
  userAnswer: UserAnswerInfo;
  correctAnswer: CorrectAnswerInfo;
  isCorrect: boolean;
}

export const Results = (props: ResultsProps) => {
  const {userAnswer, correctAnswer, isCorrect} = props;
  const {type, value} = userAnswer;
  const {value: correctValue, textSolution, videoSolution} = correctAnswer;
  const isAnswered = value !== undefined;
  const hasSolution = !!(textSolution || videoSolution);

  const [showSolution, toggleShowSolution] = useToggle(isCorrect);

  return (
    <div className="test-task__result">
      {(type === AnswerType.TEXT || type === AnswerType.NUMBER) && (
        <>
          <h4 className="test-task__result-user-answer">
            {isAnswered && (isCorrect ? <CorrectBadge /> : <IncorrectBadge />)}
            Ответ: <span>{isAnswered ? value : 'Нет ответа'}</span>
          </h4>
          {!isCorrect && (
            <h4 className="test-task__result-correct-answer">
              <CorrectBadge /> Правильный ответ: {correctValue}
            </h4>
          )}
        </>
      )}
      {type === AnswerType.FILE &&
        (value ? (
          <>
            <h4>Ответ: </h4>
            <div className="d-flex align-items-center">
              {isCorrect ? <CorrectBadge /> : <IncorrectBadge />}
              <File file={value as FileInfo} />
            </div>
          </>
        ) : (
          <h4>Ответ: Нет решения</h4>
        ))}
      {hasSolution && (
        <div
          className={classNames('test-task__solution', {
            'test-task__solution--collapsed': !showSolution,
          })}
        >
          <Button
            neutral
            className="test-task__solution-toggle d-inline-block"
            onClick={toggleShowSolution}
            icon={<i className="icon-angle-down" />}
          >
            Решение
          </Button>
          <div className="test-task__solution-body">
            <div className="test-task__solution-body-inner">
              {videoSolution && <VideoPlayer video_link={videoSolution} />}
              {textSolution && (
                <div className="test-task__solution-text">{textSolution}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
