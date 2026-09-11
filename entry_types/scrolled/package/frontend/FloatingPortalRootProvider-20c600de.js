import React, { createContext, useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { u as useDelayedBoolean } from './useDelayedBoolean-a387d85b.js';
import BackboneEvents from 'backbone-events-standalone';
import { useTheme, useEntryStructure, useEmbedOriginUrl, useChapter, useDownloadableFile } from 'pageflow-scrolled/entryState';
import Measure from 'react-measure';

const OnScreenObserverRootContext = createContext();
const OnScreenObserverRootProvider = OnScreenObserverRootContext.Provider;
function useOnScreen(ref, {
  rootMargin,
  onIntersecting,
  onChange,
  skipIframeFix
} = {}) {
  var _useContext;
  const [isIntersecting, setIntersecting] = useState(false);
  const onIntersectingRef = useRef();
  const onChangeRef = useRef();
  const root = (_useContext = useContext(OnScreenObserverRootContext)) === null || _useContext === void 0 ? void 0 : _useContext.current;
  useEffect(() => {
    onIntersectingRef.current = onIntersecting;
  }, [onIntersecting]);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const current = ref.current;
    const observer = createIntersectionObserver(entries => {
      // Even when observing only a single element, multiple entries
      // may have queued up. In Chrome this can be observed when
      // moving an observed element in the DOM: The callback is
      // invoked once with two entries for the same target, one
      // claiming the element no longer intersects and one - with a
      // later timestamp - saying that is does intersect. Assuming
      // entries are ordered according to time, we only consider the
      // last entry.
      const entry = entries[entries.length - 1];
      setIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && onIntersectingRef.current) {
        onIntersectingRef.current();
      }
      if (onChangeRef.current) {
        onChangeRef.current(entry.isIntersecting);
      }
    }, {
      rootMargin,
      root
    }, skipIframeFix);
    if (ref.current) {
      observer.observe(current);
    }
    return () => {
      observer.unobserve(current);
    };
  }, [ref, rootMargin, root, skipIframeFix]);
  return isIntersecting;
}
function createIntersectionObserver(callback, options, skipIframeFix) {
  if (skipIframeFix || options.root) {
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
    return new IntersectionObserver(callback, optionsWithIframeFix);
  } catch (e) {
    // Normally we would check for TypeError here. Since the polyfill
    // throws a generic error, we retry either way and trust that the
    // error will happen again if it is not related to the `root`
    // option.
    return createIntersectionObserver(callback, options, true);
  }
}

const StorylineActivityContext = createContext('active');
const MainStorylineCoverageContext = createContext({
  mainStorylineCovered: false,
  setMainStorylineCovered: () => {}
});
function MainStorylineActivity({
  activeExcursion,
  children
}) {
  const {
    mainStorylineCovered
  } = useContext(MainStorylineCoverageContext);
  const mode = activeExcursion ? mainStorylineCovered ? 'covered' : 'background' : 'active';
  return /*#__PURE__*/React.createElement(StorylineActivityContext.Provider, {
    value: mode
  }, children);
}
function MainStorylineCoverageProvider({
  children
}) {
  const [mainStorylineCovered, setMainStorylineCovered] = useState(false);
  const value = useMemo(() => ({
    mainStorylineCovered,
    setMainStorylineCovered
  }), [mainStorylineCovered]);
  return /*#__PURE__*/React.createElement(MainStorylineCoverageContext.Provider, {
    value: value
  }, children);
}
function useStorylineActivity() {
  return useContext(StorylineActivityContext);
}
function useMainStorylineCoverage() {
  return useContext(MainStorylineCoverageContext);
}

var styles = {"wrapper":"useScrollPositionLifecycle-module_wrapper__1a6Kr","isActiveProbe":"useScrollPositionLifecycle-module_isActiveProbe__3VKB5"};

const StaticPreviewContext = createContext(false);
function StaticPreview({
  children
}) {
  return /*#__PURE__*/React.createElement(StaticPreviewContext.Provider, {
    value: true
  }, children);
}

/**
 * Use inside a content element component to determine whether the
 * component is being rendered in a static preview, e.g. editor
 * thumbnails.
 *
 * @example
 * const isStaticPreview = useIsStaticPreview();
 */
