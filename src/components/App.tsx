import React, {useContext, ReactElement, useEffect, useCallback, createContext, useRef} from 'react';
import {LocationListener, Location} from "history";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {useToggle} from "hooks/common";
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

function useLocationChangeEffect(effect: LocationListener): void {
    const history = useHistory();
    useEffect(() => {
        return history.listen(effect);
    }, [history, effect]);
}

function useScrollToTop(): void {
    const prevPathRef = useRef<string>(useLocation().pathname);
    const onLocationChange = useCallback((location, action) => {
        console.log('update');
        if (prevPathRef.current !== location.pathname && action !== 'POP') {
            window.scrollTo(0, 0);
        }
        prevPathRef.current = location.pathname;
    }, []);
    useLocationChangeEffect(onLocationChange);
}

function useForceTrailingSlash(): void {
    const location = useLocation();
    const history = useHistory();
    const path = location.pathname;
    if (path.slice(-1) !== '/') {
        console.log(window.location);
        history.replace(path + '/');
    }
}

export type UIState = {
    sidebar: any;
};
const UIContext = createContext<UIState>(undefined as any);
UIContext.displayName = 'UIContext';

function useUIState(): UIState {
    return {
        sidebar: useToggle(false)
    };
}

export function useSideBarState(): UIState['sidebar'] {
    const {sidebar} = useContext<UIState>(UIContext);
    return sidebar;
}

const onLocationChange = (location: Location): void => {
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

export default App;
