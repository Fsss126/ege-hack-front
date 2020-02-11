import React from 'react';
import classnames from "classnames";
import {daysBetween} from "definitions/helpers";
import ListItem from "./ListItem";
import PosterCover from "./PosterCover";

export default function Course({course, online=true, isSelected=false, plain, ...props}) {
    const {name, image_link, date_start, date_end, description} = course;
    const startsIn = daysBetween(new Date(), date_start);
    const status = startsIn > 0 ? `До начала курса ${startsIn} ${
        startsIn === 1 ? 'день' :
            startsIn >= 2 && startsIn <= 4 ? 'дня' : 'дней'
    }` : (
        date_end > new Date() ? 'Курс стартовал' : 'Курс завершен'
    );
    return (
        <ListItem
            item={course}
            className={classnames('course', {
                'course-selected': isSelected
            })}
            title={name}
            subtitle={plain ? undefined : status}
            description={plain ? status : description}
            preview={(
                <PosterCover
                    cover={image_link}
                    online={course.online}
                    showOnline={online}/>
            )}
            plain={plain}
            {...props}/>
    );
}
