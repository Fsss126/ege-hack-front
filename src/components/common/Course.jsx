import React from 'react';
import classnames from "classnames";
import {daysBetween} from "definitions/helpers";
import ListItem from "./ListItem";
import CoverImage from "./CoverImage";

export default function Course({course, online=true, isSelected=false, ...props}) {
    const {name, image_link, date_start, date_end, description} = course;
    const startsIn = daysBetween(new Date(), date_start);
    return (
        <ListItem
            item={course}
            className={classnames('course', {
                'course-selected': isSelected
            })}
            title={name}
            subtitle={startsIn > 0 ? `До начала курса ${startsIn} ${
                startsIn === 1 ? 'день' : 
                    startsIn >= 2 && startsIn <= 4 ? 'дня' : 'дней'
                }` : (
                    date_end > new Date() ? 'Курс стартовал' : 'Курс завершен'
            )}
            description={description}
            preview={(
                <div className="course__cover-container">
                    {course.online && (
                        <div className={classnames('course__online-badge', 'font-size-xs', {
                            'course__online-text': online
                        })}>
                            <span>Онлайн</span>
                        </div>
                    )}
                    <CoverImage src={image_link} className="poster-cover course__cover"/>
                </div>
            )}
            {...props}/>
    );
}
