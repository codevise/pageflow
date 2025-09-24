import { E as EventContextDataProvider, C as ConnectedSection, u as usePrevious, g as getEventObject, w as withInlineEditingDecorator, a as useCurrentSectionIndexState, b as useScrollToTarget, c as usePostMessageListener, d as contentStyles, A as AtmoProvider, W as Widget, S as SelectableWidget, _ as _asyncToGenerator, e as withInlineEditingAlternative, f as useDarkBackground, i as isBlankEditableTextValue, h as EditableText, j as useContentElementAttributes, k as widths, l as useContentElementConfigurationUpdate, I as InlineFileRights, m as useTextTracks, n as useMediaMuted, o as useFocusOutlineVisible, p as useVideoQualitySetting, q as useIsomorphicLayoutEffect, r as frontendStyles, L as Link, F as Fullscreen, T as Text, s as utils, t as styles$d, R as RootProviders, v as registerVendors, x as api, y as loadInlineEditingComponents } from './FloatingPortalRootProvider-bbce8786.js';
export { ad as Atmo, ae as AtmoContext, A as AtmoProvider, ab as AudioPlayer, D as ContentElementAttributesProvider, H as ContentElementEditorCommandEmitterContext, K as ContentElementLifecycleContext, U as EditableTable, h as EditableText, $ as FloatingPortalRootProvider, a5 as Image, I as InlineFileRights, a6 as MediaPlayer, ag as OnScreenObserverRootProvider, P as PlayerEventContextDataProvider, R as RootProviders, a0 as SectionIntersectionObserver, aj as SectionThumbnail, S as SelectableWidget, ai as StandaloneSectionThumbnail, T as Text, V as ThirdPartyOptIn, X as ThirdPartyOptOutInfo, aa as VideoPlayer, W as Widget, a4 as contentElementWidthName, k as contentElementWidths, x as frontend, a2 as getAvailableTransitionNames, a7 as getInitialPlayerState, a1 as getTransitionNames, a3 as paletteColor, a8 as playerStateReducer, ac as processSources, v as registerConsentVendors, af as useAtmo, z as useAudioFocus, B as useBackgroundFile, Y as useConsentRequested, l as useContentElementConfigurationUpdate, G as useContentElementEditorCommandSubscription, J as useContentElementLifecycle, M as useCurrentChapter, f as useDarkBackground, Z as useFloatingPortalRoot, N as useIsStaticPreview, q as useIsomorphicLayoutEffect, n as useMediaMuted, ah as useOnScreen, O as useOnUnmuteMedia, a9 as usePlayerState, Q as usePortraitOrientation, s as utils } from './FloatingPortalRootProvider-bbce8786.js';
import 'core-js/modules/es.symbol';
import 'core-js/modules/es.symbol.description';
import 'core-js/modules/es.symbol.async-iterator';
import 'core-js/modules/es.symbol.has-instance';
import 'core-js/modules/es.symbol.is-concat-spreadable';
import 'core-js/modules/es.symbol.iterator';
import 'core-js/modules/es.symbol.match';
import 'core-js/modules/es.symbol.replace';
import 'core-js/modules/es.symbol.search';
import 'core-js/modules/es.symbol.species';
import 'core-js/modules/es.symbol.split';
import 'core-js/modules/es.symbol.to-primitive';
import 'core-js/modules/es.symbol.to-string-tag';
import 'core-js/modules/es.symbol.unscopables';
import 'core-js/modules/es.array.concat';
import 'core-js/modules/es.array.fill';
import 'core-js/modules/es.array.find';
import 'core-js/modules/es.array.from';
import 'core-js/modules/es.array.iterator';
import 'core-js/modules/es.json.to-string-tag';
import 'core-js/modules/es.map';
import 'core-js/modules/es.math.to-string-tag';
import 'core-js/modules/es.object.assign';
import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.promise';
import 'core-js/modules/es.promise.finally';
import 'core-js/modules/es.set';
import 'core-js/modules/es.string.iterator';
import 'core-js/modules/es.string.starts-with';
import 'core-js/modules/esnext.aggregate-error';
import 'core-js/modules/esnext.map.delete-all';
import 'core-js/modules/esnext.map.every';
import 'core-js/modules/esnext.map.filter';
import 'core-js/modules/esnext.map.find';
import 'core-js/modules/esnext.map.find-key';
import 'core-js/modules/esnext.map.from';
import 'core-js/modules/esnext.map.group-by';
import 'core-js/modules/esnext.map.includes';
import 'core-js/modules/esnext.map.key-by';
import 'core-js/modules/esnext.map.key-of';
import 'core-js/modules/esnext.map.map-keys';
import 'core-js/modules/esnext.map.map-values';
import 'core-js/modules/esnext.map.merge';
import 'core-js/modules/esnext.map.of';
import 'core-js/modules/esnext.map.reduce';
import 'core-js/modules/esnext.map.some';
import 'core-js/modules/esnext.map.update';
import 'core-js/modules/esnext.promise.all-settled';
import 'core-js/modules/esnext.promise.any';
import 'core-js/modules/esnext.promise.try';
import 'core-js/modules/esnext.set.add-all';
import 'core-js/modules/esnext.set.delete-all';
import 'core-js/modules/esnext.set.difference';
import 'core-js/modules/esnext.set.every';
import 'core-js/modules/esnext.set.filter';
import 'core-js/modules/esnext.set.find';
import 'core-js/modules/esnext.set.from';
import 'core-js/modules/esnext.set.intersection';
import 'core-js/modules/esnext.set.is-disjoint-from';
import 'core-js/modules/esnext.set.is-subset-of';
import 'core-js/modules/esnext.set.is-superset-of';
import 'core-js/modules/esnext.set.join';
import 'core-js/modules/esnext.set.map';
import 'core-js/modules/esnext.set.of';
import 'core-js/modules/esnext.set.reduce';
import 'core-js/modules/esnext.set.some';
import 'core-js/modules/esnext.set.symmetric-difference';
import 'core-js/modules/esnext.set.union';
import 'core-js/modules/esnext.symbol.dispose';
import 'core-js/modules/esnext.symbol.observable';
import 'core-js/modules/esnext.symbol.pattern-match';
import 'core-js/modules/web.dom-collections.iterator';
import 'regenerator-runtime/runtime.js';
import { browser, events, consent, features } from 'pageflow/frontend';
import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense, useContext } from 'react';
import ReactDOM from 'react-dom';
import { _ as _slicedToArray, n as useSectionsWithChapter, t as useEntryStructure, v as getFileUrlTemplateHost, u as useI18n, g as useTheme, b as _defineProperty, a as _objectSpread2, T as ThemeIcon, e as _objectWithoutProperties, h as _toConsumableArray, w as useAvailableQualities, x as setupI18n } from './ThemeIcon-87fcf0dd.js';
export { L as LocaleProvider, T as ThemeIcon, x as setupI18n, m as useAdditionalSeedData, y as useChapters, z as useCredits, A as useCutOff, B as useDarkWidgets, c as useEntryMetadata, r as useEntryStateDispatch, C as useEntryTranslations, k as useFile, D as useFileRights, j as useFileWithInlineRights, u as useI18n, F as useLegalInfo, J as useLocale, G as useMainChapters, H as useShareProviders, I as useShareUrl, g as useTheme } from './ThemeIcon-87fcf0dd.js';
import classNames from 'classnames';
import { a as useContentElementEditorState } from './useContentElementEditorState-cd3c272d.js';
export { C as ContentElementEditorStateContext, a as useContentElementEditorState } from './useContentElementEditorState-cd3c272d.js';
import './inherits-539844a6.js';
import 'backbone-events-standalone';
import 'use-context-selector';
import 'reselect';
import 'slugify';
import 'i18n-js';
import 'striptags';
import Measure from 'react-measure';
export { P as PhonePlatformContext } from './PhonePlatformContext-8bfbbea8.js';
import { DraggableCore } from 'react-draggable';
export { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-ea2bb05c.js';
export { F as FullscreenViewer } from './index-68b25ca2.js';
import { useI18n as useI18n$1, useTheme as useTheme$1 } from 'pageflow-scrolled/frontend';
export { u as usePhonePlatform } from './usePhonePlatform-520f37b0.js';
import invert from 'invert-color';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// Make sure Webpack loads chunks via asset host.
// Free variable assignment will be rewritten during Webpack compilation.
// See https://v4.webpack.js.org/guides/public-path/#on-the-fly
// PageflowScrolled::WebpackPublicPathHelper generates js snippet
// that defines the global. For Storybook, we set it to an empty default.

// eslint-disable-next-line no-undef
__webpack_public_path__ = commonjsGlobal.__webpack_public_path__ || '';

// Safari does not handle positive root margin correctly inside
// iframes. Use polyfill instead.
if (browser.agent.matchesSafari() && window.parent !== window) {
  delete window.IntersectionObserver;
}
require('intersection-observer');

// Make sure we're in a Browser-like environment before importing polyfills
// This prevents `fetch()` from being imported in a Node test environment
if (typeof window !== 'undefined') {
  require('whatwg-fetch');
  require('scroll-timeline');
}

function Chapter(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: props.chapterSlug
  }, renderSections(props.sections, props.currentSectionIndex, props.setCurrentSection));
}
function renderSections(sections, currentSectionIndex, setCurrentSection) {
  function _onActivate(section) {
    setCurrentSection(section);
  }
  return sections.map(function (section) {
    return /*#__PURE__*/React.createElement(EventContextDataProvider, {
      key: section.permaId,
      section: section,
      sectionsCount: sections.length
    }, /*#__PURE__*/React.createElement(ConnectedSection, {
      state: section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active',
      onActivate: function onActivate() {
        return _onActivate(section);
      },
      section: section
    }));
  });
}

