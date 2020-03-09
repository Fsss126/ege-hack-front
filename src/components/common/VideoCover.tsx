import React from "react";
import classnames from "classnames";
import CoverImage from "./CoverImage";

export type VideoCoverProps = {
    cover?: string;
    watchProgress?: number;
    locked: boolean;
    className?: string;
}
const VideoCover: React.withDefaultProps<React.FC<VideoCoverProps>> = ({cover, watchProgress, locked, className}) => (
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
VideoCover.defaultProps = {
    locked: false
};

export default VideoCover;
