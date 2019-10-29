import React from 'react';
import ListItem from "./ListItem";
import VideoCover from "./VideoCover";

export default function Lesson({lesson, locked=false, ...props}) {
    const {title, cover, description, watchProgress} = lesson;
    return (
        <ListItem
            item={lesson}
            className="video-class"
            title={title}
            description={description}
            preview={(
                <VideoCover
                    cover={cover}
                    className="video-class__cover"
                    locked={locked}
                    watchProgress={!locked && watchProgress}/>
            )}
            key={lesson.id}
            {...props}/>
    );
}
