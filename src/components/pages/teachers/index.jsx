import React from "react";
import { Switch, Route } from "react-router-dom";
import {TEACHERS} from "api/mocks/mocks";
import {SHOP_CATALOG} from "api/mocks/mocks";
import CatalogPage from "./catalog-page";
import TeacherPage from "./teacher-page";

const Teachers = (props) => {
    const {match} = props;
    return (
        <Switch>
            <Route path={`${match.path}/:id`} render={(props) => (
                <TeacherPage
                    teachers={TEACHERS}
                    courses={SHOP_CATALOG.catalog}
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
