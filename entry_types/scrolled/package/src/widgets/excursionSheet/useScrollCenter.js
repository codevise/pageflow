import {useEffect, useRef} from 'react';

export function useScrollCenter() {
  const parentRef = useRef();
  const childRef = useRef();

  useEffect(() => {
    function onScroll() {
      const parentRect = parentRef.current.getBoundingClientRect();
      childRef.current.style.transform =
        `translate(-50%, calc((100lvh - ${parentRect.top}px) * 0.3 - 50%)`
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }, [])

  return [parentRef, childRef];
}
