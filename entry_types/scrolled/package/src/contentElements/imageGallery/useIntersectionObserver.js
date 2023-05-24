import {useRef, useState, useEffect} from 'react';

export function useIntersectionObserver({threshold}) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  const containerRef = useRef();
  const childRefs = useRef([]);
  const observerRef = useRef();

  useEffect(() => {
    const observer = observerRef.current = new IntersectionObserver(
      (entries) => {
        const containerElement = containerRef.current;
        entries.forEach((entry) => {
          const entryIndex = Array.from(containerElement.children).findIndex(
            (child) => child === entry.target
          );

          setVisibleIndex(index => {
            if (entry.isIntersecting) {
              return entryIndex;
            }
            else if (entryIndex === index) {
              return -1;
            }

            return index;
          });
        });
      },
      {
        root: containerRef.current,
        threshold
      }
    );

    childRefs.current.forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

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

  return {containerRef, setChildRef, visibleIndex};
};
