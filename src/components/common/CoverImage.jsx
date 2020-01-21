import React from 'react';
import classnames from "classnames";

const CoverImage = ({src, placeholder=false, className, children, square=false, round=false, ...props}) => {
    return (
        <div
            className={classnames('cover', className, {
                'square-cover': square,
                'round-cover': round
            })}
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
