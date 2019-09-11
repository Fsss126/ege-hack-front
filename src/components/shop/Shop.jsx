import React from 'react';
import { Switch, Route } from "react-router-dom";
import CourseOverview from "./CourseOverview";
import Course from "components/common/Course";
import {SHOP_CATALOG} from "data/test_data";
import Page, {PageContent} from "../Page";
import CourseCatalog from "../common/CourseCatalog";

export default class Shop extends React.Component {
    state = {
        catalog: SHOP_CATALOG,
        // courses: SHOP_CATALOG.catalog.map(({course}) => course),
        // offers: SHOP_CATALOG.catalog.reduce((result, {course, offer}) => {
        //     result[course.id] = offer;
        //     return result;
        // }, {})
    };

    openCourse = (course) => {
        const {match, history} = this.props;
        history.push({
            pathname: `${match.path}/${course.id}`
            // search: `?${query}`
        });
    };

    renderCourse = (course) => {
        // const offer = this.state.offers[course.id];
        return (
            <Course
                course={course}
                selectable
                onClick={this.openCourse}
                key={course.id}>
                <div className="course__price">{course.offer.price}₽</div>
                <div className="course__select-btn button">Выбрать</div>
            </Course>
        )
    };

    render() {
        const {match, location, history} = this.props;
        const {catalog: {catalog}} = this.state;
        console.log(this.state);
        return (
            <Switch>
                <Route exact path={`${match.path}`} render={() => (
                    <Page title="Магазин курсов">
                        <PageContent>
                            <CourseCatalog
                                className="course-shop"
                                courses={catalog}
                                location={location}
                                history={history}
                                renderCourse={this.renderCourse}/>
                        </PageContent>
                    </Page>
                )}/>
                <Route path={`${match.path}/:id`} component={props => (
                    <CourseOverview {...props} path={match.path}>
                        {catalog}
                    </CourseOverview>
                )}/>
            </Switch>
        )
    }
}
