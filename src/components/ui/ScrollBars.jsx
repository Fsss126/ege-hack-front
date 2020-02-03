import React from 'react';
import classnames from 'classnames';
import {Scrollbars as ScrollComponent} from 'react-custom-scrollbars';

const renderEmpty = () => <div/>;

const renderTrackVertical = props => (<div {...props} className="track track-vertical"/>);
const renderThumbVertical = props => (<div {...props} className="thumb thumb-vertical"/>);
const renderTrackHorizontal = props => (<div {...props} className="track track-horizontal"/>);
const renderThumbHorizontal = props => (<div {...props} className="thumb thumb-horizontal"/>);
const renderView = props => (<div {...props} className="scrollbars-scroll-base"/>);

const ScrollBars = React.forwardRef(({className, hideVerticalScrollbar=false, hideHorizontalScrollbar=false, ...props}, ref) => {
    return (
        <ScrollComponent
            className={classnames('scrollbars', className)}
            renderTrackVertical={hideVerticalScrollbar ? renderEmpty : renderTrackVertical}
            renderThumbVertical={renderThumbVertical}
            renderTrackHorizontal={hideHorizontalScrollbar ? renderEmpty : renderTrackHorizontal}
            renderThumbHorizontal={renderThumbHorizontal}
            renderView={renderView}
            ref={ref}
            {...props}/>
    );
});

export default ScrollBars;
