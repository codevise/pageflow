import React, {useRef, useEffect, useContext, useMemo, createContext} from 'react';
import {useOnScreen} from './useOnScreen';

const StaticPreviewContext = createContext(false);

export function StaticPreview({children}) {
  return (
    <StaticPreviewContext.Provider value={true}>
      {children}
    </StaticPreviewContext.Provider>
  );
}

export function createScrollPositionLifecycleProvider(Context) {
  return function ScrollPositionLifecycleProvider({children}) {
    const ref = useRef();
    const isStaticPreview = useContext(StaticPreviewContext);
    const isPrepared = useOnScreen(ref, '25% 0px 25% 0px');
    const isVisible = useOnScreen(ref);
    const isActive = useOnScreen(ref, '-50% 0px -50% 0px') && !isStaticPreview;

    const value = useMemo(() => ({isPrepared, isVisible, isActive}),
                          [isPrepared, isVisible, isActive]);

    return (
      <div ref={ref}>
        <Context.Provider value={value}>
          {children}
        </Context.Provider>
      </div>
    );
  }
}

export function createScrollPositionLifecycleHook(Context) {
  return function useScrollPositionLifecycle({onActivate, onDeactivate, onVisible, onInvisible} = {}) {
    const result = useContext(Context);

    const wasActive = useRef();
    const wasVisible = useRef();

    const {isActive, isVisible} = result || {};

    useEffect(() => {
      if (!wasVisible.current && isVisible && onVisible) {
        onVisible();
      }

      if (!wasActive.current && isActive && onActivate) {
        onActivate();
      }
      else if (wasActive.current && !isActive && onDeactivate) {
        onDeactivate();
      }

      if (wasVisible.current && !isVisible && onInvisible) {
        onInvisible();
      }

      wasActive.current = isActive;
      wasVisible.current = isVisible;
    });

    return result;
  };
}
