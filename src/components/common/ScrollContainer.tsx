import classNames from 'classnames';
import React, {forwardRef} from 'react';
import Scrollbars from 'react-custom-scrollbars';

import ScrollBars, {ScrollBarsProps} from '../ui/ScrollBars';

export interface ScrollContainerProps extends ScrollBarsProps {
  withShadows?: boolean;
  fullWidth?: boolean;
}
const ScrollContainer = forwardRef<Scrollbars, ScrollContainerProps>(
  (props, ref) => {
    const {
      children,
      className,
      withShadows,
      fullWidth,
      ...scrollbarProps
    } = props;

    // const location = useLocation();
    // const scrollBarsRef = useRef(null);
    // const shadowRightRef = useRef(null);
    // const onScroll = useCallback(() => {
    //     const scrollBars = scrollBarsRef.current;
    //     let scrollWidth = scrollBars.getScrollWidth();
    //     let scrollPos = scrollBars.getScrollLeft() + scrollBars.getClientWidth();
    //     let r = Math.ceil((scrollWidth - scrollPos) / scrollWidth * 5 * 1000) / 100;
    //     const shadowRight = shadowRightRef.current;
    //     if (r < 1)
    //         shadowRight.style.opacity = r;
    //     else shadowRight.style.opacity = 1;
    // }, []);
    return (
      <div
        className={classNames('scroll-container', className, {
          'scroll-container--with-shadows': withShadows,
          'scroll-container--full-width': fullWidth,
        })}
      >
        <ScrollBars
          ref={ref}
          // onScroll={onScroll}
          autoHeight
          autoHeightMax="unset"
          hideVerticalScrollbar
          hideHorizontalScrollbar
          hideTracksWhenNotNeeded
          style={{height: '100%'}}
          {...scrollbarProps}
        >
          <div className="scroll-container__inner">{children}</div>
        </ScrollBars>
      </div>
    );
  },
);
ScrollContainer.defaultProps = {
  withShadows: true,
};
ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
