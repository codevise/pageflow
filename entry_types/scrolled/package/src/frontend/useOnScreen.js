import {useState, useEffect, useRef} from 'react';

export function useOnScreen(ref, {rootMargin, onIntersecting, skipIframeFix} = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const onIntersectingRef = useRef();

  useEffect(() => {
    onIntersectingRef.current = onIntersecting
  }, [onIntersecting]);

  useEffect(() => {
    const current = ref.current;
    const observer = createIntersectionObserver(
      (entries) => {
        // Even when observing only a single element, multiple entries
        // may have queued up. In Chrome this can be observed when
        // moving an observed element in the DOM: The callback is
        // invoked once with two entries for the same target, one
        // claiming the element no longer intersects and one - with a
        // later timestamp - saying that is does intersect. Assuming
        // entries are ordered according to time, we only consider the
        // last entry.
        const entry = entries[entries.length - 1];

        setIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && onIntersectingRef.current) {
          onIntersectingRef.current();
        }
      },
      {
        rootMargin
      },
      skipIframeFix
    );

    if (ref.current) {
      observer.observe(current);
    }

    return () => {
      observer.unobserve(current);
    };
  }, [ref, rootMargin, skipIframeFix]);

  return isIntersecting;
}

function createIntersectionObserver(callback, options, skipIframeFix) {
  if (skipIframeFix) {
    return new IntersectionObserver(callback, options);
  }

  // Positive root margins are ignored in iframes [1] (i.e. in
  // the Pageflow editor). To make it work, the iframe document
  // needs to be passed as `root` [2].
  // This leads to a `TypeError`, though, in browers that do not
  // support this yet (e.g. Chrome 80). We catch the error and
  // skip passing the `root` option.
  //
  // [1] https://github.com/w3c/IntersectionObserver/issues/283
  // [2] https://github.com/w3c/IntersectionObserver/issues/372
  try {
    let optionsWithIframeFix = options;

    if (options.rootMargin && window.parent !== window) {
      optionsWithIframeFix = {
        ...options,
        root: window.document
      };
    }

    return new IntersectionObserver(
      callback,
      optionsWithIframeFix
    );
  }
  catch(e) {
    // Normally we would check for TypeError here. Since the polyfill
    // throws a generic error, we retry either way and trust that the
    // error will happen again if it is not related to the `root`
    // option.
    return createIntersectionObserver(callback, options, true);
  }
}
