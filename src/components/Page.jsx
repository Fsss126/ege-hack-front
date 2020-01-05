import React from 'react';
import _ from 'lodash';
import {Helmet} from "react-helmet";
import Sticky from 'react-sticky-el';
import {Link, Redirect} from "react-router-dom";
import {useUser} from "../store";
import Header from "./Header";
import {CSSTransition} from "react-transition-group";
import SideBar from "./SideBar";
import {useSideBarState} from "./App";
import {PermissionsDeniedError} from "./ErrorPage";

const PageLoadingPlaceholder = () => (
    <div className="layout__content">
        <div className="layout__loading-spinner">
            <i className="spinner-border"/>
        </div>
    </div>
);

export const PageLink = ({to, arrow = true, forward = true, className, children, ...props}) => (
    <Link
        className={`${arrow ? 'arrow-link' : ''} ${forward ? 'arrow-link-forward' : 'arrow-link-backward'} ${className || ''}`}
        to={to}
        {...props}>
        {children}
    </Link>
);

export const PageContent = ({children, className, parentSection}) => (
    <div className={`layout__content-container container ${className || ''}`}>
        {parentSection && (
            <PageLink
                to={parentSection.url || '..'}
                forward={false}
                className="layout__content-parent-section-link">
                {parentSection.name}
            </PageLink>
        )}
        {children}
    </div>
);

export const BottomTab = ({children, className, ...stickyProps}) => (
    <Sticky mode="bottom" {...stickyProps}>
        <div className={`layout__bottom-tab ${className || ''}`}>
            {children}
        </div>
    </Sticky>
);

class PageErrorBoundary extends React.Component {
    state = {
        error: null
    }
}

const LayoutAnimationClassNames = {
    enter: 'sidebar-opened',
    enterActive: 'sidebar-opened',
    enterDone: 'sidebar-opened',
    exit: 'sidebar-hiding',
    exitActive: 'sidebar-hiding'
};

const Page = ({
                  title,
                  className,
                  children,
                  checkLogin = true,
                  showSidebar = true,
                  showHeader = true,
                  showUserNav = true,
                  location,
                  requiredPermissions,
                  isLoaded=true
              }) => {
    const [isSideBarOpened, toggleSideBar] = useSideBarState();
    const {user, userInfo} = useUser();

    //TODO: check permissions
    if (checkLogin) {
        if (user === null) {
            return (
                <Redirect to={{
                    pathname: '/login/',
                    state: location ? {referrer: location.pathname} : undefined
                }}/>);
        }
    }

    if (requiredPermissions && userInfo && userInfo.permissions) {
        if (_.difference(requiredPermissions, userInfo.permissions).length !== 0)
            return <PermissionsDeniedError/>;
    }
    return (
        <div className="app">
            {showHeader && (
                <Header
                    onMenuButtonClick={toggleSideBar}
                    showUserNav={showUserNav}
                    user={user}
                    userInfo={userInfo}
                    sidebar={showSidebar}/>
            )}
            <CSSTransition
                in={isSideBarOpened}
                timeout={200}
                classNames={LayoutAnimationClassNames}>
                <div className="layout">
                    <React.Fragment>
                        {showSidebar && (
                            <SideBar
                                accountRoles={user !== null ? (userInfo ? userInfo.roles : undefined) : null}
                                onMenuClose={toggleSideBar}/>
                        )}
                        <div className={`layout__content ${className || ''}`}>
                            {title && <Helmet><title>{title} – ЕГЭ HACK</title></Helmet>}
                            {user && userInfo && isLoaded ?
                                children :
                                <PageLoadingPlaceholder/>}
                        </div>
                    </React.Fragment>
                </div>
            </CSSTransition>
        </div>
    )
};

export default Page;