function useIsStaticPreview() {
  return useContext(StaticPreviewContext);
}
function createScrollPositionLifecycleProvider(Context) {
  return function ScrollPositionLifecycleProvider({
    children,
    onActivate,
    entersWithFadeTransition
  }) {
    const ref = useRef();
    const isActiveProbeRef = useRef();
    const isStaticPreview = useContext(StaticPreviewContext);
    const mode = useStorylineActivity();
    const shouldLoad = useOnScreen(ref, {
      rootMargin: '200% 0px 200% 0px'
    });
    const shouldPrepare = useOnScreen(ref, {
      rootMargin: '25% 0px 25% 0px'
    }) && !isStaticPreview;

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
      rootMargin: entersWithFadeTransition ? '0px 0px -50% 0px' : undefined
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
    const isVisibleWithDelay = useDelayedBoolean(shouldBeVisible && entersWithFadeTransition, {
      fromTrueToFalse: 1000
    });
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
      shouldLoad,
      shouldPrepare,
      isVisible: isVisibleFinal,
      isActive,
      inForeground
    }), [shouldLoad, shouldPrepare, isVisibleFinal, isActive, inForeground]);
    return /*#__PURE__*/React.createElement("div", {
      ref: ref,
      className: classNames(styles.wrapper)
    }, /*#__PURE__*/React.createElement("div", {
      ref: isActiveProbeRef,
      className: styles.isActiveProbe
    }), /*#__PURE__*/React.createElement(Context.Provider, {
      value: value
    }, children));
  };
}
function createScrollPositionLifecycleHook(Context) {
  return function useScrollPositionLifecycle({
    onActivate,
    onDeactivate,
    onVisible,
    onInvisible,
    onEnterBackground,
    onEnterForeground
  } = {}) {
    const result = useContext(Context);
    const wasActive = useRef();
    const wasVisible = useRef();
    const wasForeground = useRef();
    const {
      isActive,
      isVisible,
      inForeground
    } = result || {};
    useEffect(() => {
      if (!wasVisible.current && isVisible && onVisible) {
        onVisible();
      }
      if (!wasActive.current && isActive && onActivate) {
        onActivate();
      } else if (wasActive.current && !isActive && onDeactivate) {
        onDeactivate();
      }
      if (wasForeground.current && !inForeground && onEnterBackground) {
        onEnterBackground();
      } else if (!wasForeground.current && inForeground && onEnterForeground) {
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

function extensible(name, Component) {
  return function ExtensibleComponent(props) {
    const isStaticPreview = useIsStaticPreview();
    const extensions = useExtensions();
    if (isStaticPreview) {
      return /*#__PURE__*/React.createElement(Component, props);
    }
    const Alternative = extensions.alternatives[name];
    if (Alternative) {
      return /*#__PURE__*/React.createElement(Alternative, props);
    }
    const Decorator = extensions.decorators[name];
    if (Decorator) {
      return /*#__PURE__*/React.createElement(Decorator, props, /*#__PURE__*/React.createElement(Component, props));
    }
    return /*#__PURE__*/React.createElement(Component, props);
  };
}
function provideExtensions({
  decorators: d,
  alternatives: a
} = {}) {
  decorators = d || {};
  alternatives = a || {};
  notifyListeners();
}
function ExtensionsProvider({
  children
}) {
  const [version, setVersion] = useState(0);
  useEffect(() => subscribe(() => setVersion(v => v + 1)), []);
  return /*#__PURE__*/React.createElement(ExtensionsContext.Provider, {
    value: version
  }, children);
}
let decorators = {};
let alternatives = {};
let listeners = [];
const ExtensionsContext = createContext(0);
function useExtensions() {
  useContext(ExtensionsContext);
  return {
    decorators,
    alternatives
  };
}
function subscribe(listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}
function notifyListeners() {
  listeners.forEach(l => l());
}

/**
 * Register new types of content elements.
 * @name frontend_contentElementTypes
 */
class ContentElementTypeRegistry {
  constructor() {
    this.types = {};
  }

  /**
   * Register a new type of content element.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {React.Component} options.component
   * @param {boolean} [options.supportsWrappingAroundFloats] -
   *   In sections with centered layout, content elements can be
   *   floated to the left or right. By default all content
   *   elements are cleared to position them below floating
   *   elements. If a content element renders mainly text that
   *   can wrap around floating elements, clearing can be
   *   disabled via this option.
   * @memberof frontend_contentElementTypes
   *
   * @example
   *
   * // frontend.js
   *
   * import {frontend} from 'pageflow-scrolled/frontend';
   * import {InlineImage} from './InlineImage';
   *
   * frontend.contentElementTypes.register('inlineImage', {
   *   component: InlineImage
   * });
   */
  register(typeName, options) {
    this.types[typeName] = options;
  }
  getComponent(typeName) {
    return this.types[typeName] && this.types[typeName].component;
  }
  getOptions(typeName) {
    return this.types[typeName];
  }
  consentVendors({
    contentElements,
    t
  }) {
    const vendorsByName = {};
    contentElements.forEach(contentElement => {
      const type = this.types[contentElement.typeName];
      const consentVendors = typeof type.consentVendors === 'function' ? type.consentVendors({
        configuration: contentElement.configuration,
        t
      }) : type.consentVendors || [];
      consentVendors.forEach(vendor => {
        vendorsByName[vendor.name] = vendor;
      });
    });
    return Object.values(vendorsByName);
  }
}

/**
 * Register new types of widgets.
 * @name frontend_widgetTypes
 */
class WidgetTypeRegistry {
  constructor() {
    this.types = {};
  }

  /**
   * Register a new type of widget.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {React.Component} options.component
   * @memberof frontend_widgetTypes
   *
   * @example
   *
   * // frontend.js
   *
   * import {frontend} from 'pageflow-scrolled/frontend';
   * import {CustomNavigationBar} from './CustomNavigationBar';
   *
   * frontend.contentElementTypes.register('customNavigationBar', {
   *   component: CustomNavigationBar
   * });
   */
  register(typeName, options) {
    if (!options.component) {
      throw new Error(`Missing required component option for widget type '${typeName}'.`);
    }
    this.types[typeName] = options;
  }
  getComponent(typeName) {
    if (!this.types[typeName]) {
      throw new Error(`Unknown widget type '${typeName}'. Consider calling frontent.widgetTypes.register.`);
    }
    return this.types[typeName].component;
  }
  getPresenceProvider(typeName) {
    var _this$types$typeName;
    return (_this$types$typeName = this.types[typeName]) === null || _this$types$typeName === void 0 ? void 0 : _this$types$typeName.presenceProvider;
  }
}

const api = {
  contentElementTypes: new ContentElementTypeRegistry(),
  widgetTypes: new WidgetTypeRegistry(),
  /**
   * Custom error boundary component to wrap content elements.
   * Allows integration with error monitoring tools. The component receives
   * typeName (string), configuration (object), fallback (function returning
   * default UI), and children (content element).
   *
   * @name frontend_contentElementErrorBoundary
   * @type {React.Component}
   */
  contentElementErrorBoundary: undefined
};

const ContentElementAttributesContext = createContext({});
function ContentElementAttributesProvider({
  id,
  permaId,
  width,
  position,
  inlineComments,
  children
}) {
  const attributes = useMemo(() => ({
    contentElementId: id,
    contentElementPermaId: permaId,
    width,
    position,
    inlineComments
  }), [id, permaId, width, position, inlineComments]);
  return /*#__PURE__*/React.createElement(ContentElementAttributesContext.Provider, {
    value: attributes
  }, children);
}
function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}

const ContentElementLifecycleContext = createContext();
const LifecycleProvider = createScrollPositionLifecycleProvider(ContentElementLifecycleContext);
const useLifecycle = createScrollPositionLifecycleHook(ContentElementLifecycleContext);
function ContentElementLifecycleProvider({
  type,
  children,
  override
}) {
  const {
    lifecycle
  } = api.contentElementTypes.getOptions(type);
  if (override) {
    return /*#__PURE__*/React.createElement(ContentElementLifecycleContext.Provider, {
      value: override,
      children: children
    });
  } else if (lifecycle) {
    return /*#__PURE__*/React.createElement(LifecycleProvider, null, children);
  } else {
    return children;
  }
}

/**
 * Returns an object containing information about the scroll position
 * related lifecylce of the content element. Requires the `lifecycle`
 * option to be set to true in the `frontend.contentElements.register`
 * call for the content element's type.
 *
 * * `shouldLoad` is true if the content element should start lazy
 *   load. Becomes true before `shouldPrepare`.
 *
 * * `shouldPrepare` is true if the content element is about to enter
 *   the viewport.
 *
 * * `isActive` is true if the content element is completely in the
 *   viewport.
 *
 * @param {Function} onActivate -
 *   Invoked when content element has entered the viewport.
 *
 * @param {Function} onDeactivate -
 *   Invoked when content element has left the viewport.
 *
 * @example
 *
 * const {isActive, shouldPrepare} = useContentElementLifecycle();
 */
function useContentElementLifecycle(options) {
  const result = useLifecycle(options);
  if (!result) {
    throw new Error('useContentElementLifecycle is only available in ' + 'content elements for which `lifecycle: true` has ' + 'been passed to frontend.contentElements.register');
  }
  return result;
}

// Offsets of the subject's top edge relative to the viewport's top
// edge at the milestones of a content element's view timeline.
//
// Elements that are pinned in the viewport for part of their scroll
// space are measured along a taller subject: They move with the
// subject's top edge until they are pinned and continue with the
// subject's bottom edge once they have been.
const milestones = {
  firstVisible: ({
    viewportHeight
  }) => viewportHeight,
  firstContained: ({
    viewportHeight,
    elementHeight
  }) => viewportHeight - elementHeight,
  reachesCenter: ({
    viewportHeight
  }) => viewportHeight / 2,
  leavesCenter: ({
    subjectHeight,
    viewportHeight
  }) => viewportHeight / 2 - subjectHeight,
  lastContained: ({
    subjectHeight,
    elementHeight
  }) => elementHeight - subjectHeight,
  lastVisible: ({
    subjectHeight
  }) => -subjectHeight,
  // The pinned position is only known while the element actually is
  // pinned. That is exactly when progress along the pinned range is
  // between 0 and 1, though: Before, the element's top edge coincides
  // with the subject's, after, its bottom edge does. Both edges of the
  // range therefore come out equally far off in those phases, which
  // makes progress clamp to 0 respectively 1.
  reachesPinnedPosition: ({
    elementTop
  }) => elementTop,
  leavesPinnedPosition: ({
    elementTop,
    subjectHeight,
    elementHeight
  }) => elementTop - subjectHeight + elementHeight
};
const ranges = {
  // Mirror the named ranges of CSS scroll driven animations.
  cover: ['firstVisible', 'lastVisible'],
  contain: ['firstContained', 'lastContained'],
  entry: ['firstVisible', 'firstContained'],
  exit: ['lastContained', 'lastVisible'],
  // Same part of the page during which content elements become active
  // and autoplayed videos play.
  center: ['reachesCenter', 'leavesCenter'],
  // Only elements that components like TwoColumn or
  // ContentElementScrollSpace pin in the viewport have a pinned phase.
  pinned: ['reachesPinnedPosition', 'leavesPinnedPosition']
};
const rangeAliases = {
  // Elements that are pinned in the viewport hold the reader's
  // attention while they stay in place. Elements that are not pinned
  // at all do so while they pass the center of the viewport.
  inFocus: hasPinnedPhase => hasPinnedPhase ? 'pinned' : 'center'
};
function getViewTimelineProgress({
  range,
  subjectRect,
  elementRect,
  viewportHeight
}) {
  const hasPinnedPhase = subjectRect.height > elementRect.height;
  const alias = rangeAliases[range];
  const milestoneNames = ranges[alias ? alias(hasPinnedPhase) : range];
  if (!milestoneNames) {
    const supportedRanges = [...Object.keys(ranges), ...Object.keys(rangeAliases)];
    throw new Error(`Unknown view timeline range '${range}'. ` + `Supported ranges: ${supportedRanges.join(', ')}.`);
  }

  // Without enough content next to it, a pinned element never reaches
  // its pinned position and keeps moving with the page. Its own rect
  // then is the subject covering the same range of the page.
  const subject = hasPinnedPhase ? subjectRect : elementRect;
  const [start, end] = orderEdges(milestoneNames.map(name => milestones[name]({
    subjectHeight: subject.height,
    elementTop: elementRect.top,
    elementHeight: elementRect.height,
    viewportHeight
  })));
  if (start === end) {
    return subject.top <= start ? 1 : 0;
  }
  return clamp((start - subject.top) / (start - end));
}

// Milestones come out in reverse order for elements taller than the
// viewport: Such elements cover the viewport instead of being
// contained in it, so they stop being contained before they start
// being contained.
function orderEdges([start, end]) {
  return start < end ? [end, start] : [start, end];
}
function clamp(value) {
  return Math.min(Math.max(value, 0), 1);
}

const ContentElementViewTimelineContext = createContext();

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
function ViewTimelinePinProvider({
  getPinnedElements,
  children
}) {
  return /*#__PURE__*/React.createElement(ViewTimelinePinContext.Provider, {
    value: getPinnedElements,
    children: children
  });
}
function ContentElementViewTimelineProvider({
  type,
  children
}) {
  const {
    viewTimeline
  } = api.contentElementTypes.getOptions(type);
  if (viewTimeline) {
    return /*#__PURE__*/React.createElement(ViewTimelineProvider, null, children);
  } else {
    return children;
  }
}
function ViewTimelineProvider({
  children
}) {
  const getPinnedElements = useContext(ViewTimelinePinContext);
  const ownElementRef = useRef();
  const subscriptionsRef = useRef(new Set());

  // Content element types can support view timelines without always
  // observing scroll position. Only listen while there are
  // subscriptions to prevent each of them from adding a handler.
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const getElements = useCallback(() => getPinnedElements ? getPinnedElements() : {
    subject: ownElementRef.current,
    element: ownElementRef.current
  }, [getPinnedElements]);
  const viewTimeline = useMemo(() => ({
    subscribe(range, callback) {
      const subscription = {
        range,
        callback
      };
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
  const content = /*#__PURE__*/React.createElement(ContentElementViewTimelineContext.Provider, {
    value: viewTimeline
  }, children);
  if (getPinnedElements) {
    return content;
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ownElementRef
  }, content);
}
function update({
  subject,
  element
}, subscriptions) {
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
function useContentElementViewTimelineProgress({
  range = 'cover',
  onProgress
} = {}) {
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
    throw new Error('useContentElementViewTimelineProgress is only available in ' + 'content elements for which `viewTimeline: true` has ' + 'been passed to frontend.contentElementTypes.register');
  }
}

const widths = {
  xxs: -3,
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  full: 3
};
function widthName(width) {
  return Object.keys(widths)[(width || 0) + 3];
}

const TrimDefaultMarginTopContext = createContext(false);
const TrimDefaultMarginTop = TrimDefaultMarginTopContext.Provider;
function useTrimDefaultMarginTop() {
  return useContext(TrimDefaultMarginTopContext);
}

var styles$1 = {"wrapper":"ContentElementMargin-module_wrapper__20kIk","noTopMargin":"ContentElementMargin-module_noTopMargin__mB7t3"};

function ContentElementMargin({
  width,
  first,
  defaultMarginTop,
  top,
  bottom,
  previousBottom,
  children
}) {
  const trimDefaultMarginTop = useTrimDefaultMarginTop();
  if (width === widths.full) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, {
      [styles$1.noTopMargin]: trimDefaultMarginTop && first && !top
    }),
    style: {
      '--margin-top': scaleProperty(top) || defaultMarginTop,
      '--margin-bottom': scaleProperty(bottom),
      '--prev-margin-bottom': scaleProperty(previousBottom)
    }
  }, children);
}
function scaleProperty(value) {
  return value && `var(--theme-content-element-margin-${value})`;
}

var styles$2 = {"missing":"ContentElement-module_missing__2_1j9"};

function ContentElementErrorBoundary({
  typeName,
  configuration,
  children
}) {
  const ErrorBoundary = api.contentElementErrorBoundary || DefaultErrorBoundary;
  const fallback = () => /*#__PURE__*/React.createElement(DefaultFallback, {
    type: typeName
  });
  return /*#__PURE__*/React.createElement(ErrorBoundary, {
    typeName: typeName,
    configuration: configuration,
    fallback: fallback
  }, children);
}
class DefaultErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback();
    }
    return this.props.children;
  }
}
function DefaultFallback({
  type
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$2.missing
  }, "Error rendering element of type \"", type, "\"");
}

