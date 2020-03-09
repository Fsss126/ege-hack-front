import React, {forwardRef} from "react";
import classnames from 'classnames';
import ScrollBars, {ScrollBarsProps} from "../ui/ScrollBars";
import Scrollbars from "react-custom-scrollbars";

export type ButtonContainerProps = ScrollBarsProps;
const ButtonContainer = forwardRef<Scrollbars, ButtonContainerProps>((props, ref) => {
    const {children, className, ...scrollbarProps} = props;
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
        <div className={classnames('btn-container', className)}>
            {/*<div className="shadow">*/}
            {/*    <div className="left"/>*/}
            {/*    <div className="right" ref={shadowRightRef}/>*/}
            {/*</div>*/}
            <ScrollBars
                ref={ref}
                // onScroll={onScroll}
                autoHeight
                autoHeightMax="unset"
                hideVerticalScrollbar
                hideHorizontalScrollbar
                hideTracksWhenNotNeeded
                style={{height: '100%'}}
                className="scrollbars"
                {...scrollbarProps}>
                <div className="scroll-btn-container__inner-container">
                    {children}
                </div>
            </ScrollBars>
        </div>
    );
});
ButtonContainer.displayName = 'ButtonContainer';

export default ButtonContainer;
