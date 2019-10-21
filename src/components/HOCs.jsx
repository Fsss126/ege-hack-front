import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {useUpdateEffect, useLocationChangeEffect} from "definitions/hooks";

export const ScrollToTop = withRouter(({ children, location: { pathname }, history }) => {
    useUpdateEffect(() => {
        console.log('update');
        if (history.action !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname]);
    return children || null;
});

export const LocationListener = withRouter(({history, onLocationChange, children}) => {
    useLocationChangeEffect(onLocationChange, history);
    return children || null;
});

export const ForceTrailingSlash = withRouter(({location, children}) => {
    const path = location.pathname;
    if (path.slice(-1) !== '/') {
        return (<Redirect to={path + '/'}/>)
    }
    else
        return children || null;
});
