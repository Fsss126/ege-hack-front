import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {APP_BASE_URL} from "definitions/constants";
import {useRefValue, useToggle} from "hooks/common";
import GlobalStore from "store";
import Login from "./pages/login";
import Account from "./pages/account";
import Teachers from "./pages/teachers";
import Shop from "./pages/shop";
import MyCourses from "./pages/courses";
import Admin from "./pages/admin";
import Teaching from "./pages/teaching";
import {NotFoundErrorPage} from "./ErrorPage";

import 'sass/index.scss';

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
        console.log(window.location);
        history.replace(path + '/');
    }
}

const UIContext = React.createContext(null);
UIContext.displayName = 'UIContext';

function useUIState() {
    return {
        sidebar: useToggle(false)
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
                <Route path="/admin" component={Admin}/>
                <Route path="/teaching" component={Teaching}/>
                {/*<Route path="/:section" component={Page}/>*/}
                <Route component={NotFoundErrorPage}/>
            </Switch>
        </UIContext.Provider>
    );
}

export default () => (
    <Router basename={APP_BASE_URL}>
        <GlobalStore>
            <App/>
        </GlobalStore>
    </Router>
);
