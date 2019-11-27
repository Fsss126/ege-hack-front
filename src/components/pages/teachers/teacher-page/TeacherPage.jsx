import React from "react";
import _ from "lodash";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import ErrorPage from "components/ErrorPage";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import UserProfile from "components/common/UserProfile";
import {useShopCatalog, useTeachers} from "store";

const TeacherPage = (props) => {
    const {match: {params: {id: param_id}}, path: root, className, location} = props;
    const {teachers, subjects, error, retry} = useTeachers();
    const {catalog, error: errorLoadingCatalog, retry: reloadCatalog} = useShopCatalog();
    const id = parseInt(param_id);

    const renderCourse = React.useCallback((course, {link}) => {
        const {price, discount} = course;
        return (
            <Course
                course={course}
                selectable
                key={course.id}
                link={`/shop/${link}`}>
                <div className="list__item-action-info">
                    <span className="price">{price}₽</span> {discount && <span className="discount font-size-xs">{discount + price}₽</span>}
                </div>
                <Button style={{minWidth: '110px'}}>Открыть</Button>
            </Course>
        )
    }, []);

    if (teachers && catalog && subjects) {
        const teacher = _.find(teachers, {id});

        if (teacher) {
            const {vk_info: {first_name, last_name, photo_max_orig: photo}, contacts, subjects: teacherSubjects, bio} = teacher;
            // const teacherSubjects = subject_ids.map(id => _.find(subjects, {id}));
            const teachersCourses = catalog.filter(course => _.indexOf(course.teacher_ids, id) >= 0);
            const profile = {
                first_name,
                last_name,
                photo,
                contacts,
                about: bio,
                role: teacherSubjects.map(({name}, i) => i === 0 ? name : name.toLowerCase()).join(', ')
            };
            const fullName = `${first_name} ${last_name}`;
            return (
                <Page
                    title={`${fullName}`}
                    className={`teacher-page ${className || ''}`}
                    location={location}>
                    <PageContent parentSection={{name: "Преподаватели"}}>
                        <UserProfile {...profile}/>
                        <div className="layout__content-block">
                            <h3>Курсы преподавателя</h3>
                        </div>
                        <CourseCatalog.Body
                            className="course-shop"
                            subjects={subjects}
                            courses={teachersCourses}>
                            <CourseCatalog.Filter/>
                            <CourseCatalog.Catalog
                                renderCourse={renderCourse}/>
                        </CourseCatalog.Body>
                    </PageContent>
                </Page>
            )
        } else
            return <ErrorPage errorCode={404} message="Преподаватель не найден" link={{url: root}}/>;
    }
    else {
        return (
            <Page
                location={location}>
                <PageLoadingPlaceholder/>
            </Page>
        );
    }
};

export default TeacherPage;
