import HomeworkAssignment from 'components/common/HomeworkAssignment';
import VideoPlayer from 'components/common/VideoPlayer';
import {File} from 'components/ui/input';
import {renderDate} from 'definitions/helpers';
import React from 'react';
import {HomeworkInfo, LessonInfo} from 'types/entities';

import HomeworkLoader from './HomeworkLoader';
import {TestView} from './TestView';

export interface LessonViewProps {
  lesson: LessonInfo;
  homework: HomeworkInfo;
}
const LessonView: React.FC<LessonViewProps> = (props) => {
  const {
    lesson: {
      id,
      name,
      image_link: cover,
      video_link: video,
      description,
      assignment,
      attachments,
      test,
      course_id,
    },
    homework,
  } = props;

  return (
    <div className="col-12 col-lg layout__content-block lesson-page__current-lesson">
      <div className="block-container video-container">
        <VideoPlayer video_link={video} />
      </div>
      <div className="block-container description-container">
        <h2>{name}</h2>
        <div className="description-text">{description}</div>
      </div>
      {attachments && attachments.length > 0 && (
        <div className="block-container attachment-container">
          <h3>Материалы к уроку</h3>
          <div className="attachment__files file-container">
            {attachments.map((attachment, i) => (
              <File file={attachment} key={i} />
            ))}
          </div>
        </div>
      )}
      {assignment && (
        <div className="block-container hw-container">
          <h3>Домашнее задание</h3>
          <HomeworkAssignment assignment={assignment} />
          <HomeworkLoader
            homework={homework}
            deadline={assignment.deadline}
            lessonId={id}
          />
          {homework && homework.mark && (
            <h4>
              Оценка:{' '}
              <span className="badge accent align-middle">{homework.mark}</span>
            </h4>
          )}
          {homework && homework.comment && (
            <div className="description-text">{homework.comment}</div>
          )}
        </div>
      )}
      {test && (
        <div className="block-container hw-container">
          <h3>Тест</h3>
          <TestView courseId={course_id} lessonId={id} test={test} />
        </div>
      )}
    </div>
  );
};

export default LessonView;
