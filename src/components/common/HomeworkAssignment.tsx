import {renderDate} from 'definitions/helpers';
import React from 'react';

// import Tooltip from "../ui/Tooltip";
import {AssignmentInfo} from '../../types/entities';
import {File} from '../ui/input/file-input';

export type HomeworkAssignmentProps = {
  assignment: AssignmentInfo;
  timeLeft: boolean;
};
const HomeworkAssignment: React.withDefaultProps<React.FC<
  HomeworkAssignmentProps
>> = ({assignment}) => (
  <div className="assignment">
    {assignment.files && (
      <div className="assignment__files file-container">
        {assignment.files.map((assignment, i) => (
          <File file={assignment} key={i} />
        ))}
      </div>
    )}
    {assignment.description && (
      <div className="description-text">{assignment.description}</div>
    )}
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
HomeworkAssignment.defaultProps = {
  timeLeft: true,
};

export default HomeworkAssignment;
