import classnames from 'classnames';
import React, {Fragment, ReactElement} from 'react';

export enum TooltipPosition {
  top = 'top',
  right = 'right',
  left = 'left',
  bottom = 'bottom',
}

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
    className: classnames(
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
