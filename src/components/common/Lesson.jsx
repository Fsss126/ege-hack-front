import React from 'react';
import classnames from 'classnames';
import ListItem from "./ListItem";
import VideoCover from "./VideoCover";

export default function Lesson({lesson, locked=false, selectable, link, ...props}) {
    const {name, image_link: cover, description, watchProgress} = lesson;
    return (
        <ListItem
            item={lesson}
            className={classnames('video-class', {
                'video-class--disabled': !selectable
            })}
            title={name}
            description={description}
            preview={(
                <VideoCover
                    cover={cover}
                    className="video-class__cover"
                    locked={locked}
                    watchProgress={!locked && watchProgress}/>
            )}
            key={lesson.id}
            link={locked ? undefined : link}
            selectable={selectable}
            {...props}/>
    );
}
