import React, {ErrorInfo} from 'react';
import {RouteComponentProps} from 'react-router';

import ErrorPage from './layout/ErrorPage';

type Props = Pick<RouteComponentProps, 'location'>;

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const {location, children} = this.props;

    if (this.state.hasError) {
      return (
        <ErrorPage
          errorCode="Ой!"
          accentCodeLetter={2}
          className="error-boundary-page"
          location={location}
          url={location.pathname === '/' ? null : undefined}
          showSidebar={false}
        />
      );
    }

    return children;
  }
}