// InApp browsers on iOS (e.g. Twitter) report the height of the
// initial viewport as 100vh. Once the page is scrolled, browser
// toolbars are hidden, the viewport becomes larger and elements with
// height 100vh no longer cover the viewport.
//
// To detect this situation, this component compares the height of a
// 100vh div with the inner height of the window on resize. Once those
// window height exceeds probe heights the component sets the `--vh`
// custom property (which default to 1vh) to a pixel value such that
// `calc(100 * var(--vh))` equals the inner height of the window.
//
// To prevent changing element sizes once the browser toolbars are
// shown again (when the user scrolls back up), `--vh` is not updated
// when the inner height of the window decreases slightly.
//
// On orientation change, we do want to update `--vh`, though. We
// therefore do update it when the inner height of the window
// decreases by more than 30%.
function VhFix(_ref) {
  var children = _ref.children;
  var probeRef = useRef();
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    height = _useState2[0],
    setHeight = _useState2[1];
  useEffect(function () {
    if (!browser.has('ios platform')) {
      return;
    }
    window.addEventListener('resize', update);
    return function () {
      return window.removeEventListener('resize', update);
    };
    function update() {
      setHeight(function (previousHeight) {
        return getHeight({
          windowHeight: window.innerHeight,
          probeHeight: probeRef.current.clientHeight,
          previousHeight: previousHeight
        });
      });
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: height && {
      '--vh': "".concat(height / 100, "px")
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      position: 'absolute'
    },
    ref: probeRef
  }), children);
}
function getHeight(_ref2) {
  var windowHeight = _ref2.windowHeight,
    probeHeight = _ref2.probeHeight,
    previousHeight = _ref2.previousHeight;
  if (probeHeight < windowHeight || previousHeight) {
    if (!previousHeight || windowHeight > previousHeight || windowHeight < previousHeight * 0.7) {
      return windowHeight;
    } else {
      return previousHeight;
    }
  }
}

function useActiveExcursion(entryStructure) {
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    activeExcursionId = _useState2[0],
    setActiveExcursionId = _useState2[1];
  var returnUrlRef = useRef(null);
  useEffect(function () {
    function handleHashChange(event) {
      var hash = window.location.hash.slice(1);
      var excursion = findExcursionByHash(hash);
      if (excursion && !returnUrlRef.current) {
        returnUrlRef.current = event.oldURL;
      }
      setActiveExcursionId(excursion === null || excursion === void 0 ? void 0 : excursion.id);
    }
    function findExcursionByHash(hash) {
      if (hash.startsWith('section-')) {
        var permaId = parseInt(hash.replace('section-', ''), 10);
        return entryStructure.excursions.find(function (chapter) {
          return chapter.sections.find(function (section) {
            return section.permaId === permaId;
          });
        });
      }
      return entryStructure.excursions.find(function (chapter) {
        return chapter.chapterSlug === hash;
      });
    }
    window.addEventListener('hashchange', handleHashChange);
    return function () {
      return window.removeEventListener('hashchange', handleHashChange);
    };
  }, [entryStructure]);
  var activateExcursionOfSection = useCallback(function (_ref) {
    var id = _ref.id;
    var excursion = entryStructure.excursions.find(function (chapter) {
      return chapter.sections.find(function (section) {
        return section.id === id;
      });
    });
    if (excursion) {
      returnUrlRef.current = returnUrlRef.current || window.location.href;
      window.history.replaceState(null, null, '#' + excursion.chapterSlug);
    }
    setActiveExcursionId(excursion === null || excursion === void 0 ? void 0 : excursion.id);
  }, [entryStructure]);
  var returnFromExcursion = useCallback(function () {
    setActiveExcursionId(undefined);
    if (returnUrlRef.current) {
      window.history.replaceState(null, null, returnUrlRef.current);
      returnUrlRef.current = null;
    }
  }, []);
  var activeExcursion = useMemo(function () {
    return entryStructure.excursions.find(function (excursion) {
      return excursion.id === activeExcursionId;
    });
  }, [entryStructure, activeExcursionId]);
  return {
    activeExcursion: activeExcursion,
    activateExcursionOfSection: activateExcursionOfSection,
    returnFromExcursion: returnFromExcursion
  };
}

function useSectionChangeEvents(currentSectionIndex) {
  var previousSectionIndex = usePrevious(currentSectionIndex);
  var sections = useSectionsWithChapter();
  useEffect(function () {
    if (previousSectionIndex !== currentSectionIndex) {
      events.trigger('page:change', getEventObject({
        section: sections[currentSectionIndex],
        sectionsCount: sections.length
      }));
    }
  });
}

var sectionChangeMessagePoster = function sectionChangeMessagePoster(index) {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'CHANGE_SECTION',
      payload: {
        index: index
      }
    }, window.location.origin);
  }
};

var Content = withInlineEditingDecorator('ContentDecorator', function Content(props) {
  var entryStructure = useEntryStructure();
  var _useActiveExcursion = useActiveExcursion(entryStructure),
    activeExcursion = _useActiveExcursion.activeExcursion,
    activateExcursionOfSection = _useActiveExcursion.activateExcursionOfSection,
    returnFromExcursion = _useActiveExcursion.returnFromExcursion;
  var _useCurrentSectionInd = useCurrentSectionIndexState(),
    _useCurrentSectionInd2 = _slicedToArray(_useCurrentSectionInd, 2),
    currentSectionIndex = _useCurrentSectionInd2[0],
    setCurrentSectionIndexState = _useCurrentSectionInd2[1];
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    currentExcursionSectionIndex = _useState2[0],
    setCurrentExcursionSectionIndex = _useState2[1];
  useSectionChangeEvents(currentSectionIndex);
  var updateChapterSlug = function updateChapterSlug(section) {
    if (section.sectionIndex > 0) {
      window.history.replaceState(null, null, '#' + section.chapter.chapterSlug);
    } else {
      window.history.replaceState(null, null, window.location.href.split('#')[0]);
    }
  };
  var updateExcursionChapterSlug = function updateExcursionChapterSlug(section) {
    window.history.replaceState(null, null, '#' + section.chapter.chapterSlug);
  };
  var setCurrentSection = useCallback(function (section) {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
  }, [setCurrentSectionIndexState]);
  var setCurrentExcursionSection = useCallback(function (section) {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentExcursionSectionIndex(section.sectionIndex);
    updateExcursionChapterSlug(section);
  }, [setCurrentExcursionSectionIndex]);
  var scrollToTarget = useScrollToTarget();
  var receiveMessage = useCallback(function (data) {
    if (data.type === 'SCROLL_TO_SECTION') {
      activateExcursionOfSection({
        id: data.payload.id
      });
      scrollToTarget({
        id: data.payload.id,
        align: data.payload.align
      });
    }
  }, [scrollToTarget, activateExcursionOfSection]);
  usePostMessageListener(receiveMessage);
  return /*#__PURE__*/React.createElement("div", {
    className: contentStyles.Content,
    id: "goToContent"
  }, /*#__PURE__*/React.createElement(VhFix, null, /*#__PURE__*/React.createElement(AtmoProvider, null, renderMainStoryline(entryStructure.main, activeExcursion, currentSectionIndex, setCurrentSection), renderExcursion(activeExcursion, currentExcursionSectionIndex, setCurrentExcursionSection, {
    onClose: function onClose() {
      return returnFromExcursion();
    }
  }))));
});
function renderMainStoryline(chapters, activeExcursion, currentSectionIndex, setCurrentSection) {
  return /*#__PURE__*/React.createElement(Widget, {
    role: "mainStoryline",
    props: {
      activeExcursion: activeExcursion
    },
    renderFallback: function renderFallback(_ref) {
      var children = _ref.children;
      return children;
    }
  }, renderChapters(chapters, currentSectionIndex, setCurrentSection), /*#__PURE__*/React.createElement(Widget, {
    role: "footer"
  }));
}
function renderExcursion(excursion, currentExcursionSectionIndex, setCurrentExcursionSection, _ref2) {
  var onClose = _ref2.onClose;
  if (excursion) {
    return /*#__PURE__*/React.createElement(Widget, {
      role: "excursion",
      props: {
        excursion: excursion,
        onClose: onClose
      }
    }, renderChapters([excursion], currentExcursionSectionIndex, setCurrentExcursionSection));
  }
}
function renderChapters(chapters, currentSectionIndex, setCurrentSection) {
  return chapters.map(function (chapter, index) {
    return /*#__PURE__*/React.createElement(Chapter, {
      key: index,
      chapterSlug: chapter.chapterSlug,
      permaId: chapter.permaId,
      sections: chapter.sections,
      currentSectionIndex: currentSectionIndex,
      setCurrentSection: setCurrentSection
    });
  });
}

