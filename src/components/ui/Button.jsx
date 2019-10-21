import React from "react";

const Button = ({className, children, active = true, neutral=false, icon, iconAction, tag:Tag='div', onClick, ...props}) => {
    // const clickCallback = React.useCallback((e) => {
    //     console.log(e.target, e.currentTarget, e.target === e.currentTarget);
    //     if (e.target === e.currentTarget)
    //         onClick(e);
    // }, [onClick]);
    return (
        <Tag
            className={`btn ${active ? '' : 'btn-inactive'} ${neutral ? 'btn-neutral' : ''} ${className ? className : ''}`}
            {...props}>
        <span className="btn__content">
            {icon && <div className="btn__after" onClick={iconAction ? iconAction : onClick}>{icon}</div>}
            <span
                className="btn__name"
                onClick={onClick}>
                {children}
            </span>
        </span>
        </Tag>
    );
};

export default Button;
