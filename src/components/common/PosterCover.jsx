import React from "react";
import classnames from 'classnames';
import CoverImage from "./CoverImage";

const PosterCover = ({online, showOnline = true, cover, className, ...rest}) => (
    <div className="poster-cover-container">
        {online && (
            <div className={classnames('poster-cover__online-badge', 'font-size-xs', {
                'poster-cover__online-text': showOnline
            })}>
                <span>Онлайн</span>
            </div>
        )}
        <CoverImage
            src={cover}
            className={classnames('poster-cover', className)}
            {...rest}/>
    </div>
);

export default PosterCover;
