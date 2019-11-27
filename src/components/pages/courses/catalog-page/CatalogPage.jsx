import React from "react";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import {LEARNING_STATUS} from "definitions/constants";
import {useUserCourses} from "store";

const CatalogPage = ({location}) => {
    const {courses, subjects, error, retry} = useUserCourses();
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
        <Page
            className="user-courses"
            location={location}
            title="Мои курсы">
            {!(courses && subjects) ? (
                    <PageLoadingPlaceholder/>
                ) : (
                <CourseCatalog.Body
                    courses={courses}
                    subjects={subjects}>
                    <PageContent>
                        <CourseCatalog.Filter/>
                        <CourseCatalog.Catalog
                            renderCourse={renderCourse}/>
                    </PageContent>
                </CourseCatalog.Body>
            )
            }
        </Page>
    );
};

export default CatalogPage;
