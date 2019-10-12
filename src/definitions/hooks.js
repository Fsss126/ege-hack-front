import React from 'react';

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

export function useLocationChangeEffect(effect, history, dependencies = []) {
    React.useEffect(() => {
        effect(history.location);
        return history.listen(effect);
    }, [history, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = React.useRef(true);

    React.useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            effect();
        }
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useForceUpdate() {
    const [, update] = React.useReducer(state => !state, true);
    return update;
}
