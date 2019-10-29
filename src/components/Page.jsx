import React from 'react';
import {Helmet} from "react-helmet";
import Sticky from 'react-sticky-el';
import {Link} from "react-router-dom";

export const PageLoadingPlaceholder = () => (
    <div className="layout__loading-spinner">
        <i className="spinner-border"/>
    </div>
);

export const PageLink = ({to, arrow=true, forward=true, className, children, ...props}) => (
    <Link
        className={`${arrow ? 'arrow-link' : ''} ${forward ? 'arrow-link-forward' : 'arrow-link-backward'} ${className || ''}`}
        to={to}
        {...props}>
        {children}
    </Link>
);

export const PageContent = ({children, className, parentSection}) => (
    <div className={`layout__content-container container ${className || ''}`}>
        {parentSection && (
            <PageLink
                to={parentSection.url || '..'}
                forward={false}
                className="layout__content-parent-section-link">
                {parentSection.name}
            </PageLink>
        )}
        {children}
    </div>
);

export const BottomTab = ({children, className, ...stickyProps}) => (
    <Sticky mode="bottom" {...stickyProps}>
        <div className={`layout__bottom-tab ${className || ''}`}>
            {children}
        </div>
    </Sticky>
);

const Page = ({title, className, children}) => {
    return (
        <div className={`layout__content ${className || ''}`}>
            {title && <Helmet><title>{title} – ЕГЭ HACK</title></Helmet>}
            {children}
        </div>
    );
};

export default Page;
