import React from 'react';
import {daysBetween} from "../../definitions/helpers";
import ListItem from "./ListItem";
import CoverImage from "./CoverImage";

export default function Course({course, online=true, isSelected=false, ...props}) {
    const {title, cover, start, description} = course;
    const startsIn = daysBetween(new Date(), start);
    return (
        <ListItem
            item={course}
            className={isSelected ? 'course course-selected' : 'course'}
            title={title}
            subtitle={`До начала курса ${startsIn} ${startsIn === 1 ? 'день' : 'дней'}`}
            description={description}
            preview={(
                <div className="course__cover-container">
                    {course.online && (
                        <div className={`course__online-badge ${online ? 'course__online-text' : ''} font-size-xs`}>
                            <span>Онлайн</span>
                        </div>
                    )}
                    <CoverImage src={cover} className="poster-cover course__cover"/>
                </div>
            )}
            {...props}/>
    );
}
