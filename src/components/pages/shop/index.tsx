import React, {Fragment, useState} from 'react';
import { Switch, Route } from "react-router-dom";
import ShopCatalogPage from "./catalog-page";
import CoursePage from "./course-page";
import {useDiscount} from "hooks/selectors";
import {useToggle} from "hooks/common";
import SelectedCoursesTab from "./SelectedCoursesTab";
import PurchasePopup from "./PurchasePopup";
import {RouteComponentProps} from "react-router";
import {CourseInfo} from "types/entities";

const Shop: React.FC<RouteComponentProps> = (props) => {
    const [selectedCourses, setSelectedCourses] = useState(new Set<CourseInfo>());
    const {discount, error: errorLoadingDiscount, reload: reloadDiscount, isLoading} = useDiscount(selectedCourses);
    const onCourseSelect = React.useCallback((course) => {
        setSelectedCourses(selectedCourses => {
            if (selectedCourses.has(course))
                return selectedCourses;
            selectedCourses = new Set(selectedCourses);
            selectedCourses.add(course);
            return selectedCourses;
        });
    }, []);
    const onCourseDeselect = React.useCallback((course) => {
        setSelectedCourses(selectedCourses => {
            selectedCourses = new Set(selectedCourses);
            selectedCourses.delete(course);
            return selectedCourses;
        });
    }, []);
    const [isPurchasePopupOpened, togglePopup] = useToggle(false);
    const {match} = props;

    const selectedCoursesTab = (
        <SelectedCoursesTab
            isLoading={isLoading}
            error={errorLoadingDiscount}
            retry={reloadDiscount}
            onCourseDeselect={onCourseDeselect}
            courses={[...selectedCourses]}
            onPurchaseClick={togglePopup}
            discount={discount}/>
    );
    return (
        <Fragment>
            <Switch>
                <Route path={`${match.path}/:id`} render={(props) => (
                    <CoursePage
                        selectedCourses={selectedCourses}
                        onCourseSelect={onCourseSelect}
                        path={match.path}
                        {...props}>
                        {selectedCoursesTab}
                    </CoursePage>
                )}/>
                <Route exact path={`${match.path}`} render={(props) => (
                    <ShopCatalogPage
                        selectedCourses={selectedCourses}
                        onCourseSelect={onCourseSelect}
                        {...props}>
                        {selectedCoursesTab}
                    </ShopCatalogPage>
                )}/>
            </Switch>
            <PurchasePopup
                opened={isPurchasePopupOpened}
                selectedCourses={selectedCourses}
                onCloseClick={togglePopup}/>
        </Fragment>
    )
};

export default Shop;