var Entry = withInlineEditingDecorator('EntryDecorator', function Entry() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Widget, {
    role: "consent"
  }), /*#__PURE__*/React.createElement(SelectableWidget, {
    role: "header"
  }), /*#__PURE__*/React.createElement(Content, null));
});

function _regeneratorRuntime() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function loadDashUnlessHlsSupported(_x) {
  return _loadDashUnlessHlsSupported.apply(this, arguments);
}
function _loadDashUnlessHlsSupported() {
  _loadDashUnlessHlsSupported = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(seed) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (hasHlsSupport({
            seed: seed,
            agent: browser.agent
          })) {
            _context.next = 3;
            break;
          }
          _context.next = 3;
          return import('@videojs/http-streaming');
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadDashUnlessHlsSupported.apply(this, arguments);
}
function hasHlsSupport(_ref) {
  var agent = _ref.agent,
    seed = _ref.seed;
  return agent.matchesSafari() || agent.matchesMobilePlatform() && (!agent.matchesAndroid() || hlsHostSupportedByAndroid(seed));
}
function hlsHostSupportedByAndroid(seed) {
  return getFileUrlTemplateHost(seed, 'videoFiles', 'hls-playlist').indexOf('_') < 0;
}

var ActionButton = withInlineEditingAlternative('ActionButton', function ActionButton() {
  return null;
});

var styles = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","contentColorScope":"colors-module_contentColorScope__2Zizr","root":"Figure-module_root__3FC-x colors-module_contentColorScope__2Zizr","invert":"Figure-module_invert___0BJP"};

/**
 * Render a figure with a caption text attached.
 *
 * @param {Object} props
 * @param {string} props.children - Content of figure.
 * @param {Object[]|string} props.caption - Formatted text data as provided by onCaptionChange.
 * @param {string} [props.variant] - Name of figureCaption property scope to apply.
 * @param {Function} props.onCaptionChange - Receives updated value when it changes.
 * @param {boolean} [props.addCaptionButtonVisible=true] - Control visiblility of action button.
 * @param {string} [props.captionButtonPosition='outside'] - Position of action button.
 */
function Figure(_ref) {
  var children = _ref.children,
    variant = _ref.variant,
    caption = _ref.caption,
    onCaptionChange = _ref.onCaptionChange,
    _ref$addCaptionButton = _ref.addCaptionButtonVisible,
    addCaptionButtonVisible = _ref$addCaptionButton === void 0 ? true : _ref$addCaptionButton,
    _ref$addCaptionButton2 = _ref.addCaptionButtonPosition,
    addCaptionButtonPosition = _ref$addCaptionButton2 === void 0 ? 'outside' : _ref$addCaptionButton2,
    renderInsideCaption = _ref.renderInsideCaption;
  var darkBackground = useDarkBackground();
  var _useContentElementEdi = useContentElementEditorState(),
    isSelected = _useContentElementEdi.isSelected,
    isEditable = _useContentElementEdi.isEditable;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isEditingCaption = _useState2[0],
    setIsEditingCaption = _useState2[1];
  var _useI18n = useI18n({
      locale: 'ui'
    }),
    t = _useI18n.t;
  var theme = useTheme();
  var captionAbove = theme.options.figureCaptionPosition === 'above';
  caption = useMemo(function () {
    return typeof caption === 'string' ? [{
      type: 'paragraph',
      children: [{
        text: caption
      }]
    }] : caption;
  }, [caption]);
  if (!isBlankEditableTextValue(caption) || isEditable) {
    return /*#__PURE__*/React.createElement("figure", {
      className: classNames(styles.root, _defineProperty({}, styles.invert, !darkBackground))
    }, !captionAbove && children, isBlankEditableTextValue(caption) && isSelected && !isEditingCaption && addCaptionButtonVisible && /*#__PURE__*/React.createElement(ActionButton, {
      position: addCaptionButtonPosition,
      icon: "pencil",
      text: t('pageflow_scrolled.inline_editing.add_caption'),
      onClick: function onClick() {
        return setIsEditingCaption(true);
      }
    }), (!isBlankEditableTextValue(caption) || isEditingCaption) && /*#__PURE__*/React.createElement("figcaption", {
      className: classNames(variant && "scope-figureCaption-".concat(variant)),
      onBlur: function onBlur() {
        return setIsEditingCaption(false);
      }
    }, renderInsideCaption === null || renderInsideCaption === void 0 ? void 0 : renderInsideCaption(), /*#__PURE__*/React.createElement(EditableText, {
      autoFocus: isEditingCaption,
      value: caption,
      scaleCategory: "caption",
      onChange: onCaptionChange,
      onlyParagraphs: true,
      hyphens: "none",
      placeholder: t('pageflow_scrolled.inline_editing.type_text')
    })), captionAbove && children);
  } else {
    return children;
  }
}

var styles$1 = {"wrapper":"ContentElementBox-module_wrapper__3wZgP","full":"ContentElementBox-module_full__AfWPr","positioned":"ContentElementBox-module_positioned__3R1dq"};

/**
 * Wrap content element that render a visible box in this component to
 * apply theme specific styles like rounded corners.
 *
 * @param {Object} props
 * @param {string} props.children - Content of box.
 * @param {string} props.borderRadius - Border radius value from theme scale, or "none" to render no wrapper.
 */
function ContentElementBox(_ref) {
  var children = _ref.children,
    borderRadius = _ref.borderRadius,
    positioned = _ref.positioned;
  var _useContentElementAtt = useContentElementAttributes(),
    position = _useContentElementAtt.position,
    width = _useContentElementAtt.width;
  if (position === 'backdrop' || borderRadius === 'none') {
    return children;
  }
  var style = borderRadius ? {
    '--content-element-box-border-radius': "var(--theme-content-element-box-border-radius-".concat(borderRadius, ")")
  } : {};
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, _defineProperty(_defineProperty({}, styles$1.full, width === widths.full), styles$1.positioned, positioned)),
    style: style
  }, children);
}

/**
 * @param {Object} props
 * @param {Object} props.configuration - Configuration of the content element.
 * @param {string} props.children - Content of box.
 */
function ContentElementFigure(_ref) {
  var configuration = _ref.configuration,
    children = _ref.children;
  var updateConfiguration = useContentElementConfigurationUpdate();
  var _useContentElementAtt = useContentElementAttributes(),
    width = _useContentElementAtt.width,
    position = _useContentElementAtt.position;
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable;
  if (position === 'backdrop') {
    return children;
  }
  return /*#__PURE__*/React.createElement(Figure, {
    caption: configuration.caption,
    variant: configuration.captionVariant,
    renderInsideCaption: function renderInsideCaption() {
      return isEditable && /*#__PURE__*/React.createElement(HasCaptionTransientState, null);
    },
    onCaptionChange: function onCaptionChange(caption) {
      return updateConfiguration({
        caption: caption
      });
    },
    addCaptionButtonPosition: width === widths.full ? 'outsideIndented' : 'outside'
  }, children);
}
function HasCaptionTransientState() {
  var _useContentElementEdi2 = useContentElementEditorState(),
    setTransientState = _useContentElementEdi2.setTransientState;
  useEffect(function () {
    setTransientState({
      hasCaption: true
    });
    return function () {
      return setTransientState({
        hasCaption: false
      });
    };
  }, [setTransientState]);
  return null;
}

