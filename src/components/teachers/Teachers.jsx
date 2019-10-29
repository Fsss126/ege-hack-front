import React from "react";
import { Switch, Route } from "react-router-dom";
import CatalogPage from "./CatalogPage";
import {TEACHERS} from "data/test_data";
import {SHOP_CATALOG} from "data/test_data";
import TeacherPage from "./TeacherPage";

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
                <CatalogPage catalog={TEACHERS} {...props}/>
            )}/>
        </Switch>
    );
};

export default Teachers;
