import classnames from 'classnames';
import React, {forwardRef} from 'react';
import {ScrollbarProps, Scrollbars} from 'react-custom-scrollbars';

const renderEmpty: React.FC = () => <div />;

const renderTrackVertical: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="track track-vertical" />;
const renderThumbVertical: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="thumb thumb-vertical" />;
const renderTrackHorizontal: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="track track-horizontal" />;
const renderThumbHorizontal: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="thumb thumb-horizontal" />;
const renderView: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="scrollbars-scroll-base" />
);

export type ScrollBarsProps = {
  hideVerticalScrollbar?: boolean;
  hideHorizontalScrollbar?: boolean;
} & Omit<ScrollbarProps, 'ref'>;
const ScrollBars = forwardRef<Scrollbars, ScrollBarsProps>((props, ref) => {
  const {
    className,
    hideVerticalScrollbar = false,
    hideHorizontalScrollbar = false,
    ...rest
  } = props;

  return (
    <Scrollbars
      className={classnames('scrollbars', className)}
      renderTrackVertical={
        hideVerticalScrollbar ? renderEmpty : renderTrackVertical
      }
      renderThumbVertical={renderThumbVertical}
      renderTrackHorizontal={
        hideHorizontalScrollbar ? renderEmpty : renderTrackHorizontal
      }
      renderThumbHorizontal={renderThumbHorizontal}
      renderView={renderView}
      ref={ref}
      {...rest}
    />
  );
});
ScrollBars.displayName = 'ScrollBars';

export default ScrollBars;
