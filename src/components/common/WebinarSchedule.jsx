import React from "react";
import ScrollBars from "../ui/ScrollBars";



const WebinarSchedule = ({schedule}) => {
    return null;
    return (
        <div className="layout__content-block webinar-schedule">
            <ScrollBars
                autoHeight
                autoHeightMax="unset"
                hideTracksWhenNotNeeded
                style={{height: '100%'}}
                className="scrollbars">
                <div className="d-flex flex-nowrap">
                    {schedule.map(({webinar}) => (
                        <div className="webinar-schedule__webinar">
                        </div>
                    ))}
                </div>
            </ScrollBars>
        </div>
    );
};

export default WebinarSchedule;
