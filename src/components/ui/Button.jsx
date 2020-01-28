import React from "react";
import classnames from 'classnames';
import {CSSTransition} from "react-transition-group";

const Button = ({className, children, active = true, neutral = false, loading = false, icon, iconAction, tag: Tag = 'div', onClick, ...props}) => {
    // const clickCallback = React.useCallback((e) => {
    //     console.log(e.target, e.currentTarget, e.target === e.currentTarget);
    //     if (e.target === e.currentTarget)
    //         onClick(e);
    // }, [onClick]);
    const joinedClassname = classnames('btn', {
        'btn-loading': loading,
        'btn-inactive': !active,
        'btn-neutral': neutral
    }, className);
    return (
        <Tag
            className={joinedClassname}
            {...props}>
            <span className="btn__content">
                {icon && <div className="btn__after" onClick={iconAction ? iconAction : onClick}>{icon}</div>}
                    <span
                        className="btn__name"
                        onClick={active ? onClick : undefined}>
                    {children}
                </span>
            </span>
            <CSSTransition
                in={loading}
                appear
                mountOnEnter
                unmountOnExit
                classNames="animation-fade"
                timeout={300}>
                <div className="btn-overlay">
                    <div className="spinner-border"/>
                </div>
            </CSSTransition>
        </Tag>
    );
};

export default Button;
