import React from 'react';

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
