import React from 'react';
import Truncate from 'react-truncate';
import {useTruncate} from "../../definitions/hooks";

export default function ListItem(props) {
    const {
        preview, title, subtitle, description, item, selectable,
        className,
        children: action,
        onClick: clickCallback,
        onActionClick: actionCallback,
        callbackProps} = props;
    const [descriptionRef, isFontLoaded] = useTruncate(description);
    const onClick = React.useCallback((event) => {
        if (selectable && clickCallback && !event.target.closest('.list__item-action'))
            clickCallback(item, callbackProps);
    }, [item, clickCallback, selectable, callbackProps]);
    const onActionClick = React.useCallback((event) => {
        if (selectable && actionCallback)
            actionCallback(item, callbackProps);
    }, [item, actionCallback, selectable, callbackProps]);
    return (
        <div className={`list__item container ${selectable ? 'list__item-selectable' : ''} ${className || ''}`} onClick={onClick}>
            <div className="row align-items-center">
                <div className="list__item-preview col-12 col-md-auto">
                    {preview}
                </div>
                <div className="list__item-description col align-self-stretch">
                    <div className="list__item-description-inner">
                        <div className="title font-size-lg">{title}</div>
                        {subtitle && <div className="subtitle">{subtitle}</div>}
                        {description && (
                            <div className="description-text-container font-size-xs">
                                <div className="description-text">
                                    {isFontLoaded ? (
                                        <Truncate lines={2} ref={descriptionRef}>
                                            {description}
                                        </Truncate>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {action && (
                    <div
                        className="list__item-action col-auto d-flex align-items-center flex-column"
                        onClick={onActionClick}>
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
