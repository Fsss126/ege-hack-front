import React, {useEffect, useRef} from "react";
import classnames from 'classnames';
import ScrollBars from "../ui/ScrollBars";
import {NavLink} from "../ui/Link";

export const TabNavLink = ({className, ...props}) => {
    return <NavLink className={classnames('tab-nav__nav-link', className)} {...props}/>
};

// window.scroll({
//     top: 2500,
//     left: 0,
//     behavior: 'smooth'
// })

//TODO: scroll to active element
const TabNav = ({children}) => {
    // const location = useLocation();
    const scrollBarsRef = useRef(null);
    const shadowRightRef = useRef(null);
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
        <div className="tab-nav">
            {/*<div className="shadow">*/}
            {/*    <div className="left"/>*/}
            {/*    <div className="right" ref={shadowRightRef}/>*/}
            {/*</div>*/}
            <ScrollBars
                ref={scrollBarsRef}
                // onScroll={onScroll}
                autoHeight
                autoHeightMax="unset"
                hideVerticalScrollbar
                hideHorizontalScrollbar
                hideTracksWhenNotNeeded
                style={{height: '100%'}}
                className="scrollbars">
                <div className="tab-nav__links-container">
                    {children}
                </div>
            </ScrollBars>
        </div>
    );
};

export default TabNav;
