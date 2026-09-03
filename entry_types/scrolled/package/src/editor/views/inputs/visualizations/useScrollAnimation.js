import {useEffect, useRef} from 'react';

// Scrolls the referenced element back and forth to demonstrate how a
// content element behaves while the page scrolls. Since the position
// to scroll to often depends on the size of the rendered preview,
// scrollTop is passed as a function receiving the scroller and the
// eased progress of the animation. Pass rest to hold the end position
// for a while before scrolling back.
export function useScrollAnimation(ref, {scrollTop, duration = 3000, rest = 0, onScroll}) {
  const callbacksRef = useRef();
  callbacksRef.current = {scrollTop, onScroll};

  useEffect(() => {
    const startTime = new Date().getTime();

    function update() {
      const scroller = ref.current;
      const elapsed = (new Date().getTime() - startTime) % (2 * duration + rest);

      // Capping the way back keeps progress at the end of the animation while
      // it rests there.
      const t = elapsed <= duration ?
                elapsed / duration :
                Math.min((2 * duration + rest - elapsed) / duration, 1);

      scroller.scrollTop = callbacksRef.current.scrollTop(scroller, easeInOut(t));

      if (callbacksRef.current.onScroll) {
        callbacksRef.current.onScroll(scroller);
      }
    }

    // Update once to prevent displaying the unscrolled preview until
    // the first interval elapses.
    update();

    const interval = setInterval(update, 10);

    return () => clearInterval(interval);
  }, [ref, duration, rest]);
}

function easeInOut(t) {
  t = t * 2;
  if (t < 1) return (t**2)/2;
  t = t - 1;
  return t - (t**2)/2 + 1/2;
};
