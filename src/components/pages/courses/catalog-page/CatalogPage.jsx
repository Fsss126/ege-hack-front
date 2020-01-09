import React from "react";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import Page, {PageContent} from "components/Page";
import {LEARNING_STATUS} from "definitions/constants";
import {useSubjects, useUpcomingWebinars, useUserCourses} from "store";
import WebinarSchedule from "components/common/WebinarSchedule";

const CatalogPage = ({location}) => {
    const {courses, error, retry} = useUserCourses();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useUpcomingWebinars();
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
    const isLoaded = !!(courses && subjects && webinars);
    return (
        <Page
            isLoaded={isLoaded}
            className="user-courses"
            location={location}
            title="Мои курсы">
            {isLoaded && (
                <CourseCatalog.Body
                    courses={courses}
                    subjects={subjects}>
                    <PageContent>
                        <CourseCatalog.Filter/>
                        <WebinarSchedule schedule={webinars}/>
                        <CourseCatalog.Catalog
                            renderCourse={renderCourse}/>
                    </PageContent>
                </CourseCatalog.Body>
            )}
        </Page>
    );
};

export default CatalogPage;
