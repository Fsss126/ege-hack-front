import {PageContent} from "../../Page";
import CourseOverview from "../../common/CourseOverview";
import React from "react";
import Lesson from "../../common/Lesson";
import {renderDate} from "../../../definitions/helpers";
import Button from "../../ui/Button";

const CoursePage = ({path, catalog, ...props}) => {
    const renderLesson = (lesson, props) => {
        const {date, id} = lesson;
        const selectable = date < new Date();
        return (
            <Lesson
                lesson={lesson}
                locked={!selectable}
                selectable={selectable}
                key={id}
                {...props}>
                <div className="list__item-action-info">{renderDate(date, renderDate.shortDate)}</div>
                {selectable
                    ? <Button>Изучать</Button>
                    : <Button active={false}>Скоро</Button>}
            </Lesson>
        );
    };
    return (
        <CourseOverview.Body
            path={path}
            courses={catalog}
            {...props}>
            <PageContent parentSection={{name: "Мои курсы"}}>
                <CourseOverview.Title/>
                <CourseOverview.Lessons renderLesson={renderLesson}/>
            </PageContent>
        </CourseOverview.Body>
    );
};

export default CoursePage;
