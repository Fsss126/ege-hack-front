import React from 'react';

export interface ProgressIndicatorProps {
  progress: number;
}

const ProgressIcon: React.FC<ProgressIndicatorProps> = (props) => {
  const {progress} = props;

  return (
    <svg
      className="progress-circle"
      strokeWidth={5}
      x="0px"
      y="0px"
      viewBox="0 0 36 36"
    >
      <circle
        className="progress-circle__bg"
        fill="none"
        cx="18"
        cy="18"
        r="16"
      />
      <circle
        className="progress-circle__progress"
        fill="none"
        cx="18"
        cy="18"
        r="16"
        strokeDasharray="100 100"
        strokeDashoffset={100 - progress}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = (props) => {
  const {progress, children} = props;

  return (
    <div className="progress-indicator d-flex align-items-center">
      <div className="description-text">
        {children ? children : `Пройдено ${progress}%`}
      </div>
      <ProgressIcon progress={progress} />
    </div>
  );
};
