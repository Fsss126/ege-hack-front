import {ExpandableContainer} from 'components/common/ExpandableContainer';
import HomeworkAssignment from 'components/common/HomeworkAssignment';
import VideoPlayer from 'components/common/VideoPlayer';
import {ContentBlock} from 'components/layout/ContentBlock';
import {File} from 'components/ui/input';
import React from 'react';
import {HomeworkInfo, LessonInfo} from 'types/entities';

import HomeworkLoader from './HomeworkLoader';
import {TestAssignment} from './TestAssignment';

export interface LessonViewProps {
  lesson: LessonInfo;
  homework: HomeworkInfo | null;
}
const LessonView: React.FC<LessonViewProps> = (props) => {
  const {
    lesson: {
      id,
      name,
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
    <ContentBlock className="col-12 col-xl lesson-page__current-lesson">
      <div className="block-container video-container">
        <VideoPlayer video_link={video} />
      </div>
      <div className="block-container description-container">
        <h2>{name}</h2>
        <div className="description-block">{description}</div>
      </div>
      {attachments && attachments.length > 0 && (
        <div className="block-container attachment-container">
          <h3>
            <i className="icon-book prefix-icon" />
            Материалы к уроку
          </h3>
          <div className="attachment__files file-container">
            {attachments.map((attachment, i) => (
              <File file={attachment} key={i} />
            ))}
          </div>
        </div>
      )}
      {assignment && (
        <div className="block-container m-lg hw-container">
          <h3>
            <i className="icon-assignment prefix-icon" />
            Домашнее задание
          </h3>
          <HomeworkAssignment assignment={assignment} />
          <HomeworkLoader
            homework={homework}
            deadline={assignment.deadline}
            courseId={course_id}
            lessonId={id}
          />
          <div className="hw-result">
            {homework && homework.mark && (
              <h4>
                Оценка:{' '}
                <span className="badge accent align-middle">
                  {homework.mark}
                </span>
              </h4>
            )}
            {homework && homework.comment && (
              <ExpandableContainer
                className="hw-result__comment"
                toggleText="Комментарий"
              >
                {homework.comment}
              </ExpandableContainer>
            )}
          </div>
        </div>
      )}
      {test && (
        <div className="block-container m-lg test-container">
          <h3>
            <i className="icon-checkbox prefix-icon" />
            Тест
          </h3>
          <TestAssignment courseId={course_id} lessonId={id} test={test} />
        </div>
      )}
    </ContentBlock>
  );
};

export default LessonView;