const ContentElement = React.memo(extensible('ContentElement', function ContentElement(props) {
  const Component = api.contentElementTypes.getComponent(props.type);
  const {
    defaultMarginTop,
    inlineComments
  } = api.contentElementTypes.getOptions(props.type) || {};
  if (Component) {
    return /*#__PURE__*/React.createElement(ContentElementAttributesProvider, {
      id: props.id,
      permaId: props.permaId,
      width: props.width,
      position: props.position,
      inlineComments: inlineComments
    }, /*#__PURE__*/React.createElement(ContentElementLifecycleProvider, {
      type: props.type,
      override: props.lifecycleOverride
    }, /*#__PURE__*/React.createElement(ContentElementMargin, {
      width: props.width,
      first: props.first,
      defaultMarginTop: defaultMarginTop,
      top: props.itemProps.marginTop,
      bottom: props.marginBottom,
      previousBottom: props.previousMarginBottom
    }, /*#__PURE__*/React.createElement(ContentElementViewTimelineProvider, {
      type: props.type
    }, /*#__PURE__*/React.createElement(ContentElementErrorBoundary, {
      typeName: props.type,
      configuration: props.itemProps
    }, /*#__PURE__*/React.createElement(Component, {
      sectionProps: props.sectionProps,
      customMargin: props.customMargin,
      configuration: props.itemProps,
      contentElementWidth: props.width,
      contentElementId: props.id
    }))))));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$2.missing
    }, "Element of unknown type \"", props.type, "\"");
  }
}), arePropsEqual);
function arePropsEqual(prevProps, nextProps) {
  return prevProps.id === nextProps.id && prevProps.permaId === nextProps.permaId && prevProps.type === nextProps.type && prevProps.first === nextProps.first && prevProps.position === nextProps.position && prevProps.width === nextProps.width && prevProps.itemProps === nextProps.itemProps && prevProps.marginBottom === nextProps.marginBottom && prevProps.previousMarginBottom === nextProps.previousMarginBottom && prevProps.customMargin === nextProps.customMargin && prevProps.sectionProps === nextProps.sectionProps && prevProps.lifecycleOverride === nextProps.lifecycleOverride;
}
ContentElement.defaultProps = {
  itemProps: {}
};

var styles$3 = {"wrapper":"ContentElementScrollSpace-module_wrapper__2ZBwZ","inner":"ContentElementScrollSpace-module_inner__1FBgh"};

function ContentElementScrollSpace({
  children
}) {
  const ref = useRef();
  const innerRef = useRef();
  const getPinnedElements = useCallback(() => ({
    subject: ref.current,
    element: innerRef.current
  }), []);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$3.wrapper,
    ref: ref
  }, /*#__PURE__*/React.createElement(ViewTimelinePinProvider, {
    getPinnedElements: getPinnedElements
  }, /*#__PURE__*/React.createElement(Measure, {
    bounds: true,
    innerRef: innerRef
  }, ({
    measureRef,
    contentRect
  }) => /*#__PURE__*/React.createElement("div", {
    ref: measureRef,
    className: styles$3.inner,
    style: {
      '--height': contentRect.bounds.height / 2
    }
  }, children))));
}

