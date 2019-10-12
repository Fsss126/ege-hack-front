import React from "react";

const Button = ({className, children, active = true, neutral=false, before, after, tag:Tag='div', onClick, ...props}) => {
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
            {before && <div className="btn__before">{before}</div>}
            {after && <div className="btn__after">{after}</div>}
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
