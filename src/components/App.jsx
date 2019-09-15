import React from 'react';
import {CSSTransition} from "react-transition-group";
import 'sass/index.scss';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Shop from "./shop/Shop";
import MyCourses from "./courses/MyCourses";
import Page from "./Page";
import {useUpdateEffect} from "../definitions/hooks";
import {StickyContainer} from "react-sticky";

const ScrollToTop = withRouter(({ children, location: { pathname }, history }) => {
    useUpdateEffect(() => {
        if (history.action !== 'POP') {
            console.log('scroll top');
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return children || null;
});

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
                <StickyContainer className="app">
                    <Header onMenuButtonClick={this.onMenuButtonClick}/>
                    <CSSTransition
                        in={opened}
                        timeout={200}
                        classNames={App.layoutAnimationClassNames}>
                        <div className="layout">
                            <SideBar onMenuClose={this.onMenuButtonClick}/>
                            <ScrollToTop>
                                <Switch>
                                    <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                                    <Route path="/courses" component={MyCourses}/>
                                    <Route path="/shop" component={Shop}/>
                                    <Route path="/:section" component={Page}/>
                                </Switch>
                            </ScrollToTop>
                        </div>
                    </CSSTransition>
                </StickyContainer>
                {/*<footer>Footer</footer>*/}
            </Router>
        );
    }
}
