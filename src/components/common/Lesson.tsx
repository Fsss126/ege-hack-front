import React from 'react';
import classnames from 'classnames';
import ListItem, {ListItemProps} from "./ListItem";
import VideoCover from "./VideoCover";
import {LessonInfo} from "types/entities";

export type LessonProps<P = undefined> = {
    lesson: LessonInfo;
    locked: boolean;
} & Omit<React.Defaultize<ListItemProps<LessonInfo, P>, typeof ListItem.defaultProps>, 'item' | 'preview' | 'description' | 'subtitle' | 'title'>
const Lesson = <P extends any = undefined>(props: LessonProps<P>): React.ReactElement => {
    const {lesson, locked, selectable, link, ...rest} = props;
    const {name, image_link: cover, description, watchProgress} = lesson;
    return (
        <ListItem<LessonInfo, P>
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
                    watchProgress={!locked ? watchProgress : undefined}/>
            )}
            link={link}
            selectable={selectable}
            {...rest}/>
    );
};
Lesson.defaultProps = {
    locked: false
};

export default Lesson;
