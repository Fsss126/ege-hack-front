import React, {useCallback} from "react";
import Page, {PageContent} from "components/Page";
import CourseCatalog from "components/common/CourseCatalog";
import Course from "components/common/Course";
import Button from "components/ui/Button";
import {useShopCatalog, useSubjects} from "store";
import {useToggle} from "hooks/common";
import {renderPrice} from "definitions/helpers";

const ShopCatalogPage = ({selectedCourses, onCourseSelect, children: selectedCoursesTab, location}) => {
    const {catalog, error, retry} = useShopCatalog();
    const {subjects, error: errorLoadingSubjects, retry: reloadSubjects} = useSubjects();
    const [isEditing, toggleEditing] = useToggle(false);
    const renderCourse = useCallback((course, {link, ...rest}) => {
        const isSelected = selectedCourses.has(course);
        const {price, discount, purchased} = course;
        return (
            <Course
                course={course}
                selectable
                isSelected={isEditing ? false : isSelected}
                onActionClick={isEditing || purchased ? null : onCourseSelect}
                key={course.id}
                link={isEditing ? `/courses/${course.id}/edit` : link}
                action={isEditing || !purchased ? (
                    <React.Fragment>
                        <div className="list__item-action-info">
                            <span className="price">{renderPrice(price)}</span> {
                            !isEditing && discount && <span className="discount font-size-xs">{renderPrice(discount + price)}</span>
                        }
                        </div>
                        <Button style={{minWidth: '115px'}}>{isEditing ? 'Изменить' : (isSelected ? 'Выбрано' : 'Купить')}</Button>
                    </React.Fragment>
                ) : (
                    <Button style={{minWidth: '115px'}} active={false}>Куплено</Button>
                )}
                {...rest}/>
        )
    }, [selectedCourses, onCourseSelect, isEditing]);
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
                        <CourseCatalog.Catalog
                            renderCourse={renderCourse}/>
                    </PageContent>
                </CourseCatalog.Body>
            )}
            {!isEditing && selectedCoursesTab}
        </Page>
    );
};

export default ShopCatalogPage;
