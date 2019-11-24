import React from "react";
import File from "components/ui/File";
import VideoPlayer from "components/common/VideoPlayer";
import {renderDate} from "definitions/helpers";
import HomeworkLoader from "./HomeworkLoader";

const LessonView = ({lesson: {id, name, image_link: cover, video_link: video, description, homework}}) => {
    return (
        <div className="col-12 col-lg layout__content-block lesson-page__current-lesson">
            <div className="block-container video-container">
                <VideoPlayer video_link={video}/>
            </div>
            <div className="block-container description-container">
                <h2>{name}</h2>
                <div className="description-text">{description}</div>
            </div>
            {homework && (
                <div className="block-container hw-container">
                    <h3>Домашнее задание</h3>
                    <div className="assignment">
                        {homework.files && (
                            <div className="assignment__files file-container">
                                {homework.files.map((assignment, i) => (
                                    <File file={assignment} key={i}/>
                                ))}
                            </div>
                        )}
                        {homework.description && <div className="description-text">{homework.description}</div>}
                        {homework.deadline &&
                        <div className="assignment__deadline">Дедлайн: {renderDate(homework.deadline, renderDate.date)}</div>}
                    </div>
                    {homework.submit && (
                        <HomeworkLoader homework={homework} lessonId={id}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default LessonView;
