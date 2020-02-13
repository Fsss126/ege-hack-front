import {File} from "../ui/input/file-input";
import {renderDate, renderRemainingTime} from "definitions/helpers";
import React from "react";
import Tooltip from "../ui/Tooltip";

const HomeworkAssignment = ({assignment, timeLeft = true}) => (
    <div className="assignment">
        {assignment.files && (
            <div className="assignment__files file-container">
                {assignment.files.map((assignment, i) => (
                    <File file={assignment} key={i}/>
                ))}
            </div>
        )}
        {assignment.description && <div className="description-text">{assignment.description}</div>}
        {assignment.deadline && (
            <div className="assignment__deadline">
                Дедлайн: {renderDate(assignment.deadline, renderDate.dateWithHour)}
                {/*{timeLeft && new Date() > assignment.deadline && (*/}
                {/*    <Tooltip content={`Осталось ${renderRemainingTime(assignment.deadline)}`}>*/}
                {/*        <i className="icon-info"/>*/}
                {/*    </Tooltip>*/}
                {/*)}*/}
            </div>
        )}
    </div>
);

export default HomeworkAssignment;
