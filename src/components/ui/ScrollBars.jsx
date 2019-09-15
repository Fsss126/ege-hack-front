import React from 'react';
import {Scrollbars as ScrollComponent} from 'react-custom-scrollbars';

const renderTrackVertical = props => (<div {...props} className="track track-vertical"/>);
const renderThumbVertical = props => (<div {...props} className="thumb thumb-vertical"/>);
const renderTrackHorizontal = props => (<div {...props} className="track track-horizontal"/>);
const renderThumbHorizontal = props => (<div {...props} className="thumb thumb-horizontal"/>);

const ScrollBars = React.forwardRef(({children, ...props}, ref) => {
    return (
        <ScrollComponent
            renderTrackVertical={renderTrackVertical}
            renderThumbVertical={renderThumbVertical}
            renderTrackHorizontal={renderTrackHorizontal}
            renderThumbHorizontal={renderThumbHorizontal}
            ref={ref}
            {...props}>
            {children}
        </ScrollComponent>
    );
});

export default ScrollBars;
