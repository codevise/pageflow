import {useEffect, useRef, useState} from 'react';

export function useContentRect({enabled}) {
  const [contentRect, setContentRect] = useState({width: 0, height: 0});
  const ref = useRef();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const current = ref.current;

    const resizeObserver = new ResizeObserver(
      entries => {
        setContentRect(entries[entries.length - 1].contentRect);
      }
    );

    resizeObserver.observe(current);

    return () => {
      resizeObserver.unobserve(current);
    };
  }, [enabled]);

  return [contentRect, ref];
}
