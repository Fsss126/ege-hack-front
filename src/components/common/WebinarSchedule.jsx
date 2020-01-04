import React from "react";
import Countdown from 'react-countdown-now';
import ScrollBars from "components/ui/ScrollBars";
import CoverImage from "./CoverImage";
import APIRequest from "api";

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

const WEBINAR_STATE = {
    WAITING: 'WAITING',
    AIRING: 'AIRING',
    ENDED: 'ENDED'
};

const UNLOCK_TIME = 1000*60*5; //opens 5 minutes before start

const getWebinarState = (webinar) => {
    const now = new Date();
    return webinar.date_start > now ? WEBINAR_STATE.WAITING : (now > webinar.date_end ? WEBINAR_STATE.ENDED : WEBINAR_STATE.AIRING);
};

const isWebinarUnlocked = (param) => {
    if (param.date_start && param.date_end) {
        const webinar = param;
        const now = new Date();
        return now >= new Date(webinar.date_start - UNLOCK_TIME) && now < webinar.date_end;
    } else {
        const timeDelta = param;
        return timeDelta.total <= UNLOCK_TIME;
    }
};

const Webinar = ({webinar, courseId}) => {
    const [state, setState] = React.useState(getWebinarState(webinar));
    const [isUnlocked, setIsUnlocked] = React.useState(isWebinarUnlocked(webinar));
    const onWebinarStart = React.useCallback(() => {
        setState(WEBINAR_STATE.AIRING);
    }, []);
    React.useEffect(() => {
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

    const onTick = React.useCallback((timeDelta) => {
        setIsUnlocked(isWebinarUnlocked(timeDelta));
    }, []);

    const onClick = React.useCallback(async (event) => {
        if (!isUnlocked) {
            event.preventDefault();
            return;
        }
        const newWindow = window.open();
        const response = await APIRequest.get(`/courses/${webinar.course_id || courseId}/schedule/link`);
        newWindow.location = response.link;
    }, [isUnlocked, webinar, courseId]);
    if (state === WEBINAR_STATE.ENDED) {
        return null;
    }
    const renderCountdown = (remainingTime) => {
        const {formatted: {days, hours, minutes, seconds}, completed} = remainingTime;
        return completed ? (
            <div className="d-flex"><span>В</span><span>&nbsp;</span><span>эфире</span></div> //fixes a big on mobile
        ) : (
            <div className="countdown">
                <span>{days}</span>:
                <span>{hours}</span>:
                <span>{minutes}</span>:
                <span>{seconds}</span>
            </div>
        );
    };
    return (
        <div
            onClick={onClick}
            className={`webinar-schedule__webinar d-flex ${isUnlocked ? '' : 'webinar-schedule__webinar-locked'}`}>
            <div className="container d-flex overflow-hidden">
                <div className="row flex-nowrap flex-grow-1">
                    <div className="col-auto d-flex align-items-center webinar-schedule__webinar-status">
                        {isUnlocked ? <i className="fas fa-unlock"/> : <i className="fas fa-lock"/>}
                    </div>
                    <div className="col d-flex flex-shrink-0 p-0">
                        <CoverImage
                            className="webinar-schedule__webinar-poster"
                            src={webinar.image_link}/>
                        <div className="webinar-schedule__webinar-title d-flex flex-column justify-content-center p-2">
                            <div>{webinar.subject_name}</div>
                            <div>{webinar.name}</div>
                        </div>
                    </div>
                    <div className="col-auto d-flex align-items-center webinar-schedule__webinar-countdown">
                        <Countdown
                            date={webinar.date_start}
                            className="countdown"
                            renderer={renderCountdown}
                            onTick={onTick}
                            onComplete={onWebinarStart}>
                        </Countdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WebinarSchedule = ({schedule, courseId}) => {
    if (schedule.length === 0)
        return null;
    return (
        <div className="layout__content-block webinar-schedule">
            <ScrollBars
                autoHeight
                autoHeightMax="unset"
                hideVerticalScrollbar
                hideHorizontalScrollbar
                hideTracksWhenNotNeeded
                style={{height: '100%'}}
                className="scrollbars">
                <div className="d-flex flex-nowrap">
                    {schedule.map((webinar) => (
                        <Webinar
                            webinar={webinar}
                            courseId={courseId}
                            key={webinar.id}/>
                    ))}
                </div>
            </ScrollBars>
        </div>
    );
};

export default WebinarSchedule;