function ContentElements(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.items.map((item, index) => props.children(item, renderScrollSpace(item, /*#__PURE__*/React.createElement(ContentElement, {
    key: item.id,
    id: item.id,
    permaId: item.permaId,
    type: item.type,
    first: index === 0,
    position: item.position,
    width: item.width,
    itemProps: item.props,
    marginBottom: item.marginBottom,
    previousMarginBottom: item.previousMarginBottom,
    customMargin: props.customMargin,
    sectionProps: props.sectionProps
  })), index)));
}
ContentElements.defaultProps = {
  children: (item, child) => child
};
function renderScrollSpace(item, children) {
  if (!item.standAlone) {
    return children;
  }
  return /*#__PURE__*/React.createElement(ContentElementScrollSpace, {
    key: item.id,
    children: children
  });
}

function useMediaQuery(query, {
  active
} = {
  active: true
}) {
  const [doesMatch, setDoesMatch] = useState(false);
  useEffect(() => {
    if (!active) {
      return;
    }
    const onUpdateMatch = ({
      matches
    }) => {
      setDoesMatch(matches);
    };
    const matcher = window.matchMedia(query);
    matcher.addEventListener('change', onUpdateMatch);
    onUpdateMatch(matcher);
    return () => {
      matcher.removeEventListener('change', onUpdateMatch);
    };
  }, [query, setDoesMatch, active]);
  return active && doesMatch;
}

var styles$4 = {"root":"TwoColumn-module_root__37EqL","group":"TwoColumn-module_group__3Hg2y","group-full":"TwoColumn-module_group-full__2OT4o","box":"TwoColumn-module_box__1Nils","inline":"TwoColumn-module_inline__1fPfM","width-lg":"TwoColumn-module_width-lg__2MD35","width-xl":"TwoColumn-module_width-xl__3Bxet","width-full":"TwoColumn-module_width-full__1QWYO","constrainContentWidth":"TwoColumn-module_constrainContentWidth__1cxa-","group-lg":"TwoColumn-module_group-lg__xgaPx","restrict-xxs":"TwoColumn-module_restrict-xxs__6il-H","restrict-xs":"TwoColumn-module_restrict-xs__AOezq","restrict-sm":"TwoColumn-module_restrict-sm__2rKty","align-left":"TwoColumn-module_align-left__QSe2G","align-right":"TwoColumn-module_align-right__3Dn4i","customMargin":"TwoColumn-module_customMargin__o0uxH","right":"TwoColumn-module_right__Fr52a","side":"TwoColumn-module_side__2xx0s","sticky":"TwoColumn-module_sticky__4LCDO TwoColumn-module_side__2xx0s"};

function TwoColumn(props) {
  const shouldInline = useShouldInlineSticky();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4.root, styles$4[props.align], {
      [styles$4.constrainContentWidth]: props.constrainContentWidth
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4.group),
    key: props.align
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    className: classNames(styles$4.box, styles$4.inline),
    ref: props.contentAreaRef
  }, TwoColumn.contentAreaProbeProps))), renderItems(props, shouldInline), renderPlaceholder(props.placeholder));
}
TwoColumn.defaultProps = {
  align: 'left'
};
function useShouldInlineSticky() {
  var _theme$options$proper;
  const theme = useTheme();
  const root = ((_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : _theme$options$proper.root) || {};
  const shouldInline = {
    [widths.md]: useMediaQuery(`(max-width: ${root.twoColumnStickyBreakpoint || '950px'})`),
    [widths.lg]: useMediaQuery(`(max-width: ${root.twoColumnStickyLgBreakpoint || '1200px'})`),
    [widths.xl]: useMediaQuery(`(max-width: ${root.twoColumnStickyXlBreakpoint || '1400px'})`)
  };
  return function (width) {
    return width <= widths.md ? shouldInline[widths.md] : shouldInline[width];
  };
}

// Used in tests to render markers around groups
TwoColumn.GroupComponent = 'div';

// Used to set data-testids on probe element
TwoColumn.contentAreaProbeProps = {};
function renderItems(props, shouldInline) {
  const groups = groupItemsByPosition(props.items, shouldInline, props.isContentPadded);
  return groups.map((group, groupIndex) => /*#__PURE__*/React.createElement(TwoColumn.GroupComponent, {
    key: groupIndex,
    className: classNames(styles$4.group, styles$4[`group-${widthName(group.width)}`])
  }, group.boxes.map((box, boxIndex) => renderItemGroup(props, box, boxIndex))));
}
function renderItemGroup(props, box, key) {
  if (box.items.length) {
    return /*#__PURE__*/React.createElement(Box, {
      key: key,
      box: box
    }, props.children( /*#__PURE__*/React.createElement(ContentElements, {
      sectionProps: props.sectionProps,
      customMargin: box.customMargin,
      items: box.items
    }, (item, child) => restrictWidth(item.effectiveWidth, item.effectiveAlignment, child)), {
      position: box.position,
      width: box.width,
      customMargin: box.customMargin,
      lastMarginBottom: box.items[box.items.length - 1].marginBottom,
      openStart: box.openStart,
      openEnd: box.openEnd,
      atSectionStart: box.atSectionStart,
      atSectionEnd: box.atSectionEnd
    }));
  }
}
function Box({
  box,
  children
}) {
  const ref = useRef();
  useStickyBoxHeight(ref, box.position === 'sticky');
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$4.box, styles$4[box.position], styles$4[`width-${widthName(box.width)}`], {
      [styles$4.customMargin]: box.customMargin
    })
  }, box.position === 'sticky' ? /*#__PURE__*/React.createElement(ViewTimelinePin, {
    boxRef: ref,
    children: children
  }) : children);
}
function useStickyBoxHeight(ref, sticky) {
  useEffect(() => {
    if (!sticky || typeof ResizeObserver === 'undefined') {
      return;
    }
    const box = ref.current;
    const observer = new ResizeObserver(entries => box.style.setProperty('--sticky-box-height', `${entries[entries.length - 1].contentRect.height}px`));
    observer.observe(box);
    return () => {
      observer.disconnect();
      box.style.removeProperty('--sticky-box-height');
    };
  }, [ref, sticky]);
}

