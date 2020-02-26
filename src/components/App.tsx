import React, {useContext, ReactElement} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {APP_BASE_URL} from "definitions/constants";
import {useRefValue, useToggle} from "hooks/common";
import {useUserAuth} from "store/selectors";
import Login from "./pages/login";
import Account from "./pages/account";
import Teachers from "./pages/teachers";
import Shop from "./pages/shop";
import MyCourses from "./pages/courses";
import Admin from "./pages/admin";
import Teaching from "./pages/teaching";
import {NotFoundErrorPage} from "./ErrorPage";

import 'sass/index.scss';
import {createAppStore} from "../store/store";
import {Provider} from "react-redux";
import {LocationListener, Location} from "history";

function useLocationChangeEffect(effect: LocationListener) {
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

const UIContext = React.createContext<any>(null);
UIContext.displayName = 'UIContext';

function useUIState() {
    return {
        sidebar: useToggle(false)
    };
}

export function useSideBarState() {
    const {sidebar} = useContext<any>(UIContext);
    return sidebar;
}

const onLocationChange = (location: Location) => {
    console.log(`- - - location: '${location.pathname}'`);
};

const DefaultRedirect = (): ReactElement => <Redirect to="/courses"/>;

function App(): ReactElement {
    // routing effects
    useUserAuth();
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

const store = createAppStore();

export default (): ReactElement => (
    <Provider store={store}>
        <Router basename={APP_BASE_URL}>
            <App/>
        </Router>
    </Provider>
);
