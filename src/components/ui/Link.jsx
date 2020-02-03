import React, {useCallback} from "react";
import {Link as RouterLink, NavLink as RouterNavLink} from "react-router-dom";
import classnames from "classnames";

export const NavLink = ({disabled, className, ...props}) => {
    const onClick = useCallback((event) => {
        if (disabled) {
            event.preventDefault();
        }
    }, [disabled]);
    return (
        <RouterNavLink
            className={classnames('nav-link', className, {
                disabled
            })}
            activeClassName="active"
            onClick={onClick}
            {...props}/>
    );
};

const Link = ({to: link, ...props}) => {
    const isExternal = React.useMemo(() => {
        if (typeof link !== 'string')
            return false;
        try {
            const url = new URL(link);
            return true;
        } catch (e) {
            return false;
        }
    }, [link]);
    if (isExternal) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" {...props}/>
        );
    } else {
        return (
            <RouterLink to={link} {...props}/>
        );
    }
};

export default Link;
