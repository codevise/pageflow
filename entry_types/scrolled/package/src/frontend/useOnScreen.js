import {useState, useEffect} from 'react';

export function useOnScreen(ref, rootMargin = '0px', cb) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && cb) {
          cb();
        }
      },
      {
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(current);
    }

    return () => {
      observer.unobserve(current);
    };
  }, [ref, rootMargin, cb]);

  return isIntersecting;
}
