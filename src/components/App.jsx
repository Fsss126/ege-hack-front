import React from 'react';
import {CSSTransition} from "react-transition-group";
import 'sass/index.scss';
import {BrowserRouter as Router, Route, Switch, useHistory, useLocation} from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Shop from "./shop/Shop";
import MyCourses from "./courses/MyCourses";
import Page, {PageLoadingPlaceholder} from "./Page";
import LoginPage from "./auth/LoginPage";
import Auth, {AuthEventTypes} from "definitions/auth";
import Teachers from "./teachers/Teachers";
import {useRefValue} from "../hooks/common";
import GlobalStore, {useUser} from "store";
import AccountPage from "./account/AccountPage";

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
    return (
        <div className="app">
            <Header onMenuButtonClick={toggleSideBar}/>
            <CSSTransition
                in={isSideBarOpened}
                timeout={200}
                classNames={App.layoutAnimationClassNames}>
                <div className="layout">
                    {userInfo ? (
                    <React.Fragment>
                        <SideBar onMenuClose={toggleSideBar}/>
                        <Switch>
                            <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                            <Route path="/login" component={LoginPage}/>
                            <Route path="/courses" component={MyCourses}/>
                            <Route path="/shop" component={Shop}/>
                            <Route path="/teachers" component={Teachers}/>
                            <Route path="/account" component={AccountPage}/>
                            <Route path="/:section" component={Page}/>
                        </Switch>
                    </React.Fragment>
                    ) : (<PageLoadingPlaceholder/>)}
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
    <Router>
        <GlobalStore>
            <App/>
        </GlobalStore>
    </Router>
);
