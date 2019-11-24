import React from "react";

const VideoPlayer = ({video_link}) => (
    <div className="video-player">
        <iframe
            className="video-player__video"
            src={`https://player.vimeo.com/video/${video_link}?color=fa9346&title=0&byline=0&portrait=0`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen/>
    </div>
);

export default VideoPlayer;
