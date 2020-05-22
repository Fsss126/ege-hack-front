import React, {Ref, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {SimpleCallback} from 'types/utility/common';

export function useTruncate(text?: string): [Ref<any>, boolean] {
  const descriptionRef = useRef<any>(null);
  const [isFontLoaded, setFontLoaded] = React.useState(
    document.readyState === 'complete',
  );
  React.useEffect(() => {
    if (!text) {
      return;
    }
    function handleResize(): void {
      if (descriptionRef.current) {
        descriptionRef.current.onResize();
      }
    }
    function handleLoading(): void {
      setFontLoaded(true);
    }
    window.addEventListener('resize', handleResize);
    const cleanUpFn = () => {
      window.removeEventListener('resize', handleResize);
    };

    if (isFontLoaded) {
      return cleanUpFn;
    }
    if (document.readyState === 'complete') {
      setFontLoaded(true);
      return cleanUpFn;
    } else {
      window.addEventListener('load', handleLoading);
      return cleanUpFn;
    }
  }, [isFontLoaded, text]);
  return [descriptionRef, isFontLoaded];
}

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useLayoutEffect(() => {
    setIsMounted(true);
    return (): void => {
      setIsMounted(false);
    };
  }, []);

  return isMounted;
}

export function useUpdateEffect(
  effect: () => void,
  dependencies: any[] = [],
): void {
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) {
      effect();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    isInitialMount.current = false;
  }, []);
}

export function useForceUpdate(): SimpleCallback {
  const [, update] = React.useReducer((state) => !state, true);

  return update;
}

export function useToggle(
  initialState: boolean,
): [boolean, SimpleCallback, (isOn: boolean) => void] {
  const [isOn, toggle] = useState<boolean>(initialState);
  const toggleSideBar = React.useCallback(() => {
    toggle((opened) => !opened);
  }, []);

  return [isOn, toggleSideBar, toggle];
}
