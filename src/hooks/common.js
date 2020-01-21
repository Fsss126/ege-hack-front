import React, {useCallback, useRef, useState} from 'react';

export function useTruncate(text) {
    const descriptionRef = React.useRef(null);
    const [isFontLoaded, setFontLoaded] = React.useState(document.readyState === "complete");
    React.useEffect(() => {
        if (!text)
            return;
        function handleResize() {
            if (descriptionRef.current) {
                descriptionRef.current.onResize();
            }
        }
        window.addEventListener('resize', handleResize);
        const cleanUpFn = () => {
            window.removeEventListener('resize', handleResize);
        };
        if (isFontLoaded)
            return cleanUpFn;
        if (document.readyState === "complete") {
            setFontLoaded(true);
            return cleanUpFn;
        }
        else {
            function handleLoading() {
                setFontLoaded(true);
            }
            window.addEventListener('load', handleLoading);
            return cleanUpFn;
        }
    }, [isFontLoaded, text]);
    return [descriptionRef, isFontLoaded];
}

export function useRefValue(initialValue) {
    const ref = useRef(initialValue);
    const getValue = useCallback(() => ref.current, []);
    const setValue = useCallback((value) => {
        ref.current = value;
    }, []);
    return [getValue, setValue];
}

export function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    React.useLayoutEffect(() => {
        console.log('mounting');
        setIsMounted(true);
        return () => {
            console.log('unmounting');
            setIsMounted(false);
        };
    }, []);

    return isMounted;
}

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = React.useRef(true);

    React.useEffect(() => {
        if (!isInitialMount.current) {
            effect();
        }
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        isInitialMount.current = false;
    }, []);
}

export function useForceUpdate() {
    const [, update] = React.useReducer(state => !state, true);
    return update;
}

export function useToggle(initialState) {
    const [isOn, toggle] = React.useState(initialState);
    const toggleSideBar = React.useCallback(() => {
        toggle(opened => !opened);
    }, []);
    return [isOn, toggleSideBar];
}
