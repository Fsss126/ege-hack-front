import React from 'react';

const CoverImage = ({src, placeholder=false, className, children, square=false, round=false, ...props}) => {
    return (
        <div
            className={`${className || ''} cover ${square ? 'square-cover' : ''} ${round ? 'round-cover' : ''}`}
            {...props}>
            {src || !placeholder
                ? <div
                    className="cover-img"
                    style={src ? ({backgroundImage: `url(${src})`}) : undefined}/>
                : <div className="cover-img cover-img--placeholder ph-item"/>}
            {children}
        </div>
    );
};

export default CoverImage;
