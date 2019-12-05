import React from 'react';
import {daysBetween} from "../../definitions/helpers";
import ListItem from "./ListItem";
import CoverImage from "./CoverImage";

export default function Course({course, online=true, isSelected=false, ...props}) {
    const {name, image_link, date_start, date_end, description} = course;
    const startsIn = daysBetween(new Date(), date_start);
    return (
        <ListItem
            item={course}
            className={isSelected ? 'course course-selected' : 'course'}
            title={name}
            subtitle={startsIn > 0 ? `До начала курса ${startsIn} ${
                startsIn % 10 === 1 ? 'день' : 
                    startsIn % 10 >= 2 && startsIn % 10 <= 4 ? 'дня' : 'дней'
                }` : (
                    date_end > new Date() ? 'Курс стартовал' : 'Курс завершен'
            )}
            description={description}
            preview={(
                <div className="course__cover-container">
                    {course.online && (
                        <div className={`course__online-badge ${online ? 'course__online-text' : ''} font-size-xs`}>
                            <span>Онлайн</span>
                        </div>
                    )}
                    <CoverImage src={image_link} className="poster-cover course__cover"/>
                </div>
            )}
            {...props}/>
    );
}
