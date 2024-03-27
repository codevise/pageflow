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
    ({id, align}) => emitter.trigger(id, align),
    [emitter]
  )
}

export function useScrollTarget(id) {
  const ref = useRef();

  const emitter = useContext(ScrollTargetEmitterContext);

  useEffect(() => {
    emitter.on(id, align => {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top
             + window.scrollY
             - (align === 'start' ? 0 : window.innerHeight * 0.25),
          behavior: 'smooth'
        });
      }
    });

    return () => emitter.off(id)
  }, [id, emitter]);

  return ref;
}
