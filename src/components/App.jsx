import React from 'react';
import {CSSTransition} from "react-transition-group";
import 'sass/index.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Shop from "./shop/Shop";
import MyCourses from "./courses/MyCourses";
import Page from "./Page";
import {StickyContainer} from "react-sticky";
import {ForceTrailingSlash, LocationListener, ScrollToTop} from "./HOCs";

export default class App extends React.Component {
    static layoutAnimationClassNames = {
        enter: 'sidebar-opened',
        enterActive: 'sidebar-opened',
        enterDone: 'sidebar-opened',
        exit: 'sidebar-hiding',
        exitActive: 'sidebar-hiding'
    };

    state = {opened: false};

    onMenuButtonClick = () => {this.setState((state) => ({opened: !state.opened}));};

    render() {
        const {opened} = this.state;
        return (
            <Router>
                <LocationListener onLocationChange={(location) => {
                    console.log(`- - - location: '${location.pathname}'`);
                }}/>
                <div className="app">
                    <Header onMenuButtonClick={this.onMenuButtonClick}/>
                    <CSSTransition
                        in={opened}
                        timeout={200}
                        classNames={App.layoutAnimationClassNames}>
                        <div className="layout">
                            <SideBar onMenuClose={this.onMenuButtonClick}/>
                            <ForceTrailingSlash>
                                <ScrollToTop>
                                    <Switch>
                                        <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                                        <Route path="/courses" component={MyCourses}/>
                                        <Route path="/shop" component={Shop}/>
                                        <Route path="/:section" component={Page}/>
                                    </Switch>
                                </ScrollToTop>
                            </ForceTrailingSlash>
                        </div>
                    </CSSTransition>
                </div>
                {/*<footer>Footer</footer>*/}
            </Router>
        );
    }
}
