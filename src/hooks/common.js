import React from 'react';
import {useUser} from "../store";

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
        if (isFontLoaded)
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        if (document.readyState === "complete") {
            setFontLoaded(true);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
        else {
            function handleLoading() {
                setFontLoaded(true);
            }
            window.addEventListener('load', handleLoading);
            return () => {
                window.removeEventListener('load', handleLoading);
            };
        }
    }, [isFontLoaded, text]);
    return [descriptionRef, isFontLoaded];
}

export function useRefValue(initialValue) {
    const ref = React.useRef(initialValue);
    const getValue = React.useCallback(() => ref.current, []);
    const setValue = React.useCallback((value) => {
        ref.current = value;
    }, []);
    return [getValue, setValue];
}

export function useIsMounted() {
    const [getIsMounted, setIsMounted] = useRefValue(false);

    React.useLayoutEffect(() => {
        console.log('mounting');
        setIsMounted(true);
        return () => {
            console.log('unmounting');
            setIsMounted(false);
        };
    }, []);

    return getIsMounted;
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

// export function useCheckPageAccess(checkLogin) {
//
// }
