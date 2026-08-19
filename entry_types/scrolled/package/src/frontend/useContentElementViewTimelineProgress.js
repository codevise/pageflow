import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

import {api} from './api';
import {getViewTimelineProgress} from './viewTimelineRanges';

export const ContentElementViewTimelineContext = createContext();

// Lets components that pin content elements in the viewport for part
// of their scroll space pass a function returning the pinned element
// and the subject that keeps moving with the page. Pinned content
// elements would otherwise stop making progress along their view
// timeline for exactly the part of the page that the extra scroll
// space was added for.
//
// Passing a function instead of refs lets components resolve elements
// they do not render themselves: Sticky boxes in TwoColumn walk up the
// DOM to find their group.
const ViewTimelinePinContext = createContext();

export function ViewTimelinePinProvider({getPinnedElements, children}) {
  return (
    <ViewTimelinePinContext.Provider value={getPinnedElements}
                                     children={children} />
  );
}

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
  const getPinnedElements = useContext(ViewTimelinePinContext);
  const ownElementRef = useRef();

  const subscriptionsRef = useRef(new Set());

  // Content element types can support view timelines without always
  // observing scroll position. Only listen while there are
  // subscriptions to prevent each of them from adding a handler.
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  const getElements = useCallback(
    () => getPinnedElements ?
          getPinnedElements() :
          {subject: ownElementRef.current, element: ownElementRef.current},
    [getPinnedElements]
  );

  const viewTimeline = useMemo(() => ({
    subscribe(range, callback) {
      const subscription = {range, callback};

      subscriptionsRef.current.add(subscription);
      setHasSubscriptions(true);
      update(getElements(), [subscription]);

      return () => {
        subscriptionsRef.current.delete(subscription);
        setHasSubscriptions(subscriptionsRef.current.size > 0);
      };
    }
  }), [getElements]);

  useEffect(() => {
    if (!hasSubscriptions) {
      return;
    }

    const subscriptions = subscriptionsRef.current;

    let animationFrame;

    function handle() {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        update(getElements(), subscriptions);
      });
    }

    window.addEventListener('scroll', handle);
    window.addEventListener('resize', handle);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [getElements, hasSubscriptions]);

  const content = (
    <ContentElementViewTimelineContext.Provider value={viewTimeline}>
      {children}
    </ContentElementViewTimelineContext.Provider>
  );

  if (getPinnedElements) {
    return content;
  }

  return (
    <div ref={ownElementRef}>
      {content}
    </div>
  );
}

function update({subject, element}, subscriptions) {
  const subjectRect = subject.getBoundingClientRect();
  const elementRect = element === subject ? subjectRect : element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  subscriptions.forEach(subscription => {
    const progress = getViewTimelineProgress({
      range: subscription.range,
      subjectRect,
      elementRect,
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
 *   * `center`: While the content element intersects the vertical
 *     center of the viewport, i.e. from its top edge passing the
 *     center until its bottom edge does.
 *
 *   * `pinned`: While the content element stays pinned in the
 *     viewport, i.e. from the moment it reaches the position it is
 *     pinned at until it starts moving with the page again. Progress
 *     stays 1 for content elements that are not pinned at all.
 *
 *   * `inFocus`: While the content element holds the reader's
 *     attention: `pinned` for content elements that are pinned in the
 *     viewport, `center` for all others.
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
