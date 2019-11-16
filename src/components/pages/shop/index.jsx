import React from 'react';
import { Switch, Route } from "react-router-dom";
import ShopCatalogPage from "./catalog-page";
import CoursePage from "./course-page";

export default class Shop extends React.Component {
    state = {
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
        const {selectedCourses} = this.state;
        return (
            <Switch>
                <Route exact path={`${match.path}`} render={(props) => (
                    <ShopCatalogPage
                        selectedCourses={selectedCourses}
                        onCourseSelect={this.onCourseSelect}
                        onCourseDeselect={this.onCourseDeselect}
                        {...props}/>
                )}/>
                <Route path={`${match.path}/:id`} component={props => (
                    <CoursePage
                        path={match.path}
                        {...props}/>
                )}/>
            </Switch>
        )
    }
}
