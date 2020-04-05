import React from "react";
import { Switch, Route } from "react-router-dom";
import CatalogPage from "./catalog-page";
import TeacherPage from "./teacher-page";
import {RouteComponentProps} from "react-router";

const Teachers: React.FC<RouteComponentProps> = (props) => {
    const {match} = props;
    return (
        <Switch>
            <Route path={`${match.path}/:id`} render={(props) => (
                <TeacherPage
                    path={match.path}
                    {...props}/>
            )}/>
            <Route exact path={`${match.path}`} render={(props) => (
                <CatalogPage {...props}/>
            )}/>
        </Switch>
    );
};

export default Teachers;
