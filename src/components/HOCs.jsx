import React from "react";
import {Redirect, withRouter} from "react-router-dom";

export const ForceTrailingSlash = withRouter(({location, children}) => {
    const path = location.pathname;
    if (path.slice(-1) !== '/') {
        return (<Redirect to={path + '/'}/>)
    }
    else
        return children || null;
});
