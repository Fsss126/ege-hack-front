import {SnackbarProvider as Provider} from 'notistack';
import React from 'react';

export const SnackbarProvider: React.FC = (props) => {
  const {children} = props;

  return (
    <Provider
      maxSnack={3}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      className="snackbar"
      iconVariant={{
        error: <i className="snackbar__icon icon-alert" />,
        success: <i className="snackbar__icon icon-check" />,
      }}
      classes={{
        variantSuccess: 'snackbar--success',
        variantError: 'snackbar--error',
        variantInfo: 'snackbar--info',
        variantWarning: 'snackbar--warning',
        root: 'snackbar__root',
      }}
    >
      {children}
    </Provider>
  );
};
