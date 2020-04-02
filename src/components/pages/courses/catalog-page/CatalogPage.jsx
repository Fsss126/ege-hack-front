import React from "react";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import Page, {PageContent} from "components/Page";
import {useSubjects, useUpcomingWebinars, useUserCourses} from "hooks/selectors";
import WebinarSchedule from "components/common/WebinarSchedule";
import {LearningStatus} from "types/enums";

const CatalogPage = ({location}) => {
    const {courses, error, retry} = useUserCourses();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();
    const {webinars, error: errorLoadingWebinars, retry: reloadWebinars} = useUpcomingWebinars();
    const renderCourse = React.useCallback((course, renderProps) => (
        <Course
            course={course}
            selectable
            online={false}
            key={course.id}
            action={course.status === LearningStatus.LEARNING
                ? <Button className="course__select-btn">Изучать</Button>
                : <Button className="course__select-btn" active={false}>Пройден</Button>}
            {...renderProps}/>
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