// Sticky boxes stay pinned while the rest of their group scrolls past.
// The group therefore is the subject that drives view timelines of
// content elements inside the box.
function ViewTimelinePin({
  boxRef,
  children
}) {
  const getPinnedElements = useCallback(() => ({
    subject: boxRef.current.closest(`.${styles$4.group}`),
    element: boxRef.current
  }), [boxRef]);
  return /*#__PURE__*/React.createElement(ViewTimelinePinProvider, {
    getPinnedElements: getPinnedElements,
    children: children
  });
}
function restrictWidth(width, alignment, children) {
  if (width >= 0) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4[`restrict-${widthName(width)}`], styles$4[`align-${alignment}`])
  }, children);
}
function groupItemsByPosition(items, shouldInline, isContentPadded) {
  const groups = [];
  let currentGroup, currentBox;
  let firstInlineBox = null;
  let previousInlineBox = null;
  let previousInlineItem = null;
  let previousMarginBottom = null;
  items.reduce((previousPosition, item, index) => {
    var _item$props;
    let {
      customMargin: elementSupportsCustomMargin
    } = api.contentElementTypes.getOptions(item.type) || {};
    if (typeof elementSupportsCustomMargin === 'function') {
      elementSupportsCustomMargin = elementSupportsCustomMargin({
        configuration: item.props
      });
    }
    let width = item.width || 0;
    const position = onTheSide(item.position) && !shouldInline(width) ? item.position : 'inline';
    const customMargin = !!elementSupportsCustomMargin && width < widths.full;
    const alignment = item.position === 'inline' && width < 0 ? item.alignment : null;
    if (onTheSide(item.position) && position === 'inline' && width > widths.md) {
      width -= 1;
    }
    const boxWidth = position === 'inline' ? Math.max(width, widths.md) : width;
    if (!currentGroup || previousPosition !== position || onTheSide(position) && currentBox.customMargin !== customMargin || currentBox.width !== boxWidth) {
      currentBox = null;
      if (!(onTheSide(previousPosition) && position === 'inline' && width <= widths.md)) {
        currentGroup = {
          width: onTheSide(position) ? widths.md : boxWidth,
          boxes: []
        };
        groups.push(currentGroup);
      }
    }
    if (!currentBox || currentBox.customMargin !== customMargin) {
      currentBox = {
        customMargin,
        position,
        width: boxWidth,
        items: []
      };
      if (position === 'inline') {
        if (!continueInlineBoxes(previousInlineBox, currentBox)) {
          previousMarginBottom = null;
        }
        markFirstInlineBoxAsAtSectionStart(currentBox);
      }
      currentGroup.boxes.push(currentBox);
    }
    item = {
      ...item,
      effectiveWidth: width,
      effectiveAlignment: alignment,
      marginBottom: (_item$props = item.props) === null || _item$props === void 0 ? void 0 : _item$props.marginBottom
    };
    currentBox.items.push(item);
    if (position === 'inline') {
      assignPreviousMarginBottom(previousInlineItem, item);
      previousInlineItem = item;
      previousInlineBox = currentBox;
    }
    return position;
  }, null);
  if (currentBox) {
    currentBox.atSectionEnd = true;
  }
  return groups;
  function markFirstInlineBoxAsAtSectionStart(inlineBox) {
    if (!firstInlineBox) {
      inlineBox.atSectionStart = !isContentPadded;
      firstInlineBox = currentBox;
    }
  }
  function assignPreviousMarginBottom(previousInlineItem, item) {
    if (previousMarginBottom) {
      item.previousMarginBottom = previousMarginBottom;
      previousInlineItem.marginBottom = null;
      previousMarginBottom = null;
    }
    if (item.marginBottom) {
      previousMarginBottom = item.marginBottom;
    }
  }
}
function continueInlineBoxes(previousInlineBox, currentBox) {
  if (previousInlineBox && isContinuable(previousInlineBox) && isContinuable(currentBox)) {
    previousInlineBox.openEnd = true;
    currentBox.openStart = true;
    return true;
  }
  return false;
}
function isContinuable(box) {
  return box.width <= widths.md && !box.customMargin;
}
function onTheSide(position) {
  return position === 'side' || position === 'sticky';
}
function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4.group)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$4.box, styles$4.inline)
  }, placeholder));
}

var styles$5 = {"outer":"Center-module_outer__3Rr0H","customMargin":"Center-module_customMargin__1es3t","outer-full":"Center-module_outer-full__3dknO","box":"Center-module_box__3pZbI","box-lg":"Center-module_box-lg__3t3-e","box-xl":"Center-module_box-xl__1zdnc","box-full":"Center-module_box-full__1YKgB","constrainContentWidth":"Center-module_constrainContentWidth__3BThN","outer-lg":"Center-module_outer-lg__fEKHC","clear":"Center-module_clear__jJEap","selfClear-left":"Center-module_selfClear-left__39q7E","selfClear-right":"Center-module_selfClear-right__1T_fm","selfClear-both":"Center-module_selfClear-both__2WDEC","inner-xxs":"Center-module_inner-xxs__1oroz","inner-xs":"Center-module_inner-xs__3FRT8","inner-sm":"Center-module_inner-sm__-oQ0E","align-left":"Center-module_align-left__1rYBX","align-right":"Center-module_align-right__1uglq","inner-left":"Center-module_inner-left__2z9Ea","inner-right":"Center-module_inner-right__KBkVt","sideBySide":"Center-module_sideBySide__-YsP0","inner-md":"Center-module_inner-md__3dLC3","inner-lg":"Center-module_inner-lg__2GQbs","inner-xl":"Center-module_inner-xl__3dOME"};

const floatedPositions = ['left', 'right'];
function Center(props) {
  const groups = groupItems(props.items);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.root, {
      [styles$5.constrainContentWidth]: props.constrainContentWidth
    })
  }, /*#__PURE__*/React.createElement("div", {
    ref: props.contentAreaRef
  }), groups.map((group, groupIndex) => {
    return /*#__PURE__*/React.createElement("div", {
      key: groupIndex,
      className: classNames(styles$5.outer, styles$5[`outer-${widthName(group.width)}`], {
        [styles$5.customMargin]: group.customMargin
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$5.box, styles$5[`box-${widthName(group.width)}`])
    }, props.children( /*#__PURE__*/React.createElement(ContentElements, {
      sectionProps: props.sectionProps,
      items: group.items,
      customMargin: group.customMargin
    }, (item, child, itemIndex) => {
      const alignment = getWidth(item) < 0 && item.position === 'inline' ? item.alignment : null;
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        className: classNames(styles$5[`selfClear-${selfClear(group.items, itemIndex)}`])
      }, /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$5[`inner-${item.position}`], styles$5[`inner-${widthName(item.width)}`], styles$5[`align-${alignment}`], {
          [styles$5.clear]: clearItem(group.items, itemIndex)
        }, {
          [styles$5[`sideBySide`]]: sideBySideFloat(group.items, itemIndex)
        })
      }, child));
    }), boxProps(groups, groupIndex, props.isContentPadded))));
  }), renderPlaceholder$1(props.placeholder));
}
function groupItems(items) {
  const groups = [];
  let currentGroup;
  items.forEach(item => {
    var _item$props;
    const width = isFloated(item) ? widths.md : groupWidth(item);
    const customMargin = hasCustomMargin(item);
    if (!currentGroup || currentGroup.width !== width || currentGroup.customMargin !== customMargin) {
      currentGroup = {
        items: [],
        position: 'inline',
        width,
        customMargin
      };
      groups.push(currentGroup);
    }
    currentGroup.items.push({
      ...item,
      marginBottom: (_item$props = item.props) === null || _item$props === void 0 ? void 0 : _item$props.marginBottom
    });
  });
  return groups;
}
function boxProps(groups, index, isContentPadded) {
  const group = groups[index];
  const lastItem = group.items[group.items.length - 1];
  return {
    position: group.position,
    width: group.width,
    customMargin: group.customMargin,
    lastMarginBottom: lastItem.marginBottom,
    atSectionStart: index === 0 && !isContentPadded,
    atSectionEnd: index === groups.length - 1
  };
}
function selfClear(items, index) {
  const item = items[index];
  const next = items[index + 1];
  if (supportsWrappingAroundFloats(item) || isFloated(item) && (!next || clearItem(items, index + 1))) {
    return 'both';
  } else if (isFloated(item)) {
    return item.position === 'left' ? 'right' : 'left';
  }
  return 'none';
}
function clearItem(items, index) {
  return supportsWrappingAroundFloats(items[index]) ? followsSideBySideElements(items, index) : !isFloatedFollowingOppositeFloated(items, index);
}
function followsSideBySideElements(items, index) {
  return index > 1 && (items[index - 1].position === 'left' && items[index - 2].position === 'right' || items[index - 1].position === 'right' && items[index - 2].position === 'left');
}
function sideBySideFloat(items, index) {
  return isFloatedFollowingOppositeFloated(items, index) || isFloatedFollowedByOppositeFloated(items, index);
}
function isFloatedFollowingOppositeFloated(items, index) {
  return index > 0 && isFloated(items[index]) && isFloated(items[index - 1]) && items[index].position !== items[index - 1].position;
}
function isFloatedFollowedByOppositeFloated(items, index) {
  return index < items.length - 1 && isFloated(items[index]) && isFloated(items[index + 1]) && items[index].position !== items[index + 1].position;
}
function isFloated(item) {
  return floatedPositions.includes(item.position);
}
function supportsWrappingAroundFloats(item) {
  const {
    supportsWrappingAroundFloats
  } = api.contentElementTypes.getOptions(item.type);
  return supportsWrappingAroundFloats;
}
function hasCustomMargin(item) {
  const position = item.position;
  let {
    customMargin: elementSupportsCustomMargin
  } = api.contentElementTypes.getOptions(item.type) || {};
  if (typeof elementSupportsCustomMargin === 'function') {
    elementSupportsCustomMargin = elementSupportsCustomMargin({
      configuration: item.props
    });
  }
  return !!(elementSupportsCustomMargin && position === 'inline' && getWidth(item) < widths.full);
}
function groupWidth(item) {
  return Math.max(getWidth(item), widths.md);
}
function getWidth(item) {
  return item.width || widths.md;
}
function renderPlaceholder$1(placeholder) {
  if (!placeholder) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.outer)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.item)
  }, placeholder));
}

