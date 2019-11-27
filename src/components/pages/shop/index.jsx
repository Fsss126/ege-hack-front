import React from 'react';
import { Switch, Route } from "react-router-dom";
import ShopCatalogPage from "./catalog-page";
import CoursePage from "./course-page";

export default function Shop(props) {
    const [selectedCourses, setSelectedCourses] = React.useState(new Set());
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
    const {match} = props;
    return (
        <Switch>
            <Route path={`${match.path}/:id`} render={(props) => (
                <CoursePage
                    path={match.path}
                    {...props}/>
            )}/>
            <Route exact path={`${match.path}`} render={(props) => (
                <ShopCatalogPage
                    selectedCourses={selectedCourses}
                    onCourseSelect={onCourseSelect}
                    onCourseDeselect={onCourseDeselect}
                    {...props}/>
            )}/>
        </Switch>
    )
}