function MediaInteractionTracking(_ref) {
  var playerState = _ref.playerState,
    playerActions = _ref.playerActions,
    idleDelay = _ref.idleDelay,
    children = _ref.children;
  var hideControlsTimeout = useRef();
  var wasPlaying = usePrevious(playerState.isPlaying);
  var focusWasInside = usePrevious(playerState.focusInsideControls);
  var setHideControlsTimeout = useCallback(function () {
    clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(playerActions.userIdle, idleDelay);
  }, [playerActions.userIdle, idleDelay]);
  useEffect(function () {
    if (!wasPlaying && playerState.isPlaying || focusWasInside !== playerState.focusInsideControls) {
      setHideControlsTimeout();
    }
  }, [wasPlaying, playerState.isPlaying, setHideControlsTimeout, playerState.focusInsideControls, focusWasInside]);
  useEffect(function () {
    return function () {
      return clearTimeout(hideControlsTimeout.current);
    };
  }, []);
  var handleInteraction = function handleInteraction() {
    playerActions.userInteraction();
    setHideControlsTimeout();
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: handleInteraction,
    onMouseMove: handleInteraction,
    onMouseEnter: playerActions.mouseEntered,
    onMouseLeave: playerActions.mouseLeft
  }, children);
}
MediaInteractionTracking.defaultProps = {
  idleDelay: 2000
};

function RemotePeakData(_ref) {
  var audioFile = _ref.audioFile,
    children = _ref.children;
  var peakDataUrl = audioFile === null || audioFile === void 0 ? void 0 : audioFile.urls.peakData;
  var _useState = useState('pending'),
    _useState2 = _slicedToArray(_useState, 2),
    peakData = _useState2[0],
    setPeakData = _useState2[1];
  useEffect(function () {
    if (peakDataUrl) {
      fetch(peakDataUrl).then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error ".concat(response.status, " while loading peaks."));
        }
        return response.json();
      }).then(function (peaks) {
        setPeakData(peaks.data);
      });
    } else {
      setPeakData(null);
    }
  }, [peakDataUrl]);
  if (peakData === 'pending') {
    return null;
  } else {
    return children(peakData);
  }
}

var styles$2 = {"container":"Waveform-module_container__1Dxdv","clickMask":"Waveform-module_clickMask__3LYAT","menuBar":"Waveform-module_menuBar__342n-","menuBarInner":"Waveform-module_menuBarInner__3wjQs","timeDisplay":"Waveform-module_timeDisplay__1v4Tl","playControl":"Waveform-module_playControl__QWTsJ","waveWrapper":"Waveform-module_waveWrapper__3gamc"};

var waveColor = '#828282ed';
var waveColorInverted = 'rgba(0, 0, 0, 0.5)';
var cursorColor = '#fff';
var cursorColorInverted = '#888';
var Wavesurfer = React.lazy(function () {
  return import('./Wavesurfer-1cdc3925.js');
});
var waveformStyles = {
  waveformLines: {
    barWidth: 1,
    barGap: 2
  },
  waveformBars: {
    barWidth: 3,
    barRadius: 3,
    barGap: 3
  }
};
function Waveform(props) {
  var _useState = useState(90),
    _useState2 = _slicedToArray(_useState, 2),
    height = _useState2[0],
    setHeight = _useState2[1];
  if (props.mediaElementId) {
    return /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement("div", null)
    }, /*#__PURE__*/React.createElement(Measure, {
      client: true,
      onResize: function onResize(contentRect) {
        return setHeight(contentRect.client.height);
      }
    }, function (_ref) {
      var measureRef = _ref.measureRef;
      return /*#__PURE__*/React.createElement("div", {
        ref: measureRef,
        className: styles$2.waveWrapper
      }, /*#__PURE__*/React.createElement(RemotePeakData, {
        audioFile: props.audioFile
      }, function (peakData) {
        return /*#__PURE__*/React.createElement(Wavesurfer, {
          key: props.variant,
          mediaElt: "#".concat(props.mediaElementId),
          audioPeaks: peakData,
          options: _objectSpread2(_objectSpread2({}, waveformStyles[props.variant]), {}, {
            normalize: true,
            removeMediaElementOnDestroy: false,
            hideScrollbar: true,
            progressColor: props.waveformColor || props.mainColor,
            waveColor: props.inverted ? waveColorInverted : waveColor,
            cursorColor: props.inverted ? cursorColorInverted : cursorColor,
            height: height
          })
        });
      }));
    }));
  } else {
    return null;
  }
}

var styles$3 = {"timeDisplay":"TimeDisplay-module_timeDisplay__2UwqM","time":"TimeDisplay-module_time__li1ZU"};

var unknownTimePlaceholder = '-:--';
function formatTime(value) {
  if (isNaN(value)) {
    return unknownTimePlaceholder;
  }
  var seconds = Math.floor(value) % 60;
  var minutes = Math.floor(value / 60) % 60;
  var hours = Math.floor(value / 60 / 60);
  if (hours > 0) {
    return "".concat(hours, ":").concat(pad(minutes), ":").concat(pad(seconds));
  } else {
    return "".concat(minutes, ":").concat(pad(seconds));
  }
}
function pad(value) {
  return value < 10 ? '0' + value : value;
}

function TimeDisplay(props) {
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": 'time-display',
    className: styles$3.timeDisplay
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$3.time
  }, formatTime(props.currentTime)), "/", /*#__PURE__*/React.createElement("span", {
    className: styles$3.time
  }, formatTime(props.duration)));
}

var styles$4 = {"wrapper":"MenuBarButton-module_wrapper__2lFoI","button":"MenuBarButton-module_button__2sY0F ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne","subMenuItemAnnotation":"MenuBarButton-module_subMenuItemAnnotation__32Quc","subMenu":"MenuBarButton-module_subMenu__f-E-X","subMenuExpanded":"MenuBarButton-module_subMenuExpanded__2UvkJ","subMenuItem":"MenuBarButton-module_subMenuItem__1pyn_","subMenuItemButton":"MenuBarButton-module_subMenuItemButton__2QnUz utils-module_unstyledButton__3rgne"};

function MenuBarButton(props) {
  var subMenuItems = props.subMenuItems,
    onClick = props.onClick;
  var _useState = useState(props.subMenuExpanded),
    _useState2 = _slicedToArray(_useState, 2),
    subMenuExpanded = _useState2[0],
    setSubMenuExpanded = _useState2[1];
  var closeMenuTimeout = useRef();
  var openMenu = useCallback(function () {
    if (subMenuItems.length > 0) {
      setSubMenuExpanded(true);
    }
  }, [subMenuItems.length]);
  var closeMenu = useCallback(function () {
    setSubMenuExpanded(false);
  }, []);
  var onButtonClick = useCallback(function (event) {
    openMenu();
    if (onClick) {
      onClick();
    }
  }, [onClick, openMenu]);
  var onFocus = useCallback(function () {
    clearTimeout(closeMenuTimeout.current);
  }, []);
  var onBlur = useCallback(function () {
    clearTimeout(closeMenuTimeout.current);
    closeMenuTimeout.current = setTimeout(function () {
      setSubMenuExpanded(false);
    }, 100);
  }, []);
  var onKeyDown = useCallback(function (event) {
    if (event.key === 'Escape') {
      setSubMenuExpanded(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(_defineProperty({}, styles$4.subMenuExpanded, subMenuExpanded), styles$4.wrapper),
    onMouseEnter: openMenu,
    onMouseLeave: closeMenu,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyDown: onKeyDown
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$4.button,
    title: props.title,
    onClick: onButtonClick
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: props.icon
  })), renderSubMenu(props, closeMenu));
}
MenuBarButton.defaultProps = {
  subMenuItems: []
};
function renderSubMenu(props, closeMenu) {
  if (props.subMenuItems.length > 0) {
    return /*#__PURE__*/React.createElement("ul", {
      className: styles$4.subMenu,
      role: "menu"
    }, renderSubMenuItems(props, closeMenu));
  }
}
function renderSubMenuItems(props, closeMenu) {
  return props.subMenuItems.map(function (item) {
    return /*#__PURE__*/React.createElement("li", {
      className: styles$4.subMenuItem,
      key: item.value
    }, /*#__PURE__*/React.createElement("button", {
      className: styles$4.subMenuItemButton,
      role: "menuitemradio",
      "aria-checked": item.active,
      onClick: subMenuItemClickHandler(props, item.value, closeMenu)
    }, renderSubMenuItemIcon(item), item.label, renderSubMenuItemAnnotation(props, item)));
  });
}
function renderSubMenuItemIcon(item) {
  if (item.active) {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "checked"
    });
  }
}
function renderSubMenuItemAnnotation(props, item) {
  if (item.annotation) {
    return /*#__PURE__*/React.createElement("span", {
      className: styles$4.subMenuItemAnnotation
    }, item.annotation);
  }
}
function subMenuItemClickHandler(props, value, closeMenu) {
  return function (event) {
    event.preventDefault();
    closeMenu();
    if (props.onSubMenuItemClick) {
      props.onSubMenuItemClick(value);
    }
  };
}

function TextTracksMenu(props) {
  var _useI18n = useI18n(),
    t = _useI18n.t;
  if (props.items.length < 2) {
    return null;
  }
  return /*#__PURE__*/React.createElement(MenuBarButton, {
    title: t('pageflow_scrolled.public.player_controls.text_tracks'),
    icon: "textTracks",
    subMenuItems: props.items,
    onSubMenuItemClick: props.onItemClick
  });
}
TextTracksMenu.defaultProps = {
  items: []
};

