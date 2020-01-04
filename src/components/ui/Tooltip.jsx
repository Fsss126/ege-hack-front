import React, { Fragment } from 'react';

export const TooltipPositions = {
    top: 'pos-top',
    right: 'pos-right',
    left: 'pos-left',
    bottom: 'pos-bottom'
};

const Tooltip = (props) => {
    const {
        children,
        content,
        position
    } = props;
    let child = React.Children.only(children);
    if (!content)
        return child;
    return React.cloneElement(child, {
        className: (child.props.className ? child.props.className + ' tooltip ' : 'tooltip ') + (position || ''),
        children: (
            <Fragment>
                {child.props.children}
                <div className="tooltip-arrow"/>
                <div className="tooltip-block">{content}</div>
            </Fragment>
        )
    });
};

export default Tooltip;
