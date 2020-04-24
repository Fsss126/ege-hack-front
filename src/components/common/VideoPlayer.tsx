import React from 'react';

export type VideoPlayerProps = {
  video_link: string;
};
const VideoPlayer: React.FC<VideoPlayerProps> = ({video_link}) => (
  <div className="video-player">
    <iframe
      className="video-player__video"
      src={`${video_link}?color=fa9346&title=0&byline=0&portrait=0`}
      frameBorder="0"
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  </div>
);

export default VideoPlayer;
