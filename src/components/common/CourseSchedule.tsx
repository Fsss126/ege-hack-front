import {EventInput} from '@fullcalendar/core';
import ScheduleCalendar, {
  ScheduleCalendarProps,
} from 'components/common/ScheduleCalendar';
import React, {useMemo} from 'react';
import {CourseInfo, PersonWebinar, WebinarInfo} from 'types/entities';

export interface CourseScheduleProps<T extends PersonWebinar | WebinarInfo>
  extends Omit<ScheduleCalendarProps, 'events'> {
  courses?: CourseInfo[];
  webinars?: T[];
  displayCourseSpan: boolean;
  getCourseLink?: (course: CourseInfo) => string | undefined;
  getWebinarLink?: (webinar: T) => string | undefined;
}

const CourseSchedule = <T extends PersonWebinar | WebinarInfo>(
  props: CourseScheduleProps<T>,
) => {
  const {
    courses,
    webinars,
    displayCourseSpan,
    getCourseLink,
    getWebinarLink,
    ...calendarProps
  } = props;

  const events = useMemo(() => {
    const mapCoursesToEvents = (
      course: CourseInfo,
    ): EventInput | EventInput[] => {
      const {date_start, date_end, name} = course;

      const common = {
        title: name,
        className: 'event-course',
        url: getCourseLink ? getCourseLink(course) : undefined,
        allDay: true,
      };

      return displayCourseSpan
        ? {
            ...common,
            start: date_start,
            end: date_end,
          }
        : [
            {
              ...common,
              start: date_start,
            },
            {
              ...common,
              end: date_end,
            },
          ];
    };
    const mapWebinarsToEvents = (webinar: T): EventInput => {
      const {date_start, date_end, name} = webinar;

      return {
        start: date_start,
        end: date_end,
        title: name,
        url: getWebinarLink ? getWebinarLink(webinar) : undefined,
        className: 'event-webinar',
      };
    };
    const courseEvents: (EventInput | EventInput[])[] = courses
      ? courses.map(mapCoursesToEvents)
      : [];
    const webinarEvents: EventInput[] = webinars
      ? webinars.map(mapWebinarsToEvents)
      : [];

    return _(courseEvents).flatten().concat(webinarEvents).value();
  }, [courses, displayCourseSpan, getCourseLink, getWebinarLink, webinars]);

  return <ScheduleCalendar events={events} {...calendarProps} />;
};
CourseSchedule.defaultProps = {
  displayCourseSpan: true,
} as Pick<CourseScheduleProps<any>, 'displayCourseSpan'>;

export default CourseSchedule;
