import React from "react";
import classnames from "classnames";
import CoverImage from "./CoverImage";

const VideoCover = ({cover, watchProgress, locked=false, className}) => (
    <CoverImage
        src={cover}
        className={classnames('video-cover', className, {
            'video-locked': locked
        })}>
        {watchProgress && (
            <div className="video-cover__watch-progress-bar">
                <div
                    className="watch-progress-bar__progress-line"
                    style={{width: `${watchProgress}%`}}/>
            </div>
        )}
    </CoverImage>
);

export default VideoCover;
