import React from 'react';
import {Prompt} from 'react-router-dom';

interface NavigationBlockerProps {
  blockHistoryChange: boolean;
}

const NavigationBlocker = (props: NavigationBlockerProps) => {
  const {blockHistoryChange} = props;
  const unloadCallback = React.useCallback((event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = '';
  }, []);
  React.useEffect(() => {
    window.addEventListener('beforeunload', unloadCallback);
    return (): void => {
      window.removeEventListener('beforeunload', unloadCallback);
    };
  }, [unloadCallback]);
  return blockHistoryChange ? (
    <Prompt message="У вас есть несохраненные изменения, покинуть страницу?" />
  ) : null;
};
NavigationBlocker.defaultProps = {
  blockHistoryChange: true,
};

export default NavigationBlocker;
