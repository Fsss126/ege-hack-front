import classNames from 'classnames';
import React from 'react';

const green = '#63d263';
const orange = '#ffae45';
const red = '#fd5454';

const getGradient = (minPercent: number) => `
  linear-gradient(90deg, 
  ${red} 0%, 
  ${red} ${minPercent}%, 
  ${orange} ${minPercent + (100 - minPercent) / 3}%,
  ${green} 100%)`;

type TooltipPosition = 'top' | 'bottom';

interface MarkProps {
  large: boolean;
  tooltipOnHover: boolean;
  tooltipContent?: string;
  position: number;
  tooltipPosition: TooltipPosition;
  pointerContent?: string;
}

const Mark = (props: MarkProps): React.ReactElement => {
  const {
    position,
    tooltipContent,
    large,
    tooltipOnHover,
    tooltipPosition,
    pointerContent,
  } = props;

  const content = pointerContent ? (
    <div
      className={classNames(
        'tooltip-block',
        'tooltip',
        `pos-${tooltipPosition}`,
      )}
    >
      {pointerContent}
      <div className={classNames('result-bar__tooltip', 'tooltip-block')}>
        {tooltipContent}
      </div>
    </div>
  ) : (
    <div className="tooltip-block">
      <div className="result-bar__tooltip">{tooltipContent}</div>
    </div>
  );

  return (
    <div
      className={classNames(
        'result-bar__mark',
        'tooltip',
        `pos-${tooltipPosition}`,
        {
          'result-bar__mark--lg': large,
          'result-bar__mark--pointer': !!pointerContent,
          'is-visible': !tooltipOnHover || pointerContent,
        },
      )}
      style={{left: `${position}%`}}
    >
      {content}
    </div>
  );
};
Mark.defaultProps = {
  large: false,
  tooltipOnHover: false,
  tooltipPosition: 'top',
} as Pick<MarkProps, 'large' | 'tooltipOnHover' | 'tooltipPosition'>;

interface ResultBarProps {
  percentage: number;
  minPercentage: number;
}

export const ResultBar = (props: ResultBarProps): React.ReactElement => {
  const {percentage: percentageFrac, minPercentage: minPercentageFrac} = props;
  const percentage = percentageFrac * 100;
  const minPercentage = minPercentageFrac * 100;

  return (
    <div className="result-bar">
      <div
        className="result-bar__bar"
        style={{background: getGradient(minPercentage)}}
      >
        <div className="result-bar__bar-inner">
          <Mark
            large={false}
            tooltipContent="Минимальный проходной балл"
            position={minPercentage}
            tooltipPosition="bottom"
            pointerContent={`${minPercentage}%`}
          />
          <Mark
            large={true}
            tooltipContent={`${percentage}%`}
            position={percentage}
          />
        </div>
      </div>
    </div>
  );
};
