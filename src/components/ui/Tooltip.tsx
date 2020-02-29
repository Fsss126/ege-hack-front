import React, {Fragment, ReactElement} from 'react';
import classnames from 'classnames';

export enum TooltipPosition {
    top = 'pos-top',
    right = 'pos-right',
    left = 'pos-left',
    bottom = 'pos-bottom'
}

export type TooltipProps = {
    children: React.ReactElement;
    content: React.ReactNode;
    position?: TooltipPosition;
}
const Tooltip: React.FC<TooltipProps> = (props) => {
    const {
        children,
        content,
        position
    } = props;
    const child = React.Children.only(children);
    if (!content)
        return child;
    return React.cloneElement(child, {
        className: classnames(child.props.className, 'tooltip', position && `pos-${position}`),
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
