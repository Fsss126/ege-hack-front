import React from "react";
import classnames from 'classnames';

export const DropdownMenuOption = ({tag: Tag = 'div', children, className, ...props}) => (
    <Tag className={classnames('dropdown__menu-option', className)} {...props}>
        {children}
    </Tag>
);

export const DropdownIconButton = ({className, ...props}) => {
    return (
        <i className={classnames('dropdown__icon-btn', className)} {...props}/>
    );
};

const DropdownMenu = ({content, className, children: options}) => {
    return (
        <div className={classnames('dropdown', className)}>
            {content}
            <div className="dropdown__menu-container">
                <div className="dropdown__menu overlay-window">
                    {options}
                </div>
            </div>
        </div>
    )
};

export default DropdownMenu;