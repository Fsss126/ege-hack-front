import {useUpdateEffect} from 'hooks/common';
import React, {useState} from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';

import {SimpleCallback} from '../../types/utility/common';
import Tooltip from './Tooltip';

export enum LOADING_STATE {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  SUCCESS = 'success',
  DONE = 'done',
  REJECTED = 'rejected',
  ERROR = 'error',
}

export function useLoadingState(
  loading: null | boolean,
  done: boolean,
  rejected?: boolean,
  error?: boolean,
): LOADING_STATE {
  const [state, setState] = useState<LOADING_STATE>(
    loading === null || done
      ? LOADING_STATE.DONE
      : rejected
      ? LOADING_STATE.REJECTED
      : LOADING_STATE.LOADING,
  );
  useUpdateEffect(() => {
    if (loading === false) {
      setState(LOADING_STATE.LOADED);
    } else if (loading === true) {
      setState(LOADING_STATE.LOADING);
    }
  }, [loading]);
  useUpdateEffect(() => {
    if (state === LOADING_STATE.LOADED && done) {
      setState(LOADING_STATE.SUCCESS);
    } else if (state === LOADING_STATE.SUCCESS) {
      const timeout = setTimeout(() => {
        setState(LOADING_STATE.DONE);
      }, 1000);

      return (): void => {
        clearTimeout(timeout);
      };
    }
  }, [state, done]);
  useUpdateEffect(() => {
    if (error) {
      setState(LOADING_STATE.ERROR);
    }
  }, [error]);
  useUpdateEffect(() => {
    if (rejected) {
      setState(LOADING_STATE.REJECTED);
    }
  }, [rejected]);
  return state;
}

export type LoadingIndicatorProps = {
  state: LOADING_STATE;
  onClick?: SimpleCallback;
  errorMessage?: string;
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  state,
  onClick,
  errorMessage,
}) => {
  const icon =
    (state === LOADING_STATE.LOADED && 'spinner-border') ||
    (state === LOADING_STATE.SUCCESS && 'icon-check') ||
    (state === LOADING_STATE.ERROR && 'icon-retry') ||
    (state === LOADING_STATE.REJECTED && 'icon-alert') ||
    'spinner-border';

  return (
    <SwitchTransition>
      <CSSTransition
        key={icon}
        appear={true}
        classNames="animation-scale"
        timeout={300}
      >
        {state !== LOADING_STATE.DONE ? (
          <div className="file__state-indicator" onClick={onClick}>
            <Tooltip content={errorMessage}>
              <i className={icon} />
            </Tooltip>
          </div>
        ) : (
          <div />
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};
