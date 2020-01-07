import React from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import SelectedCoursesTab from "./SelectedCoursesTab";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useDiscount, useShopCatalog, useUser} from "store";
import {Link} from "react-router-dom";
import {PERMISSIONS} from "../../../../definitions/constants";
import ConditionalRenderer from "../../../ConditionalRender";

const COURSE_EDIT_PERMISSIONS = [
    PERMISSIONS.COURSE_EDIT
];

const ShopCatalogPage = ({selectedCourses, onCourseClick, onCourseSelect, onCourseDeselect, location}) => {
    const {userInfo} = useUser();
    const {catalog, subjects, error, retry} = useShopCatalog();
    const {discount, error: errorLoadingDiscount, retry: reloadDiscount} = useDiscount(selectedCourses);
    const renderCourse = React.useCallback((course, props) => {
        const isSelected = selectedCourses.has(course);
        const {price, discount, purchased} = course;
        return (
            <Course
                course={course}
                selectable
                isSelected={isSelected}
                onActionClick={purchased ? null : onCourseSelect}
                key={course.id}
                {...props}>
                {purchased ? (
                    <Button style={{minWidth: '110px'}} active={false}>Куплено</Button>
                ) : (
                    <React.Fragment>
                        <div className="list__item-action-info">
                            <span className="price">{price}₽</span> {discount && <span className="discount font-size-xs">{discount + price}₽</span>}
                        </div>
                        <Button style={{minWidth: '110px'}}>{isSelected ? 'Выбрано' : 'Выбрать'}</Button>
                    </React.Fragment>
                )}
            </Course>
        )
    }, [selectedCourses, onCourseSelect]);
    const isLoaded = catalog && subjects;
    return (
        <Page
            isLoaded={isLoaded}
            loadUserInfo
            className="course-shop"
            title="Магазин курсов"
            location={location}>
            {isLoaded && (
                <CourseCatalog.Body
                    subjects={subjects}
                    courses={catalog}>
                    <PageContent>
                        <CourseCatalog.Filter/>
                        <ConditionalRenderer
                            requiredPermissions={COURSE_EDIT_PERMISSIONS}>
                            <div className="layout__content-block d-flex justify-content-end">
                                <Button
                                    tag={Link}
                                    to="/courses/create"
                                    icon={<i className="icon-add"/>}>
                                    Добавить курс
                                </Button>
                            </div>
                        </ConditionalRenderer>
                        <CourseCatalog.Catalog
                            renderCourse={renderCourse}/>
                    </PageContent>
                </CourseCatalog.Body>
            )}
            <SelectedCoursesTab
                onCourseDeselect={onCourseDeselect}
                courses={[...selectedCourses]}
                discount={discount}/>
        </Page>
    );
};

export default ShopCatalogPage;
