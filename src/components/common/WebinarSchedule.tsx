import APIRequest from 'api';
import classNames from 'classnames';
import React, {useCallback, useEffect, useState} from 'react';
import Countdown, {CountdownTimeDelta} from 'react-countdown-now';
import {CountdownRenderProps} from 'react-countdown-now/dist/Countdown';
import {LinkResp} from 'types/dtos';
import {PersonWebinar, WebinarInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

import {ContentBlock} from '../layout/ContentBlock';
import {PageContent} from '../layout/Page';
import CoverImage from './CoverImage';
import ScrollContainer from './ScrollContainer';

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

const UNLOCK_TIME = 1000 * 60 * 5; // opens 5 minutes before start

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
      </div> // fixes a big on mobile
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
      className={classNames('webinar', 'd-flex', {
        webinar__locked: !isUnlocked,
      })}
      title={
        isUnlocked ? 'Вы можете перейти к вебинару' : 'Вебинар еще не начался'
      }
    >
      <div className="webinar-inner-container container d-flex">
        <div className="row flex-nowrap flex-grow-1">
          <div className="webinar__status col-auto d-flex align-items-center">
            {isUnlocked ? (
              <i className="fas fa-unlock" />
            ) : (
              <i className="fas fa-lock" />
            )}
          </div>
          <div className="webinar__content col d-flex flex-shrink-0">
            <CoverImage className="webinar__poster" src={webinar.image_link} />
            <div className="webinar__title d-flex flex-column justify-content-center p-2">
              <div>{webinar.subject_name}</div>
              <div>{webinar.name}</div>
            </div>
          </div>
          <div className="webinar__countdown col-auto d-flex align-items-center">
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
  title?: React.ReactNode;
};
const WebinarSchedule: React.FC<WebinarScheduleProps> = (props) => {
  const {schedule, title} = props;

  if (schedule.length === 0) {
    return null;
  }
  return (
    <>
      <PageContent>
        <ContentBlock title={title} transparent />
      </PageContent>
      <ContentBlock className="webinar-schedule" transparent>
        <ScrollContainer
          className="webinar-schedule__list-wrap"
          withShadows={false}
          fullWidth={true}
        >
          {schedule.map((webinar) => (
            <Webinar
              webinar={webinar}
              courseId={webinar.course_id}
              key={webinar.id}
            />
          ))}
        </ScrollContainer>
      </ContentBlock>
    </>
  );
};

export default WebinarSchedule;
