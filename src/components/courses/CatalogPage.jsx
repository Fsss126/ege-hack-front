import {PageContent} from "../Page";
import CourseCatalog from "../common/CourseCatalog";
import React from "react";
import Course from "../common/Course";
import {LEARNING_STATUS} from "../../definitions/constants";

const CatalogPage = ({catalog, ...props}) => {
    const renderCourse = React.useCallback((course, props) => (
        <Course
            course={course}
            selectable
            online={false}
            key={course.id}
            {...props}>
            {course.status === LEARNING_STATUS.learning
                ? <div className="course__select-btn btn">Изучать</div>
                : <div className="course__select-btn btn btn-inactive">Пройден</div>}
        </Course>
    ), []);
    return (
        <CourseCatalog.Body
            className="user-courses"
            title="Мои курсы"
            courses={catalog}
            {...props}>
            <PageContent>
                <CourseCatalog.Filter/>
                <CourseCatalog.Catalog
                    renderCourse={renderCourse}/>
            </PageContent>
        </CourseCatalog.Body>
    );
};

export default CatalogPage;
