import classNames from 'classnames';
import React, {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Scrollbars from 'react-custom-scrollbars';

import {useCombinedRefs} from '../../utils/react';
import ScrollBars, {ScrollBarsProps} from '../ui/ScrollBars';

export interface ScrollContainerProps extends ScrollBarsProps {
  withShadows?: boolean;
  fullWidth?: boolean;
  withArrows?: boolean;
  arrowScrollOffset?: number;
}
const ScrollContainer = forwardRef<Scrollbars, ScrollContainerProps>(
  (props, forwardedRef) => {
    const {
      children,
      className,
      withShadows,
      withArrows,
      fullWidth,
      arrowScrollOffset = 50,
      ...scrollbarProps
    } = props;

    const [showRightArrow, setShowRightArrow] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const ref = useCombinedRefs<Scrollbars>(forwardedRef);

    const setShowArrows = useCallback(() => {
      const scrollBars = ref.current;

      if (!scrollBars) {
        return;
      }

      const scrollWidth = scrollBars.getScrollWidth();
      const scrollLeft = scrollBars.getScrollLeft();
      const scrollRight =
        scrollWidth - scrollLeft - scrollBars.getClientWidth();

      if (scrollLeft > arrowScrollOffset) {
        setShowLeftArrow(true);
      } else {
        setShowLeftArrow(false);
      }

      if (scrollRight > arrowScrollOffset) {
        setShowRightArrow(true);
      } else {
        setShowRightArrow(false);
      }
    }, [ref, arrowScrollOffset]);

    useLayoutEffect(() => {
      setShowArrows();

      window.addEventListener('resize', setShowArrows);

      return () => {
        window.removeEventListener('resize', setShowArrows);
      };
    }, [setShowArrows]);

    return (
      <div
        className={classNames('scroll-container', className, {
          'scroll-container--with-shadows': withShadows,
          'scroll-container--with-arrows': withArrows,
          'scroll-container--full-width': fullWidth,
        })}
      >
        {withArrows && (
          <i
            className={classNames(
              'scroll-container__arrow',
              'icon-angle-left',
              {
                'scroll-container__arrow--visible': showLeftArrow,
              },
            )}
          />
        )}
        <ScrollBars
          ref={ref}
          onScroll={setShowArrows}
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
        {withArrows && (
          <i
            className={classNames(
              'scroll-container__arrow',
              'icon-angle-right',
              {
                'scroll-container__arrow--visible': showRightArrow,
              },
            )}
          />
        )}
      </div>
    );
  },
);
ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