var styles$5 = {"container":"ControlBar-module_container__1GH64","sticky":"ControlBar-module_sticky__6qVoI","lightBackground":"ControlBar-module_lightBackground__3-tGf","darkBackground":"ControlBar-module_darkBackground__31Wv7","controlBarContainer":"ControlBar-module_controlBarContainer__1cxRO","inset":"ControlBar-module_inset__JvBh9","controlBarInner":"ControlBar-module_controlBarInner__39fE9","fadedOut":"ControlBar-module_fadedOut__2sP_3","button":"ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne","playControl":"ControlBar-module_playControl__Vg5et ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne"};

function PlayPauseButton(props) {
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("button", {
    className: styles$5.playControl,
    "aria-label": t(props.isPlaying ? 'pause' : 'play', {
      scope: 'pageflow_scrolled.public.player_controls'
    }),
    onClick: function onClick() {
      return props.isPlaying ? props.pause({
        via: 'playPauseButton'
      }) : props.play({
        via: 'playPauseButton'
      });
    }
  }, pausePlayIcon(props));
}
function pausePlayIcon(props) {
  if (props.isPlaying) {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "pause"
    });
  } else {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "play"
    });
  }
}

function WaveformPlayerControls(props) {
  var _theme$options$proper, _theme$options$proper2, _theme$options$colors;
  var darkBackground = useDarkBackground();
  var theme = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    "data-testid": "waveform-controls",
    className: classNames(styles$2.container)
  }, props.children, /*#__PURE__*/React.createElement("div", {
    className: styles$2.clickMask,
    onClick: props.onPlayerClick
  }), /*#__PURE__*/React.createElement(Waveform, {
    audioFile: props.file,
    isPlaying: props.isPlaying,
    inverted: !darkBackground,
    variant: props.variant,
    waveformColor: props.waveformColor,
    mainColor: ((_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : (_theme$options$proper2 = _theme$options$proper.root) === null || _theme$options$proper2 === void 0 ? void 0 : _theme$options$proper2.accentColor) || ((_theme$options$colors = theme.options.colors) === null || _theme$options$colors === void 0 ? void 0 : _theme$options$colors.accent),
    play: props.play,
    pause: props.pause,
    mediaElementId: props.mediaElementId
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$2.playControl
  }, /*#__PURE__*/React.createElement(PlayPauseButton, {
    isPlaying: props.isPlaying,
    play: props.play,
    pause: props.pause
  })), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.menuBar, darkBackground ? styles$5.darkBackground : styles$5.lightBackground, _defineProperty({}, styles$5.inset, !props.standAlone))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.menuBarInner
  }, /*#__PURE__*/React.createElement(TimeDisplay, {
    currentTime: props.currentTime,
    duration: props.duration
  }), /*#__PURE__*/React.createElement(TextTracksMenu, {
    items: props.textTracksMenuItems,
    onItemClick: props.onTextTracksMenuItemClick
  })), /*#__PURE__*/React.createElement(InlineFileRights, {
    items: props.inlineFileRightsItems,
    context: "playerControls",
    playerControlsFadedOut: false,
    playerControlsStandAlone: props.standAlone
  })));
}

var styles$6 = {"container":"BigPlayPauseButton-module_container__19sKj","fadeOutDelay":"BigPlayPauseButton-module_fadeOutDelay__yoaW6","pointerCursor":"BigPlayPauseButton-module_pointerCursor__2A55P","hideCursor":"BigPlayPauseButton-module_hideCursor__2Hyys","button":"BigPlayPauseButton-module_button__10g4Q utils-module_unstyledButton__3rgne","hidden":"BigPlayPauseButton-module_hidden__1KUzr","animated":"BigPlayPauseButton-module_animated__1MMNq","fadeOut":"BigPlayPauseButton-module_fadeOut__2vcA_","fadeIn":"BigPlayPauseButton-module_fadeIn__1Ge1-"};

function useFocusHandoff() {
  var ref1 = useRef();
  var ref2 = useRef();
  return [{
    sourceRef: ref1,
    targetRef: ref2,
    name: 'A'
  }, {
    sourceRef: ref2,
    targetRef: ref1,
    name: 'B'
  }];
}
function usePassFocus(inert, _ref) {
  var name = _ref.name,
    sourceRef = _ref.sourceRef,
    targetRef = _ref.targetRef;
  var hasFocusRef = useRef();
  var passFocusRef = useRef();
  var setSourceRef = useCallback(function (source) {
    if (sourceRef.current) {
      sourceRef.current.removeEventListener('focusin', updateHasFocus);
      sourceRef.current.removeEventListener('focusout', updateHasFocus);
    }
    sourceRef.current = source;
    if (sourceRef.current) {
      sourceRef.current.addEventListener('focusin', updateHasFocus);
      sourceRef.current.addEventListener('focusout', updateHasFocus);
    }
    function updateHasFocus(event) {
      hasFocusRef.current = event.type === 'focusin';
    }
  }, [sourceRef]);
  if (inert && hasFocusRef.current && !passFocusRef.current) {
    passFocusRef.current = true;
  }
  useEffect(function () {
    if (inert && passFocusRef.current && targetRef.current) {
      passFocusRef.current = false;
      if (targetRef.current.tagName === 'BUTTON') {
        targetRef.current.focus();
      } else {
        targetRef.current.querySelector('button').focus();
      }
    }
  }, [inert, targetRef, name]);
  return setSourceRef;
}

function BigPlayPauseButton(props) {
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var c = classNames(styles$6.button, _defineProperty(_defineProperty(_defineProperty({}, styles$6.hidden, props.hidden || props.lastControlledVia === 'playPauseButton'), styles$6.fadeIn, props.unplayed), styles$6.animated, !props.unplayed));
  var inert = props.hidden || !props.unplayed;
  var ref = usePassFocus(inert, props.focusHandoff);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.container, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, styles$6.hideCursor, props.hideCursor), styles$6.hidden, props.fadedOut), styles$6.fadeOutDelay, props.isPlaying), styles$6.pointerCursor, !!props.onClick)),
    onClick: props.onClick
  }, /*#__PURE__*/React.createElement("button", {
    key: props.isPlaying,
    ref: ref,
    className: c,
    "aria-label": t('pageflow_scrolled.public.player_controls.play'),
    inert: inert ? 'true' : undefined
  }, pausePlayIcon$1(props)));
}
function pausePlayIcon$1(props) {
  if (props.unplayed || props.isPlaying) {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "play"
    });
  } else {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "pause"
    });
  }
}

var styles$7 = {"container":"ProgressIndicators-module_container__1QiQJ","wrapper":"ProgressIndicators-module_wrapper__2PCVv","draggable":"ProgressIndicators-module_draggable__1iAE8","bars":"ProgressIndicators-module_bars__2-ddd","progressBar":"ProgressIndicators-module_progressBar__2PYn-","background":"ProgressIndicators-module_background__-x5f_ ProgressIndicators-module_progressBar__2PYn-","loadingProgressBar":"ProgressIndicators-module_loadingProgressBar__YD2GH ProgressIndicators-module_progressBar__2PYn-","playProgressBar":"ProgressIndicators-module_playProgressBar__3mCSX ProgressIndicators-module_progressBar__2PYn-","sliderHandle":"ProgressIndicators-module_sliderHandle__3ArIf","dragging":"ProgressIndicators-module_dragging__3yY3t"};

