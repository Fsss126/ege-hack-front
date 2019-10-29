import React from "react";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {PageContent} from "components/Page";
import {LEARNING_STATUS} from "definitions/constants";

const CatalogPage = ({catalog, ...props}) => {
    const renderCourse = React.useCallback((course, props) => (
        <Course
            course={course}
            selectable
            online={false}
            key={course.id}
            {...props}>
            {course.status === LEARNING_STATUS.learning
                ? <Button className="course__select-btn">Изучать</Button>
                : <Button className="course__select-btn" active={false}>Пройден</Button>}
        </Course>
    ), []);
    return (
        <CourseCatalog.Page
            className="user-courses"
            title="Мои курсы"
            courses={catalog}
            {...props}>
            <PageContent>
                <CourseCatalog.Filter/>
                <CourseCatalog.Catalog
                    renderCourse={renderCourse}/>
            </PageContent>
        </CourseCatalog.Page>
    );
};

export default CatalogPage;
