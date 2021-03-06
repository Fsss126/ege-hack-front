import classNames from 'classnames';
import {daysBetween} from 'definitions/helpers';
import React from 'react';
import {CourseInfo} from 'types/entities';

import ListItem, {ListItemProps} from './ListItem';
import PosterCover from './PosterCover';

export type CourseProps<P = undefined> = {
  course: CourseInfo;
  online: boolean;
  isSelected: boolean;
} & Omit<
  React.Defaultize<ListItemProps<CourseInfo, P>, typeof ListItem.defaultProps>,
  'item' | 'preview' | 'description' | 'subtitle' | 'title'
>;
const Course = <P extends any = undefined>(
  props: CourseProps<P>,
): React.ReactElement => {
  const {course, online, isSelected, plain, ...rest} = props;
  const {name, image_link, date_start, date_end, description} = course;
  const startsIn = daysBetween(new Date(), date_start);
  const status =
    startsIn > 0
      ? `До начала курса ${startsIn} ${
          startsIn === 1
            ? 'день'
            : startsIn >= 2 && startsIn <= 4
            ? 'дня'
            : 'дней'
        }`
      : date_end > new Date()
      ? 'Курс стартовал'
      : 'Курс завершен';

  return (
    <ListItem<CourseInfo, P>
      item={course}
      className={classNames('course', {
        'course-selected': isSelected,
      })}
      title={name}
      subtitle={plain ? undefined : status}
      description={plain ? status : description}
      preview={
        <PosterCover
          cover={image_link}
          online={course.online}
          showOnline={online}
        />
      }
      plain={plain}
      {...rest}
    />
  );
};
Course.defaultProps = {
  online: true,
  isSelected: false,
  plain: false,
};

export default Course;