const Layout = React.memo(extensible('LayoutWithPlaceholder', LayoutWithoutInlineEditing), (prevProps, nextProps) => prevProps.sectionId === nextProps.sectionId && prevProps.items === nextProps.items && prevProps.appearance === nextProps.appearance && prevProps.contentAreaRef === nextProps.contentAreaRef && prevProps.sectionProps === nextProps.sectionProps && prevProps.isContentPadded === nextProps.isContentPadded && prevProps.constrainContentWidth === nextProps.constrainContentWidth);
function LayoutWithoutInlineEditing(props) {
  if (props.sectionProps.layout === 'center' || props.sectionProps.layout === 'centerRagged') {
    return /*#__PURE__*/React.createElement(Center, props);
  } else if (props.sectionProps.layout === 'right') {
    return /*#__PURE__*/React.createElement(TwoColumn, Object.assign({
      align: "right"
    }, props));
  } else {
    return /*#__PURE__*/React.createElement(TwoColumn, props);
  }
}
Layout.defaultProps = {
  layout: 'left'
};

function scrollToElement(element, {
  align,
  ifNeeded,
  behavior
} = {}) {
  const rect = element.getBoundingClientRect();
  if (ifNeeded && isInViewport(align, rect)) {
    return;
  }
  window.scrollTo({
    top: rect.top + window.scrollY + getAlignOffset(align, rect),
    behavior: behavior || 'smooth'
  });
}
function getAlignOffset(align, rect) {
  if (align === 'start') {
    return 0;
  } else if (align === 'center') {
    return (rect.height - window.innerHeight) / 2;
  } else if (align === 'nearEnd') {
    return rect.height - window.innerHeight * 0.75;
  } else {
    return -window.innerHeight * 0.25;
  }
}
function isInViewport(align, rect) {
  if (align === 'nearEnd') {
    const bottom = rect.top + rect.height;
    return bottom > 0 && bottom <= window.innerHeight;
  } else {
    return rect.top >= 0 && rect.top < window.innerHeight;
  }
}

