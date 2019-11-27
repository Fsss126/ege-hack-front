import React from 'react';
import {CSSTransition} from "react-transition-group";
import {HashRouter as Router, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Page from "./Page";
import {useRefValue} from "hooks/common";
import GlobalStore, {useUser} from "store";

import Login from "./pages/login";
import Account from "./pages/account";
import Teachers from "./pages/teachers";
import Shop from "./pages/shop";
import MyCourses from "./pages/courses";

import 'sass/index.scss';
import {ACCOUNT_ROLES} from "../definitions/constants";

function useLocationChangeEffect(effect) {
    const history = useHistory();
    React.useEffect(() => {
        return history.listen(effect);
    }, [history, effect]);
}

function useScrollToTop() {
    const [getPrevPath, setPrevPath] = useRefValue(useLocation().pathname);
    const onLocationChange = React.useCallback((location, action) => {
        console.log('update');
        if (getPrevPath() !== location.pathname && action !== 'POP') {
            window.scrollTo(0, 0);
        }
        setPrevPath(location.pathname);
    }, [getPrevPath, setPrevPath]);
    useLocationChangeEffect(onLocationChange);
}

function useForceTrailingSlash() {
    const location = useLocation();
    const history = useHistory();
    const path = location.pathname;
    if (path.slice(-1) !== '/') {
        history.replace(path + '/');
    }
}

function useSideBarState() {
    const [isSideBarOpened, setSideBar] = React.useState(false);
    const toggleSideBar = React.useCallback(() => {
        setSideBar(opened => !opened);
    }, []);
    return [isSideBarOpened, toggleSideBar];
}

const onLocationChange = (location, args) => {
    console.log(`- - - location: '${location.pathname}'`, args);
};

function App() {
    // routing effects
    useForceTrailingSlash();
    useScrollToTop();
    useLocationChangeEffect(onLocationChange);

    const [isSideBarOpened, toggleSideBar] = useSideBarState();
    const {user, userInfo} = useUser();
    const showSidebar = user !== null;
    return (
        <div className="app">
            <Header
                onMenuButtonClick={toggleSideBar}
                user={user}
                sidebar={showSidebar}/>
            <CSSTransition
                in={isSideBarOpened}
                timeout={200}
                classNames={App.layoutAnimationClassNames}>
                <div className="layout">
                    <React.Fragment>
                        {showSidebar && (
                            <SideBar
                                accountRoles={user ? (userInfo ? userInfo.roles : undefined) : null}
                                onMenuClose={toggleSideBar}/>
                        )}
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to="/courses"/>}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/courses" component={MyCourses}/>
                            <Route path="/shop" component={Shop}/>
                            <Route path="/teachers" component={Teachers}/>
                            <Route path="/account" component={Account}/>
                            <Route path="/:section" component={Page}/>
                        </Switch>
                    </React.Fragment>
                </div>
            </CSSTransition>
        </div>
    );
}

App.layoutAnimationClassNames = {
    enter: 'sidebar-opened',
    enterActive: 'sidebar-opened',
    enterDone: 'sidebar-opened',
    exit: 'sidebar-hiding',
    exitActive: 'sidebar-hiding'
};

export default () => (
    <Router basename={process.env.REACT_APP_BASE_NAME}>
        <GlobalStore>
            <App/>
        </GlobalStore>
    </Router>
);