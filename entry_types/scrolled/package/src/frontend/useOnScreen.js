import {useState, useEffect} from 'react';
import iObserver from '../vendor/intersection-observer';

export function useOnScreen(ref, rootMargin = '0px', cb) {
  const [isIntersecting, setIntersecting] = useState(false);
  const Observer = window.IntersectionObserver ? window.IntersectionObserver : iObserver;
  useEffect(() => {
    const current = ref.current;
    const observer = new Observer(
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
