import 'styles/index.scss';

import {Location, LocationListener} from 'history';
import {useToggle} from 'hooks/common';
import {useUserAuth} from 'modules/user/user.hooks';
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import {DEBUG_MODE} from '../definitions/constants';
import {ErrorBoundary} from './ErrorBoundary';
import {NotFoundErrorPage} from './layout/ErrorPage';
import Account from './pages/account';
import Admin from './pages/admin';
import MyCourses from './pages/courses';
import Login from './pages/login';
import Shop from './pages/shop';
import Teachers from './pages/teachers';
import Teaching from './pages/teaching';
import {SnackbarProvider} from './SnackbarProvider';

function useLocationChangeEffect(effect: LocationListener): void {
  const history = useHistory();
  useEffect(() => {
    return history.listen(effect);
  }, [history, effect]);
}

function useScrollToTop(): void {
  const prevPathRef = useRef<string>(useLocation().pathname);
  const onLocationChange = useCallback((location, action) => {
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
    if (DEBUG_MODE) {
      console.warn('Force trailing slash', path);
    }
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
    sidebar: useToggle(false),
  };
}

export function useSideBarState(): UIState['sidebar'] {
  const {sidebar} = useContext<UIState>(UIContext);

  return sidebar;
}

const onLocationChange = (location: Location): void => {
  if (DEBUG_MODE) {
    // eslint-disable-next-line no-console
    console.log(`- - - location: '${location.pathname}'`);
  }
};

const DefaultRedirect = (): ReactElement => <Redirect to="/courses" />;

function App(): ReactElement {
  // routing effects
  useUserAuth();
  useForceTrailingSlash();
  useScrollToTop();
  useLocationChangeEffect(onLocationChange);
  const location = useLocation();
  const uiState = useUIState();

  return (
    <UIContext.Provider value={uiState}>
      <SnackbarProvider>
        <ErrorBoundary location={location}>
          <Switch>
            <Route path="/index.html" component={DefaultRedirect} />
            <Route exact path="/" component={DefaultRedirect} />
            <Route path="/login" component={Login} />
            <Route path="/courses" component={MyCourses} />
            <Route path="/shop" component={Shop} />
            <Route path="/teachers" component={Teachers} />
            <Route path="/account" component={Account} />
            <Route path="/admin" component={Admin} />
            <Route path="/teaching" component={Teaching} />
            <Route component={NotFoundErrorPage} />
          </Switch>
        </ErrorBoundary>
      </SnackbarProvider>
    </UIContext.Provider>
  );
}

export default App;
