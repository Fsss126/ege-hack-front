import React, {useRef} from 'react';

export function useCombinedRefs<T>(...refs: React.Ref<T>[]) {
  const targetRef = useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(targetRef.current || null);
      } else {
        (ref.current as any) = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
