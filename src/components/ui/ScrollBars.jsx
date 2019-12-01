import React from 'react';
import {Scrollbars as ScrollComponent} from 'react-custom-scrollbars';

const renderEmpty = () => <div/>;

const renderTrackVertical = props => (<div {...props} className="track track-vertical"/>);
const renderThumbVertical = props => (<div {...props} className="thumb thumb-vertical"/>);
const renderTrackHorizontal = props => (<div {...props} className="track track-horizontal"/>);
const renderThumbHorizontal = props => (<div {...props} className="thumb thumb-horizontal"/>);

const ScrollBars = React.forwardRef(({children, hideVerticalScrollbar=false, hideHorizontalScrollbar=false, ...props}, ref) => {
    return (
        <ScrollComponent
            renderTrackVertical={hideVerticalScrollbar ? renderEmpty : renderTrackVertical}
            renderThumbVertical={renderThumbVertical}
            renderTrackHorizontal={hideHorizontalScrollbar ? renderEmpty : renderTrackHorizontal}
            renderThumbHorizontal={renderThumbHorizontal}
            ref={ref}
            {...props}>
            {children}
        </ScrollComponent>
    );
});

export default ScrollBars;
