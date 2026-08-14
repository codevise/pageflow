import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';

import {api} from './api';
import {getViewTimelineProgress} from './viewTimelineRanges';

export const ContentElementViewTimelineContext = createContext();

export function ContentElementViewTimelineProvider({type, children}) {
  const {viewTimeline} = api.contentElementTypes.getOptions(type);

  if (viewTimeline) {
    return (
      <ViewTimelineProvider>
        {children}
      </ViewTimelineProvider>
    );
  }
  else {
    return children;
  }
}

function ViewTimelineProvider({children}) {
  const subjectRef = useRef();
  const subscriptionsRef = useRef(new Set());

  // Content element types can support view timelines without always
  // observing scroll position. Only listen while there are
  // subscriptions to prevent each of them from adding a handler.
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  const viewTimeline = useMemo(() => ({
    subscribe(range, callback) {
      const subscription = {range, callback};

      subscriptionsRef.current.add(subscription);
      setHasSubscriptions(true);
      update(subjectRef.current, [subscription]);

      return () => {
        subscriptionsRef.current.delete(subscription);
        setHasSubscriptions(subscriptionsRef.current.size > 0);
      };
    }
  }), []);

  useEffect(() => {
    if (!hasSubscriptions) {
      return;
    }

    const subject = subjectRef.current;
    const subscriptions = subscriptionsRef.current;

    let animationFrame;

    function handle() {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        update(subject, subscriptions);
      });
    }

    window.addEventListener('scroll', handle);
    window.addEventListener('resize', handle);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [hasSubscriptions]);

  return (
    <div ref={subjectRef}>
      <ContentElementViewTimelineContext.Provider value={viewTimeline}>
        {children}
      </ContentElementViewTimelineContext.Provider>
    </div>
  );
}

function update(subject, subscriptions) {
  const rect = subject.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  subscriptions.forEach(subscription => {
    const progress = getViewTimelineProgress({
      range: subscription.range,
      rect,
      viewportHeight
    });

    if (progress !== subscription.lastProgress) {
      subscription.lastProgress = progress;
      subscription.callback(progress);
    }
  });
}

/**
 * Invokes a callback with the progress of the content element along a
 * range of its view timeline. Mirrors the concepts of CSS scroll
 * driven animations: The content element acts as the subject of a
 * view timeline of the page's scroll container. Requires the
 * `viewTimeline` option to be set to true in the
 * `frontend.contentElementTypes.register` call for the content
 * element's type.
 *
 * Progress is passed to a callback instead of being returned to
 * prevent rerendering the content element on every scroll frame.
 *
 * @param {Object} options
 *
 * @param {string} [options.range='cover'] -
 *   Which part of the content element's view timeline to measure:
 *
 *   * `cover`: From the moment the content element starts entering
 *     the viewport until it has completely left it.
 *
 *   * `contain`: While the content element is completely inside the
 *     viewport. For content elements taller than the viewport, while
 *     the content element completely covers the viewport.
 *
 *   * `entry`: While the content element is entering the viewport.
 *
 *   * `exit`: While the content element is leaving the viewport.
 *
 * @param {Function} [options.onProgress] -
 *   Invoked with a number between 0 and 1 whenever progress along the
 *   range changes. Pass a falsy value to not observe scroll position
 *   at all.
 *
 * @example
 *
 * useContentElementViewTimelineProgress({
 *   range: 'cover',
 *   onProgress: progress => player.seekTo(progress)
 * });
 */
export function useContentElementViewTimelineProgress({range = 'cover', onProgress} = {}) {
  const viewTimeline = useContext(ContentElementViewTimelineContext);

  const onProgressRef = useRef();
  onProgressRef.current = onProgress;

  const enabled = !!onProgress;

  useEffect(() => {
    if (viewTimeline && enabled) {
      return viewTimeline.subscribe(range, progress => onProgressRef.current(progress));
    }
  }, [viewTimeline, range, enabled]);

  if (!viewTimeline) {
    throw new Error('useContentElementViewTimelineProgress is only available in ' +
                    'content elements for which `viewTimeline: true` has ' +
                    'been passed to frontend.contentElementTypes.register');
  }
}
