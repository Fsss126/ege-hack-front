import React from "react";
import Page, {PageContent, PageLoadingPlaceholder} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import SelectedCoursesTab from "./SelectedCoursesTab";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useShopCatalog} from "store";

const ShopCatalogPage = ({selectedCourses, onCourseClick, onCourseSelect, onCourseDeselect, location}) => {
    const {catalog, subjects, error, retry} = useShopCatalog();
    const renderCourse = React.useCallback((course, props) => {
        const isSelected = selectedCourses.has(course);
        const {price, discount} = course;
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
        <Page
            className="course-shop"
            title="Магазин курсов"
            location={location}>
            {!(catalog && subjects) ? (
                <PageLoadingPlaceholder/>
            ) : (
                <CourseCatalog.Body
                    subjects={subjects}
                    courses={catalog}>
                    <PageContent>
                        <CourseCatalog.Filter/>
                        <CourseCatalog.Catalog
                            renderCourse={renderCourse}/>
                    </PageContent>
                    <SelectedCoursesTab
                        onCourseDeselect={onCourseDeselect}
                        courses={[...selectedCourses]}/>
                </CourseCatalog.Body>
            )}
        </Page>
    );
};

export default ShopCatalogPage;
