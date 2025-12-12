import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import BackboneEvents from 'backbone-events-standalone';

const ScrollTargetEmitterContext = createContext();

export function ScrollTargetEmitterProvider({children}) {
  const emitter =  useMemo(() => Object.assign({}, BackboneEvents), []);

  return (
    <ScrollTargetEmitterContext.Provider value={emitter}>
      {children}
    </ScrollTargetEmitterContext.Provider>
  );
}

export function useScrollToTarget() {
  const emitter = useContext(ScrollTargetEmitterContext);

  return useCallback(
    ({id, align, ifNeeded}) => emitter.trigger(id, {align, ifNeeded}),
    [emitter]
  )
}

export function useScrollTarget(id) {
  const ref = useRef();

  const emitter = useContext(ScrollTargetEmitterContext);

  useEffect(() => {
    emitter.on(id, ({align, ifNeeded}) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();

        if (ifNeeded && isInViewport(align, rect)) {
          return;
        }

        window.scrollTo({
          top: rect.top + window.scrollY + getAlignOffset(align, rect),
          behavior: 'smooth'
        });
      }
    });

    return () => emitter.off(id)
  }, [id, emitter]);

  return ref;
}

function getAlignOffset(align, rect) {
  if (align === 'start') {
    return 0;
  }
  else if (align === 'nearEnd') {
    return rect.height - window.innerHeight * 0.75;
  }
  else {
    return -window.innerHeight * 0.25;
  }
}

function isInViewport(align, rect) {
  if (align === 'nearEnd') {
    const bottom = rect.top + rect.height;
    return bottom > 0 && bottom <= window.innerHeight;
  }
  else {
    return rect.top >= 0 && rect.top < window.innerHeight;
  }
}
