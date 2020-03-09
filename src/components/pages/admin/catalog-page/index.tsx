import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import TabNav, {TabNavLink} from "components/common/TabNav";
import CourseCatalogPage from "./CourseCatalogPage";
import {RouteComponentProps} from "react-router";

export type CoursesPageProps = RouteComponentProps & {
    path: string;
}
const CoursesPage: React.FC<CoursesPageProps> = (props) => {
    const {path} = props;
    const header = (
        <div className="layout__content-block tab-nav-container">
            <h2>Курсы</h2>
            <TabNav>
                <TabNavLink to={`${path}/list/`}>Список</TabNavLink>
                <TabNavLink to={`${path}/calendar/`} disabled>Календарь</TabNavLink>
            </TabNav>
        </div>
    );
    return (
        <Switch>
            <Route path={[`${path}/list`, `${path}/calendar`]} render={props => (
                <CourseCatalogPage
                    path={path}
                    {...props}>
                    {header}
                </CourseCatalogPage>
            )}/>
            <Route render={() => <Redirect to={`${path}/list/`}/>}/>
        </Switch>
    )
};

export default CoursesPage;
