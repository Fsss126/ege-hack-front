import classNames from 'classnames';
import {useUser} from 'hooks/selectors';
import {SnackbarKey, useSnackbar} from 'notistack';
import React, {useEffect, useRef, useState} from 'react';
import {Helmet} from 'react-helmet';
import {RouteComponentProps} from 'react-router';
import {Link, LinkProps, Redirect} from 'react-router-dom';
import Sticky from 'react-sticky-el';
import {CSSTransition} from 'react-transition-group';
import {SimpleCallback} from 'types/utility/common';

import {useSideBarState} from '../App';
import {
  RequiredPermissions,
  RequiredRoles,
  useCheckPermissions,
} from '../ConditionalRender';
import {
  LOADING_STATE,
  LoadingIndicator,
  useLoadingState,
} from '../ui/LoadingIndicator';
import {
  NotFoundErrorPage,
  PermissionsDeniedErrorPage,
  SpecificErrorPageProps,
} from './ErrorPage';
import Header from './Header';
import SideBar from './SideBar';

interface PageLoadingPlaceholderProps {
  state: LOADING_STATE;
}

const PageLoadingPlaceholder: React.FC<PageLoadingPlaceholderProps> = (
  props,
) => (
  <div className="layout__content">
    <div className="layout__loading-spinner">
      <LoadingIndicator state={props.state} />
    </div>
  </div>
);

export type PageLinkProps = {
  arrow: boolean;
  forward: boolean;
  // } & React.ComponentProps<typeof Link>;
} & LinkProps;

export const PageLink: React.withDefaultProps<React.FC<PageLinkProps>> = ({
  arrow,
  forward,
  className,
  ...props
}) => (
  <Link
    className={classNames(
      className,
      {
        'arrow-link': arrow,
      },
      forward ? 'arrow-link-forward' : 'arrow-link-backward',
    )}
    {...props}
  />
);
PageLink.defaultProps = {
  arrow: true,
  forward: true,
};

export type PageParentSection = {
  url?: string;
  name: string;
};

export type PageContentProps = {
  parentSection?: PageParentSection;
  className?: string;
  children: React.ReactNode;
};

export const PageContent: React.FC<PageContentProps> = ({
  children,
  className,
  parentSection,
}) => (
  <div
    className={classNames('layout__content-container', 'container', className)}
  >
    {parentSection && (
      <PageLink
        to={parentSection.url || '..'}
        forward={false}
        className="layout__content-parent-section-link"
      >
        {parentSection.name}
      </PageLink>
    )}
    {children}
  </div>
);

export type BottomTabProps = Sticky.Props;

export const BottomTab: React.FC<BottomTabProps> = ({
  children,
  className,
  ...stickyProps
}) => (
  <Sticky mode="bottom" {...stickyProps}>
    <div className={`layout__bottom-tab ${className || ''}`}>{children}</div>
  </Sticky>
);

enum LayoutAnimationClassNames {
  enter = 'sidebar-opened',
  enterActive = 'sidebar-opened',
  enterDone = 'sidebar-opened',
  exit = 'sidebar-hiding',
  exitActive = 'sidebar-hiding',
}