const ScrollTargetEmitterContext = createContext();
function ScrollTargetEmitterProvider({
  children
}) {
  const emitter = useMemo(() => Object.assign({}, BackboneEvents), []);
  return /*#__PURE__*/React.createElement(ScrollTargetEmitterContext.Provider, {
    value: emitter
  }, children);
}
function useScrollToTarget() {
  const emitter = useContext(ScrollTargetEmitterContext);
  return useCallback(({
    id,
    align,
    ifNeeded,
    behavior
  }) => {
    emitter.trigger(id, {
      align,
      ifNeeded,
      behavior
    });
  }, [emitter]);
}
function useScrollTarget(id) {
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

const DarkBackgroundContext = createContext(true);
function BackgroundColorProvider({
  dark,
  invert,
  children
}) {
  const previousValue = useDarkBackground();
  return /*#__PURE__*/React.createElement(DarkBackgroundContext.Provider, {
    value: getValue({
      dark,
      invert,
      previousValue
    })
  }, children);
}
function getValue({
  dark,
  invert,
  previousValue
}) {
  if (dark !== undefined) {
    return dark;
  } else if (invert === true) {
    return !previousValue;
  } else {
    return previousValue;
  }
}

/**
 * Use to invert elements depending on whether they are rendered on a
 * dark or light background to ensure correct display in inverted
 * sections or in sections with card appearance.
 *
 * @return {boolean}
 */
function useDarkBackground() {
  return useContext(DarkBackgroundContext);
}

const ActiveExcursionContext = createContext({
  activeExcursion: undefined,
  activateExcursionOfSection: () => {},
  returnFromExcursion: () => {}
});
function ActiveExcursionProvider({
  children
}) {
  const entryStructure = useEntryStructure();
  const scrollToTarget = useScrollToTarget();
  const [activeExcursionId, setActiveExcursionId] = useState();
  const [scrollTarget, setScrollTarget] = useState();
  const returnUrlRef = useRef(null);
  useEffect(() => {
    function handleHashChange(event) {
      const hash = window.__ACTIVE_EXCURSION__ ||
      // Used in Storybook
      window.location.hash.slice(1);
      const {
        excursion,
        sectionId
      } = findScrollTargetByHash(hash);
      if (excursion && (event === null || event === void 0 ? void 0 : event.oldURL) && !returnUrlRef.current) {
        returnUrlRef.current = event.oldURL;
      }
      setActiveExcursionId(prevExcursionId => {
        const excursionChanged = (excursion === null || excursion === void 0 ? void 0 : excursion.id) !== prevExcursionId;
        if (excursionChanged && sectionId) {
          setScrollTarget(sectionId);
        }
        return excursion === null || excursion === void 0 ? void 0 : excursion.id;
      });
    }
    function findScrollTargetByHash(hash) {
      if (hash.startsWith('section-')) {
        const permaId = parseInt(hash.replace('section-', ''), 10);
        for (const chapter of entryStructure.excursions) {
          const section = chapter.sections.find(s => s.permaId === permaId);
          if (section) {
            var _chapter$sections$;
            const isFirstSection = section.id === ((_chapter$sections$ = chapter.sections[0]) === null || _chapter$sections$ === void 0 ? void 0 : _chapter$sections$.id);
            return {
              excursion: chapter,
              sectionId: isFirstSection ? null : section.id
            };
          }
        }
        for (const chapter of entryStructure.main) {
          const section = chapter.sections.find(s => s.permaId === permaId);
          if (section) {
            return {
              excursion: null,
              sectionId: section.id
            };
          }
        }
        return {
          excursion: null,
          sectionId: null
        };
      }
      const excursion = entryStructure.excursions.find(chapter => chapter.chapterSlug === hash);
      if (excursion) {
        return {
          excursion,
          sectionId: null
        };
      }
      const mainChapter = entryStructure.main.find(chapter => chapter.chapterSlug === hash);
      if (mainChapter) {
        var _mainChapter$sections;
        return {
          excursion: null,
          sectionId: (_mainChapter$sections = mainChapter.sections[0]) === null || _mainChapter$sections === void 0 ? void 0 : _mainChapter$sections.id
        };
      }
      return {
        excursion: null,
        sectionId: null
      };
    }
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [entryStructure]);
  useEffect(() => {
    if (!scrollTarget) {
      return;
    }
    setTimeout(() => {
      scrollToTarget({
        id: scrollTarget
      });
    }, 500);
    setScrollTarget(null);
  }, [scrollTarget, scrollToTarget]);
  const activateExcursionOfSection = useCallback(({
    id
  }) => {
    const excursion = entryStructure.excursions.find(chapter => chapter.sections.find(section => section.id === id));
    if (excursion) {
      returnUrlRef.current = returnUrlRef.current || window.location.href;
      window.history.replaceState(null, null, '#' + excursion.chapterSlug);
    }
    setActiveExcursionId(excursion === null || excursion === void 0 ? void 0 : excursion.id);
  }, [entryStructure]);
  const returnFromExcursion = useCallback(() => {
    setActiveExcursionId(undefined);
    if (returnUrlRef.current) {
      window.history.replaceState(null, null, returnUrlRef.current);
      returnUrlRef.current = null;
    }
  }, []);
  const activeExcursion = useMemo(() => {
    return entryStructure.excursions.find(excursion => excursion.id === activeExcursionId);
  }, [entryStructure, activeExcursionId]);
  const value = useMemo(() => ({
    activeExcursion,
    activateExcursionOfSection,
    returnFromExcursion
  }), [activeExcursion, activateExcursionOfSection, returnFromExcursion]);
  return /*#__PURE__*/React.createElement(ActiveExcursionContext.Provider, {
    value: value
  }, children);
}
function useActiveExcursion() {
  return useContext(ActiveExcursionContext);
}

function camelize(snakeCase) {
  return snakeCase.replace(/[_-][a-z]/g, function (match) {
    return match[1].toUpperCase();
  });
}

/**
 * Resolve a palette color to a CSS custom property.
 *
 * @example
 * <div style={{backgroundColor: paletteColor(configuration.backgroundColor)}}>
 */
function paletteColor(value) {
  if (!value) {
    return undefined;
  }
  if (value[0] === '#') {
    return value;
  }
  return `var(--theme-palette-color-${value})`;
}

var textStyles = {"text-2xs":"16px","text-xs":"18px","text-s":"20px","text-base":"22px","text-md":"33px","text-l":"40px","text-2l":"50px","text-xl":"66px","text-2xl":"88px","text-3xl":"110px","text-4xl":"200px","text-5xl":"350px","heading-lg":"Text-module_heading-lg__FKxzu typography-headingLg typography-heading","heading-md":"Text-module_heading-md__1q5Ss typography-headingMd typography-heading","heading-sm":"Text-module_heading-sm__2awaz typography-headingSm typography-heading","heading-xs":"Text-module_heading-xs__21nHy typography-headingXs typography-heading","headingTagline-lg":"Text-module_headingTagline-lg__1O2TQ typography-headingTaglineLg typography-headingTagline","headingTagline-md":"Text-module_headingTagline-md__2hrVS typography-headingTaglineMd typography-headingTagline","headingTagline-sm":"Text-module_headingTagline-sm__1Fw2J typography-headingTaglineSm typography-headingTagline","headingSubtitle-lg":"Text-module_headingSubtitle-lg__15kj0 typography-headingSubtitleLg typography-headingSubtitle","headingSubtitle-md":"Text-module_headingSubtitle-md__2_qtz typography-headingSubtitleMd typography-headingSubtitle","headingSubtitle-sm":"Text-module_headingSubtitle-sm__MOc_6 typography-headingSubtitleSm typography-headingSubtitle","body":"Text-module_body__4oWD- typography-body","caption":"Text-module_caption__3_6Au typography-caption","question":"Text-module_question__ByVAq typography-question","questionAnswer":"Text-module_questionAnswer__2Hdmc typography-questionAnswer","quoteText-lg":"Text-module_quoteText-lg__3ZnZi typography-quoteText typography-quoteTextLg","quoteText-md":"Text-module_quoteText-md__2eooO typography-quoteText typography-quoteTextMd","quoteText-sm":"Text-module_quoteText-sm__5nKex typography-quoteText typography-quoteTextSm","quoteText-xs":"Text-module_quoteText-xs__2p5on typography-quoteText typography-quoteTextXs","quoteAttribution":"Text-module_quoteAttribution__VBqLw typography-quoteAttribution","quoteAttribution-lg":"Text-module_quoteAttribution-lg__23pl- Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionLg","quoteAttribution-md":"Text-module_quoteAttribution-md__2BnBN Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionMd","quoteAttribution-sm":"Text-module_quoteAttribution-sm__17vbI Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionSm","quoteAttribution-xs":"Text-module_quoteAttribution-xs__3v3BW Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionXs","counterNumber":"Text-module_counterNumber__DkyhC typography-counterNumber","counterUnit":"Text-module_counterUnit__1N5v7 typography-counterUnit","counterDescription":"Text-module_counterDescription__34NjQ typography-counterDescription","hotspotsTooltipTitle":"Text-module_hotspotsTooltipTitle__2KROf typography-hotspotTooltipTitle","hotspotsTooltipDescription":"Text-module_hotspotsTooltipDescription__2l9v5 typography-hotspotTooltipDescription","hotspotsTooltipLink":"Text-module_hotspotsTooltipLink__2F2aj typography-hotspotTooltipLink typography-linkButton","teaserTitle-lg":"Text-module_teaserTitle-lg__K3MFG typography-externalLinkTitle typography-externalLinkTitleLg","teaserTitle-md":"Text-module_teaserTitle-md__tBZIn typography-externalLinkTitle typography-externalLinkTitleMd","teaserTitle-sm":"Text-module_teaserTitle-sm__ZXQCr typography-externalLinkTitle typography-externalLinkTitleSm","teaserTagline-lg":"Text-module_teaserTagline-lg__8JW7Z typography-externalLinkTagline typography-externalLinkTaglineLg","teaserTagline-md":"Text-module_teaserTagline-md__45HLL typography-externalLinkTagline typography-externalLinkTaglineMd","teaserTagline-sm":"Text-module_teaserTagline-sm__1vzOr typography-externalLinkTagline typography-externalLinkTaglineSm","teaserDescription-lg":"Text-module_teaserDescription-lg__1ysIZ typography-externalLinkDescription","teaserDescription-md":"Text-module_teaserDescription-md__1JtRs typography-externalLinkDescription","teaserDescription-sm":"Text-module_teaserDescription-sm__2VRao typography-externalLinkDescription","teaserLink":"Text-module_teaserLink__XEWHU typography-teaserLink typography-linkButton","infoTableLabel":"Text-module_infoTableLabel__w9kbv typography-infoTableLabel","infoTableValue":"Text-module_infoTableValue__2elOY typography-infoTableValue"};

/**
 * Render some text using the default typography scale.
 *
 * @param {Object} props
 * @param {string} props.scaleCategory -
 *   One of the styles `'heading-lg'`, `'heading-md'`, `'heading-sm'`,`'heading-xs'`,
 *   `'headingTagline-lg'`, `'headingTagline-md'`, `'headingTagline-sm'`,
 *   `'headingSubtitle-lg'`, `'headingSubtitle-md'`, `'headingSubtitle-sm'`,
 *   `'body'`, `'caption'`, `'question'`, `'questionAnswer'`,
 *   `'quoteText-lg'`, `'quoteText-md'`, `'quoteText-sm'`, `'quoteText-xs'`, `'quoteAttribution'`,
 *   `'counterNumber'`, `'counterUnit'`, `'counterDescription'`,
 *   `'infoTableLabel'`, `'infoTableValue`'.
 *   `'hotspotsTooltipTitle'`, `'hotspotsTooltipDescription`', `'hotspotsTooltipLink`',
 *   `'teaserTitle-lg'`, `'teaserTitle-md'`, `'teaserTitle-sm'`,
 *   `'teaserTagline-lg'`, `'teaserTagline-md'`, `'teaserTagline-sm'`,
 *   `'teaserDescription-lg'`, `'teaserDescription-md'`, `'teaserDescription-sm'`,
 *   `'teaserLink'`.
 * @param {string} [props.typographyVariant] - Suffix for variant class name.
 * @param {string} [props.typographySize] - Suffix for size class name.
 * @param {string} [props.inline] - Render a span instread of a div.
 * @param {string} props.children - Nodes to render with specified typography.
 */
function Text({
  inline,
  scaleCategory,
  typographyVariant,
  typographySize,
  children
}) {
  const variantClassName = typographyVariant && `typography-${scaleCategory.split('-')[0]}-${typographyVariant}`;
  const sizeClassName = typographySize && `typography-${scaleCategory}-${typographySize}`;
  return React.createElement(inline ? 'span' : 'div', {
    className: classNames(textStyles[scaleCategory], variantClassName, sizeClassName)
  }, children);
}

function Link({
  attributes,
  children,
  href,
  openInNewTab
}) {
  const embedOriginUrl = useEmbedOriginUrl();
  if (href === null || href === void 0 ? void 0 : href.chapter) {
    return /*#__PURE__*/React.createElement(ChapterLink, {
      attributes: attributes,
      chapterPermaId: href.chapter
    }, children);
  } else if (href === null || href === void 0 ? void 0 : href.section) {
    return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
      href: `#section-${href.section}`
    }), children);
  }
  if (href === null || href === void 0 ? void 0 : href.file) {
    return /*#__PURE__*/React.createElement(FileLink, {
      attributes: attributes,
      fileOptions: href.file
    }, children);
  } else {
    const targetAttributes = getTargetAttributes({
      href,
      openInNewTab,
      embedOriginUrl
    });
    return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, targetAttributes, {
      href: href
    }), children);
  }
}
function ChapterLink({
  attributes,
  children,
  chapterPermaId
}) {
  const chapter = useChapter({
    permaId: chapterPermaId
  });
  return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
    href: `#${(chapter === null || chapter === void 0 ? void 0 : chapter.chapterSlug) || ''}`
  }), children);
}
function FileLink({
  attributes,
  children,
  fileOptions
}) {
  const file = useDownloadableFile(fileOptions);
  return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
    target: "_blank",
    rel: "noopener noreferrer",
    href: file === null || file === void 0 ? void 0 : file.urls.download
  }), children);
}
function getTargetAttributes({
  href,
  openInNewTab,
  embedOriginUrl
}) {
  if (openInNewTab) {
    return {
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  }
  if (embedOriginUrl && typeof href === 'string' && !href.startsWith('#') && !href.startsWith(embedOriginUrl)) {
    return {
      target: '_top'
    };
  }
  return {};
}

var textStyles$1 = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","contentLinkColor":"var(--content-link-color)","root":"EditableText-module_root__2v1tU","justify":"EditableText-module_justify__1pNdv","light":"EditableText-module_light__2c29h","dark":"EditableText-module_dark__2ym90","link":"EditableText-module_link__3vDbl typography-contentLink","bold":"EditableText-module_bold__tGw26","sub":"EditableText-module_sub__pNBwN","sup":"EditableText-module_sup__RJJlq"};

const defaultValue = [{
  type: 'paragraph',
  children: [{
    text: ''
  }]
}];
function PlainEditableText({
  value,
  className,
  scaleCategory = 'body',
  typographyVariant,
  typographySize
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(textStyles$1.root, className)
  }, /*#__PURE__*/React.createElement(Text, {
    scaleCategory: scaleCategory,
    typographyVariant: typographyVariant,
    typographySize: typographySize
  }, render(value || defaultValue)));
}
const EditableText = extensible('EditableText', PlainEditableText);
function render(children) {
  return children.map((element, index) => {
    if (element.type && element.children) {
      return renderElement({
        attributes: {
          key: index
        },
        element,
        children: render(element.children)
      });
    } else {
      return renderLeaf({
        attributes: {
          key: index
        },
        leaf: element,
        children: children.length === 1 && element.text.trim() === '' ? '\uFEFF' : element.text
      });
    }
  });
}
function renderElement({
  attributes,
  children,
  element
}) {
  const variantClassName = element.variant && ['typography-textBlock', camelize(element.type), element.variant].join('-');
  const sizeClassName = element.size && ['typography-textBlock', camelize(element.type), element.size].join('-');
  const className = classNames(variantClassName, sizeClassName, {
    [textStyles$1.justify]: element.textAlign === 'justify'
  });
  const inlineStyles = {
    ...(element.color && {
      color: paletteColor(element.color)
    })
  };
  switch (element.type) {
    case 'block-quote':
      return /*#__PURE__*/React.createElement("blockquote", Object.assign({}, attributes, {
        className: className,
        style: inlineStyles
      }), children);
    case 'bulleted-list':
      return /*#__PURE__*/React.createElement("ul", Object.assign({}, attributes, {
        className: className,
        style: inlineStyles
      }), children);
    case 'numbered-list':
      return /*#__PURE__*/React.createElement("ol", Object.assign({}, attributes, {
        className: className,
        style: inlineStyles
      }), children);
    case 'list-item':
      return /*#__PURE__*/React.createElement("li", attributes, children);
    case 'heading':
      const {
        key,
        ...otherAttributes
      } = attributes;
      return /*#__PURE__*/React.createElement(Heading, {
        key: key,
        attributes: otherAttributes,
        className: className,
        inlineStyles: inlineStyles
      }, children);
    case 'link':
      return renderLink({
        attributes,
        children,
        element
      });
    default:
      return /*#__PURE__*/React.createElement("p", Object.assign({}, attributes, {
        className: className,
        style: inlineStyles
      }), children);
  }
}
function Heading({
  attributes,
  className,
  inlineStyles,
  children
}) {
  const darkBackground = useDarkBackground();
  return /*#__PURE__*/React.createElement("h2", Object.assign({}, attributes, {
    className: classNames(className, darkBackground ? textStyles$1.light : textStyles$1.dark, 'scope-headings', textStyles['heading-xs']),
    style: inlineStyles
  }), children);
}
function renderLink({
  attributes,
  children,
  element
}) {
  const {
    key,
    ...otherAttributes
  } = attributes;
  return /*#__PURE__*/React.createElement(Link, {
    key: key,
    attributes: {
      ...otherAttributes,
      className: textStyles$1.link
    },
    href: element.href,
    openInNewTab: element.openInNewTab,
    children: children
  });
}
function renderLeaf({
  attributes,
  children,
  leaf
}) {
  if (leaf.bold) {
    children = /*#__PURE__*/React.createElement("strong", {
      className: textStyles$1.bold
    }, children);
  }
  if (leaf.italic) {
    children = /*#__PURE__*/React.createElement("em", null, children);
  }
  if (leaf.underline) {
    children = /*#__PURE__*/React.createElement("u", null, children);
  }
  if (leaf.strikethrough) {
    children = /*#__PURE__*/React.createElement("s", null, children);
  }
  if (leaf.sub) {
    children = /*#__PURE__*/React.createElement("sub", {
      className: textStyles$1.sub
    }, children);
  }
  if (leaf.sup) {
    children = /*#__PURE__*/React.createElement("sup", {
      className: textStyles$1.sup
    }, children);
  }
  return /*#__PURE__*/React.createElement("span", attributes, children);
}

