import React from 'react';

const CoverImage = ({src, className, children}) => {
    return (
        <div className={`${className} cover`}>
            <div className="cover-img" style={{backgroundImage: `url(${src})`}}/>
            {children}
        </div>
    );
};

export default CoverImage;
