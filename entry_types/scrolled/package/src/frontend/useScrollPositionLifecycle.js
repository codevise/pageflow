import React, {useRef, useEffect, useContext, useMemo, createContext, useState} from 'react';
import classNames from 'classnames';
import {useOnScreen} from './useOnScreen';
import {useDelayedBoolean} from './useDelayedBoolean';
import {useStorylineActivity} from './storylineActivity';

import styles from './useScrollPositionLifecycle.module.css';

const StaticPreviewContext = createContext(false);

export function StaticPreview({children}) {
  return (
    <StaticPreviewContext.Provider value={true}>
      {children}
    </StaticPreviewContext.Provider>
  );
}

/**
 * Use inside a content element component to determine whether the
 * component is being rendered in a static preview, e.g. editor
 * thumbnails.
 *
 * @example
 * const isStaticPreview = useIsStaticPreview();
 */
export function useIsStaticPreview() {
  return useContext(StaticPreviewContext);
}

export function createScrollPositionLifecycleProvider(Context) {
  return function ScrollPositionLifecycleProvider({
    children, onActivate, entersWithFadeTransition
  }) {
    const ref = useRef();
    const isActiveProbeRef = useRef();

    const isStaticPreview = useContext(StaticPreviewContext);
    const mode = useStorylineActivity();

    const shouldLoad = useOnScreen(ref, {rootMargin: '200% 0px 200% 0px'});
    const shouldPrepare = useOnScreen(ref, {rootMargin: '25% 0px 25% 0px'}) && !isStaticPreview;

    // Sections that enter with fade transition only become visible
    // once they reach the center of the viewport. We want to reflect
    // that in `isVisible`/`onVisible` to prevent background videos
    // from starting too soon. Since fade section might still exit
    // with a scroll transition, we want to keep `isVisible` true
    // until the section has completely left the viewport. We do not
    // care about when exactly a background video pauses.
    //
    // Note that with fade transitions sections actually stay visible
    // a bit longer while they are still fading out. This is handled
    // by `isVisibleWithDelay` below.
    const shouldBeVisible = useOnScreen(ref, {
      rootMargin: entersWithFadeTransition ?
                  '0px 0px -50% 0px' :
                  undefined
    }) && !isStaticPreview;

    const shouldBeActive = useOnScreen(isActiveProbeRef, {
      rootMargin: '-50% 0px -50% 0px',
      onIntersecting: onActivate
    }) && !isStaticPreview;

    // useDelayedBoolean causes an extra render once the delay has
    // elapsed. When entersWithFadeTransition is false,
    // isVisibleWithDelay is never used, though. Since hooks can not
    // be wrapped in conditionals, we ensure that the value passed to
    // useDelayedBoolean is always false if entersWithFadeTransition
    // is false. This prevents the extra render.
    const isVisibleWithDelay = useDelayedBoolean(
      shouldBeVisible && entersWithFadeTransition,
      {fromTrueToFalse: 1000}
    );

    const isVisible = entersWithFadeTransition ? isVisibleWithDelay : shouldBeVisible;
    // Elements in covered storylines are not visible.
    // Elements in background storylines are visible (but not active).
    // Elements in active storylines are both visible and active.
    const isVisibleFinal = isVisible && mode !== 'covered';
    const inForeground = mode === 'active';

    // We want to make sure that `onActivate` is never called before
    // `onVisible`, no matter in which order the intersection
    // observers above fire.
    const isActive = isVisibleFinal && shouldBeActive && inForeground;

    const value = useMemo(() => ({
      shouldLoad, shouldPrepare, isVisible: isVisibleFinal, isActive, inForeground}
    ), [shouldLoad, shouldPrepare, isVisibleFinal, isActive, inForeground]);

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
  return function useScrollPositionLifecycle({
    onActivate, onDeactivate, onVisible, onInvisible, onEnterBackground, onEnterForeground} = {
  }) {
    const result = useContext(Context);

    const wasActive = useRef();
    const wasVisible = useRef();
    const wasForeground = useRef();

    const {isActive, isVisible, inForeground} = result || {};

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

      if (wasForeground.current && !inForeground && onEnterBackground) {
        onEnterBackground();
      }
      else if (!wasForeground.current && inForeground && onEnterForeground) {
        onEnterForeground();
      }

      if (wasVisible.current && !isVisible && onInvisible) {
        onInvisible();
      }

      wasActive.current = isActive;
      wasVisible.current = isVisible;
      wasForeground.current = inForeground;
    });

    return result;
  };
}
