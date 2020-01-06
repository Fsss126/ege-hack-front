import React from "react";
import {File} from "components/ui/input";
import VideoPlayer from "components/common/VideoPlayer";
import {renderDate} from "definitions/helpers";
import HomeworkLoader from "./HomeworkLoader";

const LessonView = ({lesson: {id, name, image_link: cover, video_link: video, description, assignment, attachments}, homework}) => {
    return (
        <div className="col-12 col-lg layout__content-block lesson-page__current-lesson">
            <div className="block-container video-container">
                <VideoPlayer video_link={video}/>
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
                            <File file={attachment} key={i}/>
                        ))}
                    </div>
                </div>
            )}
            {assignment && (
                <div className="block-container hw-container">
                    <h3>Домашнее задание</h3>
                    <div className="assignment">
                        {assignment.files && (
                            <div className="assignment__files file-container">
                                {assignment.files.map((assignment, i) => (
                                    <File file={assignment} key={i}/>
                                ))}
                            </div>
                        )}
                        {assignment.description && <div className="description-text">{assignment.description}</div>}
                        {assignment.deadline &&
                        <div className="assignment__deadline">Дедлайн: {renderDate(assignment.deadline, renderDate.date)}</div>}
                    </div>
                    <HomeworkLoader
                        homework={homework}
                        deadline={assignment.deadline}
                        lessonId={id}/>
                </div>
            )}
        </div>
    );
};

export default LessonView;
