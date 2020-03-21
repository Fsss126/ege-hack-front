import React from 'react';
import classnames from 'classnames';
import {Helmet} from "react-helmet";
import Sticky from 'react-sticky-el';
import {Link, LinkProps, Redirect, useLocation} from "react-router-dom";
import {useUser} from "store/selectors";
import Header from "./Header";
import {CSSTransition} from "react-transition-group";
import SideBar from "./SideBar";
import {useSideBarState} from "./App";
import {PermissionsDeniedErrorPage} from "./ErrorPage";
import {RequiredPermissions, RequiredRoles, useCheckPermissions} from "./ConditionalRender";
import {RouteComponentProps} from "react-router";

const PageLoadingPlaceholder: React.FC = () => (
    <div className="layout__content">
        <div className="layout__loading-spinner">
            <i className="spinner-border"/>
        </div>
    </div>
);

export type PageLinkProps = {
    arrow: boolean;
    forward: boolean;
// } & React.ComponentProps<typeof Link>;
} & LinkProps;

export const PageLink: React.withDefaultProps<React.FC<PageLinkProps>> = ({arrow, forward, className, ...props}) => (
    <Link
        className={classnames(className, {
            'arrow-link': arrow
        }, forward ? 'arrow-link-forward' : 'arrow-link-backward')}
        {...props}/>
);
PageLink.defaultProps = {
    arrow: true,
    forward: true
};

export type PageParentSection = {
    url: string;
    name: string;
}
export type PageContentProps = {
    parentSection?: PageParentSection;
    className?: string;
    children: React.ReactNode;
}
export const PageContent: React.FC<PageContentProps> = ({children, className, parentSection}) => (
    <div className={classnames('layout__content-container', 'container', className)}>
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

export type BottomTabProps = Sticky.Props;
export const BottomTab: React.FC<BottomTabProps> = ({children, className, ...stickyProps}) => (
    <Sticky mode="bottom" {...stickyProps}>
        <div className={`layout__bottom-tab ${className || ''}`}>
            {children}
        </div>
    </Sticky>
);

//TODO: Add page error boundary
class PageErrorBoundary extends React.Component {
    state = {
        error: null
    }
}

enum LayoutAnimationClassNames {
    enter = 'sidebar-opened',
    enterActive = 'sidebar-opened',
    enterDone = 'sidebar-opened',
    exit = 'sidebar-hiding',
    exitActive = 'sidebar-hiding'
}

//TODO: check error and show popup
//TODO: parent sections using context

export type PageProps = {
    title?: string;
    className?: string;
    children: React.ReactNode;
    checkLogin: boolean;
    showSidebar: boolean;
    showHeader: boolean;
    showUserNav: boolean;
    requiredPermissions?: RequiredPermissions;
    requiredRoles?: RequiredRoles;
    fullMatch: boolean;
    loadUserInfo: boolean;
    isLoaded: boolean;
} & Pick<RouteComponentProps<any>, 'location'>;
const Page: React.withDefaultProps<React.FC<PageProps>> = (props) => {
    const {
        title,
        className,
        children,
        checkLogin,
        showSidebar,
        showHeader,
        showUserNav,
        requiredPermissions,
        requiredRoles,
        fullMatch,
        loadUserInfo,
        isLoaded,
    } = props;
    const location = useLocation();
    const [isSideBarOpened, toggleSideBar] = useSideBarState();
    const {credentials, userInfo} = useUser();

    const permissionsSatisfied = useCheckPermissions(requiredPermissions, requiredRoles, fullMatch);
    if (checkLogin) {
        if (credentials === null) {
            return (
                <Redirect to={{
                    pathname: '/login/',
                    state: location ? {referrer: location.pathname} : undefined
                }}/>);
        }
        if (permissionsSatisfied === false) {
            return <PermissionsDeniedErrorPage/>;
        }
    }
    const showContent = (checkLogin ? (requiredPermissions || loadUserInfo ? credentials && userInfo : !!credentials) : true) && isLoaded;
    return (
        <div className="app">
            {showHeader && (
                <Header
                    onMenuButtonClick={toggleSideBar}
                    showUserNav={showUserNav}
                    user={credentials ? (credentials instanceof Error ? null : credentials) : null}
                    userInfo={userInfo ? (userInfo instanceof Error ? undefined : userInfo) : undefined}
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
                                accountRoles={credentials !== null ? (userInfo && !(userInfo instanceof Error)? userInfo.roles : undefined) : null}
                                onMenuClose={toggleSideBar}/>
                        )}
                        <div className={classnames('layout__content', className)}>
                            {title && <Helmet><title>{title} – ЕГЭ HACK</title></Helmet>}
                            {showContent ?
                                children :
                                <PageLoadingPlaceholder/>}
                        </div>
                    </React.Fragment>
                </div>
            </CSSTransition>
        </div>
    )
};
Page.defaultProps = {
    checkLogin: true,
    showSidebar: true,
    showHeader: true,
    showUserNav: true,
    loadUserInfo: false,
    isLoaded: true,
};

export default Page;