import React, {useRef, useEffect, useContext, useMemo, createContext} from 'react';
import classNames from 'classnames';
import {useOnScreen} from './useOnScreen';

import styles from './useScrollPositionLifecycle.module.css';

const StaticPreviewContext = createContext(false);

export function StaticPreview({children}) {
  return (
    <StaticPreviewContext.Provider value={true}>
      {children}
    </StaticPreviewContext.Provider>
  );
}

export function createScrollPositionLifecycleProvider(Context) {
  return function ScrollPositionLifecycleProvider({children, onActivate}) {
    const ref = useRef();
    const isActiveProbeRef = useRef();

    const isStaticPreview = useContext(StaticPreviewContext);

    const isPrepared = useOnScreen(ref, {rootMargin: '25% 0px 25% 0px'});
    const isVisible = useOnScreen(ref) && !isStaticPreview;
    const isActive = useOnScreen(isActiveProbeRef, {
      rootMargin: '-50% 0px -50% 0px',
      onIntersecting: onActivate
    }) && !isStaticPreview;

    const value = useMemo(() => ({isPrepared, isVisible, isActive}),
                          [isPrepared, isVisible, isActive]);

    return (
      <div ref={ref} className={classNames(styles.wrapper)}>
        <div ref={isActiveProbeRef} className={styles.isActiveProbe} />

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
