import React from 'react';
import {Helmet} from "react-helmet";
import StickyElement from "components/ui/Sticky";

export const PageContent = ({children, className}) => (
    <div className={`layout__content-container container ${className || ''}`}>
        {children}
    </div>
);

export const BottomTab = ({children, className}) => (
    <StickyElement>
        {({style}) => (
            <div className={`layout__bottom-tab ${className || ''}`} style={{...style, top: 'auto', bottom: 0}}>
                {children}
            </div>
        )}
    </StickyElement>
);

const Page = ({title, className, children}) => {
    return (
        <div className={`layout__content ${className || ''}`}>
            {title && <Helmet><title>{title} — ЕГЭ HACK</title></Helmet>}
            {children}
        </div>
    );
};

export default Page;
