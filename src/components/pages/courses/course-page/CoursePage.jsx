import React from "react";
import {PageContent} from "components/Page";
import CourseOverview from "components/common/CourseOverview";
import Lesson from "components/common/Lesson";
import Button from "components/ui/Button";
import {renderDate} from "definitions/helpers";
import _ from "lodash";

const CoursePage = ({path, catalog, match, ...props}) => {
    const {params: {id: courseId}} = match;
    const id = parseInt(courseId);
    const course = _.find(catalog, {id});
    console.log(catalog, courseId, course);
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
            lessons={course && course.lessons}
            match={match}
            {...props}>
            <PageContent parentSection={{name: "Мои курсы"}}>
                <CourseOverview.Title/>
                <CourseOverview.Lessons renderLesson={renderLesson}/>
            </PageContent>
        </CourseOverview.Body>
    );
};

export default CoursePage;
