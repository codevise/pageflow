import {useState, useEffect} from 'react';

export function useOnScreen(ref, {rootMargin, onIntersecting, skipIframeFix} = {}) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const current = ref.current;
    const observer = createIntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && onIntersecting) {
          onIntersecting();
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
  }, [ref, rootMargin, onIntersecting, skipIframeFix]);

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
