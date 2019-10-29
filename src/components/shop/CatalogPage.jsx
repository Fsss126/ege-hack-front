import {PageContent} from "../Page";
import CourseCatalog from "../common/CourseCatalog";
import SelectedCoursesTab from "./SelectedCoursesTab";
import React from "react";
import Course from "../common/Course";
import Button from "../ui/Button";

const CatalogPage = ({catalog, selectedCourses, onCourseClick, onCourseSelect, onCourseDeselect, ...props}) => {
    const renderCourse = React.useCallback((course, props) => {
        const isSelected = selectedCourses.has(course);
        const {offer: {price, discount}} = course;
        return (
            <Course
                course={course}
                selectable
                isSelected={isSelected}
                onActionClick={onCourseSelect}
                key={course.id}
                {...props}>
                <div className="list__item-action-info">
                    <span className="price">{price}₽</span> {discount && <span className="discount font-size-xs">{discount + price}₽</span>}
                </div>
                <Button style={{minWidth: '110px'}}>{isSelected ? 'Выбрано' : 'Выбрать'}</Button>
            </Course>
        )
    }, [selectedCourses, onCourseSelect]);
    return (
        <CourseCatalog.Page
            className="course-shop"
            title="Магазин курсов"
            courses={catalog}
            {...props}>
            <PageContent>
                <CourseCatalog.Filter/>
                <CourseCatalog.Catalog
                    renderCourse={renderCourse}/>
            </PageContent>
            <SelectedCoursesTab
                onCourseDeselect={onCourseDeselect}
                courses={[...selectedCourses]}/>
        </CourseCatalog.Page>
    );
};

export default CatalogPage;