function ProgressIndicators(_ref) {
  var currentTime = _ref.currentTime,
    duration = _ref.duration,
    bufferedEnd = _ref.bufferedEnd,
    scrubTo = _ref.scrubTo,
    seekTo = _ref.seekTo;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    dragging = _useState2[0],
    setDragging = _useState2[1];
  var progressBarsContainerWidth = useRef();
  var positionToTime = useCallback(function (x) {
    if (duration && progressBarsContainerWidth.current) {
      var fraction = Math.max(0, Math.min(1, x / progressBarsContainerWidth.current));
      return fraction * duration;
    } else {
      return 0;
    }
  }, [duration]);
  var handleStop = useCallback(function (mouseEvent, dragEvent) {
    setDragging(false);
    seekTo(positionToTime(dragEvent.x));
  }, [seekTo, positionToTime]);
  var handleDrag = useCallback(function (mouseEvent, dragEvent) {
    setDragging(true);
    scrubTo(positionToTime(dragEvent.x));
  }, [scrubTo, positionToTime]);
  var handleKeyDown = useCallback(function (event) {
    var destination;
    if (event.key === 'ArrowLeft') {
      destination = Math.max(0, currentTime - 1);
    } else if (event.key === 'ArrowRight') {
      destination = Math.min(currentTime + 1, duration || Infinity);
    }
    seekTo(destination);
  }, [seekTo, currentTime, duration]);
  var loadProgress = duration > 0 ? Math.min(1, bufferedEnd / duration) : 0;
  var playProgress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$7.container, _defineProperty({}, styles$7.dragging, dragging)),
    "aria-label": t('pageflow_scrolled.public.player_controls.progress', {
      currentTime: formatTime(currentTime),
      duration: formatTime(duration)
    }),
    onKeyDown: handleKeyDown,
    tabIndex: "0"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$7.wrapper
  }, /*#__PURE__*/React.createElement(Measure, {
    client: true,
    onResize: function onResize(contentRect) {
      return progressBarsContainerWidth.current = contentRect.client.width;
    }
  }, function (_ref2) {
    var measureRef = _ref2.measureRef;
    return /*#__PURE__*/React.createElement(DraggableCore, {
      onStart: handleDrag,
      onDrag: handleDrag,
      onStop: handleStop
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$7.draggable)
    }, /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styles$7.bars
    }, /*#__PURE__*/React.createElement("div", {
      className: styles$7.background
    }), /*#__PURE__*/React.createElement("div", {
      className: styles$7.loadingProgressBar,
      style: {
        width: toPercent(loadProgress)
      },
      "data-testid": "loading-progress-bar"
    }), /*#__PURE__*/React.createElement("div", {
      className: styles$7.playProgressBar,
      style: {
        width: toPercent(playProgress)
      },
      "data-testid": "play-progress-bar"
    }), /*#__PURE__*/React.createElement("div", {
      className: styles$7.sliderHandle,
      style: {
        left: toPercent(playProgress)
      },
      "data-testid": "slider-handle"
    }))));
  })));
}
function toPercent(value) {
  return value > 0 ? value * 100 + '%' : 0;
}

function QualityMenu(props) {
  var _useI18n = useI18n(),
    t = _useI18n.t;
  if (props.items.length < 2) {
    return null;
  }
  return /*#__PURE__*/React.createElement(MenuBarButton, {
    title: t('pageflow_scrolled.public.player_controls.quality'),
    icon: "gear",
    subMenuItems: props.items,
    subMenuExpanded: props.subMenuExpanded,
    onSubMenuItemClick: props.onItemClick,
    x: true
  });
}
QualityMenu.defaultProps = {
  items: []
};

var _excluded = ["darkBackground", "focusHandoff"];
function ClassicPlayerControls(props) {
  var darkBackground = useDarkBackground();
  var _useFocusHandoff = useFocusHandoff(),
    _useFocusHandoff2 = _slicedToArray(_useFocusHandoff, 2),
    bigPlayButtonFocusHandoff = _useFocusHandoff2[0],
    controlBarFocusHandoff = _useFocusHandoff2[1];
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.container, _defineProperty({}, styles$5.sticky, props.sticky))
  }, props.children, !props.standAlone && /*#__PURE__*/React.createElement(BigPlayPauseButton, {
    focusHandoff: bigPlayButtonFocusHandoff,
    unplayed: props.unplayed,
    isPlaying: props.isPlaying,
    lastControlledVia: props.lastControlledVia,
    hidden: props.hideBigPlayButton,
    fadedOut: props.fadedOut,
    hideCursor: props.isPlaying && props.inactive,
    onClick: props.onPlayerClick
  }), !props.hideControlBar && /*#__PURE__*/React.createElement(ControlBar, Object.assign({}, props, {
    darkBackground: darkBackground,
    focusHandoff: controlBarFocusHandoff
  })));
}
function ControlBar(_ref) {
  var darkBackground = _ref.darkBackground,
    focusHandoff = _ref.focusHandoff,
    props = _objectWithoutProperties(_ref, _excluded);
  var hidden = !props.standAlone && props.unplayed || props.fadedOut;
  var inactive = props.isPlaying && props.inactive;
  var fadedOut = hidden || inactive;
  var focusHandoffRef = usePassFocus(hidden, focusHandoff);
  return /*#__PURE__*/React.createElement("div", {
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    className: classNames(styles$5.controlBarContainer, darkBackground ? styles$5.darkBackground : styles$5.lightBackground, _defineProperty(_defineProperty({}, styles$5.inset, !props.standAlone), styles$5.fadedOut, fadedOut))
  }, /*#__PURE__*/React.createElement("div", {
    ref: focusHandoffRef,
    inert: hidden ? 'true' : undefined,
    className: styles$5.controlBarInner
  }, /*#__PURE__*/React.createElement(PlayPauseButton, {
    isPlaying: props.isPlaying,
    play: props.play,
    pause: props.pause
  }), /*#__PURE__*/React.createElement(ProgressIndicators, {
    currentTime: props.currentTime,
    duration: props.duration,
    bufferedEnd: props.bufferedEnd,
    scrubTo: props.scrubTo,
    seekTo: props.seekTo
  }), /*#__PURE__*/React.createElement(TimeDisplay, {
    currentTime: props.currentTime,
    duration: props.duration
  }), /*#__PURE__*/React.createElement(TextTracksMenu, {
    items: props.textTracksMenuItems,
    onItemClick: props.onTextTracksMenuItemClick
  }), /*#__PURE__*/React.createElement(QualityMenu, {
    items: props.qualityMenuItems,
    onItemClick: props.onQualityMenuItemClick,
    subMenuExpanded: props.qualityMenuExpanded
  })), /*#__PURE__*/React.createElement(InlineFileRights, {
    items: props.inlineFileRightsItems,
    context: "playerControls",
    playerControlsFadedOut: fadedOut,
    playerControlsStandAlone: props.standAlone
  }));
}

function PlayerControls(props) {
  var _props$variant;
  var ControlComponent = ((_props$variant = props.variant) === null || _props$variant === void 0 ? void 0 : _props$variant.startsWith('waveform')) ? WaveformPlayerControls : ClassicPlayerControls;
  return /*#__PURE__*/React.createElement(ControlComponent, props);
}
PlayerControls.defaultProps = {
  currentTime: 200,
  duration: 600,
  bufferedEnd: 400,
  isPlaying: false,
  play: function play() {},
  pause: function pause() {},
  scrubTo: function scrubTo() {},
  seekTo: function seekTo() {},
  inset: false
};

function MediaPlayerControls(props) {
  var playerState = props.playerState;
  var playerActions = props.playerActions;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var textTracks = useTextTracks({
    file: props.file,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });
  var focusOutlineVisible = useFocusOutlineVisible();
  return /*#__PURE__*/React.createElement(PlayerControls, Object.assign({
    type: props.type,
    variant: props.configuration.playerControlVariant,
    waveformColor: props.configuration.waveformColor,
    mediaElementId: playerState.mediaElementId,
    currentTime: playerState.scrubbingAt !== undefined ? playerState.scrubbingAt : playerState.currentTime,
    bufferedEnd: playerState.bufferedEnd,
    duration: playerState.duration,
    isPlaying: playerState.shouldPlay,
    unplayed: playerState.unplayed,
    lastControlledVia: playerState.lastControlledVia,
    inactive: props.autoHide && (playerState.userIdle || !playerState.userHovering) && (!focusOutlineVisible || !playerState.focusInsideControls) && !playerState.userHoveringControls,
    onFocus: playerActions.focusEnteredControls,
    onBlur: playerActions.focusLeftControls,
    onMouseEnter: playerActions.mouseEnteredControls,
    onMouseLeave: playerActions.mouseLeftControls,
    play: playerActions.playBlessed,
    pause: playerActions.pause,
    scrubTo: playerActions.scrubTo,
    seekTo: playerActions.seekTo,
    textTracksMenuItems: getTextTracksMenuItems(textTracks, t),
    onTextTracksMenuItemClick: textTracks.select,
    qualityMenuItems: props.qualityMenuItems,
    onQualityMenuItemClick: props.onQualityMenuItemClick
  }, props));
}
MediaPlayerControls.defaultProps = {
  configuration: {}
};
function getTextTracksMenuItems(textTracks, t) {
  if (!textTracks.files.length) {
    return [];
  }
  return [{
    value: 'off',
    label: t('pageflow_scrolled.public.text_track_modes.none'),
    active: textTracks.mode === 'off'
  }, {
    value: 'auto',
    label: textTracks.autoDisplayLabel,
    active: textTracks.mode === 'auto'
  }].concat(_toConsumableArray(textTracks.files.map(function (textTrackFile) {
    return {
      value: textTrackFile.id,
      label: textTrackFile.displayLabel,
      active: textTracks.mode === 'user' && textTrackFile.id === textTracks.activeFileId
    };
  })));
}

