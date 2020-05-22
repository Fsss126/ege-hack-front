import {ExpandableContainer} from 'components/common/ExpandableContainer';
import VideoPlayer from 'components/common/VideoPlayer';
import {File} from 'components/ui/input';
import React from 'react';
import {FileInfo} from 'types/dtos';
import {
  AnswerType,
  CorrectAnswerInfo,
  SanitizedTaskInfo,
  UserAnswerInfo,
} from 'types/entities';

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
  task: SanitizedTaskInfo;
  userAnswer?: UserAnswerInfo;
  correctAnswer?: CorrectAnswerInfo;
  isCorrect?: boolean;
  isRated: boolean;
}

export const Results = (props: ResultsProps) => {
  const {userAnswer, correctAnswer, task, isCorrect, isRated} = props;
  const {value} = userAnswer || {};
  const {
    answer: {type},
  } = task;
  const {value: correctValue, text_solution, video_solution} =
    correctAnswer || {};
  const isAnswered = value !== undefined;
  const isResultShown = isAnswered && isRated;
  const hasSolution = !!(text_solution || video_solution);

  return (
    <div className="test-task__result">
      {(type === AnswerType.TEXT || type === AnswerType.NUMBER) && (
        <>
          <h4 className="test-task__result-user-answer">
            {isResultShown &&
              (isCorrect ? <CorrectBadge /> : <IncorrectBadge />)}
            Ответ: <span>{isAnswered ? value : 'Нет ответа'}</span>
          </h4>
          {isRated && !isCorrect && (
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
              {isResultShown &&
                (isCorrect ? <CorrectBadge /> : <IncorrectBadge />)}
              <File file={value as FileInfo} />
            </div>
          </>
        ) : (
          <h4>Ответ: Нет решения</h4>
        ))}
      {hasSolution && (
        <ExpandableContainer
          className="test-task__solution"
          toggleText="Решение"
          initiallyExpanded={!isCorrect}
        >
          {video_solution && <VideoPlayer video_link={video_solution} />}
          {text_solution && (
            <div className="test-task__solution-text">{text_solution}</div>
          )}
        </ExpandableContainer>
      )}
    </div>
  );
};
