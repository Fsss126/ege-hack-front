import React from 'react';
import { Switch, Route } from "react-router-dom";
import CatalogPage from "./catalog-page";
import CoursePage from "./course-page";

const Teaching = ({match}) => {
    return (
        <Switch>
            <Route
                exact
                path={[match.path, `${match.path}/list`, `${match.path}/calendar`]}
                render={props => <CatalogPage path={match.path} {...props}/>}/>
            <Route
                path={`${match.path}/:courseId`}
                render={props => <CoursePage path={match.path} {...props}/>}/>
        </Switch>
    );
};

export default Teaching;