var _excluded$1 = ["videoFile"];
function VideoPlayerControls(_ref) {
  var videoFile = _ref.videoFile,
    props = _objectWithoutProperties(_ref, _excluded$1);
  var _useVideoQualitySetti = useVideoQualitySetting(),
    _useVideoQualitySetti2 = _slicedToArray(_useVideoQualitySetti, 2),
    activeQuality = _useVideoQualitySetti2[0],
    setActiveQuality = _useVideoQualitySetti2[1];
  var availableQualities = useAvailableQualities(videoFile);
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement(MediaPlayerControls, Object.assign({}, props, {
    file: videoFile,
    autoHide: true,
    qualityMenuItems: getQualityMenuItems(availableQualities, activeQuality, t),
    onQualityMenuItemClick: setActiveQuality
  }));
}
function getQualityMenuItems(availableQualities, activeQuality, t) {
  return availableQualities.map(function (quality) {
    return {
      value: quality,
      label: t("pageflow_scrolled.public.video_qualities.labels.".concat(quality)),
      annotation: t("pageflow_scrolled.public.video_qualities.annotations.".concat(quality), {
        defaultValue: ''
      }),
      active: activeQuality === quality
    };
  });
}

var _excluded$2 = ["audioFile"];
function AudioPlayerControls(_ref) {
  var audioFile = _ref.audioFile,
    props = _objectWithoutProperties(_ref, _excluded$2);
  return /*#__PURE__*/React.createElement(MediaPlayerControls, Object.assign({}, props, {
    file: audioFile
  }));
}

var Viewer = React.lazy(function () {
  return import('./Viewer-be7df204.js');
});
function Panorama(props) {
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null)
  }, /*#__PURE__*/React.createElement(Viewer, props));
}

var _excluded$3 = ["enabled"];
var Viewer$1 = React.lazy(function () {
  return import('./Viewer-ae493769.js');
});
function ExpandableImage(_ref) {
  var enabled = _ref.enabled,
    props = _objectWithoutProperties(_ref, _excluded$3);
  if (!enabled) {
    return props.children;
  }
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null)
  }, /*#__PURE__*/React.createElement(Viewer$1, props));
}

var styles$8 = {"nav":"PaginationIndicator-module_nav__cY6JE","item":"PaginationIndicator-module_item__O7cZ-","current":"PaginationIndicator-module_current__1wxHj"};

function PaginationIndicator(_ref) {
  var itemCount = _ref.itemCount,
    currentIndex = _ref.currentIndex,
    scrollerRef = _ref.scrollerRef,
    navAriaLabelTranslationKey = _ref.navAriaLabelTranslationKey,
    itemAriaLabelTranslationKey = _ref.itemAriaLabelTranslationKey,
    onItemClick = _ref.onItemClick;
  var _useI18n = useI18n$1(),
    t = _useI18n.t;
  var navRef = useRef();
  var theme = useTheme$1();
  var currentItemFlex = theme.options.properties.root.paginationIndicatorCurrentItemFlex || 3;
  useEffect(function () {
    if (!(currentItemFlex > 1)) {
      return;
    }
    var timeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });
    var animations = _toConsumableArray(navRef.current.children).map(function (element, index) {
      var start = 1 / Math.max(itemCount - 1, 1) * (index - 1);
      var end = 1 / Math.max(itemCount - 1, 1) * (index + 1);
      return element.animate([start >= 0 && {
        flex: 1,
        offset: start
      }, {
        flex: currentItemFlex
      }, end <= 1 && {
        flex: 1,
        offset: end
      }].filter(Boolean), {
        easing: 'linear',
        timeline: timeline
      });
    });
    return function () {
      return animations.forEach(function (animation) {
        return animation.cancel();
      });
    };
  }, [currentItemFlex, scrollerRef, itemCount]);
  return /*#__PURE__*/React.createElement("nav", {
    ref: navRef,
    className: styles$8.nav,
    "aria-label": t(navAriaLabelTranslationKey),
    style: {
      aspectRatio: "".concat(itemCount + 2, " / 1")
    }
  }, Array(itemCount).fill().map(function (_, index) {
    return /*#__PURE__*/React.createElement("button", {
      key: index,
      className: classNames(styles$8.item, _defineProperty({}, styles$8.current, index === currentIndex)),
      "aria-label": t(itemAriaLabelTranslationKey, {
        index: index
      }),
      "aria-current": index === currentIndex,
      onClick: function onClick() {
        return onItemClick(index);
      }
    });
  }));
}

// from https://github.com/n8tb1t/use-scroll-position
var isBrowser = typeof window !== "undefined";
function getScrollPosition(_ref) {
  var element = _ref.element,
    useWindow = _ref.useWindow;
  if (!isBrowser) return {
    x: 0,
    y: 0
  };
  var target = element ? element.current : document.body;
  var position = target.getBoundingClientRect();
  return useWindow ? {
    x: window.scrollX,
    y: window.scrollY
  } : {
    x: position.left,
    y: position.top
  };
}
function useScrollPosition(effect, deps, element, useWindow, wait) {
  var position = useRef(getScrollPosition({
    useWindow: useWindow
  }));
  var throttleTimeout = null;
  var callBack = function callBack() {
    var currPos = getScrollPosition({
      element: element,
      useWindow: useWindow
    });
    effect({
      prevPos: position.current,
      currPos: currPos
    });
    position.current = currPos;
    throttleTimeout = null;
  };
  useIsomorphicLayoutEffect(function () {
    if (!isBrowser) {
      return;
    }
    var handleScroll = function handleScroll() {
      if (wait) {
        if (throttleTimeout === null) {
          // Todo: store in useRef hook?
          throttleTimeout = setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return function () {
      return window.removeEventListener('scroll', handleScroll);
    };
  }, deps);
}
useScrollPosition.defaultProps = {
  deps: [],
  element: false,
  useWindow: false,
  wait: null
};

var EditableInlineText = withInlineEditingAlternative('EditableInlineText', function EditableInlineText(_ref) {
  var _value$, _value$$children$;
  var value = _ref.value,
    hyphens = _ref.hyphens,
    _ref$defaultValue = _ref.defaultValue,
    defaultValue = _ref$defaultValue === void 0 ? '' : _ref$defaultValue;
  var text = value ? (_value$ = value[0]) === null || _value$ === void 0 ? void 0 : (_value$$children$ = _value$.children[0]) === null || _value$$children$ === void 0 ? void 0 : _value$$children$.text : defaultValue;
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(frontendStyles.root, frontendStyles.textEffects, frontendStyles["hyphens-".concat(hyphens)])
  }, /*#__PURE__*/React.createElement("span", null, text));
});

var EditableLink = withInlineEditingAlternative('EditableLink', function EditableLink(_ref) {
  var className = _ref.className,
    href = _ref.href,
    openInNewTab = _ref.openInNewTab,
    children = _ref.children;
  return /*#__PURE__*/React.createElement(Link, {
    href: href,
    openInNewTab: openInNewTab,
    attributes: {
      className: className
    },
    children: children
  });
});

var LinkTooltipProvider = withInlineEditingAlternative('LinkTooltipProvider', function LinkTooltipProvider(_ref) {
  var children = _ref.children;
  return children;
});

var styles$9 = {"container":"FitViewport-module_container__-awVj","content":"FitViewport-module_content__1_K5a","inner":"FitViewport-module_inner__3psd1","opaque":"FitViewport-module_opaque__3EE3o"};

var AspectRatioContext = React.createContext();

/**
 * Render a div with the given aspect ratio which does not
 * exceed the heigth of the viewport by setting an appropriate
 * `max-width` on the container.
 *
 * Wrap content in `FitViewport.Content` element:
 *
 *    <FitViewport aspectRatio={0.5625}>
 *      <FitViewport.Content>
 *         <div style={{height: '100%'}}>
 *            This div will have the specified aspec ratio
 *            while not exceeding the height of the viewport
 *         </div>
 *      </FitViewport.Content>
 *      <div>
 *        This div will have the same width as the content.
 *      </div>
 *    </FitViewport>
 *
 * @param {Object} props
 * @param {number} [props.aspectRatio] - Aspect ratio of div.
 * @param {Object} [props.file] - Use width/height of file to calculate aspect ratio.
 * @param {number} [props.scale] - Only take up fraction of the viewport height supplied as value between 0 and 1.
 * @param {Object} [props.opaque] - Render black background behind content.
 * @param {string} [props.fill] - Ignore aspect ration and fill viewport vertically.
 */
function FitViewport(_ref) {
  var file = _ref.file,
    aspectRatio = _ref.aspectRatio,
    opaque = _ref.opaque,
    children = _ref.children,
    fill = _ref.fill,
    scale = _ref.scale;
  if (!file && !aspectRatio) return children;
  if (typeof aspectRatio === 'string') {
    aspectRatio = "var(--theme-aspect-ratio-".concat(aspectRatio, ")");
  }
  aspectRatio = fill ? 'fill' : aspectRatio || file.height / file.width;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$9.container, _defineProperty({}, styles$9.opaque, opaque)),
    style: {
      '--fit-viewport-aspect-ratio': fill ? undefined : aspectRatio,
      '--fit-viewport-scale': scale
    }
  }, /*#__PURE__*/React.createElement(AspectRatioContext.Provider, {
    value: aspectRatio
  }, children));
}
FitViewport.Content = function FitViewportContent(_ref2) {
  var children = _ref2.children;
  var aspectRatio = useContext(AspectRatioContext);
  if (aspectRatio === 'fill') {
    return /*#__PURE__*/React.createElement(Fullscreen, {
      children: children
    });
  } else if (!aspectRatio) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$9.content
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: styles$9.inner
  }, children));
};

