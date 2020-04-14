import APIRequest from 'api';
import classnames from 'classnames';
import ScrollBars from 'components/ui/ScrollBars';
import React, {useCallback, useEffect, useState} from 'react';
import Countdown, {CountdownTimeDelta} from 'react-countdown-now';
import {CountdownRenderProps} from 'react-countdown-now/dist/Countdown';
import {PersonWebinar, WebinarInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

import {LinkResp} from '../../types/dtos';
import CoverImage from './CoverImage';

// const getTimerState = (releaseDate) => {
//     console.log(releaseDate);
//     const total = Math.max(releaseDate - new Date(), 0);
//     const seconds = Math.floor((total / 1000) % 60);
//     const minutes = Math.floor((total / 1000 / 60) % 60);
//     const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
//     const days = Math.floor(total / (1000 * 60 * 60 * 24));
//     return ({
//         isAvailable: total === 0,
//         remainingTime: {
//             total,
//             days,
//             hours,
//             minutes,
//             seconds,
//         }});
// };
//
// function useCountdown(deadline) {
//     const [state, setState] = React.useState(getTimerState(deadline));
//     const timer = React.useRef();
//     React.useEffect(() => {
//         if (deadline > new Date()) {
//             // noinspection JSValidateTypes
//             timer.current = setInterval(() => {
//                 const newState = getTimerState(deadline);
//                 if (newState.isAvailable)
//                     clearInterval(timer.current);
//                 setState(newState);
//             }, 1000);
//         }
//         return () => {clearInterval(timer.current);};
//     }, [deadline]);
//     return state;
// }

export enum WEBINAR_STATE {
  WAITING = 'WAITING',
  AIRING = 'AIRING',
  ENDED = 'ENDED',
}

const UNLOCK_TIME = 1000 * 60 * 5; //opens 5 minutes before start

type Webinar = PersonWebinar | WebinarInfo;

export const getWebinarState = (webinar: Webinar): WEBINAR_STATE => {
  const now = new Date();

  return webinar.date_start > now
    ? WEBINAR_STATE.WAITING
    : now > webinar.date_end
    ? WEBINAR_STATE.ENDED
    : WEBINAR_STATE.AIRING;
};

export const isWebinarUnlocked = (
  param: Webinar | CountdownTimeDelta,
): boolean => {
  if ('total' in param) {
    const timeDelta = param;

    return timeDelta.total <= UNLOCK_TIME;
  } else {
    const webinar = param;
    const now = new Date();

    return (
      now >= new Date(webinar.date_start.getTime() - UNLOCK_TIME) &&
      now < webinar.date_end
    );
  }
};

export type WebinarHookResult = {
  state: WEBINAR_STATE;
  isUnlocked: boolean;
  onWebinarStart: SimpleCallback;
  onTick: (timeDelta: CountdownTimeDelta) => void;
};

export function useWebinar(webinar: Webinar): WebinarHookResult {
  const [state, setState] = useState(getWebinarState(webinar));
  const [isUnlocked, setIsUnlocked] = useState(isWebinarUnlocked(webinar));
  const onWebinarStart = useCallback(() => {
    setState(WEBINAR_STATE.AIRING);
  }, []);
  useEffect(() => {
    if (state === WEBINAR_STATE.AIRING) {
      const now = new Date();
      const timeTillEnd = webinar.date_end.getTime() - now.getTime();
      const timeout = setTimeout(() => {
        setState(WEBINAR_STATE.ENDED);
      }, timeTillEnd);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [state, webinar]);

  const onTick = useCallback((timeDelta) => {
    setIsUnlocked(isWebinarUnlocked(timeDelta));
  }, []);

  return {
    state,
    isUnlocked,
    onWebinarStart,
    onTick,
  };
}

export type WebinarProps = {
  webinar: PersonWebinar;
  courseId: number;
};
const Webinar: React.FC<WebinarProps> = ({webinar, courseId}) => {
  const {state, isUnlocked, onTick, onWebinarStart} = useWebinar(webinar);

  const onClick = React.useCallback(
    async (event) => {
      if (!isUnlocked) {
        event.preventDefault();
        return;
      }
      const newWindow = window.open() as Window;
      const response = (await APIRequest.get(
        `/courses/${webinar.course_id || courseId}/schedule/link`,
      )) as LinkResp;
      newWindow.location.href = response.link;
    },
    [isUnlocked, webinar, courseId],
  );

  const renderCountdown = useCallback((remainingTime: CountdownRenderProps) => {
    const {
      formatted: {days, hours, minutes, seconds},
      completed,
    } = remainingTime;

    return completed ? (
      <div className="d-flex">
        <span>В</span>
        <span>&nbsp;</span>
        <span>эфире</span>
      </div> //fixes a big on mobile
    ) : (
      <div className="countdown">
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
    );
  }, []);

  if (state === WEBINAR_STATE.ENDED) {
    return null;
  }
  return (
    <div
      onClick={onClick}
      className={classnames('webinar-schedule__webinar', 'd-flex', {
        'webinar-schedule__webinar-locked': !isUnlocked,
      })}
    >
      <div className="container d-flex overflow-hidden">
        <div className="row flex-nowrap flex-grow-1">
          <div className="col-auto d-flex align-items-center webinar-schedule__webinar-status">
            {isUnlocked ? (
              <i className="fas fa-unlock" />
            ) : (
              <i className="fas fa-lock" />
            )}
          </div>
          <div className="col d-flex flex-shrink-0 p-0">
            <CoverImage
              className="webinar-schedule__webinar-poster"
              src={webinar.image_link}
            />
            <div className="webinar-schedule__webinar-title d-flex flex-column justify-content-center p-2">
              <div>{webinar.subject_name}</div>
              <div>{webinar.name}</div>
            </div>
          </div>
          <div className="col-auto d-flex align-items-center webinar-schedule__webinar-countdown">
            <Countdown
              date={webinar.date_start}
              renderer={renderCountdown}
              onTick={onTick}
              onComplete={onWebinarStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export type WebinarScheduleProps = {
  schedule: PersonWebinar[];
};
const WebinarSchedule: React.FC<WebinarScheduleProps> = (props) => {
  const {schedule} = props;

  if (schedule.length === 0) {
    return null;
  }
  return (
    <div className="layout__content-block webinar-schedule">
      <ScrollBars
        autoHeight
        autoHeightMax="unset"
        hideVerticalScrollbar
        hideHorizontalScrollbar
        hideTracksWhenNotNeeded
        style={{height: '100%'}}
        className="scrollbars"
      >
        <div className="d-flex flex-nowrap">
          {schedule.map((webinar) => (
            <Webinar
              webinar={webinar}
              courseId={webinar.course_id}
              key={webinar.id}
            />
          ))}
        </div>
      </ScrollBars>
    </div>
  );
};

export default WebinarSchedule;