export type PageProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  checkLogin: boolean;
  showSidebar: boolean;
  showHeader: boolean;
  showUserNav: boolean;
  requiredPermissions?: RequiredPermissions;
  requiredRoles?: RequiredRoles;
  fullMatch?: boolean;
  loadUserInfo: boolean;
  isLoaded: boolean;
  errors?: any[];
  reloadCallbacks?: SimpleCallback[];
  withShimmer?: boolean;
  notFoundPageProps?: Omit<SpecificErrorPageProps, 'location'>;
} & Pick<RouteComponentProps, 'location'>;
const Page = (props: PageProps) => {
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
    location,
    errors = [],
    reloadCallbacks = [],
    withShimmer,
    notFoundPageProps = {},
  } = props;
  const [isSideBarOpened, toggleSideBar] = useSideBarState();
  const {credentials, userInfo} = useUser();

  const permissionsSatisfied = useCheckPermissions(
    requiredPermissions,
    requiredRoles,
    fullMatch,
  );

  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  const [hasError, setHasError] = useState(
    errors.some((error) => !!error && error !== true),
  );
  const [notFound, setNotFound] = useState(
    errors.some((error) => error === true),
  );

  const loadingState = useLoadingState(
    !isLoaded && !hasError,
    isLoaded,
    hasError,
  );

  if (errors.length !== reloadCallbacks.length) {
    throw new Error('Wrong errors or reloadCallbacks props provided.');
  }

  useEffect(() => {
    for (const error of errors) {
      if (error === true) {
        setNotFound(true);
        return;
      }
    }

    for (const error of errors) {
      if (error) {
        setHasError(true);
        break;
      }
    }
  }, [errors]);

  const errorsRef = useRef<any[]>(errors);
  const reloadCallbacksRef = useRef<SimpleCallback[]>(reloadCallbacks);
  const snackbarKeyRef = useRef<SnackbarKey>();

  errorsRef.current = errors;
  reloadCallbacksRef.current = reloadCallbacks;

  useEffect(() => {
    if (hasError) {
      // eslint-disable-next-line prefer-const
      let snackbarKey: SnackbarKey;

      const reloadCallback = () => {
        const reloadCallbacks = reloadCallbacksRef.current;
        const errors = errorsRef.current;

        setHasError(false);
        closeSnackbar(snackbarKey);

        for (const [i, callback] of reloadCallbacks.entries()) {
          if (errors[i]) {
            callback();
          }
        }
      };

      snackbarKey = enqueueSnackbar('Ошибка при загрузке', {
        persist: true,
        key: new Date().getTime(),
        variant: 'error',
        preventDuplicate: true,
        action: <i className="icon-reload" onClick={reloadCallback} />,
      });
      snackbarKeyRef.current = snackbarKey;
    }
  }, [closeSnackbar, enqueueSnackbar, hasError]);

  useEffect(() => {
    return () => {
      closeSnackbar(snackbarKeyRef.current);
    };
  }, [closeSnackbar]);

  if (checkLogin) {
    if (credentials === null) {
      return (
        <Redirect
          to={{
            pathname: '/login/',
            state: location ? {referrer: location.pathname} : undefined,
          }}
        />
      );
    }
    if (permissionsSatisfied === false) {
      return <PermissionsDeniedErrorPage location={location} />;
    }
  }
  const showContent =
    (checkLogin
      ? requiredPermissions || loadUserInfo
        ? credentials && userInfo
        : !!credentials
      : true) &&
    (withShimmer || isLoaded);

  if (notFound) {
    return <NotFoundErrorPage location={location} {...notFoundPageProps} />;
  }

  return (
    <div className="app">
      {showHeader && (
        <Header
          onMenuButtonClick={toggleSideBar}
          showUserNav={showUserNav}
          user={
            credentials
              ? credentials instanceof Error
                ? null
                : credentials
              : null
          }
          userInfo={
            userInfo
              ? userInfo instanceof Error
                ? undefined
                : userInfo
              : undefined
          }
          sidebar={showSidebar}
        />
      )}
      <CSSTransition
        in={isSideBarOpened}
        timeout={200}
        classNames={LayoutAnimationClassNames}
      >
        <div className="layout">
          <React.Fragment>
            {showSidebar && (
              <SideBar
                accountRoles={
                  credentials !== null
                    ? userInfo && !(userInfo instanceof Error)
                      ? userInfo.roles
                      : undefined
                    : null
                }
                onMenuClose={toggleSideBar}
              />
            )}
            <div className={classNames('layout__content', className)}>
              {title && (
                <Helmet>
                  <title>{title} – ЕГЭ HACK</title>
                </Helmet>
              )}
              {showContent ? (
                children
              ) : (
                <PageLoadingPlaceholder state={loadingState} />
              )}
            </div>
          </React.Fragment>
        </div>
      </CSSTransition>
    </div>
  );
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
