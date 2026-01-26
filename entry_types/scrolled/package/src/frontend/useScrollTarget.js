import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import BackboneEvents from 'backbone-events-standalone';

const ScrollTargetEmitterContext = createContext();

export function ScrollTargetEmitterProvider({children}) {
  const emitter = useMemo(() => Object.assign({}, BackboneEvents), []);

  return (
    <ScrollTargetEmitterContext.Provider value={emitter}>
      {children}
    </ScrollTargetEmitterContext.Provider>
  );
}

export function useScrollToTarget() {
  const emitter = useContext(ScrollTargetEmitterContext);

  return useCallback(
    ({id, align, ifNeeded, behavior}) => {
      emitter.trigger(id, {align, ifNeeded, behavior});
    },
    [emitter]
  )
}

export function useScrollTarget(id) {
  const ref = useRef();

  const emitter = useContext(ScrollTargetEmitterContext);

  useEffect(() => {
    const handler = ({align, ifNeeded, behavior}) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();

        if (ifNeeded && isInViewport(align, rect)) {
          return;
        }

        window.scrollTo({
          top: rect.top + window.scrollY + getAlignOffset(align, rect),
          behavior: behavior || 'smooth'
        });
      }
    };

    emitter.on(id, handler);

    return () => emitter.off(id, handler);
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
