import React from 'react';

export default function CoverImage({src, classname}) {
    return (
        <div className={`${classname} cover`}>
            <div className="cover-img" style={{backgroundImage: `url(${src})`}}/>
        </div>
    );
}
