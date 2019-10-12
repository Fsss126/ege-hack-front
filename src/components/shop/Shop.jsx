import React from 'react';
import { Switch, Route } from "react-router-dom";
import {SHOP_CATALOG} from "data/test_data";
import CatalogPage from "./CatalogPage";
import CoursePage from "./CoursePage";

export default class Shop extends React.Component {
    state = {
        catalog: SHOP_CATALOG,
        selectedCourses: new Set()
    };

    onCourseSelect = (course) => {
        let {selectedCourses} = this.state;
        if (selectedCourses.has(course))
            return;
        selectedCourses = new Set(selectedCourses);
        selectedCourses.add(course);
        this.setState({selectedCourses});
    };

    onCourseDeselect = (course) => {
        let {selectedCourses} = this.state;
        selectedCourses = new Set(selectedCourses);
        selectedCourses.delete(course);
        this.setState({selectedCourses});
    };

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     const shouldUpdate =  (_.reduce(this.props, (result, value, key) => {
    //         const changed = this.props[key] !== nextProps[key];
    //         if (changed)
    //             console.log(key);
    //         if (changed && key === 'match')
    //             return result;
    //         return result || changed;
    //     }, false));
    //     console.log(shouldUpdate);
    //     return shouldUpdate;
    // }

    render() {
        const {match} = this.props;
        const {catalog: {catalog}, selectedCourses} = this.state;
        return (
            <Switch>
                <Route exact path={`${match.path}`} render={(props) => (
                    <CatalogPage
                        catalog={catalog}
                        selectedCourses={selectedCourses}
                        onCourseSelect={this.onCourseSelect}
                        onCourseDeselect={this.onCourseDeselect}
                        {...props}/>
                )}/>
                <Route path={`${match.path}/:id`} component={props => (
                    <CoursePage
                        catalog={catalog}
                        path={match.path}
                        {...props}/>
                )}/>
            </Switch>
        )
    }
}
