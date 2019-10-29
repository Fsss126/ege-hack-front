import React from 'react';

const CoverImage = ({src, className, children, square=false, round=false}) => {
    return (
        <div className={`${className} cover ${square ? 'square-cover' : ''} ${round ? 'round-cover' : ''}`}>
            <div className="cover-img" style={{backgroundImage: `url(${src})`}}/>
            {children}
        </div>
    );
};

export default CoverImage;
