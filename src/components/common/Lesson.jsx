import React from 'react';
import ListItem from "./ListItem";
import CoverImage from "./CoverImage";

export default function Lesson({lesson, locked=false, ...props}) {
    const {title, cover, description} = lesson;
    return (
        <ListItem
            item={lesson}
            className="video-class"
            title={title}
            description={description}
            preview={(
                <CoverImage
                    src={cover}
                    classname={`video-class__cover video-cover ${locked ? 'video-locked' : ''}`}/>
            )}
            key={lesson.id}
            {...props}/>
    );
}
