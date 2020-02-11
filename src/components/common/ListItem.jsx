import React from 'react';
import classnames from 'classnames';
import Truncate from 'react-truncate';
import {useTruncate} from "hooks/common";
import Link from "components/ui/Link";

export default function ListItem(props) {
    const {
        preview, title, subtitle, description, item, selectable,
        adaptive,
        plain,
        className,
        children: action,
        link,
        onClick: clickCallback,
        onActionClick: actionCallback,
        noOnClickOnAction = false,
        callbackProps} = props;
    const [descriptionRef, isFontLoaded] = useTruncate(description);
    const onClick = React.useCallback((event) => {
        const clicked = selectable && !((actionCallback || noOnClickOnAction) && event.target.closest('.list__item-action'));
        if (clicked && clickCallback)
            clickCallback(item, callbackProps);
        else if (!clicked && link)
            event.preventDefault();
    }, [item, clickCallback, selectable, callbackProps, link, actionCallback, noOnClickOnAction]);
    const onActionClick = React.useCallback((event) => {
        if (selectable && actionCallback)
            actionCallback(item, callbackProps);
    }, [item, actionCallback, selectable, callbackProps]);
    const content = (
        <div className="row align-items-center">
            <div className={classnames('preview-container', plain ? 'col-auto' : 'adaptive col-12 col-md-auto', {
                'miniature': plain
            })}>
                {preview}
            </div>
            <div className="list__item-description col align-self-stretch d-flex">
                <div className="list__item-description-inner">
                    <div className="title">{title}</div>
                    {subtitle && <div className="subtitle">{subtitle}</div>}
                    {description && (
                        <div className="description-container font-size-xs">
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
    );
    const joinedClassname = classnames('list__item', {
        'list__item-selectable': selectable,
        'list__item-plain': plain
    }, 'container', className);
    if (link) {
        return (
            <Link
                className={joinedClassname}
                to={link}
                onClick={onClick}>
                {content}
            </Link>
        );
    }
    else {
        return (
            <div className={joinedClassname} onClick={onClick}>
                {content}
            </div>
        );
    }
}
