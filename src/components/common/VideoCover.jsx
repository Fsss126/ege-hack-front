import React from "react";
import CoverImage from "./CoverImage";

const VideoCover = ({cover, watchProgress, locked=false, className}) => (
    <CoverImage
        src={cover}
        className={`video-cover ${locked ? 'video-locked' : ''} ${className || ''}`}>
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
