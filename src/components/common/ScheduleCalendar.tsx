import EventApi from '@fullcalendar/core/api/EventApi';
import View from '@fullcalendar/core/View';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, {useCallback} from 'react';
import {useHistory} from 'react-router';

export type ScheduleCalendarProps = React.ComponentProps<
  typeof FullCalendar
> & {
  weekMode?: boolean;
};

const ScheduleCalendar = React.forwardRef<FullCalendar, ScheduleCalendarProps>(
  (props, ref) => {
    const {weekMode, ...calendarProps} = props;

    const history = useHistory();

    const onEventClick = useCallback(
      (arg: {
        el: HTMLElement;
        event: EventApi;
        jsEvent: MouseEvent;
        view: View;
      }) => {
        if (arg.event.url) {
          arg.jsEvent.preventDefault();
          history.push(arg.event.url);
        }
      },
      [history],
    );

    return (
      <div className="schedule-calendar">
        <FullCalendar
          ref={ref}
          header={{
            left: '',
            center: `prev,next ${
              weekMode ? 'today title dayGridMonth,timeGridWeek' : 'title today'
            }`,
            right: '',
          }}
          eventClick={onEventClick}
          {...calendarProps}
        />
      </div>
    );
  },
);
ScheduleCalendar.displayName = 'ScheduleCalendar';
ScheduleCalendar.defaultProps = {
  weekMode: true,
  defaultView: 'dayGridMonth',
  locale: 'ru',
  firstDay: 1,
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  eventLimit: 4,
  height: 'auto',
  titleFormat: {month: 'long'},
  allDaySlot: false,
  buttonText: {
    today: 'сегодня',
    month: 'месяц',
    week: 'неделя',
    day: 'день',
    list: 'список',
  },
  views: {
    timeGridWeek: {
      columnHeaderFormat: {day: 'numeric'},
    },
  },
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: false,
  },
};

export default ScheduleCalendar;
