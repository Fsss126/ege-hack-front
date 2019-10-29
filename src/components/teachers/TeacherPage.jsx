import React from "react";
import _ from "lodash";
import Page, {PageContent} from "components/Page";
import ErrorPage from "components/ErrorPage";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import UserProfile from "components/common/UserProfile";

const TeacherPage = (props) => {
    const {match: {params: {id}}, path: root, teachers, courses, className} = props;
    const teacher = _.find(teachers, {id});

    const renderCourse = React.useCallback((course, {link}) => {
        const {offer: {price, discount}} = course;
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

    if (teacher) {
        const {firstName, lastName, photo, contacts, subjects, about} = teacher;
        const profile = {
            firstName,
            lastName,
            photo,
            contacts,
            about,
            role: subjects.map(({name}, i) => i === 0 ? name : name.toLowerCase()).join(', ')
        };
        const teachersCourses = courses.filter(course => _.find(course.teachers, {id}));
        console.log(teachersCourses);
        const fullName = `${firstName} ${lastName}`;
        return (
            <Page title={`${fullName}`} className={`teacher-page ${className || ''}`}>
                <PageContent parentSection={{name: "Преподаватели"}}>
                    <UserProfile {...profile}/>
                    <div className="layout__content-block">
                        <h3>Курсы преподавателя</h3>
                    </div>
                    <CourseCatalog.Body
                        className="course-shop"
                        title="Магазин курсов"
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
};

export default TeacherPage;
