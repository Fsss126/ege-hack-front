import classNames from 'classnames';
import React, {Fragment} from 'react';

type TooltipPosition = 'top' | 'right' | 'left' | 'bottom';

export type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  position?: TooltipPosition;
};
const Tooltip: React.FC<TooltipProps> = (props) => {
  const {children, content, position} = props;
  const child = React.Children.only(children);

  if (!content) {
    return child;
  }
  return React.cloneElement(child, {
    className: classNames(
      child.props.className,
      'tooltip',
      position && `pos-${position}`,
    ),
    children: (
      <Fragment>
        {child.props.children}
        <div className="tooltip-block">
          {content}
          <div className="tooltip-arrow" />
        </div>
      </Fragment>
    ),
  });
};

export default Tooltip;
