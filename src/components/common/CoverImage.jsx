import React from 'react';

const CoverImage = ({src, placeholder=false, className, children, square=false, round=false}) => {
    return (
        <div className={`${className || ''} cover ${square ? 'square-cover' : ''} ${round ? 'round-cover' : ''}`}>
            {src || !placeholder
                ? <div className="cover-img" style={{backgroundImage: `url(${src})`}}/>
                : <div className="cover-img cover-img--placeholder ph-item"/>}
            {children}
        </div>
    );
};

export default CoverImage;
