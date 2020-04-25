import classNames from 'classnames';
import React from 'react';

export interface ProgressIconProps {
  progress: number;
  className?: string;
}

export interface ProgressIndicatorProps extends ProgressIconProps {
  children: React.ReactNode;
  className?: string;
}

export const ProgressIcon: React.FC<ProgressIconProps> = (props) => {
  const {progress, className} = props;

  return (
    <svg
      className={classNames('progress-circle', className)}
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
        strokeDashoffset={100 - progress * 100}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = (props) => {
  const {progress, children, className} = props;

  return (
    <div
      className={classNames(
        'progress-indicator',
        'd-flex',
        'align-items-center',
        className,
      )}
    >
      <div className="description-block">{children}</div>
      <ProgressIcon progress={progress} />
    </div>
  );
};