var styles$a = {"container":"Tooltip-module_container__3V63U","bubble":"Tooltip-module_bubble__FIL1C scope-tooltip","fixed":"Tooltip-module_fixed__3NGyG","openOnHover":"Tooltip-module_openOnHover__1EeI5","fadeIn":"Tooltip-module_fadeIn__3g9QH","inner":"Tooltip-module_inner__E2hsp","highlight":"Tooltip-module_highlight__2NpuQ","arrow":"Tooltip-module_arrow__3LxXo"};

function Tooltip(_ref) {
  var bubbleClassName = _ref.bubbleClassName,
    arrowPos = _ref.arrowPos,
    children = _ref.children,
    content = _ref.content,
    fixed = _ref.fixed,
    highlight = _ref.highlight,
    openOnHover = _ref.openOnHover,
    verticalOffset = _ref.verticalOffset,
    horizontalOffset = _ref.horizontalOffset;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.container, _defineProperty(_defineProperty({}, styles$a.openOnHover, openOnHover), styles$a.fixed, fixed)),
    onClick: fixFocusHandlingSafari
  }, children, /*#__PURE__*/React.createElement(Bubble, {
    className: bubbleClassName,
    highlight: highlight,
    arrowPos: arrowPos,
    verticalOffset: verticalOffset,
    horizontalOffset: horizontalOffset
  }, content));
}
function Bubble(_ref2) {
  var className = _ref2.className,
    arrowPos = _ref2.arrowPos,
    children = _ref2.children,
    highlight = _ref2.highlight,
    horizontalOffset = _ref2.horizontalOffset,
    verticalOffset = _ref2.verticalOffset;
  var inlineStyle = {
    marginLeft: horizontalOffset,
    marginTop: verticalOffset
  };

  // Negative tabIndex ensures element can take focus but does not
  // come up in tab order. This ensures the tooltip stays expanded
  // when text in the legal info menu is selected.
  return /*#__PURE__*/React.createElement("div", {
    style: inlineStyle,
    tabIndex: "-1",
    className: classNames(className, styles$a.bubble, _defineProperty({}, styles$a.highlight, highlight))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      left: arrowPos
    },
    className: styles$a.arrow
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$a.inner
  }, children));
}

// Safari does not focus buttons after they are clicked [1]. Focus
// manually to ensure `focus-within` selector that opens the tooltip
// applies.
//
// [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
function fixFocusHandlingSafari(event) {
  if (!event.target.closest) {
    // IE does not support closest, but also does not need this fix.
    return;
  }
  var button = event.target.closest('button');
  if (button) {
    button.focus();
  }
}
Tooltip.defaultProps = {
  arrowPos: '50%',
  fixed: false,
  openOnHover: false,
  verticalOffset: 7,
  horizontalOffset: 0
};

var styles$b = {"button":"ScrollButton-module_button__3rrDc","icon":"ScrollButton-module_icon__128_J","disabled":"ScrollButton-module_disabled__35fFF","visuallyHidden":"ScrollButton-module_visuallyHidden__36chO"};

var size = 40;
function ScrollButton(_ref) {
  var direction = _ref.direction,
    disabled = _ref.disabled,
    onClick = _ref.onClick;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$b.button, _defineProperty({}, styles$b.disabled, disabled)),
    tabIndex: "-1",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$b.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: direction === 'left' ? 'arrowLeft' : 'arrowRight',
    width: size,
    height: size
  }), /*#__PURE__*/React.createElement("span", {
    className: styles$b.visuallyHidden
  }, t(direction === 'left' ? 'pageflow_scrolled.public.previous' : 'pageflow_scrolled.public.next'))));
}

function textColorForBackgroundColor(hex) {
  return invert(hex, true);
}

function registerTemplateWidgetType (typeName, callback) {
  var element = document.getElementById('template-widget-container');
  callback(element);
}

var WidgetSelectionRect = withInlineEditingAlternative('WidgetSelectionRect', function WidgetSelectionRect(_ref) {
  var children = _ref.children;
  return children;
});

var styles$c = {"button":"LinkButton-module_button__33q1F","editable":"LinkButton-module_editable__FzuA4"};

var _excluded$4 = ["href", "openInNewTab", "value", "onTextChange", "onLinkChange", "scaleCategory", "className", "actionButtonVisible", "linkPreviewPosition", "linkPreviewDisabled", "children"];
function LinkButton(_ref) {
  var href = _ref.href,
    openInNewTab = _ref.openInNewTab,
    value = _ref.value,
    onTextChange = _ref.onTextChange,
    onLinkChange = _ref.onLinkChange,
    scaleCategory = _ref.scaleCategory,
    className = _ref.className,
    actionButtonVisible = _ref.actionButtonVisible,
    linkPreviewPosition = _ref.linkPreviewPosition,
    linkPreviewDisabled = _ref.linkPreviewDisabled,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded$4);
  var _useI18n = useI18n({
      locale: 'ui'
    }),
    t = _useI18n.t;
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable;
  return /*#__PURE__*/React.createElement(Text, {
    inline: true,
    scaleCategory: scaleCategory
  }, /*#__PURE__*/React.createElement(EditableLink, Object.assign({
    href: href,
    openInNewTab: openInNewTab,
    linkPreviewPosition: linkPreviewPosition,
    linkPreviewDisabled: utils.isBlankEditableTextValue(value) || linkPreviewDisabled,
    actionButtonVisible: actionButtonVisible,
    className: classNames(styles$c.button, className, _defineProperty({}, styles$c.editable, isEditable)),
    onChange: onLinkChange
  }, props), /*#__PURE__*/React.createElement(EditableInlineText, {
    value: value,
    onChange: onTextChange,
    placeholder: t('pageflow_scrolled.inline_editing.type_text')
  }), children));
}

function _regeneratorRuntime$1() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime$1 = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
var editMode = typeof window !== 'undefined' && window.location.pathname.indexOf('/editor/entries') === 0;
var withShadowClassName = styles$d.withShadow;
global.pageflowScrolledRender = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime$1().mark(function _callee(seed) {
    return _regeneratorRuntime$1().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          setupI18n(seed.i18n);
          features.enable('frontend', seed.config.enabledFeatureNames);
          _context.next = 4;
          return browser.detectFeatures();
        case 4:
          _context.next = 6;
          return loadDashUnlessHlsSupported(seed);
        case 6:
          if (!editMode) {
            _context.next = 11;
            break;
          }
          _context.next = 9;
          return loadInlineEditingComponents();
        case 9:
          _context.next = 12;
          break;
        case 11:
          registerVendors({
            contentElementTypes: api.contentElementTypes,
            consent: consent,
            seed: seed
          });
        case 12:
          render(seed);
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
global.pageflowScrolledRegisterUpdateSeedHandler = function () {
  if (window.parent !== window) {
    window.addEventListener('message', receive);
  }
  function receive(message) {
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'UPDATE_SEED') {
        render(message.data.payload);
      }
    }
  }
};
function render(seed) {
  if (editMode) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Root, {
      seed: seed
    }), document.getElementById('root'));
  } else {
    ReactDOM.hydrate( /*#__PURE__*/React.createElement(Root, {
      seed: seed
    }), document.getElementById('root'));
  }
}
function Root(_ref2) {
  var seed = _ref2.seed;
  return /*#__PURE__*/React.createElement(RootProviders, {
    seed: seed
  }, /*#__PURE__*/React.createElement(Entry, null));
}

export { AudioPlayerControls, ClassicPlayerControls, ContentElementBox, ContentElementFigure, EditableInlineText, EditableLink, Entry, ExpandableImage, Figure, FitViewport, LinkButton, LinkTooltipProvider, MediaInteractionTracking, MediaPlayerControls, PaginationIndicator, Panorama, PlayerControls, Root, ScrollButton, Tooltip, VideoPlayerControls, WaveformPlayerControls, WidgetSelectionRect, registerTemplateWidgetType, textColorForBackgroundColor, useScrollPosition, withShadowClassName };
