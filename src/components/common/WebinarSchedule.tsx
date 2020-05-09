import APIRequest from 'api';
import classNames from 'classnames';
import {ContentBlock} from 'components/layout/ContentBlock';
import {useSnackbar} from 'notistack';
import React, {useCallback, useEffect, useState} from 'react';
import Countdown, {CountdownTimeDelta} from 'react-countdown-now';
import {CountdownRenderProps} from 'react-countdown-now/dist/Countdown';
import {LinkResp} from 'types/dtos';
import {PersonWebinar, WebinarInfo} from 'types/entities';
import {SimpleCallback} from 'types/utility/common';

import {renderDate} from '../../definitions/helpers';
import {PageContent} from '../layout/Page';
import CoverImage from './CoverImage';
import ScrollContainer from './ScrollContainer';

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
    return param.total <= UNLOCK_TIME;
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
  subjectId: number;
};
const Webinar: React.FC<WebinarProps> = ({webinar, subjectId}) => {
  const {state, isUnlocked, onTick, onWebinarStart} = useWebinar(webinar);

  const {enqueueSnackbar} = useSnackbar();

  const onClick = React.useCallback(
    async (event) => {
      if (!isUnlocked) {
        event.preventDefault();
        enqueueSnackbar(
          `Вебинар откроется ${renderDate(
            webinar.date_start,
            renderDate.dateWithHour,
          )}`,
          {
            persist: false,
            key: webinar.id,
            variant: 'info',
            preventDuplicate: true,
          },
        );
        return;
      }

      const newWindow = window.open() as Window;

      try {
        const response = (await APIRequest.get(
          `/courses/${webinar.course_id || subjectId}/schedule/link`,
        )) as LinkResp;
        newWindow.location.href = response.link;
        newWindow.focus();
      } catch (e) {
        newWindow.close();

        console.error(e);
        enqueueSnackbar('Ошибка при подключении к вебинару', {
          persist: false,
          key: webinar.id,
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
    [isUnlocked, webinar, subjectId, enqueueSnackbar],
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
              subjectId={webinar.course_id}
              key={webinar.id}
            />
          ))}
        </ScrollContainer>
      </ContentBlock>
    </>
  );
};

export default WebinarSchedule;
