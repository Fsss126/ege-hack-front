import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {useRefValue} from "hooks/common";
import GlobalStore from "store";

import Login from "./pages/login";
import Account from "./pages/account";
import Teachers from "./pages/teachers";
import Shop from "./pages/shop";
import MyCourses from "./pages/courses";

import 'sass/index.scss';
import ErrorPage from "./ErrorPage";

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

const UIContext = React.createContext(null);
UIContext.displayName = 'UIContext';

function useUIState() {
    const [isSideBarOpened, setSideBar] = React.useState(false);
    const toggleSideBar = React.useCallback(() => {
        setSideBar(opened => !opened);
    }, []);
    return {
        sidebar: [isSideBarOpened, toggleSideBar]
    };
}

export function useSideBarState() {
    const {sidebar} = React.useContext(UIContext);
    return sidebar;
}

const onLocationChange = (location, args) => {
    console.log(`- - - location: '${location.pathname}'`, args);
};

const DefaultRedirect = () => <Redirect to="/courses"/>;


function App() {
    // routing effects
    useForceTrailingSlash();
    useScrollToTop();
    useLocationChangeEffect(onLocationChange);
    const uiState = useUIState();

    return (
        <UIContext.Provider value={uiState}>
            <Switch>
                <Route path="/index.html" component={DefaultRedirect}/>
                <Route exact path="/" component={DefaultRedirect}/>
                <Route path="/login" component={Login}/>
                <Route path="/courses" component={MyCourses}/>
                <Route path="/shop" component={Shop}/>
                <Route path="/teachers" component={Teachers}/>
                <Route path="/account" component={Account}/>
                {/*<Route path="/:section" component={Page}/>*/}
                <Route component={ErrorPage}/>
            </Switch>
        </UIContext.Provider>
    );
}

export default () => (
    <Router basename={process.env.REACT_APP_BASE_URL}>
        <GlobalStore>
            <App/>
        </GlobalStore>
    </Router>
);