const FloatingPortalRootContext = createContext();
function useFloatingPortalRoot() {
  return useContext(FloatingPortalRootContext);
}
const FloatingPortalRootProvider = FloatingPortalRootContext.Provider;

export { useScrollTarget as A, BackgroundColorProvider as B, ContentElementAttributesProvider as C, Layout as D, EditableText as E, FloatingPortalRootProvider as F, ExtensionsProvider as G, ActiveExcursionProvider as H, StaticPreview as I, camelize as J, renderLink as K, Link as L, MainStorylineCoverageProvider as M, renderLeaf as N, OnScreenObserverRootProvider as O, scrollToElement as P, LayoutWithoutInlineEditing as Q, renderElement as R, ScrollTargetEmitterProvider as S, Text as T, PlainEditableText as U, textStyles$1 as V, useActiveExcursion as a, MainStorylineActivity as b, useMainStorylineCoverage as c, api as d, extensible as e, useDarkBackground as f, useContentElementAttributes as g, useContentElementLifecycle as h, ContentElementLifecycleContext as i, useContentElementViewTimelineProgress as j, ContentElementViewTimelineContext as k, getViewTimelineProgress as l, useIsStaticPreview as m, useStorylineActivity as n, useFloatingPortalRoot as o, provideExtensions as p, paletteColor as q, widthName as r, useOnScreen as s, createScrollPositionLifecycleProvider as t, useScrollToTarget as u, createScrollPositionLifecycleHook as v, widths as w, useMediaQuery as x, TrimDefaultMarginTop as y, ContentElement as z };
