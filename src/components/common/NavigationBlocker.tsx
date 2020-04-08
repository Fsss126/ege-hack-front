import React from 'react';
import {Prompt} from 'react-router-dom';

const NavigationBlocker: React.FC = () => {
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
  return (
    <Prompt message="У вас есть несохраненные изменения, покинуть страницу?" />
  );
};

export default NavigationBlocker;
