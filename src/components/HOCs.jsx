import React from 'react';
import {Redirect, useLocation} from 'react-router-dom';

export const ForceTrailingSlash = ({children}) => {
  const location = useLocation();
  const path = location.pathname;

  if (path.slice(-1) !== '/') {
    return <Redirect to={path + '/'} />;
  } else {
    return children || null;
  }
};
