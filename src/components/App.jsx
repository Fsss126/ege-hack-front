import React from 'react';
import {CSSTransition} from "react-transition-group";
import 'sass/index.scss';
import {BrowserRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Shop from "./shop/Shop";
import MyCourses from "./courses/MyCourses";
import Page from "./Page";
import {ForceTrailingSlash, LocationListener, ScrollToTop} from "./HOCs";
import LoginPage from "./auth/LoginPage";
import Auth from "../definitions/auth";

const AppContent = React.createContext(null);

function useSideBarState() {
    const [isSideBarOpened, setSideBar] = React.useState(false);
    const toggleSideBar = React.useCallback(() => {
        setSideBar(opened => !opened);
    }, []);
    return [isSideBarOpened, toggleSideBar];
}

function useUserAuth() {
    const [user, setUser] = React.useState(Auth.getUser());
    const history = useHistory();
    const loginCallback = React.useCallback((userData) => {
        setUser(userData);
        history.push('/');
    }, [history]);
    const logoutCallback = React.useCallback(() => {
        setUser(null);
        history.push('/login/');
    }, [history]);
    React.useLayoutEffect(() => {
        Auth.subscribe(Auth.EventTypes.login, loginCallback);
        Auth.subscribe(Auth.EventTypes.logout, logoutCallback);
        return () => {
            Auth.unsubscribe(Auth.EventTypes.login, loginCallback);
            Auth.unsubscribe(Auth.EventTypes.logout, logoutCallback);
        }
    }, [loginCallback, logoutCallback]);
    return [user, setUser];
}

function App() {
    const [isSideBarOpened, toggleSideBar] = useSideBarState();
    const [user] = useUserAuth();
    return (
        <AppContent.Provider value={{user}}>
            <div className="app">
                <Header onMenuButtonClick={toggleSideBar}/>
                <CSSTransition
                    in={isSideBarOpened}
                    timeout={200}
                    classNames={App.layoutAnimationClassNames}>
                    <div className="layout">
                        <SideBar onMenuClose={toggleSideBar}/>
                        <ForceTrailingSlash>
                            <ScrollToTop>
                                <Switch>
                                    <Route exact path="/" render={() => <div className="layout__content">Home</div>}/>
                                    <Route path="/login" component={LoginPage}/>
                                    <Route path="/courses" component={MyCourses}/>
                                    <Route path="/shop" component={Shop}/>
                                    <Route path="/:section" component={Page}/>
                                </Switch>
                            </ScrollToTop>
                        </ForceTrailingSlash>
                    </div>
                </CSSTransition>
            </div>
        </AppContent.Provider>
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
        <LocationListener onLocationChange={(location) => {
            console.log(`- - - location: '${location.pathname}'`);
        }}/>
        <App/>
    </Router>
);
