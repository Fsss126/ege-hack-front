import React from "react";
import {Link as RouterLink} from "react-router-dom";

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
