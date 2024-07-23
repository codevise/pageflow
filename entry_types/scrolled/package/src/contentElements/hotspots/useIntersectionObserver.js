import {useRef, useEffect} from 'react';

export function useIntersectionObserver({threshold, onVisibleIndexChange, enabled}) {
  const containerRef = useRef();
  const childRefs = useRef([]);
  const observerRef = useRef();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = observerRef.current = new IntersectionObserver(
      (entries) => {
        const containerElement = containerRef.current;

        let found = false;

        entries.forEach((entry) => {
          const entryIndex = Array.from(containerElement.children).findIndex(
            (child) => child === entry.target
          );

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            found = true;
            onVisibleIndexChange(entryIndex);
          }
        });

        if (!found) {
          onVisibleIndexChange(-1);
        }
      },
      {
        root: containerRef.current,
        threshold
      }
    );

    childRefs.current.forEach((child) => {
      if (child) {
        observer.observe(child);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, onVisibleIndexChange]);

  const setChildRef = (index) => (ref) => {
    if (observerRef.current) {
      if (ref) {
        observerRef.current.observe(ref);
      }
      else {
        observerRef.current.unobserve(childRefs.current[index]);
      }
    }

    childRefs.current[index] = ref;
  };

  return [containerRef, setChildRef];
};
