import {useState, useEffect} from 'react';

export function useOnScreen(ref, {rootMargin, onIntersecting} = {}) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && onIntersecting) {
          onIntersecting();
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
  }, [ref, rootMargin, onIntersecting]);

  return isIntersecting;
}
