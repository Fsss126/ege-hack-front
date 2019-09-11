import React from 'react';
import {Helmet} from "react-helmet";

export const PageContent = ({children, className}) => (
    <div className={`layout__content-container container ${className || ''}`}>
        {children}
    </div>
);

export default ({title, className, children}) => {
    return (
        <div className={`layout__content ${className || ''}`}>
            {title && <Helmet><title>{title} — ЕГЭ HACK</title></Helmet>}
            {children}
        </div>
    );
}
