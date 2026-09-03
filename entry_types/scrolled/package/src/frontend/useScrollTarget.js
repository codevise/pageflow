import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import BackboneEvents from 'backbone-events-standalone';

import {scrollToElement} from './scrollToElement';

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
    const handler = options => {
      if (ref.current) {
        scrollToElement(ref.current, options);
      }
    };

    emitter.on(id, handler);

    return () => emitter.off(id, handler);
  }, [id, emitter]);

  return ref;
}
