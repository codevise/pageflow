import { events, browser, documentHiddenState, PlayerSourceIDMap, media, MultiPlayer, settings, features, consent } from 'pageflow/frontend';
import React, { createContext, useState, useRef, useContext, useEffect, useMemo, useReducer, useCallback, useLayoutEffect } from 'react';
import { _ as _slicedToArray, a as _objectSpread2, b as _defineProperty, u as useI18n, c as useEntryMetadata, d as useNestedFiles, e as _objectWithoutProperties, f as useWidget, g as useTheme, h as _toConsumableArray, i as useContentElement, j as useFileWithInlineRights, k as useFile, l as useSectionForegroundContentElements, m as useAdditionalSeedData, n as useSectionsWithChapter, o as useContentElementConsentVendor, T as ThemeIcon, E as EntryStateProvider, L as LocaleProvider, p as useChapter, q as useDownloadableFile, r as useEntryStateDispatch, s as useSection } from './ThemeIcon-87fcf0dd.js';
import classNames from 'classnames';
import { u as useDelayedBoolean, a as useContentElementEditorState } from './useContentElementEditorState-cd3c272d.js';
import { _ as _createClass, a as _classCallCheck, b as _inherits, c as _getPrototypeOf, d as _possibleConstructorReturn, e as _isNativeReflectConstruct } from './inherits-539844a6.js';
import BackboneEvents from 'backbone-events-standalone';
import I18n from 'i18n-js';
import stripTags from 'striptags';
import Measure from 'react-measure';
import { u as useBrowserFeature, P as PhonePlatformContext, B as BrowserFeaturesProvider } from './PhonePlatformContext-8bfbbea8.js';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var OnScreenObserverRootContext = createContext();
var OnScreenObserverRootProvider = OnScreenObserverRootContext.Provider;
function useOnScreen(ref) {
  var _useContext;
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    rootMargin = _ref.rootMargin,
    onIntersecting = _ref.onIntersecting,
    skipIframeFix = _ref.skipIframeFix;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isIntersecting = _useState2[0],
    setIntersecting = _useState2[1];
  var onIntersectingRef = useRef();
  var root = (_useContext = useContext(OnScreenObserverRootContext)) === null || _useContext === void 0 ? void 0 : _useContext.current;
  useEffect(function () {
    onIntersectingRef.current = onIntersecting;
  }, [onIntersecting]);
  useEffect(function () {
    var current = ref.current;
    var observer = createIntersectionObserver(function (entries) {
      // Even when observing only a single element, multiple entries
      // may have queued up. In Chrome this can be observed when
      // moving an observed element in the DOM: The callback is
      // invoked once with two entries for the same target, one
      // claiming the element no longer intersects and one - with a
      // later timestamp - saying that is does intersect. Assuming
      // entries are ordered according to time, we only consider the
      // last entry.
      var entry = entries[entries.length - 1];
      setIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && onIntersectingRef.current) {
        onIntersectingRef.current();
      }
    }, {
      rootMargin: rootMargin,
      root: root
    }, skipIframeFix);
    if (ref.current) {
      observer.observe(current);
    }
    return function () {
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
    var optionsWithIframeFix = options;
    if (options.rootMargin && window.parent !== window) {
      optionsWithIframeFix = _objectSpread2(_objectSpread2({}, options), {}, {
        root: window.document
      });
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

var styles = {"wrapper":"useScrollPositionLifecycle-module_wrapper__1a6Kr","isActiveProbe":"useScrollPositionLifecycle-module_isActiveProbe__3VKB5"};

var StaticPreviewContext = createContext(false);
function StaticPreview(_ref) {
  var children = _ref.children;
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
  return function ScrollPositionLifecycleProvider(_ref2) {
    var children = _ref2.children,
      onActivate = _ref2.onActivate,
      entersWithFadeTransition = _ref2.entersWithFadeTransition;
    var ref = useRef();
    var isActiveProbeRef = useRef();
    var isStaticPreview = useContext(StaticPreviewContext);
    var shouldLoad = useOnScreen(ref, {
      rootMargin: '200% 0px 200% 0px'
    });
    var shouldPrepare = useOnScreen(ref, {
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
    var shouldBeVisible = useOnScreen(ref, {
      rootMargin: entersWithFadeTransition ? '0px 0px -50% 0px' : undefined
    }) && !isStaticPreview;
    var shouldBeActive = useOnScreen(isActiveProbeRef, {
      rootMargin: '-50% 0px -50% 0px',
      onIntersecting: onActivate
    }) && !isStaticPreview;

    // useDelayedBoolean causes an extra render once the delay has
    // elapsed. When entersWithFadeTransition is false,
    // isVisibleWithDelay is never used, though. Since hooks can not
    // be wrapped in conditionals, we ensure that the value passed to
    // useDelayedBoolean is always false if entersWithFadeTransition
    // is false. This prevents the extra render.
    var isVisibleWithDelay = useDelayedBoolean(shouldBeVisible && entersWithFadeTransition, {
      fromTrueToFalse: 1000
    });
    var isVisible = entersWithFadeTransition ? isVisibleWithDelay : shouldBeVisible;

    // We want to make sure that `onActivate` is never called before
    // `onVisible`, no matter in which order the intersection
    // observers above fire.
    var isActive = isVisible && shouldBeActive;
    var value = useMemo(function () {
      return {
        shouldLoad: shouldLoad,
        shouldPrepare: shouldPrepare,
        isVisible: isVisible,
        isActive: isActive
      };
    }, [shouldLoad, shouldPrepare, isVisible, isActive]);
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
  return function useScrollPositionLifecycle() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onActivate = _ref3.onActivate,
      onDeactivate = _ref3.onDeactivate,
      onVisible = _ref3.onVisible,
      onInvisible = _ref3.onInvisible;
    var result = useContext(Context);
    var wasActive = useRef();
    var wasVisible = useRef();
    var _ref4 = result || {},
      isActive = _ref4.isActive,
      isVisible = _ref4.isVisible;
    useEffect(function () {
      if (!wasVisible.current && isVisible && onVisible) {
        onVisible();
      }
      if (!wasActive.current && isActive && onActivate) {
        onActivate();
      } else if (wasActive.current && !isActive && onDeactivate) {
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

var SectionLifecycleContext = createContext();
var SectionLifecycleProvider = createScrollPositionLifecycleProvider(SectionLifecycleContext);
var useSectionLifecycle = createScrollPositionLifecycleHook(SectionLifecycleContext);

var Atmo = /*#__PURE__*/function () {
  function Atmo(_ref) {
    var _this = this;
    var atmoSourceId = _ref.atmoSourceId,
      multiPlayer = _ref.multiPlayer,
      backgroundMedia = _ref.backgroundMedia;
    _classCallCheck(this, Atmo);
    this.multiPlayer = multiPlayer;
    this.atmoSourceId = atmoSourceId;
    this.backgroundMedia = backgroundMedia;
    this.backgroundMedia.on('change:muted', function () {
      _this.update();
    });
    documentHiddenState(function (hiddenState) {
      if (hiddenState === 'hidden') {
        _this.multiPlayer.fadeOutIfPlaying();
      } else {
        _this.update();
      }
    });
    this.listenTo(this.multiPlayer, 'playfailed', function () {
      backgroundMedia.mute(true);
    });
  }
  _createClass(Atmo, [{
    key: "disable",
    value: function disable() {
      this.disabled = true;
      this.multiPlayer.fadeOutAndPause();
      events.trigger('atmo:disabled');
    }
  }, {
    key: "enable",
    value: function enable() {
      this.disabled = false;
      this.update();
      events.trigger('atmo:enabled');
    }
  }, {
    key: "pause",
    value: function pause() {
      if (browser.has('volume control support')) {
        return this.multiPlayer.fadeOutAndPause();
      } else {
        this.multiPlayer.pause();
      }
    }
  }, {
    key: "turnDown",
    value: function turnDown() {
      if (browser.has('volume control support')) {
        return this.multiPlayer.changeVolumeFactor(0.2);
      } else {
        this.multiPlayer.pause();
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.multiPlayer.paused()) {
        if (this.disabled || this.backgroundMedia.muted) {
          return Promise.resolve();
        } else {
          return this.multiPlayer.resumeAndFadeIn();
        }
      } else {
        return this.multiPlayer.changeVolumeFactor(1);
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.disabled) {
        if (this.backgroundMedia.muted) {
          this.multiPlayer.fadeOutAndPause();
        } else {
          this.multiPlayer.fadeTo(this.atmoSourceId);
        }
      }
    }
  }, {
    key: "createMediaPlayerHooks",
    value: function createMediaPlayerHooks(atmoDuringPlayback) {
      var atmo = this;
      return {
        before: function before() {
          if (atmoDuringPlayback === 'mute') {
            atmo.pause();
          } else if (atmoDuringPlayback === 'turnDown') {
            atmo.turnDown();
          }
        },
        after: function after() {
          atmo.resume();
        }
      };
    }
  }]);
  return Atmo;
}();
Object.assign(Atmo.prototype, BackboneEvents);

function getContextValue(updateAtmo, createMediaPlayerHooks) {
  var empty = function empty() {};
  return {
    updateAtmo: updateAtmo || empty,
    createMediaPlayerHooks: createMediaPlayerHooks || empty
  };
}
var AtmoContext = createContext(getContextValue());
function AtmoProvider(_ref) {
  var children = _ref.children;
  var atmoConfig = useRef({});
  useEffect(function () {
    var currentAtmo = atmoConfig.current;
    currentAtmo.pool = PlayerSourceIDMap(media, {
      playerOptions: {
        tagName: 'audio',
        loop: true
      }
    });
    currentAtmo.multiPlayer = new MultiPlayer(currentAtmo.pool, {
      fadeDuration: 500,
      crossFade: true,
      playFromBeginning: false,
      rewindOnChange: true
    });
    currentAtmo.atmo = new Atmo({
      multiPlayer: currentAtmo.multiPlayer,
      backgroundMedia: media
    });
  }, []);
  var updateAtmo = function updateAtmo(_ref2) {
    var audioFilePermaId = _ref2.audioFilePermaId,
      sources = _ref2.sources;
    var currentAtmo = atmoConfig.current;
    if (currentAtmo.atmo) {
      currentAtmo.pool.mapSources(audioFilePermaId, sources);
      currentAtmo.atmo.atmoSourceId = audioFilePermaId;
      currentAtmo.atmo.update();
    }
  };
  var createMediaPlayerHooks = function createMediaPlayerHooks(options) {
    if (atmoConfig.current.atmo) {
      return atmoConfig.current.atmo.createMediaPlayerHooks(options);
    }
  };
  var contextValue = useMemo(function () {
    return getContextValue(updateAtmo, createMediaPlayerHooks);
  }, []);
  return /*#__PURE__*/React.createElement(AtmoContext.Provider, {
    value: contextValue
  }, children);
}
function useAtmo() {
  return useContext(AtmoContext);
}

function PlayerContainer(_ref) {
  var filePermaId = _ref.filePermaId,
    sources = _ref.sources,
    textTrackSources = _ref.textTrackSources,
    type = _ref.type,
    playsInline = _ref.playsInline,
    loop = _ref.loop,
    controls = _ref.controls,
    altText = _ref.altText,
    mediaEventsContextData = _ref.mediaEventsContextData,
    atmoDuringPlayback = _ref.atmoDuringPlayback,
    onSetup = _ref.onSetup,
    onDispose = _ref.onDispose;
  var playerWrapperRef = useRef(null);
  var atmo = useAtmo();
  useEffect(function () {
    var playerWrapper = playerWrapperRef.current;
    if (sources) {
      var player = media.getPlayer(sources, {
        textTrackSources: textTrackSources,
        filePermaId: filePermaId,
        tagName: type,
        playsInline: playsInline,
        loop: loop,
        controls: controls,
        hooks: atmoDuringPlayback ? atmo.createMediaPlayerHooks(atmoDuringPlayback) : {},
        //create hooks only for inline media players
        mediaEventsContextData: mediaEventsContextData,
        altText: altText,
        onRelease: function onRelease() {
          playerWrapper.removeChild(player.el());
          player = null;
          if (onDispose) {
            onDispose();
          }
        }
      });
      playerWrapper.appendChild(player.el());
      if (onSetup) {
        onSetup(player);
      }
      return function () {
        // onRelease might already have been called by the pool when
        // it needed to re-use a player.
        if (player) {
          media.releasePlayer(player);
        }
      };
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: playerWrapperRef
  });
}
PlayerContainer.defaultProps = {
  textTrackSources: []
};

// This function assumes that that the parameters are arrays of
// objects containing only skalar values. It is not a full deep
// equality check, but  suffices for the use case.
function deepEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    var aItem = a[i];
    var bItem = b[i];
    if (Object.keys(aItem).length !== Object.keys(bItem).length) {
      return false;
    }
    for (var key in aItem) {
      if (aItem[key] !== bItem[key]) {
        return false;
      }
    }
  }
  return true;
}
function areEqual(prevProps, nextProps) {
  return prevProps.type === nextProps.type && prevProps.playsInline === nextProps.playsInline && prevProps.loop === nextProps.loop && prevProps.controls === nextProps.controls && prevProps.altText === nextProps.altText && prevProps.atmoDuringPlayback === nextProps.atmoDuringPlayback && deepEqual(prevProps.sources, nextProps.sources) && deepEqual(prevProps.textTrackSources, nextProps.textTrackSources);
}
var PlayerContainer$1 = React.memo(PlayerContainer, areEqual);

function watchPlayer(player, actions) {
  player.on('loadedmetadata', function () {
    return actions.metaDataLoaded(player.currentTime(), player.duration());
  });
  player.on('loadeddata', function () {
    return actions.dataLoaded();
  });
  player.on('progress', function () {
    return actions.progress(player.bufferedEnd());
  });
  player.on('play', actions.playing);
  player.on('playfailed', actions.playFailed);
  player.on('pause', actions.paused);
  player.on('waiting', actions.waiting);
  player.on('seeking', actions.seeking);
  player.on('seeked', actions.seeked);
  player.on('bufferunderrun', actions.bufferUnderrun);
  player.on('bufferunderruncontinue', actions.bufferUnderrunContinue);
  player.on('timeupdate', handleTimeUpdate);
  player.on('ended', actions.ended);
  player.one('loadedmetadata', function () {
    return actions.saveMediaElementId(player.getMediaElement().id);
  });
  function handleTimeUpdate() {
    actions.timeUpdate(player.currentTime(), player.duration());
  }
  return function () {
    player.off('loadedmetadata');
    player.off('loadeddata');
    player.off('progress');
    player.off('play', actions.playing);
    player.off('playfailed', actions.playFailed);
    player.off('pause', actions.paused);
    player.off('waiting', actions.waiting);
    player.off('seeking', actions.seeking);
    player.off('seeked', actions.seeked);
    player.off('bufferunderrun', actions.bufferUnderrun);
    player.off('bufferunderruncontinue', actions.bufferUnderrunContinue);
    player.off('timeupdate', handleTimeUpdate);
    player.off('canplay');
    player.off('ended', actions.ended);
    actions.discardMediaElementId();
  };
}

function applyPlayerState(player, playerState, playerActions) {
  player.one('loadedmetadata', function () {
    return player.currentTime(playerState.currentTime);
  });
  player.changeVolumeFactor(playerState.volumeFactor, 0);
  if (playerState.shouldPrebuffer) {
    player.prebuffer().then(playerActions.prebuffered);
  }
  if (playerState.shouldPlay) {
    player.play();
  }
  player.on('canplay', function () {
    if (playerState.shouldPlay && player.paused()) {
      player.play();
    }
  });
}

function updatePlayerState(player, prevPlayerState, playerState, playerActions) {
  if (!prevPlayerState.shouldPrebuffer && playerState.shouldPrebuffer) {
    player.prebuffer().then(function () {
      return setTimeout(playerActions.prebuffered, 0);
    });
  }
  if (!prevPlayerState.shouldPlay && playerState.shouldPlay) {
    if (playerState.fadeDuration) {
      player.playAndFadeIn(playerState.fadeDuration);
    } else {
      player.playOrPlayOnLoad();
    }
  } else if (prevPlayerState.shouldPlay && !playerState.shouldPlay && playerState.isPlaying) {
    if (playerState.fadeDuration && !player.muted()) {
      player.fadeOutAndPause(playerState.fadeDuration);
    } else {
      player.pause();
    }
  }
  if (playerState.shouldSeekTo !== undefined && prevPlayerState.shouldSeekTo !== playerState.shouldSeekTo) {
    player.currentTime(playerState.shouldSeekTo);
  }
  if (prevPlayerState.volumeFactor !== playerState.volumeFactor) {
    player.changeVolumeFactor(playerState.volumeFactor, playerState.volumeFactorFadeDuration);
  }
}

function updateObjectPosition(player, x, y) {
  player.getMediaElement().style.objectPosition = typeof x !== 'undefined' && typeof y !== 'undefined' ? "".concat(x, "% ").concat(y, "%") : '';
}

function getEventObject(_ref) {
  var section = _ref.section,
    sectionsCount = _ref.sectionsCount;
  var page = {
    getAnalyticsData: function getAnalyticsData() {
      return {
        chapterIndex: section === null || section === void 0 ? void 0 : section.chapter.index,
        chapterTitle: section === null || section === void 0 ? void 0 : section.chapter.title,
        index: section ? section.sectionIndex : -1,
        total: sectionsCount
      };
    },
    index: section ? section.sectionIndex : -1,
    configuration: {
      title: section ? section.chapter.title + ', Section ' + section.sectionIndex : null
    }
  };
  return page;
}
var EventContext = createContext(getEventObject({}));
function EventContextDataProvider(_ref2) {
  var section = _ref2.section,
    sectionsCount = _ref2.sectionsCount,
    children = _ref2.children;
  var contextValue = useMemo(function () {
    return {
      page: getEventObject({
        section: section,
        sectionsCount: sectionsCount
      })
    };
  }, [section, sectionsCount]);
  return /*#__PURE__*/React.createElement(EventContext.Provider, {
    value: contextValue
  }, children);
}
function PlayerEventContextDataProvider(_ref3) {
  var playbackMode = _ref3.playbackMode,
    playerDescription = _ref3.playerDescription,
    children = _ref3.children;
  var original = useEventContextData();
  var value = useMemo(function () {
    return _objectSpread2(_objectSpread2({}, original), {}, {
      playbackMode: playbackMode,
      playerDescription: playerDescription
    });
  }, [original, playbackMode, playerDescription]);
  return /*#__PURE__*/React.createElement(EventContext.Provider, {
    value: value
  }, children);
}
function useEventContextData() {
  return useContext(EventContext);
}

function updateTextTracksMode(player, activeTextTrackFileId) {
  [].slice.call(player.textTracks()).forEach(function (textTrack) {
    if (textTrack.id === "text_track_file_".concat(activeTextTrackFileId)) {
      textTrack.mode = 'showing';
    } else {
      textTrack.mode = 'disabled';
    }
  });
}
function getTextTrackSources(textTrackFiles, textTracksDisabled) {
  if (textTracksDisabled) {
    return [];
  }
  return textTrackFiles.filter(function (textTrackFile) {
    return textTrackFile.isReady;
  }).map(function (textTrackFile) {
    return {
      id: "text_track_file_".concat(textTrackFile.id),
      kind: textTrackFile.configuration.kind,
      label: textTrackFile.displayLabel,
      srclang: textTrackFile.configuration.srclang,
      src: textTrackFile.urls.vtt
    };
  });
}

var textTrackStyles = {"inset":"textTracks-module_inset__K7DIL"};

var styles$1 = {"wrapper":"MediaPlayer-module_wrapper__1cSGR","cover":"MediaPlayer-module_cover__2wGez"};

var PLAY = 'MEDIA_PLAY';
var PLAYING = 'MEDIA_PLAYING';
var PLAY_FAILED = 'MEDIA_PLAY_FAILED';
var PAUSE = 'MEDIA_PAUSE';
var PAUSED = 'MEDIA_PAUSED';
var PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
var FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';
var CHANGE_VOLUME_FACTOR = 'CHANGE_VOLUME_FACTOR';
var META_DATA_LOADED = 'MEDIA_META_DATA_LOADED';
var DATA_LOADED = 'MEDIA_DATA_LOADED';
var PROGRESS = 'MEDIA_PROGRESS';
var TIME_UPDATE = 'MEDIA_TIME_UPDATE';
var ENDED = 'MEDIA_ENDED';
var SCRUB_TO = 'MEDIA_SCRUB_TO';
var SEEK_TO = 'MEDIA_SEEK_TO';
var SEEKING = 'MEDIA_SEEKING';
var SEEKED = 'MEDIA_SEEKED';
var WAITING = 'MEDIA_WAITING';
var PREBUFFER = 'MEDIA_PREBUFFER';
var PREBUFFERED = 'MEDIA_PREBUFFERED';
var BUFFER_UNDERRUN = 'MEDIA_BUFFER_UNDERRUN';
var BUFFER_UNDERRUN_CONTINUE = 'MEDIA_BUFFER_UNDERRUN_CONTINUE';
var MOUSE_ENTERED = 'MEDIA_MOUSE_ENTERED';
var MOUSE_LEFT = 'MEDIA_MOUSE_LEFT';
var MOUSE_ENTERED_CONTROLS = 'MEDIA_MOUSE_ENTERED_CONTROLS';
var MOUSE_LEFT_CONTROLS = 'MEDIA_MOUSE_LEFT_CONTROLS';
var FOCUS_ENTERED_CONTROLS = 'MEDIA_FOCUS_ENTERED_CONTROLS';
var FOCUS_LEFT_CONTROLS = 'MEDIA_FOCUS_LEFT_CONTROLS';
var USER_INTERACTION = 'MEDIA_USER_INTERACTION';
var USER_IDLE = 'MEDIA_USER_IDLE';
var SAVE_MEDIA_ELEMENT_ID = 'MEDIA_SAVE_MEDIA_ELEMENT_ID';
var DISCARD_MEDIA_ELEMENT_ID = 'MEDIA_DISCARD_MEDIA_ELEMENT_ID';
function createActions(dispatch) {
  return {
    playBlessed: function playBlessed() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        via = _ref.via;
      media.mute(false);
      dispatch({
        type: PLAY,
        payload: {
          via: via
        }
      });
    },
    play: function play() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        via = _ref2.via;
      dispatch({
        type: PLAY,
        payload: {
          via: via
        }
      });
    },
    playing: function playing() {
      dispatch({
        type: PLAYING
      });
    },
    playFailed: function playFailed() {
      dispatch({
        type: PLAY_FAILED
      });
    },
    pause: function pause() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        via = _ref3.via;
      dispatch({
        type: PAUSE,
        payload: {
          via: via
        }
      });
    },
    paused: function paused() {
      dispatch({
        type: PAUSED
      });
    },
    playAndFadeIn: function playAndFadeIn(fadeDuration) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        via = _ref4.via;
      dispatch({
        type: PLAY_AND_FADE_IN,
        payload: {
          fadeDuration: fadeDuration,
          via: via
        }
      });
    },
    fadeOutAndPause: function fadeOutAndPause(fadeDuration) {
      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        via = _ref5.via;
      dispatch({
        type: FADE_OUT_AND_PAUSE,
        payload: {
          fadeDuration: fadeDuration,
          via: via
        }
      });
    },
    changeVolumeFactor: function changeVolumeFactor(volumeFactor, fadeDuration) {
      dispatch({
        type: CHANGE_VOLUME_FACTOR,
        payload: {
          fadeDuration: fadeDuration,
          volumeFactor: volumeFactor
        }
      });
    },
    metaDataLoaded: function metaDataLoaded(currentTime, duration) {
      dispatch({
        type: META_DATA_LOADED,
        payload: {
          currentTime: currentTime,
          duration: duration
        }
      });
    },
    dataLoaded: function dataLoaded() {
      dispatch({
        type: DATA_LOADED
      });
    },
    progress: function progress(bufferedEnd) {
      dispatch({
        type: PROGRESS,
        payload: {
          bufferedEnd: bufferedEnd
        }
      });
    },
    timeUpdate: function timeUpdate(currentTime, duration) {
      dispatch({
        type: TIME_UPDATE,
        payload: {
          currentTime: currentTime,
          duration: duration
        }
      });
    },
    ended: function ended() {
      dispatch({
        type: ENDED
      });
    },
    scrubTo: function scrubTo(time) {
      dispatch({
        type: SCRUB_TO,
        payload: {
          time: time
        }
      });
    },
    seekTo: function seekTo(time) {
      dispatch({
        type: SEEK_TO,
        payload: {
          time: time
        }
      });
    },
    seeking: function seeking() {
      dispatch({
        type: SEEKING
      });
    },
    seeked: function seeked() {
      dispatch({
        type: SEEKED
      });
    },
    waiting: function waiting() {
      dispatch({
        type: WAITING
      });
    },
    prebuffer: function prebuffer() {
      dispatch({
        type: PREBUFFER
      });
    },
    prebuffered: function prebuffered() {
      dispatch({
        type: PREBUFFERED
      });
    },
    bufferUnderrun: function bufferUnderrun() {
      dispatch({
        type: BUFFER_UNDERRUN
      });
    },
    bufferUnderrunContinue: function bufferUnderrunContinue() {
      dispatch({
        type: BUFFER_UNDERRUN_CONTINUE
      });
    },
    mouseEntered: function mouseEntered() {
      dispatch({
        type: MOUSE_ENTERED
      });
    },
    mouseLeft: function mouseLeft() {
      dispatch({
        type: MOUSE_LEFT
      });
    },
    mouseEnteredControls: function mouseEnteredControls() {
      dispatch({
        type: MOUSE_ENTERED_CONTROLS
      });
    },
    mouseLeftControls: function mouseLeftControls() {
      dispatch({
        type: MOUSE_LEFT_CONTROLS
      });
    },
    userInteraction: function userInteraction() {
      dispatch({
        type: USER_INTERACTION
      });
    },
    userIdle: function userIdle() {
      dispatch({
        type: USER_IDLE
      });
    },
    focusEnteredControls: function focusEnteredControls() {
      dispatch({
        type: FOCUS_ENTERED_CONTROLS
      });
    },
    focusLeftControls: function focusLeftControls() {
      dispatch({
        type: FOCUS_LEFT_CONTROLS
      });
    },
    saveMediaElementId: function saveMediaElementId(id) {
      dispatch({
        type: SAVE_MEDIA_ELEMENT_ID,
        payload: {
          id: id
        }
      });
    },
    discardMediaElementId: function discardMediaElementId() {
      dispatch({
        type: DISCARD_MEDIA_ELEMENT_ID
      });
    }
  };
}

function getInitialPlayerState() {
  return {
    isPlaying: false,
    shouldPlay: false,
    unplayed: true,
    dataLoaded: false,
    isLoading: true,
    playFailed: false,
    duration: 0,
    bufferedEnd: 0,
    shouldPrebuffer: true,
    fadeDuration: undefined,
    bufferUnderrun: undefined,
    scrubbingAt: undefined,
    currentTime: 0,
    mediaElementId: undefined,
    shouldSeekTo: undefined,
    userHovering: false,
    userHoveringControls: false,
    focusInsideControls: false,
    userIdle: false,
    volumeFactor: 1
  };
}
function playerStateReducer(state, action) {
  switch (action.type) {
    case PLAY:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        isLoading: true,
        shouldPlay: true,
        playFailed: false,
        unplayed: false,
        lastControlledVia: action.payload.via
      });
    case PLAYING:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: true,
        isPlaying: true,
        userIdle: false
      });
    case PLAY_AND_FADE_IN:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: true,
        fadeDuration: action.payload.fadeDuration,
        isLoading: true,
        lastControlledVia: action.payload.via
      });
    case FADE_OUT_AND_PAUSE:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: false,
        fadeDuration: action.payload.fadeDuration,
        isLoading: false,
        lastControlledVia: action.payload.via
      });
    case PLAY_FAILED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: false,
        playFailed: true,
        fadeDuration: null,
        unplayed: true,
        isLoading: false
      });
    case PAUSE:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: false,
        isLoading: false,
        fadeDuration: null,
        lastControlledVia: action.payload.via
      });
    case PAUSED:
      if (state.bufferUnderrun) {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          isPlaying: false
        });
      } else {
        return _objectSpread2(_objectSpread2({}, state), {}, {
          shouldPlay: false,
          fadeDuration: null,
          isPlaying: false,
          isLoading: false
        });
      }
    case SCRUB_TO:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        scrubbingAt: action.payload.time
      });
    case SEEK_TO:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldSeekTo: action.payload.time
      });
    case SEEKING:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        isLoading: true
      });
    case SEEKED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldSeekTo: undefined,
        scrubbingAt: undefined,
        isLoading: false
      });
    case META_DATA_LOADED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        currentTime: action.payload.currentTime,
        duration: action.payload.duration
      });
    case DATA_LOADED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        dataLoaded: true
      });
    case PROGRESS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        bufferedEnd: action.payload.bufferedEnd
      });
    case TIME_UPDATE:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        currentTime: action.payload.currentTime,
        duration: action.payload.duration,
        isLoading: false
      });
    case ENDED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPlay: false,
        isPlaying: false,
        unplayed: true,
        lastControlledVia: null
      });
    case WAITING:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        isLoading: true
      });
    case PREBUFFER:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPrebuffer: true
      });
    case PREBUFFERED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        shouldPrebuffer: false
      });
    case BUFFER_UNDERRUN:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        bufferUnderrun: true
      });
    case BUFFER_UNDERRUN_CONTINUE:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        bufferUnderrun: false
      });
    case MOUSE_ENTERED:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userHovering: true
      });
    case MOUSE_LEFT:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userHovering: false
      });
    case MOUSE_ENTERED_CONTROLS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userHoveringControls: true
      });
    case MOUSE_LEFT_CONTROLS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userHoveringControls: false
      });
    case FOCUS_ENTERED_CONTROLS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        focusInsideControls: true,
        userIdle: false
      });
    case FOCUS_LEFT_CONTROLS:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        focusInsideControls: false,
        userIdle: false
      });
    case USER_INTERACTION:
      if (!state.userIdle) {
        return state;
      }
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userIdle: false
      });
    case USER_IDLE:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        userIdle: true
      });
    case SAVE_MEDIA_ELEMENT_ID:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        mediaElementId: action.payload.id
      });
    case DISCARD_MEDIA_ELEMENT_ID:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        dataLoaded: false,
        isPlaying: false,
        mediaElementId: null
      });
    case CHANGE_VOLUME_FACTOR:
      return _objectSpread2(_objectSpread2({}, state), {}, {
        volumeFactor: action.payload.volumeFactor,
        volumeFactorFadeDuration: action.payload.fadeDuration
      });
    default:
      return state;
  }
}
function usePlayerState() {
  var _useReducer = useReducer(playerStateReducer, getInitialPlayerState()),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  var actions = useMemo(function () {
    return createActions(dispatch);
  }, [dispatch]);
  return [state, actions];
}

function MediaPlayer(props) {
  var isStaticPreview = useIsStaticPreview();
  var load = props.load === 'auto' && isStaticPreview ? 'poster' : props.load;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, styles$1[props.fit], _defineProperty({}, textTrackStyles.inset, props.textTracksInset))
  }, load === 'auto' && /*#__PURE__*/React.createElement(PreparedMediaPlayer, props), load !== 'none' && /*#__PURE__*/React.createElement(Poster, {
    imageUrl: props.posterImageUrl,
    objectPosition: props.objectPosition,
    hide: props.type === 'video' && load !== 'poster' && props.playerState.dataLoaded && !props.playerState.unplayed
  }));
}
MediaPlayer.defaultProps = {
  load: 'auto'
};
function Poster(_ref) {
  var imageUrl = _ref.imageUrl,
    objectPosition = _ref.objectPosition,
    hide = _ref.hide;
  if (!imageUrl) {
    return null;
  }
  return /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: "",
    style: {
      display: hide ? 'none' : undefined,
      objectPosition: objectPosition && "".concat(objectPosition.x, "% ").concat(objectPosition.y, "%")
    }
  });
}
function PreparedMediaPlayer(props) {
  var playerRef = useRef();
  var previousPlayerState = useRef(props.playerState);
  var eventContextData = useEventContextData();
  var unwatchPlayer;
  var onSetup = function onSetup(newPlayer) {
    playerRef.current = newPlayer;
    unwatchPlayer = watchPlayer(newPlayer, props.playerActions);
    applyPlayerState(newPlayer, props.playerState, props.playerActions);
    updateObjectPosition(newPlayer, props.objectPosition.x, props.objectPosition.y);
  };
  var onDispose = function onDispose() {
    unwatchPlayer();
    playerRef.current = undefined;
  };
  useEffect(function () {
    var player = playerRef.current;
    if (player) {
      updatePlayerState(player, previousPlayerState.current, props.playerState, props.playerActions);
    }
    previousPlayerState.current = props.playerState;
  }, [props.playerState, props.playerActions]);
  useEffect(function () {
    var player = playerRef.current;
    if (player) {
      updateTextTracksMode(player, props.textTracks.activeFileId);
    }
  }, [props.textTracks.activeFileId]);
  useEffect(function () {
    var player = playerRef.current;
    if (player) {
      updateObjectPosition(player, props.objectPosition.x, props.objectPosition.y);
    }
  }, [props.objectPosition.x, props.objectPosition.y]);
  return /*#__PURE__*/React.createElement(PlayerContainer$1, {
    type: props.type,
    sources: appendSuffix(props.sources, props.sourceUrlSuffix),
    textTrackSources: getTextTrackSources(props.textTracks.files, props.textTracksDisabled),
    filePermaId: props.filePermaId,
    loop: props.loop,
    controls: props.controls,
    playsInline: props.playsInline,
    mediaEventsContextData: eventContextData,
    atmoDuringPlayback: props.atmoDuringPlayback,
    onSetup: onSetup,
    onDispose: onDispose,
    altText: props.altText
  });
}
PreparedMediaPlayer.defaultProps = {
  objectPosition: {},
  textTracks: {
    files: []
  }
};
function appendSuffix(sources, suffix) {
  if (!suffix) {
    return sources;
  }
  return sources.map(function (source) {
    return _objectSpread2(_objectSpread2({}, source), {}, {
      src: "".concat(source.src).concat(suffix)
    });
  });
}

function useSetting(name) {
  var _useState = useState(settings.get(name)),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  useEffect(function () {
    function update() {
      setValue(settings.get(name));
    }
    settings.on("change:".concat(name), update);
    return function () {
      return settings.off(undefined, update);
    };
  }, [setValue, name]);
  var setter = useCallback(function (value) {
    return settings.set(name, value);
  }, [name]);
  return [value, setter];
}

function useTextTracks(_ref) {
  var file = _ref.file,
    defaultTextTrackFilePermaId = _ref.defaultTextTrackFilePermaId,
    captionsByDefault = _ref.captionsByDefault;
  var _useSetting = useSetting('textTrack'),
    _useSetting2 = _slicedToArray(_useSetting, 2),
    setting = _useSetting2[0],
    setSetting = _useSetting2[1];
  setting = setting || {};
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var _useEntryMetadata = useEntryMetadata(),
    locale = _useEntryMetadata.locale;
  var textTrackFiles = useTextTrackFiles({
    file: file
  });
  var autoTextTrackFile = getAutoTextTrackFile(textTrackFiles, defaultTextTrackFilePermaId, locale, captionsByDefault);
  return {
    mode: setting.kind === 'off' ? 'off' : setting.kind ? 'user' : 'auto',
    autoDisplayLabel: autoTextTrackFile ? t('pageflow_scrolled.public.text_track_modes.auto', {
      label: autoTextTrackFile.displayLabel
    }) : t('pageflow_scrolled.public.text_track_modes.auto_off'),
    files: textTrackFiles,
    activeFileId: getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, setting),
    select: function select(textTrackFileIdOrKind) {
      if (textTrackFileIdOrKind === 'off') {
        setSetting({
          kind: 'off'
        });
      } else if (textTrackFileIdOrKind === 'auto') {
        setSetting({});
      } else {
        var textTrackFile = textTrackFiles.find(function (file) {
          return file.id === textTrackFileIdOrKind;
        });
        setSetting({
          kind: textTrackFile.configuration.kind,
          srclang: textTrackFile.configuration.srclang
        });
      }
    }
  };
}
function useTextTrackFiles(_ref2) {
  var file = _ref2.file;
  var _useI18n2 = useI18n(),
    t = _useI18n2.t;
  return useNestedFiles({
    collectionName: 'textTrackFiles',
    parent: file
  }).map(function (file) {
    return addDisplayLabel(file, t);
  }).sort(function (file1, file2) {
    return file1.displayLabel.localeCompare(file2.displayLabel);
  });
}
function getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, setting) {
  if (setting.kind === 'off') {
    return null;
  }
  var file = textTrackFiles.find(function (textTrackFile) {
    return textTrackFile.configuration.srclang === setting.srclang && textTrackFile.configuration.kind === setting.kind;
  });
  if (file) {
    return file.id;
  }
  return autoTextTrackFile && autoTextTrackFile.id;
}
function getAutoTextTrackFile(textTrackFiles, defaultTextTrackFilePermaId, locale, captionsByDefault) {
  if (defaultTextTrackFilePermaId) {
    var defaultTextTrackFile = textTrackFiles.find(function (textTrackFile) {
      return textTrackFile.permaId === defaultTextTrackFilePermaId;
    });
    if (defaultTextTrackFile) {
      return defaultTextTrackFile;
    }
  }
  var subtitlesInEntryLanguage = textTrackFiles.find(function (textTrackFile) {
    return textTrackFile.configuration.kind === 'subtitles' && textTrackFile.configuration.srclang === locale;
  });
  var defaultCaptions = captionsByDefault ? textTrackFiles.find(function (textTrackFile) {
    return textTrackFile.configuration.kind === 'captions';
  }) : null;
  return subtitlesInEntryLanguage || defaultCaptions;
}
function addDisplayLabel(textTrackFile, t) {
  return _objectSpread2(_objectSpread2({}, textTrackFile), {}, {
    displayLabel: textTrackFile.configuration.label || t('pageflow_scrolled.public.languages.' + textTrackFile.configuration.srclang || 'unknown', {
      defaultValue: t('pageflow_scrolled.public.languages.unknown')
    })
  });
}

var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function usePrevious(value) {
  var ref = useRef();
  useEffect(function () {
    ref.current = value;
  });
  return ref.current;
}

var MediaMutedContext = createContext(false);
function MediaMutedProvider(_ref) {
  var children = _ref.children;
  var _useState = useState(media.muted),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  useEffect(function () {
    media.on('change:muted', setValue);
    return function () {
      return media.off('change:muted', setValue);
    };
  }, []);
  return /*#__PURE__*/React.createElement(MediaMutedContext.Provider, {
    value: value
  }, children);
}

/**
 * Returns boolean indicating whether the entry is currently muted.
 */
function useMediaMuted() {
  return useContext(MediaMutedContext);
}
function useOnUnmuteMedia(callback) {
  var muted = useMediaMuted();
  var wasMuted = usePrevious(muted);
  useIsomorphicLayoutEffect(function () {
    if (wasMuted && !muted) {
      callback();
    }
  }, [wasMuted, muted, callback]);
}

function ensureProtocol(protocol, url) {
  if (url && url.match(/^\/\//)) {
    return "".concat(protocol, ":").concat(url);
  }
  return url;
}

function formatTimeDuration(durationInMs) {
  var seconds = Math.round(durationInMs / 1000) % 60;
  var minutes = Math.floor(durationInMs / 1000 / 60) % 60;
  var hours = Math.floor(durationInMs / 1000 / 60 / 60);
  var result = 'PT';
  if (hours > 0) {
    result += "".concat(hours, "H");
  }
  if (minutes > 0) {
    result += "".concat(minutes, "M");
  }
  if (seconds > 0 || minutes === 0 && hours === 0) {
    result += "".concat(seconds, "S");
  }
  return result;
}

function StructuredData(_ref) {
  var data = _ref.data;
  return /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data)
    }
  });
}

function AudioStructuredData(_ref) {
  var file = _ref.file;
  var entryMedadata = useEntryMetadata();
  var data = {
    '@context': 'http://schema.org',
    '@type': 'AudioObject',
    name: file.basename,
    description: file.configuration.alt,
    url: ensureProtocol('https', file.urls.mp3),
    duration: formatTimeDuration(file.durationInMs),
    datePublished: entryMedadata.publishedAt,
    uploadDate: file.createdAt,
    copyrightHolder: {
      '@type': 'Organization',
      name: file.rights
    }
  };
  return /*#__PURE__*/React.createElement(StructuredData, {
    data: data
  });
}

var styles$2 = {"spaceForTextTracks":"AudioPlayer-module_spaceForTextTracks__169MK","spaceForTextTracksActive":"AudioPlayer-module_spaceForTextTracksActive__99m7R"};

var _excluded = ["audioFile", "posterImageFile"];

/**
 * Render audio file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.audioFile - Audio file obtained via `useFile`.
 * @param {number} [props.posterImageFile] - Poster image file obtained via `useFile`.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {string} [props.load] - Control lazy loading. `"auto"` (default), `"poster"` or `"none"`.
 */
function AudioPlayer(_ref) {
  var audioFile = _ref.audioFile,
    posterImageFile = _ref.posterImageFile,
    props = _objectWithoutProperties(_ref, _excluded);
  var textTracks = useTextTracks({
    file: audioFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });
  if (audioFile && audioFile.isReady) {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$2.spaceForTextTracks, _defineProperty({}, styles$2.spaceForTextTracksActive, !posterImageFile && textTracks.files.length))
    }, /*#__PURE__*/React.createElement(MediaPlayer, Object.assign({
      type: 'audio',
      textTracks: textTracks,
      filePermaId: audioFile.permaId,
      sources: processSources(audioFile),
      textTracksInset: !!posterImageFile,
      posterImageUrl: posterImageFile && posterImageFile.isReady ? posterImageFile.urls.large : undefined,
      altText: audioFile.configuration.alt
    }, props)), /*#__PURE__*/React.createElement(AudioStructuredData, {
      file: audioFile
    }));
  }
  return null;
}
AudioPlayer.defaultProps = {
  controls: true
};
function processSources(audioFile) {
  var sources = [];
  if (audioFile.urls['ogg'] && !has('broken ogg support')) {
    sources.push({
      type: 'audio/ogg',
      src: "".concat(audioFile.urls['ogg'], "?u=1")
    });
  }
  if (audioFile.urls['mp3']) {
    sources.push({
      type: 'audio/mp3',
      src: "".concat(audioFile.urls['mp3'], "?u=1")
    });
  }
  if (audioFile.urls['m4a']) {
    sources.push({
      type: 'audio/m4a',
      src: "".concat(audioFile.urls['m4a'], "?u=1")
    });
  }
  return sources;
}
function has(featureName) {
  return typeof window !== 'undefined' && browser.has(featureName);
}

function SectionAtmo(_ref) {
  var audioFile = _ref.audioFile;
  var lastAudioFile = usePrevious(audioFile);
  var atmo = useAtmo();
  var processAtmo = useCallback(function () {
    var sources = undefined;
    if (audioFile && audioFile.isReady) {
      sources = processSources(audioFile);
    }
    if (atmo) {
      atmo.updateAtmo({
        sources: sources,
        audioFilePermaId: audioFile === null || audioFile === void 0 ? void 0 : audioFile.permaId
      });
    }
  }, [atmo, audioFile]);
  useSectionLifecycle({
    onActivate: function onActivate() {
      processAtmo();
    }
  });
  useEffect(function () {
    if (lastAudioFile !== undefined && (lastAudioFile && lastAudioFile.permaId) !== (audioFile && audioFile.permaId)) {
      processAtmo();
    }
  }, [processAtmo, lastAudioFile, audioFile]);
  return null;
}

var styles$3 = {"Foreground":"Foreground-module_Foreground__13ODU","fullFadeHeight":"Foreground-module_fullFadeHeight__2p9dx","fullHeight":"Foreground-module_fullHeight__1vMXb","paddingBottom":"Foreground-module_paddingBottom__3OtY4"};

var ForcePaddingContext = createContext(false);
function Foreground(props) {
  var forcePadding = useContext(ForcePaddingContext);
  return /*#__PURE__*/React.createElement("div", {
    className: className(props, forcePadding),
    style: {
      minHeight: props.minHeight
    }
  }, props.children);
}
function className(props, forcePadding) {
  return classNames(styles$3.Foreground, props.transitionStyles.foreground, props.transitionStyles["foreground-".concat(props.state)], _defineProperty({}, styles$3.paddingBottom, props.paddingBottom || forcePadding), styles$3["".concat(props.heightMode, "Height")]);
}

function getEffectValue(file, name) {
  var _find;
  return (_find = ((file === null || file === void 0 ? void 0 : file.effects) || []).find(function (effect) {
    return effect.name === name;
  })) === null || _find === void 0 ? void 0 : _find.value;
}

var styles$4 = {"breakpoint-md":"(min-width: 768px)","outer":"BackdropFrameEffect-module_outer__1Od-V","inner":"BackdropFrameEffect-module_inner__n74el"};

function BackdropFrameEffect(_ref) {
  var backdrop = _ref.backdrop;
  var frameColor = getEffectValue(backdrop, 'frame');
  if (!frameColor) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$4.outer,
    style: {
      '--frame-color': frameColor
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$4.inner
  }));
}

function isBlank(html) {
  return !!stripTags(html).match(/^\s*$/);
}
function presence(html) {
  return isBlank(html) ? null : html;
}
function isBlankEditableTextValue(value) {
  var _value$0$children$;
  return !value || value.length === 0 || value.length === 1 && value[0].children.length <= 1 && !((_value$0$children$ = value[0].children[0]) === null || _value$0$children$ === void 0 ? void 0 : _value$0$children$.text);
}

/**
 * Register new types of content elements.
 * @name frontend_contentElementTypes
 */
var ContentElementTypeRegistry = /*#__PURE__*/function () {
  function ContentElementTypeRegistry() {
    _classCallCheck(this, ContentElementTypeRegistry);
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
  _createClass(ContentElementTypeRegistry, [{
    key: "register",
    value: function register(typeName, options) {
      this.types[typeName] = options;
    }
  }, {
    key: "getComponent",
    value: function getComponent(typeName) {
      return this.types[typeName] && this.types[typeName].component;
    }
  }, {
    key: "getOptions",
    value: function getOptions(typeName) {
      return this.types[typeName];
    }
  }, {
    key: "consentVendors",
    value: function consentVendors(_ref) {
      var _this = this;
      var contentElements = _ref.contentElements,
        t = _ref.t;
      var vendorsByName = {};
      contentElements.forEach(function (contentElement) {
        var type = _this.types[contentElement.typeName];
        var consentVendors = typeof type.consentVendors === 'function' ? type.consentVendors({
          configuration: contentElement.configuration,
          t: t
        }) : type.consentVendors || [];
        consentVendors.forEach(function (vendor) {
          vendorsByName[vendor.name] = vendor;
        });
      });
      return Object.values(vendorsByName);
    }
  }]);
  return ContentElementTypeRegistry;
}();

/**
 * Register new types of widgets.
 * @name frontend_widgetTypes
 */
var WidgetTypeRegistry = /*#__PURE__*/function () {
  function WidgetTypeRegistry() {
    _classCallCheck(this, WidgetTypeRegistry);
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
  _createClass(WidgetTypeRegistry, [{
    key: "register",
    value: function register(typeName, options) {
      if (!options.component) {
        throw new Error("Missing required component option for widget type '".concat(typeName, "'."));
      }
      this.types[typeName] = options;
    }
  }, {
    key: "getComponent",
    value: function getComponent(typeName) {
      if (!this.types[typeName]) {
        throw new Error("Unknown widget type '".concat(typeName, "'. Consider calling frontent.widgetTypes.register."));
      }
      return this.types[typeName].component;
    }
  }]);
  return WidgetTypeRegistry;
}();

var api = {
  contentElementTypes: new ContentElementTypeRegistry(),
  widgetTypes: new WidgetTypeRegistry()
};

function Widget(_ref) {
  var role = _ref.role,
    props = _ref.props,
    children = _ref.children,
    renderFallback = _ref.renderFallback;
  var widget = useWidget({
    role: role
  });
  if (!widget) {
    return renderFallback ? renderFallback(_objectSpread2(_objectSpread2({}, props), {}, {
      children: children
    })) : null;
  }
  var Component = api.widgetTypes.getComponent(widget.typeName);
  return /*#__PURE__*/React.createElement(Component, Object.assign({
    configuration: widget.configuration
  }, props, {
    children: children
  }));
}

var styles$5 = {"list":"InlineFileRights-module_list__2OuO5"};

function InlineFileRights(_ref) {
  var _ref$items = _ref.items,
    items = _ref$items === void 0 ? [] : _ref$items,
    _ref$context = _ref.context,
    context = _ref$context === void 0 ? 'standAlone' : _ref$context,
    position = _ref.position,
    playerControlsFadedOut = _ref.playerControlsFadedOut,
    playerControlsStandAlone = _ref.playerControlsStandAlone,
    _ref$configuration = _ref.configuration,
    configuration = _ref$configuration === void 0 ? {} : _ref$configuration;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var filteredItems = items.filter(function (item) {
    return item.file && item.file.inlineRights && !isBlank(item.file.rights);
  });
  if (!filteredItems.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Widget, {
    role: "inlineFileRights",
    props: {
      context: context,
      position: position,
      playerControlsFadedOut: playerControlsFadedOut,
      playerControlsStandAlone: playerControlsStandAlone,
      configuration: configuration
    }
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles$5.list
  }, filteredItems.map(function (_ref2) {
    var label = _ref2.label,
      file = _ref2.file;
    return /*#__PURE__*/React.createElement("li", {
      key: "".concat(label, "-").concat(file.id)
    }, label && /*#__PURE__*/React.createElement("span", null, t(label, {
      scope: 'pageflow_scrolled.public.inline_file_rights_labels'
    }), ": "), renderRights(file), renderLicense(file));
  })));
}
function renderRights(file) {
  if (isBlank(file.configuration.source_url)) {
    return file.rights;
  } else {
    return /*#__PURE__*/React.createElement("a", {
      href: file.configuration.source_url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, file.rights);
  }
}
function renderLicense(file) {
  if (!file.license) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, ' ', "(", /*#__PURE__*/React.createElement("a", {
    href: file.license.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, file.license.name), ")");
}

var styles$6 = {"fade-duration":"0.5s","wrapper":"SectionInlineFileRights-module_wrapper__1l6rr","fade":"SectionInlineFileRights-module_fade__1Snfk","inactive":"SectionInlineFileRights-module_inactive__1VpQh"};

function SectionInlineFileRights(_ref) {
  var _section$nextSection, _section$nextSection$;
  var section = _ref.section,
    state = _ref.state,
    backdrop = _ref.backdrop,
    atmoAudioFile = _ref.atmoAudioFile;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.wrapper, _defineProperty(_defineProperty({}, styles$6.fade, (_section$nextSection = section.nextSection) === null || _section$nextSection === void 0 ? void 0 : (_section$nextSection$ = _section$nextSection.transition) === null || _section$nextSection$ === void 0 ? void 0 : _section$nextSection$.startsWith('fade')), styles$6.inactive, state !== 'active'))
  }, /*#__PURE__*/React.createElement(InlineFileRights, {
    context: "section",
    items: [{
      label: 'image',
      file: backdrop.image
    }, {
      label: 'video',
      file: backdrop.video
    }, {
      label: 'atmo',
      file: atmoAudioFile
    }]
  }));
}

// For reasons that are beyond me, Storybook's Webpack build fails
// with a "JavaScript heap out of memory" error if this import
// expression lives in inlineEditing/index.js directly. I originally
// intended to hide the import from Webpack by using
// file-replace-loader in Storybook's Webpack config to replace this
// file with an empty one, but found out that extracting the import
// to a separate file apparently is enough.
function importComponents() {
  return import('./components-d12ca048.js');
}

var components = {};
function loadInlineEditingComponents() {
  return importComponents().then(function (importedComponents) {
    components = importedComponents;
  });
}
function withInlineEditingDecorator(name, Component) {
  return function InlineEditingDecorator(props) {
    var Decorator = components[name];
    var isStaticPreview = useIsStaticPreview();
    if (Decorator && !isStaticPreview) {
      return /*#__PURE__*/React.createElement(Decorator, props, /*#__PURE__*/React.createElement(Component, props));
    } else {
      return /*#__PURE__*/React.createElement(Component, props);
    }
  };
}
function withInlineEditingAlternative(name, Component) {
  return function InlineEditingDecorator(props) {
    var Alternative = components[name];
    var isStaticPreview = useIsStaticPreview();
    if (Alternative && !isStaticPreview) {
      return /*#__PURE__*/React.createElement(Alternative, props);
    } else {
      return /*#__PURE__*/React.createElement(Component, props);
    }
  };
}

var ContentElementAttributesContext = createContext({});
function ContentElementAttributesProvider(_ref) {
  var id = _ref.id,
    width = _ref.width,
    position = _ref.position,
    children = _ref.children;
  var attributes = useMemo(function () {
    return {
      contentElementId: id,
      width: width,
      position: position
    };
  }, [id, width, position]);
  return /*#__PURE__*/React.createElement(ContentElementAttributesContext.Provider, {
    value: attributes
  }, children);
}
function useContentElementAttributes() {
  return useContext(ContentElementAttributesContext);
}

var ContentElementLifecycleContext = createContext();
var LifecycleProvider = createScrollPositionLifecycleProvider(ContentElementLifecycleContext);
var useLifecycle = createScrollPositionLifecycleHook(ContentElementLifecycleContext);
function ContentElementLifecycleProvider(_ref) {
  var type = _ref.type,
    children = _ref.children,
    override = _ref.override;
  var _api$contentElementTy = api.contentElementTypes.getOptions(type),
    lifecycle = _api$contentElementTy.lifecycle;
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
  var result = useLifecycle(options);
  if (!result) {
    throw new Error('useContentElementLifecycle is only available in ' + 'content elements for which `lifecycle: true` has ' + 'been passed to frontend.contentElements.register');
  }
  return result;
}

var widths = {
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

var styles$7 = {"wrapper":"ContentElementMargin-module_wrapper__20kIk"};

function ContentElementMargin(_ref) {
  var width = _ref.width,
    top = _ref.top,
    bottom = _ref.bottom,
    children = _ref.children;
  if (width === widths.full) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$7.wrapper,
    style: {
      marginTop: scaleProperty(top),
      marginBottom: scaleProperty(bottom)
    }
  }, children);
}
function scaleProperty(value) {
  return value && "var(--theme-content-element-margin-".concat(value, ")");
}

var styles$8 = {"missing":"ContentElement-module_missing__2_1j9"};

function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
var ContentElementErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ContentElementErrorBoundary, _React$Component);
  function ContentElementErrorBoundary(props) {
    var _this;
    _classCallCheck(this, ContentElementErrorBoundary);
    _this = _callSuper(this, ContentElementErrorBoundary, [props]);
    _this.state = {
      hasError: false
    };
    return _this;
  }
  _createClass(ContentElementErrorBoundary, [{
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/React.createElement("div", {
          className: styles$8.missing
        }, "Error rendering element of type \"", this.props.type, "\"");
      }
      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError(error) {
      return {
        hasError: true
      };
    }
  }]);
  return ContentElementErrorBoundary;
}(React.Component);

var ContentElement = React.memo(withInlineEditingDecorator('ContentElementDecorator', function ContentElement(props) {
  var Component = api.contentElementTypes.getComponent(props.type);
  if (Component) {
    return /*#__PURE__*/React.createElement(ContentElementAttributesProvider, {
      id: props.id,
      width: props.width,
      position: props.position
    }, /*#__PURE__*/React.createElement(ContentElementLifecycleProvider, {
      type: props.type,
      override: props.lifecycleOverride
    }, /*#__PURE__*/React.createElement(ContentElementMargin, {
      width: props.width,
      top: props.itemProps.marginTop,
      bottom: props.itemProps.marginBottom
    }, /*#__PURE__*/React.createElement(ContentElementErrorBoundary, {
      type: props.type
    }, /*#__PURE__*/React.createElement(Component, {
      sectionProps: props.sectionProps,
      customMargin: props.customMargin,
      configuration: props.itemProps,
      contentElementWidth: props.width,
      contentElementId: props.id
    })))));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$8.missing
    }, "Element of unknown type \"", props.type, "\"");
  }
}), arePropsEqual);
function arePropsEqual(prevProps, nextProps) {
  return prevProps.id === nextProps.id && prevProps.permaId === nextProps.permaId && prevProps.type === nextProps.type && prevProps.position === nextProps.position && prevProps.width === nextProps.width && prevProps.itemProps === nextProps.itemProps && prevProps.customMargin === nextProps.customMargin && prevProps.sectionProps === nextProps.sectionProps && prevProps.lifecycleOverride === nextProps.lifecycleOverride;
}
ContentElement.defaultProps = {
  itemProps: {}
};

var styles$9 = {"wrapper":"ContentElementScrollSpace-module_wrapper__2ZBwZ","inner":"ContentElementScrollSpace-module_inner__1FBgh"};

function ContentElementScrollSpace(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$9.wrapper
  }, /*#__PURE__*/React.createElement(Measure, {
    bounds: true
  }, function (_ref2) {
    var measureRef = _ref2.measureRef,
      contentRect = _ref2.contentRect;
    return /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styles$9.inner,
      style: {
        '--height': contentRect.bounds.height / 2
      }
    }, children);
  }));
}

function ContentElements(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, props.items.map(function (item, index) {
    return props.children(item, renderScrollSpace(item, /*#__PURE__*/React.createElement(ContentElement, {
      key: item.id,
      id: item.id,
      permaId: item.permaId,
      type: item.type,
      first: index === 0,
      position: item.position,
      width: item.width,
      itemProps: item.props,
      customMargin: props.customMargin,
      sectionProps: props.sectionProps
    })), index);
  }));
}
ContentElements.defaultProps = {
  children: function children(item, child) {
    return child;
  }
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

function useMediaQuery(query) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      active: true
    },
    active = _ref.active;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    doesMatch = _useState2[0],
    setDoesMatch = _useState2[1];
  useEffect(function () {
    if (!active) {
      return;
    }
    var onUpdateMatch = function onUpdateMatch(_ref2) {
      var matches = _ref2.matches;
      setDoesMatch(matches);
    };
    var matcher = window.matchMedia(query);
    matcher.addEventListener('change', onUpdateMatch);
    onUpdateMatch(matcher);
    return function () {
      matcher.removeEventListener('change', onUpdateMatch);
    };
  }, [query, setDoesMatch, active]);
  return active && doesMatch;
}

var styles$a = {"root":"TwoColumn-module_root__37EqL","group":"TwoColumn-module_group__3Hg2y","group-full":"TwoColumn-module_group-full__2OT4o","box":"TwoColumn-module_box__1Nils","inline":"TwoColumn-module_inline__1fPfM","width-lg":"TwoColumn-module_width-lg__2MD35","width-xl":"TwoColumn-module_width-xl__3Bxet","width-full":"TwoColumn-module_width-full__1QWYO","restrict-xxs":"TwoColumn-module_restrict-xxs__6il-H","restrict-xs":"TwoColumn-module_restrict-xs__AOezq","restrict-sm":"TwoColumn-module_restrict-sm__2rKty","align-left":"TwoColumn-module_align-left__QSe2G","align-right":"TwoColumn-module_align-right__3Dn4i","customMargin":"TwoColumn-module_customMargin__o0uxH","right":"TwoColumn-module_right__Fr52a","side":"TwoColumn-module_side__2xx0s","sticky":"TwoColumn-module_sticky__4LCDO TwoColumn-module_side__2xx0s"};

function TwoColumn(props) {
  var shouldInline = useShouldInlineSticky();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.root, styles$a[props.align])
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.group),
    key: props.align
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    className: classNames(styles$a.box, styles$a.inline),
    ref: props.contentAreaRef
  }, TwoColumn.contentAreaProbeProps))), renderItems(props, shouldInline), renderPlaceholder(props.placeholder));
}
TwoColumn.defaultProps = {
  align: 'left'
};
function useShouldInlineSticky() {
  var _theme$options$proper;
  var theme = useTheme();
  var root = ((_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : _theme$options$proper.root) || {};
  var shouldInline = _defineProperty(_defineProperty(_defineProperty({}, widths.md, useMediaQuery("(max-width: ".concat(root.twoColumnStickyBreakpoint || '950px', ")"))), widths.lg, useMediaQuery("(max-width: ".concat(root.twoColumnStickyLgBreakpoint || '1200px', ")"))), widths.xl, useMediaQuery("(max-width: ".concat(root.twoColumnStickyXlBreakpoint || '1400px', ")")));
  return function (width) {
    return width <= widths.md ? shouldInline[widths.md] : shouldInline[width];
  };
}

// Used in tests to render markers around groups
TwoColumn.GroupComponent = 'div';

// Used to set data-testids on probe element
TwoColumn.contentAreaProbeProps = {};
function renderItems(props, shouldInline) {
  return groupItemsByPosition(props.items, shouldInline).map(function (group, index) {
    return /*#__PURE__*/React.createElement(TwoColumn.GroupComponent, {
      key: index,
      className: classNames(styles$a.group, styles$a["group-".concat(widthName(group.width))])
    }, group.boxes.map(function (box, index) {
      return renderItemGroup(props, box, index);
    }));
  });
}
function renderItemGroup(props, box, key) {
  if (box.items.length) {
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: classNames(styles$a.box, styles$a[box.position], styles$a["width-".concat(widthName(box.width))], _defineProperty({}, styles$a.customMargin, box.customMargin))
    }, props.children( /*#__PURE__*/React.createElement(RestrictWidth, {
      width: box.width,
      alignment: box.alignment
    }, /*#__PURE__*/React.createElement(ContentElements, {
      sectionProps: props.sectionProps,
      customMargin: box.customMargin,
      items: box.items
    })), {
      position: box.position,
      width: box.width,
      customMargin: box.customMargin,
      openStart: box.openStart,
      openEnd: box.openEnd
    }));
  }
}
function RestrictWidth(_ref) {
  var width = _ref.width,
    alignment = _ref.alignment,
    children = _ref.children;
  if (width >= 0) {
    return children;
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$a["restrict-".concat(widthName(width))], styles$a["align-".concat(alignment)])
    }, children);
  }
}
function groupItemsByPosition(items, shouldInline) {
  var groups = [];
  var lastInlineBox = null;
  var currentGroup, currentBox;
  items.reduce(function (previousPosition, item, index) {
    var _ref2 = api.contentElementTypes.getOptions(item.type) || {},
      elementSupportsCustomMargin = _ref2.customMargin;
    if (typeof elementSupportsCustomMargin === 'function') {
      elementSupportsCustomMargin = elementSupportsCustomMargin({
        configuration: item.props
      });
    }
    var width = item.width || 0;
    var position = onTheSide(item.position) && !shouldInline(width) ? item.position : 'inline';
    var customMargin = !!elementSupportsCustomMargin && width < widths.full;
    var alignment = item.position === 'inline' && width < 0 ? item.alignment : null;
    if (onTheSide(item.position) && position === 'inline' && width > widths.md) {
      width -= 1;
    }
    if (!currentGroup || previousPosition !== position || onTheSide(position) && currentBox.customMargin !== customMargin || currentBox.width !== width) {
      currentBox = null;
      if (!(onTheSide(previousPosition) && position === 'inline' && width <= widths.md)) {
        currentGroup = {
          width: width,
          boxes: []
        };
        groups.push(currentGroup);
      }
    }
    if (!currentBox || currentBox.customMargin !== customMargin || currentBox.alignment !== alignment) {
      currentBox = {
        customMargin: customMargin,
        position: position,
        width: width,
        alignment: alignment,
        items: []
      };
      if (lastInlineBox && position === 'inline' && width <= widths.md && !customMargin) {
        lastInlineBox.openEnd = true;
        currentBox.openStart = true;
      }
      if (position === 'inline' && width <= widths.md && !customMargin) {
        lastInlineBox = currentBox;
      } else if (position === 'inline' && width > widths.md || customMargin && !onTheSide(position)) {
        lastInlineBox = null;
      }
      currentGroup.boxes.push(currentBox);
    }
    currentBox.items.push(item);
    return position;
  }, null);
  return groups;
}
function onTheSide(position) {
  return position === 'side' || position === 'sticky';
}
function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.group)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.box, styles$a.inline)
  }, placeholder));
}

var styles$b = {"outer":"Center-module_outer__3Rr0H","customMargin":"Center-module_customMargin__1es3t","outer-full":"Center-module_outer-full__3dknO","item":"Center-module_item__1KSs3","item-inline-lg":"Center-module_item-inline-lg__DGjXl","item-inline-xl":"Center-module_item-inline-xl__2McfB","item-inline-full":"Center-module_item-inline-full__l-6kG","clear":"Center-module_clear__jJEap","inner-xxs":"Center-module_inner-xxs__1oroz","inner-xs":"Center-module_inner-xs__3FRT8","inner-sm":"Center-module_inner-sm__-oQ0E","align-left":"Center-module_align-left__1rYBX","align-right":"Center-module_align-right__1uglq","inner-left":"Center-module_inner-left__2z9Ea","inner-right":"Center-module_inner-right__KBkVt","sideBySide":"Center-module_sideBySide__-YsP0","inner-md":"Center-module_inner-md__3dLC3","inner-lg":"Center-module_inner-lg__2GQbs","inner-xl":"Center-module_inner-xl__3dOME"};

var floatedPositions = ['left', 'right'];
function Center(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$b.root)
  }, /*#__PURE__*/React.createElement("div", {
    ref: props.contentAreaRef
  }), props.items.map(function (item, index) {
    var customMargin = hasCustomMargin(item);
    var position = item.position;
    var width = getWidth(item);
    var alignment = width < 0 && item.position === 'inline' ? item.alignment : null;
    return /*#__PURE__*/React.createElement(ContentElements, {
      key: item.id,
      sectionProps: props.sectionProps,
      items: [item],
      customMargin: customMargin
    }, function (item, child) {
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        className: outerClassName(props.items, index)
      }, /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$b.item, styles$b["item-".concat(position, "-").concat(widthName(width))])
      }, props.children( /*#__PURE__*/React.createElement("div", {
        className: classNames(styles$b["inner-".concat(item.position)], styles$b["inner-".concat(widthName(width))], styles$b["align-".concat(alignment)], _defineProperty({}, styles$b["sideBySide"], sideBySideFloat(props.items, index)))
      }, child), boxProps(props.items, item, index))));
    });
  }), renderPlaceholder$1(props.placeholder));
}
function outerClassName(items, index) {
  var item = items[index];
  return classNames(styles$b.outer, styles$b["outer-".concat(widthName(getWidth(item)))], _defineProperty({}, styles$b.customMargin, hasCustomMargin(item)), _defineProperty({}, styles$b.clear, clearItem(items, index)));
}
function boxProps(items, item, index) {
  var previous = items[index - 1];
  var next = items[index + 1];
  var customMargin = hasCustomMargin(item);
  var width = getWidth(item);
  return {
    position: item.position,
    width: width,
    customMargin: customMargin,
    selfClear: selfClear(items, index),
    openStart: previous && !customMargin && !hasCustomMargin(previous) && !isWideOrFull(item) && !isWideOrFull(previous),
    openEnd: next && !customMargin && !hasCustomMargin(next) && !isWideOrFull(item) && !isWideOrFull(next)
  };
}
function isWideOrFull(item) {
  return item.position === 'inline' && getWidth(item) > widths.md;
}
function selfClear(items, index) {
  var item = items[index];
  var next = items[index + 1];
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
  var _api$contentElementTy = api.contentElementTypes.getOptions(item.type),
    supportsWrappingAroundFloats = _api$contentElementTy.supportsWrappingAroundFloats;
  return supportsWrappingAroundFloats;
}
function hasCustomMargin(item) {
  var position = item.position;
  var _ref = api.contentElementTypes.getOptions(item.type) || {},
    elementSupportsCustomMargin = _ref.customMargin;
  if (typeof elementSupportsCustomMargin === 'function') {
    elementSupportsCustomMargin = elementSupportsCustomMargin({
      configuration: item.props
    });
  }
  return !!(elementSupportsCustomMargin && position === 'inline' && getWidth(item) < widths.full);
}
function getWidth(item) {
  return item.width || widths.md;
}
function renderPlaceholder$1(placeholder) {
  if (!placeholder) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$b.outer)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$b.item)
  }, placeholder));
}

var Layout = React.memo(withInlineEditingAlternative('LayoutWithPlaceholder', LayoutWithoutInlineEditing), function (prevProps, nextProps) {
  return prevProps.sectionId === nextProps.sectionId && prevProps.items === nextProps.items && prevProps.appearance === nextProps.appearance && prevProps.contentAreaRef === nextProps.contentAreaRef && prevProps.sectionProps === nextProps.sectionProps;
});
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

var ScrollTargetEmitterContext = createContext();
function ScrollTargetEmitterProvider(_ref) {
  var children = _ref.children;
  var emitter = useMemo(function () {
    return Object.assign({}, BackboneEvents);
  }, []);
  return /*#__PURE__*/React.createElement(ScrollTargetEmitterContext.Provider, {
    value: emitter
  }, children);
}
function useScrollToTarget() {
  var emitter = useContext(ScrollTargetEmitterContext);
  return useCallback(function (_ref2) {
    var id = _ref2.id,
      align = _ref2.align;
    return emitter.trigger(id, align);
  }, [emitter]);
}
function useScrollTarget(id) {
  var ref = useRef();
  var emitter = useContext(ScrollTargetEmitterContext);
  useEffect(function () {
    emitter.on(id, function (align) {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top + window.scrollY - (align === 'start' ? 0 : window.innerHeight * 0.25),
          behavior: 'smooth'
        });
      }
    });
    return function () {
      return emitter.off(id);
    };
  }, [id, emitter]);
  return ref;
}

var breakpoints = {"breakpoint-sm":"(min-width: 640px)","breakpoint-md":"(min-width: 768px)","breakpoint-lg":"(min-width: 1024px)","breakpoint-xl":"(min-width: 1280px)","breakpoint-below-sm":"(max-width: 639px)","breakpoint-below-md":"(max-width: 767px)","breakpoint-below-lg":"(max-width: 1023px)","breakpoint-below-xl":"(max-width: 1279px)"};

var PhoneLayoutContext = createContext(false);
function PhoneLayoutProvider(_ref) {
  var children = _ref.children;
  var phoneLayout = useMediaQuery(breakpoints['breakpoint-below-sm']);
  return /*#__PURE__*/React.createElement(PhoneLayoutContext.Provider, {
    value: phoneLayout
  }, children);
}
function usePhoneLayout() {
  return useContext(PhoneLayoutContext);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion)').matches;
}

var SectionViewTimelineContext = React.createContext();
function SectionViewTimelineProvider(_ref) {
  var _backdrop$effects;
  var backdrop = _ref.backdrop,
    children = _ref.children;
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    timeline = _useState2[0],
    setTimeline = _useState2[1];
  var ref = useRef();
  var isNeeded = backdrop === null || backdrop === void 0 ? void 0 : (_backdrop$effects = backdrop.effects) === null || _backdrop$effects === void 0 ? void 0 : _backdrop$effects.some(function (effect) {
    return effect.name === 'scrollParallax';
  });
  useEffect(function () {
    if (!isNeeded || !window.ViewTimeline || prefersReducedMotion()) {
      return;
    }
    setTimeline(new window.ViewTimeline({
      subject: ref.current
    }));
    return function () {
      return setTimeline(null);
    };
  }, [isNeeded]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement(SectionViewTimelineContext.Provider, {
    value: timeline
  }, children));
}
function useSectionViewTimeline() {
  return useContext(SectionViewTimelineContext);
}

var DarkBackgroundContext = createContext(true);
function BackgroundColorProvider(_ref) {
  var dark = _ref.dark,
    invert = _ref.invert,
    children = _ref.children;
  var previousValue = useDarkBackground();
  return /*#__PURE__*/React.createElement(DarkBackgroundContext.Provider, {
    value: getValue({
      dark: dark,
      invert: invert,
      previousValue: previousValue
    })
  }, children);
}
function getValue(_ref2) {
  var dark = _ref2.dark,
    invert = _ref2.invert,
    previousValue = _ref2.previousValue;
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

var SelectableWidget = withInlineEditingDecorator('SelectableWidgetDecorator', Widget);

/**
 * Returns boolean indicating whether viewport orientation is currently
 * portrait.
 */
function usePortraitOrientation(options) {
  return useMediaQuery('(orientation: portrait)', options);
}

function useSectionPaddingCustomProperties(section) {
  var styles = {};
  var portrait = usePortraitOrientation({
    active: section.portraitPaddingTop || section.portraitPaddingBottom
  });
  var paddingTop = portrait && section.portraitPaddingTop ? section.portraitPaddingTop : section.paddingTop;
  var paddingBottom = portrait && section.portraitPaddingBottom ? section.portraitPaddingBottom : section.paddingBottom;
  if (paddingTop) {
    styles['--foreground-padding-top'] = "var(--theme-section-padding-top-".concat(paddingTop, ")");
  }
  if (paddingBottom) {
    styles['--foreground-padding-bottom'] = "var(--theme-section-padding-bottom-".concat(paddingBottom, ")");
  }
  return styles;
}

var styles$c = {"probe":"SectionIntersectionObserver-module_probe__1_1UM"};

var SectionIntersectionObserverContext = createContext([]);
function SectionIntersectionObserver(_ref) {
  var sections = _ref.sections,
    probeClassName = _ref.probeClassName,
    onChange = _ref.onChange,
    children = _ref.children;
  var sectionsByIdRef = useRef();
  var callbackRef = useRef();
  var observerRef = useRef();
  var probesRef = useRef({});
  useEffect(function () {
    sectionsByIdRef.current = sections.reduce(function (result, section) {
      result[section.id] = section;
      return result;
    }, {});
  }, [sections]);
  useEffect(function () {
    callbackRef.current = onChange;
  }, [onChange]);
  useEffect(function () {
    var sectionsById = sectionsByIdRef.current;
    var callback = callbackRef.current;
    var visibleSection = null;
    var observer = observerRef.current = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var section = sectionsById[entry.target.dataset.id];
        if (entry.isIntersecting) {
          visibleSection = section;
          callback(visibleSection);
        } else if (visibleSection === section) {
          visibleSection = null;
          callback(visibleSection);
        }
      });
    }, {
      rootMargin: '0px 0px -100% 0px'
    });
    Object.values(probesRef.current).forEach(function (el) {
      observer.observe(el);
    });
    return function () {
      return observer.disconnect();
    };
  }, [sections]);
  var setProbeRef = useCallback(function (id) {
    return function (el) {
      if (observerRef.current) {
        if (el) {
          observerRef.current.observe(el);
        } else {
          observerRef.current.unobserve(probesRef.current[id]);
        }
      }
      if (el) {
        probesRef.current[id] = el;
      } else {
        delete probesRef.current[id];
      }
    };
  }, []);
  var previousContextValue = useContext(SectionIntersectionObserverContext);
  var contextValue = useMemo(function () {
    return [].concat(_toConsumableArray(previousContextValue), [{
      setProbeRef: setProbeRef,
      probeClassName: probeClassName
    }]);
  }, [previousContextValue, setProbeRef, probeClassName]);
  return /*#__PURE__*/React.createElement(SectionIntersectionObserverContext.Provider, {
    value: contextValue
  }, children);
}
function SectionIntersectionProbe(_ref2) {
  var section = _ref2.section;
  var value = useContext(SectionIntersectionObserverContext);
  return value.map(function (_ref3, index) {
    var setProbeRef = _ref3.setProbeRef,
      probeClassName = _ref3.probeClassName;
    return /*#__PURE__*/React.createElement("div", {
      ref: setProbeRef(section.id),
      key: index,
      className: classNames(styles$c.probe, probeClassName),
      "data-id": section.id
    });
  });
}

function getSize(el) {
  if (!el) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      bottom: 0
    };
  }
  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
    bottom: el.offsetParent ? el.offsetParent.offsetHeight - el.offsetTop - el.offsetHeight : 0
  };
}
function useDimension() {
  var _useState = useState(getSize(null)),
    _useState2 = _slicedToArray(_useState, 2),
    componentSize = _useState2[0],
    setComponentSize = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    currentNode = _useState4[0],
    setCurrentNode = _useState4[1];
  var measuredRef = useCallback(function (node) {
    setCurrentNode(node);
    setComponentSize(getSize(node));
  }, []);
  useEffect(function () {
    function handleResize() {
      setComponentSize(getSize(currentNode));
    }
    if (!currentNode) {
      return;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentNode]);
  return [componentSize, measuredRef];
}

var styles$d = {"root":"Fullscreen-module_root__1N3CI"};

var DimensionContext = React.createContext({});
function useFullscreenDimensions() {
  return useContext(DimensionContext);
}
function FullscreenDimensionProvider(_ref) {
  var width = _ref.width,
    height = _ref.height,
    children = _ref.children;
  var value = useMemo(function () {
    return {
      width: width,
      height: height
    };
  }, [width, height]);
  return /*#__PURE__*/React.createElement(DimensionContext.Provider, {
    value: value
  }, children);
}
var Fullscreen = React.forwardRef(function Fullscreen(props, ref) {
  var _useFullscreenDimensi = useFullscreenDimensions(),
    height = _useFullscreenDimensi.height;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$d.root,
    style: {
      height: height
    }
  }, props.children);
});

var styles$e = {"FillColor":"FillColor-module_FillColor__S1uEG"};

function FillColor(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$e.FillColor,
    style: {
      backgroundColor: props.color
    }
  }, /*#__PURE__*/React.createElement(Fullscreen, null));
}

/**
 * Extend image or video file with position/motif area related
 * properties that are needed to use the file as a section backdrop.
 *
 * The added properties are:
 *
 * `cropPosition`: Position in percent that can be used as
 * `background-position` or `object-position` to center the given
 * motif area in the container.
 *
 * `motifAreaOffsetRect`: Pixel position and size of the motif area in
 * the container assuming the crop position has been applied.
 *
 * `motifArea`: Either the passed motif area object or the motif area
 * from the legacy file configuration if no motif area has been
 * passed.
 *
 * @param {Object} options
 * @param {Object} options.file - Image or video file obtained via
 * `useFile`.
 * @param {Object} options.motifArea - Section specific setting
 * specifying motif area rect in percent.
 * @param {Object} options.containerDimension - Width and height in
 *   pixels of the container (normally the backdrop) the file shall be
 *   displayed as background of.
 *
 * @private
 */
function useBackgroundFile(_ref) {
  var file = _ref.file,
    motifArea = _ref.motifArea,
    containerDimension = _ref.containerDimension,
    effects = _ref.effects;
  if (!file) {
    return null;
  }

  // Calculate scale factor required to make the file cover the container:

  var originalRatio = file.width / file.height;
  var containerRatio = containerDimension.width / containerDimension.height;
  var scale = containerRatio > originalRatio ? containerDimension.width / file.width : containerDimension.height / file.height;

  // Calculate the pixel size the image will have inside the container:

  var displayFileWidth = file.width * scale;
  var displayFileHeight = file.height * scale;

  // Calculate the pixel position of the center of the motif area in
  // the scaled image:

  var motifCenterX = motifArea ? motifArea.left + motifArea.width / 2 : 50;
  var motifCenterY = motifArea ? motifArea.top + motifArea.height / 2 : 50;
  var displayMotifCenterX = motifCenterX * displayFileWidth / 100;
  var displayMotifCenterY = motifCenterY * displayFileHeight / 100;

  // If the x-axis position (inside the image) of the center of the
  // motif area is smaller than `A = containerDimension.width / 2`, we
  // need to set the crop position to 0% to ensure that the full width
  // motif area is visible:
  //
  //     center of motif area
  //      |
  //   oXXXXXooo...........
  //   |-A-|
  //
  // Legend:
  //   o: Part of the image that is visible in the container
  //   .: Part of the image that is clipped
  //   X: Part of the motif area that is visible in the container
  //   x: Part of the motif area that is clipped
  //
  // If the x-axis position (inside the image) of the center of the
  // motif area is greater than
  // `B = image.width - containerDimension.width / 2`, we need to set the
  // crop position to 100%:
  //
  //   ............oooXXXXXo
  //   |-------B-------|
  //
  // For positions between A and B we want to linearly shift the crop
  // position to ensure the center of the motif area is centered in
  // the container:
  //
  //   ...ooXXXXXoo.........
  //
  // This also applies if the motif area is wider than the container:
  //
  //   .xxXXXXXXXXXxx.......
  //

  var Ax = containerDimension.width / 2;
  var Ay = containerDimension.height / 2;
  var Bx = displayFileWidth - containerDimension.width / 2;
  var By = displayFileHeight - containerDimension.height / 2;
  var cropPosition = {
    x: Bx - Ax > 0 ? Math.min(100, Math.max(0, (displayMotifCenterX - Ax) / (Bx - Ax) * 100)) : 50,
    y: By - Ay > 0 ? Math.min(100, Math.max(0, (displayMotifCenterY - Ay) / (By - Ay) * 100)) : 50
  };

  // Calculate the amount of pixels the image will be shifted
  // when the crop position is applied:

  var cropLeft = (displayFileWidth - containerDimension.width) * cropPosition.x / 100;
  var cropTop = (displayFileHeight - containerDimension.height) * cropPosition.y / 100;

  // Calculate the pixel position and dimension of the motif area
  // relative to the container assuming the crop position has been
  // applied:

  var motifAreaOffsetRect = motifArea && {
    top: Math.round(displayFileHeight * motifArea.top / 100 - cropTop),
    left: Math.round(displayFileWidth * motifArea.left / 100 - cropLeft),
    width: Math.round(displayFileWidth * motifArea.width / 100),
    height: Math.round(displayFileHeight * motifArea.height / 100)
  };
  return _objectSpread2(_objectSpread2({}, file), {}, {
    cropPosition: cropPosition,
    motifArea: motifArea,
    motifAreaOffsetRect: motifAreaOffsetRect,
    effects: effects
  });
}

function useVideoQualitySetting() {
  var _useSetting = useSetting('videoQuality'),
    _useSetting2 = _slicedToArray(_useSetting, 2),
    value = _useSetting2[0],
    setValue = _useSetting2[1];
  return [value || 'auto', setValue];
}

browser.feature('dash', function () {
  return true;
});
browser.feature('video', function () {
  return true;
});
browser.feature('highdef', function () {
  return true;
});
function sources(videoFile) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$quality = _ref.quality,
    quality = _ref$quality === void 0 ? 'auto' : _ref$quality,
    adaptiveMinQuality = _ref.adaptiveMinQuality;
  if (typeof window !== 'undefined') {
    if (!browser.has('video')) {
      return [];
    }
    if (!browser.has('highdef')) {
      return [{
        type: 'video/mp4',
        src: videoFile.urls.high
      }];
    }
    if (!browser.has('dash')) {
      return [{
        type: 'video/mp4',
        src: videoFile.urls['4k'] || videoFile.urls.fullhd || videoFile.urls.high
      }];
    }
  }
  if (features.isEnabled('force_fullhd_video_quality')) {
    return [{
      type: 'video/mp4',
      src: videoFile.urls.fullhd || videoFile.urls.high
    }];
  } else if (quality === 'auto') {
    var result = [{
      type: 'application/x-mpegURL',
      src: getPlaylistSrc(videoFile, 'hls', adaptiveMinQuality)
    }, {
      type: 'video/mp4',
      src: videoFile.urls.high
    }];
    if (videoFile.urls['dash-playlist'] && !features.isEnabled('hls_instead_of_dash')) {
      result = [{
        type: 'application/dash+xml',
        src: getPlaylistSrc(videoFile, 'dash', adaptiveMinQuality)
      }].concat(result);
    }
    return result;
  } else {
    if (!videoFile.urls[quality]) {
      quality = 'high';
    }
    return [{
      type: 'video/mp4',
      src: videoFile.urls[quality]
    }];
  }
}
function getPlaylistSrc(videoFile, format, adaptiveMinQuality) {
  var key = adaptiveMinQuality ? "".concat(format, "-playlist-").concat(adaptiveMinQuality, "-and-up") : "".concat(format, "-playlist");
  var result = videoFile.urls[key];
  if (!result && adaptiveMinQuality) {
    return getPlaylistSrc(videoFile, format);
  }
  return result;
}

function VideoStructuredData(_ref) {
  var file = _ref.file;
  var entryMedadata = useEntryMetadata();
  var data = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    name: file.basename,
    description: file.configuration.alt,
    url: ensureProtocol('https', file.urls.high),
    thumbnailUrl: ensureProtocol('https', file.urls.posterMedium),
    width: file.width,
    height: file.height,
    duration: formatTimeDuration(file.durationInMs),
    datePublished: entryMedadata.publishedAt,
    uploadDate: file.createdAt,
    copyrightHolder: {
      '@type': 'Organization',
      name: file.rights
    }
  };
  return /*#__PURE__*/React.createElement(StructuredData, {
    data: data
  });
}

var _excluded$1 = ["videoFile", "posterImageFile", "adaptiveMinQuality"];

/**
 * Render video file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.videoFile - Video file obtained via `useFile`.
 * @param {number} [props.posterImageFile] - Poster image file obtained via `useFile`.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {string} [props.load] - Control lazy loading. `"auto"` (default), `"poster"` or `"none"`.
 * @param {String} [props.fit] - `"contain"` (default) or `"cover"`.
 * @param {String} [props.adaptiveMinQuality] - Pass "high" or "fullhd" to use HLS/Dash playlists
 *   with at least given quality.
 */
function VideoPlayer(_ref) {
  var videoFile = _ref.videoFile,
    posterImageFile = _ref.posterImageFile,
    adaptiveMinQuality = _ref.adaptiveMinQuality,
    props = _objectWithoutProperties(_ref, _excluded$1);
  var _useVideoQualitySetti = useVideoQualitySetting(),
    _useVideoQualitySetti2 = _slicedToArray(_useVideoQualitySetti, 1),
    activeQuality = _useVideoQualitySetti2[0];
  var textTracks = useTextTracks({
    file: videoFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });
  if (videoFile && videoFile.isReady) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MediaPlayer, Object.assign({
      type: 'video',
      fit: props.fit,
      textTracks: textTracks,
      filePermaId: videoFile.permaId,
      sources: sources(videoFile, {
        quality: activeQuality,
        adaptiveMinQuality: adaptiveMinQuality
      }),
      textTracksInset: true,
      posterImageUrl: posterImageFile && posterImageFile.isReady ? posterImageFile.urls.large : videoFile.urls.posterLarge,
      altText: videoFile.configuration.alt,
      objectPosition: props.fit === 'cover' ? videoFile.cropPosition : undefined
    }, props)), /*#__PURE__*/React.createElement(VideoStructuredData, {
      file: videoFile
    }));
  }
  return null;
}
VideoPlayer.defaultProps = {
  fit: 'contain',
  controls: true
};

var styles$f = {"root":"MotifArea-module_root__1_ACd","visible":"MotifArea-module_visible__18Kln"};

var MotifAreaVisibilityContext = React.createContext(false);
function MotifAreaVisibilityProvider(_ref) {
  var visible = _ref.visible,
    children = _ref.children;
  return /*#__PURE__*/React.createElement(MotifAreaVisibilityContext.Provider, {
    value: visible
  }, children);
}

var MotifArea = function MotifArea(props) {
  var _props$file;
  var lastPosition = useRef();
  var position = ((_props$file = props.file) === null || _props$file === void 0 ? void 0 : _props$file.isReady) && getPosition(props);
  var visible = useContext(MotifAreaVisibilityContext);
  var elementRef = useRef();
  var onUpdate = props.onUpdate;
  var setElementRef = useCallback(function (element) {
    elementRef.current = element;
    onUpdate(element);
  }, [elementRef, onUpdate]);
  useEffect(function () {
    if (lastPosition.current && position && (lastPosition.current.top !== position.top || lastPosition.current.left !== position.left || lastPosition.current.width !== position.width || lastPosition.current.height !== position.height)) {
      onUpdate(elementRef.current);
    }
    lastPosition.current = position;
  });
  if (!position) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: setElementRef,
    className: classNames(styles$f.root, _defineProperty({}, styles$f.visible, visible)),
    style: position,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave
  });
};
MotifArea.defaultProps = {
  onUpdate: function onUpdate() {}
};
function getPosition(props) {
  return props.file.motifAreaOffsetRect || {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };
}

var styles$g = {"effects":"Effects-module_effects__2swN4","autoZoom":"Effects-module_autoZoom__109yr"};

function Effects(_ref) {
  var file = _ref.file,
    children = _ref.children;
  var ref = useRef();
  var sectionViewTimeline = useSectionViewTimeline();
  var isStaticPreview = useIsStaticPreview();
  var _useSectionLifecycle = useSectionLifecycle(),
    isVisible = _useSectionLifecycle.isVisible;
  var scrollParallaxValue = getEffectValue(file, 'scrollParallax');
  var autoZoomValue = getEffectValue(file, 'autoZoom');
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    autoZoomRunning = _useState2[0],
    setAutoZoomRunning = _useState2[1];
  useIsomorphicLayoutEffect(function () {
    if (scrollParallaxValue && !isStaticPreview && sectionViewTimeline) {
      var max = 20 * scrollParallaxValue / 100;
      var scale = 100 + 2 * max;
      var animation = ref.current.animate({
        transform: ["translateY(".concat(max, "%) scale(").concat(scale, "%)"), "translateY(".concat(-max, "%) scale(").concat(scale, "%)")]
      }, {
        fill: 'forwards',
        timeline: sectionViewTimeline,
        rangeStart: 'cover 0%',
        composite: 'add',
        rangeEnd: 'cover 100%'
      });
      return function () {
        return animation.cancel();
      };
    }
  }, [sectionViewTimeline, scrollParallaxValue, isStaticPreview]);
  useIsomorphicLayoutEffect(function () {
    setAutoZoomRunning(autoZoomValue && isVisible && !prefersReducedMotion());
  }, [autoZoomValue, isVisible]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$g.effects, _defineProperty({}, styles$g.autoZoom, autoZoomRunning)),
    style: _objectSpread2({
      filter: getFilter((file === null || file === void 0 ? void 0 : file.effects) || [])
    }, getAutoZoomProperties(autoZoomValue, file))
  }, children);
}
function getFilter(effects) {
  var components = effects.map(function (effect) {
    if (effect.name === 'blur') {
      return "blur(".concat(effect.value / 100 * 10, "px)");
    } else if (['brightness', 'contrast', 'saturate'].includes(effect.name)) {
      var value = Math.round(effect.value < 0 ? 100 + effect.value * 0.6 : 100 + effect.value);
      return "".concat(effect.name, "(").concat(value, "%)");
    } else if (['grayscale', 'sepia'].includes(effect.name)) {
      return "".concat(effect.name, "(").concat(effect.value, "%)");
    }
    return null;
  }).filter(Boolean);
  return components.length ? components.join(' ') : null;
}
function getAutoZoomProperties(autoZoomValue, file) {
  if (!autoZoomValue) {
    return null;
  }
  var x = (file === null || file === void 0 ? void 0 : file.motifArea) ? 50 - (file.motifArea.left + file.motifArea.width / 2) : 0;
  var y = (file === null || file === void 0 ? void 0 : file.motifArea) ? 50 - (file.motifArea.top + file.motifArea.height / 2) : 0;
  return {
    '--auto-zoom-origin-x': "".concat(x, "%"),
    '--auto-zoom-origin-y': "".concat(y, "%"),
    '--auto-zoom-duration': "".concat(1000 * (autoZoomValue / 100) + 40000 * (1 - autoZoomValue / 100), "ms")
  };
}

function BackgroundVideo(_ref) {
  var video = _ref.video,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate,
    containerDimension = _ref.containerDimension;
  var _usePlayerState = usePlayerState(),
    _usePlayerState2 = _slicedToArray(_usePlayerState, 2),
    playerState = _usePlayerState2[0],
    playerActions = _usePlayerState2[1];
  var _useSectionLifecycle = useSectionLifecycle({
      onVisible: function onVisible() {
        playerActions.changeVolumeFactor(0, 0);
        playerActions.play();
      },
      onActivate: function onActivate() {
        playerActions.changeVolumeFactor(1, 1000);
      },
      onDeactivate: function onDeactivate() {
        playerActions.changeVolumeFactor(0, 1000);
      },
      onInvisible: function onInvisible() {
        playerActions.pause();
      }
    }),
    shouldLoad = _useSectionLifecycle.shouldLoad,
    shouldPrepare = _useSectionLifecycle.shouldPrepare;
  useEffect(function () {
    var documentState = documentHiddenState(function (visibilityState) {
      if (visibilityState === 'hidden') {
        playerActions.pause();
      } else {
        playerActions.play();
      }
    });
    return function () {
      documentState.removeCallback();
    };
  }, [playerActions]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Effects, {
    file: video
  }, /*#__PURE__*/React.createElement(PlayerEventContextDataProvider, {
    playerDescription: "Backdrop Video",
    playbackMode: "loop"
  }, /*#__PURE__*/React.createElement(VideoPlayer, {
    load: shouldPrepare ? 'auto' : shouldLoad ? 'poster' : 'none',
    playerState: playerState,
    playerActions: playerActions,
    videoFile: video,
    textTracksDisabled: true,
    adaptiveMinQuality: "high",
    fit: "cover",
    loop: true,
    playsInline: true
  }))), /*#__PURE__*/React.createElement(MotifArea, {
    key: video.permaId,
    onUpdate: onMotifAreaUpdate,
    file: video,
    containerWidth: containerDimension.width,
    containerHeight: containerDimension.height
  }));
}

var styles$h = {"fill":"Image-module_fill__1D1wH","contain":"Image-module_contain__3_XWB"};

function ImageStructuredData(_ref) {
  var file = _ref.file;
  var entryMedadata = useEntryMetadata();
  var data = {
    '@context': 'http://schema.org',
    '@type': 'ImageObject',
    name: file.basename,
    description: file.configuration.alt,
    url: ensureProtocol('https', file.urls.large),
    width: file.width,
    height: file.height,
    datePublished: entryMedadata.publishedAt,
    uploadDate: file.createdAt,
    copyrightHolder: {
      '@type': 'Organization',
      name: file.rights
    }
  };
  return /*#__PURE__*/React.createElement(StructuredData, {
    data: data
  });
}

var _excluded$2 = ["imageFile"];

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {Object} props.imageFile - Image file obtained via `useFile`.
 * @param {string} [props.variant] - Paperclip style to use. Defaults to large.
 * @param {boolean} [props.load] - Whether to load the image. Can be used for lazy loading.
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 * @param {boolean} [props.preferSvg] - Use original if image is SVG.
 * @param {boolean} [props.fill=true] - Position absolute and fill parent.
 * @param {boolean} [props.fit=cover] - `"contain"` or `"cover"`.
 */
function Image(_ref) {
  var imageFile = _ref.imageFile,
    props = _objectWithoutProperties(_ref, _excluded$2);
  if (imageFile && imageFile.isReady && props.load) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, renderImageTag(props, imageFile), renderStructuredData(props, imageFile));
  }
  return null;
}
function renderImageTag(props, imageFile) {
  var cropPositionX = imageFile.cropPosition ? imageFile.cropPosition.x : 50;
  var cropPositionY = imageFile.cropPosition ? imageFile.cropPosition.y : 50;
  return /*#__PURE__*/React.createElement("img", {
    className: classNames(_defineProperty(_defineProperty({}, styles$h.fill, props.fill), styles$h.contain, props.fit === 'contain')),
    src: imageUrl(imageFile, props),
    alt: imageFile.configuration.alt ? imageFile.configuration.alt : '',
    width: props.width,
    height: props.height,
    style: {
      objectPosition: "".concat(cropPositionX, "% ").concat(cropPositionY, "%")
    }
  });
}
function imageUrl(imageFile, _ref2) {
  var variant = _ref2.variant,
    preferSvg = _ref2.preferSvg;
  if (variant === 'ultra' && !imageFile.urls.ultra) {
    variant = 'large';
  }
  if (preferSvg && imageFile.extension.toLowerCase() === 'svg') {
    return imageFile.urls.original;
  } else {
    return imageFile.urls[variant];
  }
}
function renderStructuredData(props, file) {
  if (props.structuredData && file) {
    return /*#__PURE__*/React.createElement(ImageStructuredData, {
      file: file
    });
  }
}
Image.defaultProps = {
  load: true,
  variant: 'large',
  fill: true
};

function BackgroundImage(_ref) {
  var image = _ref.image,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate,
    containerDimension = _ref.containerDimension;
  var _useSectionLifecycle = useSectionLifecycle(),
    shouldLoad = _useSectionLifecycle.shouldLoad;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Effects, {
    file: image
  }, /*#__PURE__*/React.createElement(Image, {
    imageFile: image,
    load: shouldLoad,
    structuredData: true,
    preferSvg: true
  })), /*#__PURE__*/React.createElement(MotifArea, {
    key: image === null || image === void 0 ? void 0 : image.permaId,
    onUpdate: onMotifAreaUpdate,
    file: image,
    containerWidth: containerDimension.width,
    containerHeight: containerDimension.height
  }));
}

var BackgroundContentElement = withInlineEditingDecorator('BackgroundContentElementDecorator', function BackgroundContentElement(_ref) {
  var contentElement = _ref.contentElement,
    isIntersecting = _ref.isIntersecting,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate,
    containerDimension = _ref.containerDimension;
  var sectionLifecycle = useSectionLifecycle();
  var lifecycleOverride = useMemo(function () {
    return _objectSpread2(_objectSpread2({}, sectionLifecycle), {}, {
      isActive: sectionLifecycle.isActive && !isIntersecting
    });
  }, [sectionLifecycle, isIntersecting]);
  var sectionProps = useMemo(function () {
    return {
      isIntersecting: isIntersecting,
      containerDimension: containerDimension
    };
  }, [isIntersecting, containerDimension]);
  return /*#__PURE__*/React.createElement("div", {
    ref: onMotifAreaUpdate
  }, /*#__PURE__*/React.createElement(ContentElement, {
    id: contentElement.id,
    permaId: contentElement.permaId,
    type: contentElement.type,
    position: contentElement.position,
    width: 3,
    itemProps: contentElement.props,
    sectionProps: sectionProps,
    lifecycleOverride: lifecycleOverride
  }));
});

function BackgroundAsset(props) {
  var backgroundFile = useBackgroundFile({
    file: props.backdrop.video || props.backdrop.image,
    motifArea: props.backdrop.motifArea,
    effects: props.backdrop.effects,
    containerDimension: props.containerDimension
  });
  if (props.backdrop.contentElement) {
    return /*#__PURE__*/React.createElement(Fullscreen, {
      ref: props.setContainerRef
    }, /*#__PURE__*/React.createElement(BackgroundContentElement, {
      contentElement: props.backdrop.contentElement,
      onMotifAreaUpdate: props.onMotifAreaUpdate,
      containerDimension: props.containerDimension,
      isIntersecting: props.motifAreaState.isMotifIntersected
    }));
  } else if (props.backdrop.video) {
    return /*#__PURE__*/React.createElement(Fullscreen, {
      ref: props.setContainerRef
    }, /*#__PURE__*/React.createElement(BackgroundVideo, {
      video: backgroundFile,
      onMotifAreaUpdate: props.onMotifAreaUpdate,
      containerDimension: props.containerDimension
    }));
  } else if (props.backdrop.color) {
    return /*#__PURE__*/React.createElement(FillColor, {
      color: props.backdrop.color
    });
  } else {
    return /*#__PURE__*/React.createElement(Fullscreen, {
      ref: props.setContainerRef
    }, /*#__PURE__*/React.createElement(BackgroundImage, {
      image: backgroundFile,
      onMotifAreaUpdate: props.onMotifAreaUpdate,
      containerDimension: props.containerDimension
    }));
  }
}

var styles$i = {"Backdrop":"Backdrop-module_Backdrop__1w4UZ","noCompositionLayer":"Backdrop-module_noCompositionLayer__33IlH","coverSection":"Backdrop-module_coverSection__201GK","defaultBackground":"Backdrop-module_defaultBackground__1YQQL"};

var sharedTransitionStyles = {"fixed":"shared-module_fixed__3T2AK","justifyBottom":"shared-module_justifyBottom__22ncu","fadedOut":"shared-module_fadedOut__D8bt8"};

var Backdrop = withInlineEditingDecorator('BackdropDecorator', function Backdrop(props) {
  var _useDimension = useDimension(),
    _useDimension2 = _slicedToArray(_useDimension, 2),
    containerDimension = _useDimension2[0],
    setContainerRef = _useDimension2[1];
  var _useSectionLifecycle = useSectionLifecycle(),
    shouldLoad = _useSectionLifecycle.shouldLoad;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$i.Backdrop, _defineProperty({}, styles$i.noCompositionLayer, !shouldLoad && !props.eagerLoad), _defineProperty({}, styles$i.coverSection, props.size === 'coverSection'), props.transitionStyles.backdrop, props.transitionStyles["backdrop-".concat(props.state)])
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(props.transitionStyles.backdropInner, _defineProperty({}, sharedTransitionStyles.justifyBottom, props.backdrop.contentElement))
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$i.defaultBackground, props.transitionStyles.backdropInner2)
  }, props.children( /*#__PURE__*/React.createElement(BackgroundAsset, Object.assign({}, props, {
    containerDimension: containerDimension,
    setContainerRef: setContainerRef
  }))))));
});
Backdrop.defaultProps = {
  children: function children(_children) {
    return _children;
  },
  transitionStyles: {}
};

function isIntersectingX(rectA, rectB) {
  return rectA.left < rectB.right && rectA.right > rectB.left || rectB.left < rectA.right && rectB.right > rectA.left;
}

function getBoundingClientRect(el) {
  if (!el) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0
    };
  }
  return el.getBoundingClientRect();
}
function useBoundingClientRect() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$updateOnScrollAn = _ref.updateOnScrollAndResize,
    updateOnScrollAndResize = _ref$updateOnScrollAn === void 0 ? true : _ref$updateOnScrollAn,
    _ref$dependencies = _ref.dependencies,
    dependencies = _ref$dependencies === void 0 ? [] : _ref$dependencies;
  var _useState = useState(getBoundingClientRect(null)),
    _useState2 = _slicedToArray(_useState, 2),
    boundingClientRect = _useState2[0],
    setBoundingClientRect = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    currentNode = _useState4[0],
    setCurrentNode = _useState4[1];
  var measureRef = useCallback(function (node) {
    setCurrentNode(node);
    setBoundingClientRect(getBoundingClientRect(node));
  }, []);
  useIsomorphicLayoutEffect(function () {
    if (dependencies.length && currentNode) {
      setBoundingClientRect(getBoundingClientRect(currentNode));
    }
  }, dependencies);
  useEffect(function () {
    function handler() {
      setBoundingClientRect(getBoundingClientRect(currentNode));
    }
    if (!currentNode || !updateOnScrollAndResize) {
      return;
    }
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);
    return function () {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    };
  }, [currentNode, updateOnScrollAndResize]);
  return [boundingClientRect, measureRef];
}

/**
 * Handles the state of the section layout based on the current
 * position of content and motif area. Returns an array of the form:
 *
 *     [
 *      {
 *        isContentPadded,    // true if motif and content will
 *                            // not fit side by side.
 *
 *        isMotifIntersected, // true if either section content or
 *                            // or content from the next section
 *                            // entering with a fadeBg transition
 *                            // overlaps the motif. Used to hide
 *                            // interactive parts (e.g., player
 *                            // controls) of backdrop content
 *                            // elements.
 *
 *        intersectionRatioY, // Ratio of the motif area that is
 *                            // covered by the content given the
 *                            // current scroll position of motif
 *                            // is exposed.
 *
 *        paddingTop,         // Distance to shift down the content
 *                            // to ensure the motif area can be
 *                            // seen when entering the section.
 *
 *        minHeight,          // Min Height of the section to ensure
 *                            // the motif area can be seen.
 *      },
 *      setMotifAreaRectRef,  // Assign motif area element that shall be
 *                            // measured.
 *
 *      setContentAreaRef     // Assign content area element that
 *                            // shall be measured.
 *     ]
 *
 * @param {Object} options
 * @param {boolean} backdropContentElement - Whether the section has a
 *   backdrop content element.
 * @param {string[]} transitions - Names of the section's enter and exit
 *   transitions.
 * @param {boolean} fullHeight - Whether the section has full or dynamic
 *   height.
 * @param {boolean} empty - Whether the section contains content
 *  elements.
 * @param {boolean} exposeMotifArea - Whether to pad content down if it
 *  would otherwise intersect with the motif area.
 *
 * @private
 */
function useMotifAreaState() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    backdropContentElement = _ref.backdropContentElement,
    transitions = _ref.transitions,
    fullHeight = _ref.fullHeight,
    empty = _ref.empty,
    exposeMotifArea = _ref.exposeMotifArea,
    updateOnScrollAndResize = _ref.updateOnScrollAndResize;
  var _useBoundingClientRec = useBoundingClientRect({
      updateOnScrollAndResize: updateOnScrollAndResize
    }),
    _useBoundingClientRec2 = _slicedToArray(_useBoundingClientRec, 2),
    motifAreaRect = _useBoundingClientRec2[0],
    setMotifAreaRectRef = _useBoundingClientRec2[1];
  var _useDimension = useDimension(),
    _useDimension2 = _slicedToArray(_useDimension, 2),
    motifAreaDimension = _useDimension2[0],
    setMotifAreaDimensionRef = _useDimension2[1];
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isPadded = _useState2[0],
    setIsPadded = _useState2[1];
  var setMotifAreaRef = useCallback(function (node) {
    setMotifAreaRectRef(node);
    setMotifAreaDimensionRef(node);
  }, [setMotifAreaRectRef, setMotifAreaDimensionRef]);
  var _useBoundingClientRec3 = useBoundingClientRect({
      updateOnScrollAndResize: updateOnScrollAndResize,
      dependencies: [isPadded]
    }),
    _useBoundingClientRec4 = _slicedToArray(_useBoundingClientRec3, 2),
    contentAreaRect = _useBoundingClientRec4[0],
    setContentAreaRef = _useBoundingClientRec4[1];
  var contentRequiresPadding = exposeMotifArea && isIntersectingX(motifAreaRect, contentAreaRect) && motifAreaRect.height > 0 && !empty;
  var paddingTop = getMotifAreaPadding(contentRequiresPadding, transitions, motifAreaDimension, backdropContentElement, empty);

  // Force measuring content area again since applying the padding
  // changes the intersection ratio.
  var willBePadded = !!paddingTop;
  useEffect(function () {
    setIsPadded(willBePadded);
  }, [willBePadded]);
  var intersectionRatioY = getIntersectionRatioY(motifAreaRect, contentAreaRect);
  return [{
    paddingTop: paddingTop,
    isContentPadded: contentRequiresPadding || backdropContentElement,
    minHeight: getMotifAreaMinHeight(fullHeight, transitions, motifAreaDimension),
    intersectionRatioY: contentRequiresPadding ? intersectionRatioY : 0,
    isMotifIntersected: getIsMotifIntersected(empty, transitions, intersectionRatioY)
  }, setMotifAreaRef, setContentAreaRef];
}
function getMotifAreaPadding(contentRequiresPadding, transitions, motifAreaDimension, backdropContentElement, empty) {
  if (backdropContentElement) {
    if (transitions[0] === 'fadeIn' || empty && transitions[1] === 'fadeOut') {
      return '70vh';
    } else {
      return '110vh';
    }
  } else if (!contentRequiresPadding) {
    return;
  }
  if (transitions[0] === 'fadeIn' || transitions[0] === 'fadeInBg') {
    // Once the section has become active, the backdrop becomes
    // visible all at once. Motif area aware background positioning
    // ensures that the motif area is within the viewport. Still, when
    // scrolling fast, the top of the section will already have
    // reached the top of the viewport once the fade transitions ends.
    //
    // If the motif area is at the top of the backdrop, adding its
    // height as padding is enough to ensure that the content does not
    // immediately start intersecting.
    //
    // If the motif area is at the bottom of the backdrop, additional
    // padding is needed to prevent the content from hiding the motif
    // right at the start. Adding the full top distance of the motif
    // area, though, means a full viewport height has to be scrolled
    // by after the content of the previous section has been faded out
    // before the content of the section enters the viewport.
    // Subjectively, this feels like to little feedback that more
    // content is coming. We therefore reduce the additional distance
    // by a third.
    return motifAreaDimension.top * 2 / 3 + motifAreaDimension.height;
  }
  if (transitions[0] === 'reveal') {
    // The backdrop remains in a fixed position while the content is
    // being scrolled in. Shifting the content down by the height of
    // the motif area means the motif area will be completely visible
    // when the top of the section aligns with the top of the motif
    // area.
    //
    // For exit transition `scrollOut`, the min height determined
    // below, ensures that the top of the section can actually reach
    // that position before the section begins to scroll.
    return motifAreaDimension.height;
  } else {
    // In the remaining `scrollIn` case, content and backdrop move in
    // together. We need to shift content down below the motif.
    return motifAreaDimension.top + motifAreaDimension.height;
  }
}
function getMotifAreaMinHeight(fullHeight, transitions, motifAreaDimension) {
  if (fullHeight) {
    return;
  }
  if (transitions[0] === 'reveal') {
    if (transitions[1] === 'conceal') {
      // Ensure section is tall enough to reveal the full height of
      // the motif area once the section passes it.
      return motifAreaDimension.height;
    } else {
      // Ensure backdrop can be revealed far enough before the section
      // starts scrolling.
      return motifAreaDimension.bottom + motifAreaDimension.height;
    }
  } else {
    // Ensure motif is visible in scrolled in section.
    return motifAreaDimension.top + motifAreaDimension.height;
  }
}
function getIntersectionRatioY(motifAreaRect, contentAreaRect) {
  var motifAreaOverlap = Math.max(0, Math.min(motifAreaRect.height, motifAreaRect.bottom - contentAreaRect.top));
  return motifAreaRect.height > 0 ? motifAreaOverlap / motifAreaRect.height : 0;
}
function getIsMotifIntersected(empty, transitions, intersectionRatioY) {
  // Hide interactive parts of backdrop content elements (e.g., player
  // controls) if:
  // - section has content and it has been scrolled to overlap or
  // - next section enters with fadeOutBg making it contents potentially
  //   overlap the motif area
  return !empty || transitions[1] === 'fadeOutBg' ? intersectionRatioY > 0 : false;
}

function useBackdrop(section) {
  var _section$backdrop, _section$backdrop2, _section$backdrop3;
  var videoBackdrop = useFileBackdrop({
    section: section,
    collectionName: 'videoFiles',
    propertyName: 'video'
  });
  var imageBackdrop = useFileBackdrop({
    section: section,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  var contentElement = useContentElement({
    permaId: (_section$backdrop = section.backdrop) === null || _section$backdrop === void 0 ? void 0 : _section$backdrop.contentElement,
    layout: 'backdrop'
  });
  if (contentElement && contentElement.sectionId === section.id) {
    return {
      contentElement: contentElement
    };
  } else if (((_section$backdrop2 = section.backdrop) === null || _section$backdrop2 === void 0 ? void 0 : _section$backdrop2.color) || ((_section$backdrop3 = section.backdrop) === null || _section$backdrop3 === void 0 ? void 0 : _section$backdrop3.image) && section.backdrop.image.toString().startsWith('#')) {
    return {
      color: section.backdrop.color || section.backdrop.image
    };
  } else {
    return videoBackdrop || imageBackdrop || {};
  }
}
function useFileBackdrop(_ref) {
  var section = _ref.section,
    collectionName = _ref.collectionName,
    propertyName = _ref.propertyName;
  var file = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName: collectionName,
    propertyName: propertyName
  });
  var mobileFile = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName: collectionName,
    propertyName: "".concat(propertyName, "Mobile")
  });
  var mobile = usePortraitOrientation({
    active: file && mobileFile
  });
  if (mobileFile && (mobile || !file)) {
    return _defineProperty(_defineProperty(_defineProperty({}, propertyName, mobileFile), "motifArea", section.backdrop["".concat(propertyName, "MobileMotifArea")]), "effects", section.backdropEffectsMobile);
  } else if (file) {
    return _defineProperty(_defineProperty(_defineProperty({}, propertyName, file), "motifArea", section.backdrop["".concat(propertyName, "MotifArea")]), "effects", section.backdropEffects);
  } else {
    return null;
  }
}

function useBackdropSectionCustomProperties() {}
function useBackdropSectionClassNames() {}

var v1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  useBackdropSectionCustomProperties: useBackdropSectionCustomProperties,
  useBackdropSectionClassNames: useBackdropSectionClassNames,
  Backdrop: Backdrop,
  useMotifAreaState: useMotifAreaState,
  useBackdrop: useBackdrop
});

var styles$j = {"wrapper":"Positioner-module_wrapper__3iFSg"};

function Positioner(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$j.wrapper
  }, children);
}

var styles$k = {"root":"Picture-module_root__1BCCg"};

function Picture(_ref) {
  var imageFile = _ref.imageFile,
    imageFileMobile = _ref.imageFileMobile,
    variant = _ref.variant,
    structuredData = _ref.structuredData,
    load = _ref.load,
    preferSvg = _ref.preferSvg;
  if (imageFile && imageFile.isReady && load) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, renderTag({
      imageFile: imageFile,
      imageFileMobile: imageFileMobile,
      variant: variant,
      preferSvg: preferSvg
    }), renderStructuredData$1({
      imageFile: imageFile,
      structuredData: structuredData
    }));
  }
  return null;
}
function renderTag(_ref2) {
  var imageFile = _ref2.imageFile,
    imageFileMobile = _ref2.imageFileMobile,
    variant = _ref2.variant,
    preferSvg = _ref2.preferSvg;
  return /*#__PURE__*/React.createElement("picture", null, imageFileMobile && /*#__PURE__*/React.createElement("source", {
    srcSet: imageUrl$1({
      imageFile: imageFileMobile,
      variant: variant,
      preferSvg: preferSvg
    }),
    media: "(orientation: portrait)"
  }), /*#__PURE__*/React.createElement("img", {
    className: classNames(styles$k.root),
    src: imageUrl$1({
      imageFile: imageFile,
      variant: variant,
      preferSvg: preferSvg
    }),
    alt: imageFile.configuration.alt ? imageFile.configuration.alt : ''
  }));
}
function imageUrl$1(_ref3) {
  var imageFile = _ref3.imageFile,
    variant = _ref3.variant,
    preferSvg = _ref3.preferSvg;
  if (preferSvg && imageFile.extension.toLowerCase() === 'svg') {
    return imageFile.urls.original;
  } else {
    return imageFile.urls[variant];
  }
}
function renderStructuredData$1(_ref4) {
  var imageFile = _ref4.imageFile,
    structuredData = _ref4.structuredData;
  if (structuredData && imageFile) {
    return /*#__PURE__*/React.createElement(ImageStructuredData, {
      file: imageFile
    });
  }
}
Picture.defaultProps = {
  load: true,
  variant: 'large'
};

var v2Styles = {"root":"MotifArea-module_root__2gOCe"};

var MotifArea$1 = function MotifArea(props) {
  var visible = useContext(MotifAreaVisibilityContext);
  return /*#__PURE__*/React.createElement("div", {
    ref: props.onUpdate,
    className: classNames(styles$f.root, v2Styles.root, _defineProperty({}, styles$f.visible, visible))
  });
};

var styles$l = {"effects":"Effects-module_effects__MDZRR"};

function Effects$1(_ref) {
  var file = _ref.file,
    mobileFile = _ref.mobileFile,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$l.effects,
    style: {
      '--filter': getFilter$1((file === null || file === void 0 ? void 0 : file.effects) || []),
      '--mobile-filter': getFilter$1((mobileFile === null || mobileFile === void 0 ? void 0 : mobileFile.effects) || [])
    }
  }, children);
}
function getFilter$1(effects) {
  return effects.map(function (effect) {
    if (effect.name === 'blur') {
      return "blur(".concat(effect.value / 100 * 10, "px)");
    } else if (['brightness', 'contrast', 'saturate'].includes(effect.name)) {
      var value = Math.round(effect.value < 0 ? 100 + effect.value * 0.6 : 100 + effect.value);
      return "".concat(effect.name, "(").concat(value, "%)");
    } else {
      return "".concat(effect.name, "(").concat(effect.value, "%)");
    }
  }).join(' ');
}

function BackgroundImage$1(_ref) {
  var _backdrop$file;
  var backdrop = _ref.backdrop,
    eagerLoad = _ref.eagerLoad,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate;
  var _useSectionLifecycle = useSectionLifecycle(),
    shouldLoad = _useSectionLifecycle.shouldLoad;
  var renderedInSectionThumbnail = !!useFullscreenDimensions().height;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Effects$1, {
    file: backdrop.file,
    mobileFile: backdrop.mobileFile
  }, /*#__PURE__*/React.createElement(Picture, {
    imageFile: backdrop.file,
    imageFileMobile: !renderedInSectionThumbnail && backdrop.mobileFile,
    load: shouldLoad || eagerLoad,
    structuredData: true,
    preferSvg: true
  })), /*#__PURE__*/React.createElement(MotifArea$1, {
    key: (_backdrop$file = backdrop.file) === null || _backdrop$file === void 0 ? void 0 : _backdrop$file.permaId,
    onUpdate: onMotifAreaUpdate
  }));
}

function BackgroundVideo$1(_ref) {
  var video = _ref.video,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate;
  var _usePlayerState = usePlayerState(),
    _usePlayerState2 = _slicedToArray(_usePlayerState, 2),
    playerState = _usePlayerState2[0],
    playerActions = _usePlayerState2[1];
  var _useSectionLifecycle = useSectionLifecycle({
      onVisible: function onVisible() {
        playerActions.changeVolumeFactor(0, 0);
        playerActions.play();
      },
      onActivate: function onActivate() {
        playerActions.changeVolumeFactor(1, 1000);
      },
      onDeactivate: function onDeactivate() {
        playerActions.changeVolumeFactor(0, 1000);
      },
      onInvisible: function onInvisible() {
        playerActions.pause();
      }
    }),
    shouldLoad = _useSectionLifecycle.shouldLoad,
    shouldPrepare = _useSectionLifecycle.shouldPrepare;
  useEffect(function () {
    var documentState = documentHiddenState(function (visibilityState) {
      if (visibilityState === 'hidden') {
        playerActions.pause();
      } else {
        playerActions.play();
      }
    });
    return function () {
      documentState.removeCallback();
    };
  }, [playerActions]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Effects$1, {
    file: video
  }, /*#__PURE__*/React.createElement(PlayerEventContextDataProvider, {
    playerDescription: "Backdrop Video",
    playbackMode: "loop"
  }, /*#__PURE__*/React.createElement(VideoPlayer, {
    load: shouldPrepare ? 'auto' : shouldLoad ? 'poster' : 'none',
    playerState: playerState,
    playerActions: playerActions,
    videoFile: video,
    textTracksDisabled: true,
    fit: "cover",
    loop: true,
    playsInline: true
  }))), /*#__PURE__*/React.createElement(MotifArea$1, {
    key: video.permaId,
    onUpdate: onMotifAreaUpdate
  }));
}

function BackgroundAsset$1(_ref) {
  var backdrop = _ref.backdrop,
    eagerLoad = _ref.eagerLoad,
    state = _ref.state,
    onMotifAreaUpdate = _ref.onMotifAreaUpdate;
  if (backdrop.type === 'video') {
    return /*#__PURE__*/React.createElement(Fullscreen, null, /*#__PURE__*/React.createElement(Positioner, null, /*#__PURE__*/React.createElement(BackgroundVideo$1, {
      video: backdrop.file,
      onMotifAreaUpdate: onMotifAreaUpdate
    })));
  }
  if (backdrop.type === 'color') {
    return /*#__PURE__*/React.createElement(FillColor, {
      color: backdrop.color
    });
  } else {
    return /*#__PURE__*/React.createElement(Fullscreen, null, /*#__PURE__*/React.createElement(Positioner, null, /*#__PURE__*/React.createElement(BackgroundImage$1, {
      backdrop: backdrop,
      eagerLoad: eagerLoad && state === 'active',
      onMotifAreaUpdate: onMotifAreaUpdate
    })));
  }
}
BackgroundAsset$1.defaultProps = {
  eagerLoad: false
};

function Backdrop$1(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$i.Backdrop, props.transitionStyles.backdrop, props.transitionStyles["backdrop-".concat(props.state)])
  }, /*#__PURE__*/React.createElement("div", {
    className: props.transitionStyles.backdropInner
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$i.defaultBackground, props.transitionStyles.backdropInner2)
  }, props.children( /*#__PURE__*/React.createElement(BackgroundAsset$1, props)))));
}
Backdrop$1.defaultProps = {
  children: function children(_children) {
    return _children;
  },
  transitionStyles: {}
};

/**
 * Handles the state of the section layout based on the current
 * position of content and motif area. Returns an array of the form:
 *
 *     [
 *      {
 *        isContentPadded,    // true if motif and content will
 *                            // not fit side by side.
 *
 *        intersectionRatioY, // Ratio of the motif area that is
 *                            // covered by the content given the
 *                            // current scroll position if motif
 *                            // is exposed.
 *
 *        paddingTop,         // Distance to shift down the content
 *                            // to ensure the motif area can be
 *                            // seen when entering the section.
 *
 *        minHeight,          // Min Height of the section to ensure
 *                            // the motif area can be seen.
 *      },
 *      setMotifAreaRectRef,  // Assign motif area element that shall be
 *                            // measured.
 *
 *      setContentAreaRef     // Assign content area element that
 *                            // shall be measured.
 *     ]
 *
 * @param {Object} options
 * @param {string[]} transitions - Names of the section's enter and exit
 *   transitions.
 * @param {boolean} fullHeight - Whether the section has full or dynamic
 *   height.
 * @param {boolean} empty - Whether the section contains content
 *  elements.
 * @param {boolean} exposeMotifArea - Whether to pad content down if it
 *  would otherwise intersect with the motif area.
 *
 * @private
 */
function useMotifAreaState$1() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    transitions = _ref.transitions,
    fullHeight = _ref.fullHeight,
    empty = _ref.empty,
    exposeMotifArea = _ref.exposeMotifArea,
    updateOnScrollAndResize = _ref.updateOnScrollAndResize;
  var _useBoundingClientRec = useBoundingClientRect({
      updateOnScrollAndResize: updateOnScrollAndResize
    }),
    _useBoundingClientRec2 = _slicedToArray(_useBoundingClientRec, 2),
    motifAreaRect = _useBoundingClientRec2[0],
    setMotifAreaRectRef = _useBoundingClientRec2[1];
  var _useBoundingClientRec3 = useBoundingClientRect({
      updateOnScrollAndResize: updateOnScrollAndResize
    }),
    _useBoundingClientRec4 = _slicedToArray(_useBoundingClientRec3, 2),
    contentAreaRect = _useBoundingClientRec4[0],
    setContentAreaRef = _useBoundingClientRec4[1];
  var isContentPadded = exposeMotifArea && motifAreaRect.height > 0 && !empty;
  return [{
    paddingTop: getMotifAreaPadding$1(transitions),
    minHeight: getMotifAreaMinHeight$1(fullHeight, transitions),
    intersectionRatioY: getIntersectionRatioY$1(isContentPadded, motifAreaRect, contentAreaRect)
  }, setMotifAreaRectRef, setContentAreaRef];
}
function getMotifAreaPadding$1(transitions) {
  if (transitions[0] === 'fadeIn' || transitions[0] === 'fadeInBg') {
    return 'var(--motif-padding-fade-in)';
  }
  if (transitions[0] === 'reveal') {
    return 'var(--motif-padding-reveal)';
  } else {
    return 'var(--motif-padding-scroll-in)';
  }
}
function getMotifAreaMinHeight$1(fullHeight, transitions) {
  if (fullHeight) {
    return;
  }
  if (transitions[0] === 'reveal') {
    if (transitions[1] === 'conceal') {
      return 'var(--motif-min-height-reveal-conceal)';
    } else {
      return 'var(--motif-min-height-reveal)';
    }
  } else {
    return 'var(--motif-min-height-scroll-in)';
  }
}
function getIntersectionRatioY$1(isContentPadded, motifAreaRect, contentAreaRect) {
  var motifAreaOverlap = Math.max(0, Math.min(motifAreaRect.height, motifAreaRect.bottom - contentAreaRect.top));
  return isContentPadded ? motifAreaOverlap / motifAreaRect.height : 0;
}

function useBackdrop$1(_ref) {
  var backdrop = _ref.backdrop,
    backdropEffects = _ref.backdropEffects,
    backdropEffectsMobile = _ref.backdropEffectsMobile;
  var videoFile = useBackdropFile({
    permaId: backdrop.video,
    collectionName: 'videoFiles',
    motifArea: backdrop.videoMotifArea,
    effects: backdropEffects
  });
  var imageFile = useBackdropFile({
    permaId: backdrop.image,
    collectionName: 'imageFiles',
    motifArea: backdrop.imageMotifArea,
    effects: backdropEffects
  });
  var mobileImageFile = useBackdropFile({
    permaId: backdrop.imageMobile,
    collectionName: 'imageFiles',
    motifArea: backdrop.imageMobileMotifArea,
    effects: backdropEffectsMobile
  });
  if (videoFile) {
    return {
      type: 'video',
      file: videoFile
    };
  }
  if (backdrop.color || backdrop.image && backdrop.image.toString().startsWith('#')) {
    return {
      type: 'color',
      color: backdrop.color || backdrop.image
    };
  } else {
    return {
      type: 'image',
      file: imageFile || mobileImageFile,
      mobileFile: imageFile && mobileImageFile
    };
  }
}
function useBackdropFile(_ref2) {
  var permaId = _ref2.permaId,
    collectionName = _ref2.collectionName,
    motifArea = _ref2.motifArea,
    effects = _ref2.effects;
  var file = useFile({
    permaId: permaId,
    collectionName: collectionName
  });
  return file && _objectSpread2(_objectSpread2({}, file), {}, {
    motifArea: motifArea,
    effects: effects
  });
}

function useBackdropSectionCustomProperties$1(backdrop) {
  return _objectSpread2(_objectSpread2({}, backdropFileCustomProperties(backdrop.file)), backdropFileCustomProperties(backdrop.mobileFile, 'mobile'));
}
function backdropFileCustomProperties(backdropFile, prefix) {
  if (!backdropFile || !backdropFile.isReady) {
    return {};
  }
  prefix = prefix ? "".concat(prefix, "-") : '';
  return backdropFile ? _objectSpread2(_defineProperty(_defineProperty({}, "--".concat(prefix, "backdrop-w"), backdropFile.width), "--".concat(prefix, "backdrop-h"), backdropFile.height), motifAreaCustomProperties(backdropFile.motifArea, prefix)) : {};
}
function motifAreaCustomProperties(motifArea, prefix) {
  return motifArea ? _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "--".concat(prefix, "motif-t"), motifArea.top), "--".concat(prefix, "motif-l"), motifArea.left), "--".concat(prefix, "motif-w"), motifArea.width), "--".concat(prefix, "motif-h"), motifArea.height) : {};
}

var styles$m = {"section":"Section-module_section__7UvMm","orientation":"Section-module_orientation__3-m2N","exposeMotifArea":"Section-module_exposeMotifArea__2rsq_","layout-left":"Section-module_layout-left__2IqOD","layout-right":"Section-module_layout-right__3al0b"};

function useBackdropSectionClassNames$1(backdrop) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    layout = _ref.layout,
    exposeMotifArea = _ref.exposeMotifArea,
    empty = _ref.empty;
  var fullscreenDimensions = useFullscreenDimensions();
  return [styles$m.section, !fullscreenDimensions.height && styles$m.orientation, styles$m["layout-".concat(layout || 'left')], exposeMotifArea && !empty && styles$m.exposeMotifArea, useAspectRatioClassName(backdrop.file, fullscreenDimensions), useAspectRatioClassName(backdrop.mobileFile, fullscreenDimensions, {
    mobile: true
  })].filter(Boolean);
}
function useAspectRatioClassName(file, fullscreenDimensions) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    mobile = _ref2.mobile;
  var aspectRatio = file && file.isReady && getAspectRatio(file);
  var className = getAspectRatioClassName(aspectRatio, fullscreenDimensions, mobile);
  useAspectRatioStyleTag(aspectRatio, className, {
    orientation: mobile ? '(orientation: portrait) and ' : ''
  });
  return className;
}
function getAspectRatioClassName(aspectRatio, fullscreenDimensions, mobile) {
  if (fullscreenDimensions.height) {
    return (!mobile || isPortrait(fullscreenDimensions)) && hasAspectRatio(fullscreenDimensions, {
      min: aspectRatio
    }) && 'minAspectRatio';
  } else {
    var suffix = mobile ? 'Mobile' : '';
    return aspectRatio && "aspectRatio".concat(suffix).concat(aspectRatio);
  }
}
function hasAspectRatio(rect, _ref3) {
  var min = _ref3.min;
  return min && getAspectRatio(rect) > min;
}
function isPortrait(rect) {
  return rect.width < rect.height;
}
function getAspectRatio(rect) {
  return Math.round(rect.width / rect.height * 1000);
}
function useAspectRatioStyleTag(aspectRatio, className, _ref4) {
  var orientation = _ref4.orientation;
  useIsomorphicLayoutEffect(function () {
    // global variable is set in script tag inserted by
    // GeneratedMediaQueriesHelper when style tags have been rendered
    // on the server
    if (!global.pageflowScrolledSSRAspectRatioMediaQueries && aspectRatio && className) {
      ensureAspectRatioStyleTag(aspectRatio, className, orientation);
    }
  }, [aspectRatio, className]);
}
function ensureAspectRatioStyleTag(aspectRatio, className, orientation) {
  if (!document.head.querySelector("[data-for=\"".concat(className, "\"]"))) {
    var el = document.createElement('style');
    el.setAttribute('data-for', className);
    el.innerHTML = getAspectRatioCSS(aspectRatio, className, orientation);
    document.head.appendChild(el);
  }
}
function getAspectRatioCSS(aspectRatio, className, orientation) {
  if (className === 'minAspectRatio') {
    return getAspectRatioRule('minAspectRatio');
  } else {
    return "\n      @media ".concat(orientation, "(min-aspect-ratio: ").concat(aspectRatio, "/1000) {\n        ").concat(getAspectRatioRule(className), "\n      }\n    ");
  }
}
function getAspectRatioRule(className) {
  // WARNING: This CSS snippet needs to be kept in sync with the
  // corresponding snippet in GeneratedMediaQueriesHelper
  return "\n    section.".concat(className, " {\n      --backdrop-positioner-transform: var(--backdrop-positioner-min-ar-transform);\n      --backdrop-positioner-width: var(--backdrop-positioner-min-ar-width);\n      --backdrop-positioner-height: var(--backdrop-positioner-min-ar-height);\n\n      --motif-placeholder-width: var(--motif-placeholder-min-ar-width);\n\n      --motif-display-top: var(--motif-display-min-ar-top);\n      --motif-display-bottom: var(--motif-display-min-ar-bottom);\n      --motif-display-height: var(--motif-display-min-ar-height);\n    }\n  ");
}



var v2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Backdrop: Backdrop$1,
  useMotifAreaState: useMotifAreaState$1,
  useBackdrop: useBackdrop$1,
  useBackdropSectionCustomProperties: useBackdropSectionCustomProperties$1,
  useBackdropSectionClassNames: useBackdropSectionClassNames$1
});

var styles$n = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","Section":"Section-module_Section__Yo58b","first":"Section-module_first__1vLBH","narrow":"Section-module_narrow__3Dawu","lightContent":"Section-module_lightContent__1hqim scope-lightContent","darkContent":"Section-module_darkContent__20cnO scope-darkContent"};

var fadeInBgConceal = {"fade-duration":"0.5s","backdrop":"fadeInBgConceal-module_backdrop__11JGO","backdropInner":"fadeInBgConceal-module_backdropInner__1IAYD shared-module_fixed__3T2AK","backdrop-below":"fadeInBgConceal-module_backdrop-below__3E6Uk"};

var fadeInBgFadeOut = {"fade-duration":"0.5s","backdrop":"fadeInBgFadeOut-module_backdrop__r0YXp","backdropInner":"fadeInBgFadeOut-module_backdropInner__IQp87 shared-module_fixed__3T2AK","backdrop-below":"fadeInBgFadeOut-module_backdrop-below__2G-Ic","foreground":"fadeInBgFadeOut-module_foreground__Q2vkT","foreground-above":"fadeInBgFadeOut-module_foreground-above__3pmz9 shared-module_fadedOut__D8bt8"};

var fadeInBgFadeOutBg = {"fade-duration":"0.5s","backdrop":"fadeInBgFadeOutBg-module_backdrop__15ocl","backdropInner":"fadeInBgFadeOutBg-module_backdropInner__sAnz6 shared-module_fixed__3T2AK","boxShadow":"fadeInBgFadeOutBg-module_boxShadow__xUKyj","boxShadow-above":"fadeInBgFadeOutBg-module_boxShadow-above__2bY0E","backdrop-below":"fadeInBgFadeOutBg-module_backdrop-below__1rDT6"};

var fadeInBgScrollOut = {"fade-duration":"0.5s","backdrop":"fadeInBgScrollOut-module_backdrop__1bSsb","backdropInner":"fadeInBgScrollOut-module_backdropInner__3JZBG","backdropInner2":"fadeInBgScrollOut-module_backdropInner2__q-00L","foreground":"fadeInBgScrollOut-module_foreground__1ODH9","backdrop-below":"fadeInBgScrollOut-module_backdrop-below__2Dbkr"};

var fadeInConceal = {"fade-duration":"0.5s","backdrop":"fadeInConceal-module_backdrop__1zaRO","backdropInner":"fadeInConceal-module_backdropInner__1AIvq shared-module_fixed__3T2AK","backdrop-below":"fadeInConceal-module_backdrop-below__AWyQe","foreground":"fadeInConceal-module_foreground__3giM9","foreground-below":"fadeInConceal-module_foreground-below__2z5Op shared-module_fadedOut__D8bt8"};

var fadeInFadeOut = {"fade-duration":"0.5s","backdrop":"fadeInFadeOut-module_backdrop__Y4xOA","backdropInner":"fadeInFadeOut-module_backdropInner__1oRfP shared-module_fixed__3T2AK","backdrop-below":"fadeInFadeOut-module_backdrop-below__1h2I4","foreground":"fadeInFadeOut-module_foreground__1eleZ","foreground-above":"fadeInFadeOut-module_foreground-above__249wa shared-module_fadedOut__D8bt8","foreground-below":"fadeInFadeOut-module_foreground-below__3mE6f shared-module_fadedOut__D8bt8"};

var fadeInFadeOutBg = {"fade-duration":"0.5s","backdrop":"fadeInFadeOutBg-module_backdrop__2-IF3","backdropInner":"fadeInFadeOutBg-module_backdropInner__3r_bo shared-module_fixed__3T2AK","boxShadow":"fadeInFadeOutBg-module_boxShadow__3x7Ki","backdrop-below":"fadeInFadeOutBg-module_backdrop-below__4Ys_2","boxShadow-above":"fadeInFadeOutBg-module_boxShadow-above__3T2K5","foreground":"fadeInFadeOutBg-module_foreground__24f_M","foreground-below":"fadeInFadeOutBg-module_foreground-below__3pTRc shared-module_fadedOut__D8bt8"};

var fadeInScrollOut = {"fade-duration":"0.5s","backdrop":"fadeInScrollOut-module_backdrop__2FhBb","backdropInner":"fadeInScrollOut-module_backdropInner__1OfNZ","backdropInner2":"fadeInScrollOut-module_backdropInner2__5bNPT","foreground":"fadeInScrollOut-module_foreground__3h0EX","foreground-below":"fadeInScrollOut-module_foreground-below__1Jcql shared-module_fadedOut__D8bt8","backdrop-below":"fadeInScrollOut-module_backdrop-below__3cRLH"};

var revealConceal = {"backdrop":"revealConceal-module_backdrop__dLUhU utils-module_clip__34eot","backdropInner":"revealConceal-module_backdropInner__2k1Z- shared-module_fixed__3T2AK"};

var revealFadeOut = {"fade-duration":"0.5s","backdrop":"revealFadeOut-module_backdrop___Q1QF utils-module_clip__34eot","backdropInner":"revealFadeOut-module_backdropInner__17qRn shared-module_fixed__3T2AK","foreground":"revealFadeOut-module_foreground__1GzBs","foreground-above":"revealFadeOut-module_foreground-above__3GxOf shared-module_fadedOut__D8bt8"};

var revealFadeOutBg = {"fade-duration":"0.5s","backdrop":"revealFadeOutBg-module_backdrop__30OCF utils-module_clip__34eot","backdropInner":"revealFadeOutBg-module_backdropInner__3v3tM shared-module_fixed__3T2AK","boxShadow":"revealFadeOutBg-module_boxShadow__1NZRz","boxShadow-above":"revealFadeOutBg-module_boxShadow-above__2r4ov"};

var revealScrollOut = {"backdrop":"revealScrollOut-module_backdrop__2yOXd utils-module_clip__34eot","backdropInner":"revealScrollOut-module_backdropInner__211p3","backdropInner2":"revealScrollOut-module_backdropInner2__v6WqM","foreground":"revealScrollOut-module_foreground__3z-hw"};

var scrollInConceal = {"backdrop":"scrollInConceal-module_backdrop__2OJJC"};

var scrollInFadeOut = {"fade-duration":"0.5s","backdrop":"scrollInFadeOut-module_backdrop__1vXJd","foreground":"scrollInFadeOut-module_foreground__3Ikxb","foreground-above":"scrollInFadeOut-module_foreground-above__6ipm- shared-module_fadedOut__D8bt8"};

var scrollInFadeOutBg = {"fade-duration":"0.5s","backdrop":"scrollInFadeOutBg-module_backdrop__zw95c","boxShadow":"scrollInFadeOutBg-module_boxShadow__3UxCQ","boxShadow-above":"scrollInFadeOutBg-module_boxShadow-above__3kfau"};

var scrollInScrollOut = {"backdrop":"scrollInScrollOut-module_backdrop__XzCge","backdropInner":"scrollInScrollOut-module_backdropInner__1ftIm"};

var styles$o = {
  fadeInBgConceal: fadeInBgConceal,
  fadeInBgFadeOut: fadeInBgFadeOut,
  fadeInBgFadeOutBg: fadeInBgFadeOutBg,
  fadeInBgScrollOut: fadeInBgScrollOut,
  fadeInConceal: fadeInConceal,
  fadeInFadeOut: fadeInFadeOut,
  fadeInFadeOutBg: fadeInFadeOutBg,
  fadeInScrollOut: fadeInScrollOut,
  revealConceal: revealConceal,
  revealFadeOut: revealFadeOut,
  revealFadeOutBg: revealFadeOutBg,
  revealScrollOut: revealScrollOut,
  scrollInConceal: scrollInConceal,
  scrollInFadeOut: scrollInFadeOut,
  scrollInFadeOutBg: scrollInFadeOutBg,
  scrollInScrollOut: scrollInScrollOut
};
var enterTransitions = {
  fade: 'fadeIn',
  fadeBg: 'fadeInBg',
  scroll: 'scrollIn',
  scrollOver: 'scrollIn',
  reveal: 'reveal',
  beforeAfter: 'reveal'
};
var exitTransitions = {
  fade: 'fadeOut',
  fadeBg: 'fadeOutBg',
  scroll: 'scrollOut',
  scrollOver: 'conceal',
  reveal: 'scrollOut',
  beforeAfter: 'conceal'
};
function getTransitionNames() {
  return Object.keys(exitTransitions);
}
function getAvailableTransitionNames(section, previousSection) {
  if (!section.fullHeight || !previousSection.fullHeight) {
    return getTransitionNames().filter(function (name) {
      return !name.startsWith('fade');
    });
  }
  return getTransitionNames();
}
function getTransitionStyles(section, previousSection, nextSection) {
  var name = getTransitionStylesName(section, previousSection, nextSection);
  if (!styles$o[name]) {
    throw new Error("Unknown transition ".concat(name));
  }
  return styles$o[name];
}
function getEnterAndExitTransitions(section, previousSection, nextSection) {
  return [enterTransitions[getTransitionName(previousSection, section)], exitTransitions[getTransitionName(section, nextSection)]];
}
function getTransitionStylesName(section, previousSection, nextSection) {
  var _getEnterAndExitTrans = getEnterAndExitTransitions(section, previousSection, nextSection),
    _getEnterAndExitTrans2 = _slicedToArray(_getEnterAndExitTrans, 2),
    enter = _getEnterAndExitTrans2[0],
    exit = _getEnterAndExitTrans2[1];
  return "".concat(enter).concat(capitalize(exit));
}
function getTransitionName(previousSection, section) {
  if (!section || !previousSection) {
    return 'scroll';
  }
  if ((!section.fullHeight || !previousSection.fullHeight) && section.transition.startsWith('fade')) {
    return 'scroll';
  }
  return section.transition;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function NoOpShadow(props) {
  return /*#__PURE__*/React.createElement("div", null, props.children);
}

var styles$p = {"static":"GradientShadow-module_static__rXNpZ","dynamic":"GradientShadow-module_dynamic__2v2JU","align-right":"GradientShadow-module_align-right__3iXZs","dark":"GradientShadow-module_dark__1YuV5","align-left":"GradientShadow-module_align-left__3qcNM","align-center":"GradientShadow-module_align-center__2C7cl","align-centerRagged":"GradientShadow-module_align-centerRagged__2-iv8","light":"GradientShadow-module_light__Vn92v","shadow":"GradientShadow-module_shadow__2UiDH"};

function GradientShadow(props) {
  // Hide static shadow if motif area intersects with content area.
  var staticShadowOpacity = props.motifAreaState.isContentPadded ? 0 : props.staticShadowOpacity;

  // If motif area intersects with content area horizontally, fade in
  // shadow soon as the content has been scrolled far enough to start
  // intersecting with the motif area vertically.
  var opacityFactor =
  // Make shadow reach full opacity when content has been scrolled
  // up half way across the motif area.
  roundToFirstDecimalPlace(Math.min(1, props.motifAreaState.intersectionRatioY * 2));
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$p["align-".concat(props.align)], props.inverted ? styles$p.light : styles$p.dark)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$p.dynamic,
    style: {
      opacity: props.dynamicShadowOpacity * opacityFactor
    }
  }, /*#__PURE__*/React.createElement(Fullscreen, null)), /*#__PURE__*/React.createElement("div", {
    className: styles$p["static"],
    style: {
      opacity: staticShadowOpacity
    }
  }, /*#__PURE__*/React.createElement(Fullscreen, null)), props.children);
}
GradientShadow.defaultProps = {
  opacity: 0.7,
  align: 'left'
};
function roundToFirstDecimalPlace(value) {
  return Math.round(value * 10) / 10;
}

var styles$q = {"start":"InvisibleBoxWrapper-module_start__F1nZ7","end":"InvisibleBoxWrapper-module_end__nphD-"};

function InvisibleBoxWrapper(_ref) {
  var position = _ref.position,
    width = _ref.width,
    openStart = _ref.openStart,
    openEnd = _ref.openEnd,
    children = _ref.children;
  var full = width === widths.full;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(_defineProperty(_defineProperty({}, styles$q.start, !openStart && !full), styles$q.end, !openEnd && !full))
  }, children);
}

var styles$r = {"wrapper":"GradientBox-module_wrapper__1Jj7N","content":"GradientBox-module_content__96lDk","shadow":"GradientBox-module_shadow__2XilX","gradient":"GradientBox-module_gradient__31tJ-","long":"GradientBox-module_long__10s6v","root":"GradientBox-module_root__8Xn9W","withShadow":"GradientBox-module_withShadow__3mhPR","shadowDark":"GradientBox-module_shadowDark__3Tv0L","shadowLight":"GradientBox-module_shadowLight__Bieg6"};

function GradientBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$r.root, _defineProperty(_defineProperty({}, styles$r.gradient, props.motifAreaState.isContentPadded), styles$r["long"], props.coverInvisibleNextSection)),
    style: {
      paddingTop: props.motifAreaState.paddingTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$r.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$r.shadow, props.inverted ? styles$r.shadowLight : styles$r.shadowDark, props.transitionStyles.boxShadow, props.transitionStyles["boxShadow-".concat(props.state)]),
    style: {
      top: props.motifAreaState.paddingTop,
      opacity: props.staticShadowOpacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$r.content
  }, props.children)));
}

var styles$s = {"content":"CardBox-module_content__36v7J","wrapper":"CardBox-module_wrapper__3vnaH"};

function CardBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$s.wrapper,
    style: {
      paddingTop: props.motifAreaState.paddingTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$s.content
  }, props.children));
}

var styles$t = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","card":"CardBoxWrapper-module_card__hvRUa scope-cardsAppearance","selfClear-left":"CardBoxWrapper-module_selfClear-left__2Dd26","selfClear-right":"CardBoxWrapper-module_selfClear-right__9kgvN","selfClear-both":"CardBoxWrapper-module_selfClear-both__2hwB7","cardStart":"CardBoxWrapper-module_cardStart__2NywG","cardEnd":"CardBoxWrapper-module_cardEnd__x4Ye6","cardBgWhite":"CardBoxWrapper-module_cardBgWhite__xXhg7 scope-darkContent","cardBgBlack":"CardBoxWrapper-module_cardBgBlack__Ahp3s scope-lightContent"};

function CardBoxWrapper(props) {
  if (outsideBox(props)) {
    return props.children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className$1(props),
    style: {
      '--card-surface-color': props.cardSurfaceColor
    }
  }, /*#__PURE__*/React.createElement(BackgroundColorProvider, {
    invert: true
  }, props.children));
}
function outsideBox(props) {
  return props.position === 'sticky' || props.position === 'inline' && props.width > widths.md || props.customMargin;
}
function className$1(props) {
  return classNames(styles$t.card, props.inverted ? styles$t.cardBgBlack : styles$t.cardBgWhite, styles$t["selfClear-".concat(props.selfClear)], _defineProperty({}, styles$t.blur, props.cardSurfaceTransparency > 0), _defineProperty({}, styles$t.cardStart, !props.openStart), _defineProperty({}, styles$t.cardEnd, !props.openEnd));
}

var components$1 = {
  shadow: {
    Shadow: GradientShadow,
    Box: GradientBox,
    BoxWrapper: InvisibleBoxWrapper
  },
  transparent: {
    Shadow: NoOpShadow,
    Box: CardBox,
    BoxWrapper: InvisibleBoxWrapper
  },
  cards: {
    Shadow: NoOpShadow,
    Box: CardBox,
    BoxWrapper: CardBoxWrapper
  }
};
function getAppearanceComponents(appearance) {
  return components$1[appearance || 'shadow'];
}

var Section = withInlineEditingDecorator('SectionDecorator', function Section(_ref) {
  var _section$transition;
  var section = _ref.section,
    transitions = _ref.transitions,
    backdrop = _ref.backdrop,
    contentElements = _ref.contentElements,
    state = _ref.state,
    onActivate = _ref.onActivate,
    domIdPrefix = _ref.domIdPrefix;
  var _ref2 = useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1,
    useBackdropSectionClassNames = _ref2.useBackdropSectionClassNames,
    useBackdropSectionCustomProperties = _ref2.useBackdropSectionCustomProperties;
  var ref = useScrollTarget(section.id);
  var transitionStyles = getTransitionStyles(section, section.previousSection, section.nextSection);
  var backdropSectionClassNames = useBackdropSectionClassNames(backdrop, {
    layout: section.layout,
    exposeMotifArea: section.exposeMotifArea,
    empty: !contentElements.length
  });
  var atmoAudioFile = useFileWithInlineRights({
    configuration: section,
    collectionName: 'audioFiles',
    propertyName: 'atmoAudioFileId'
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "".concat(domIdPrefix, "-").concat(section.permaId),
    ref: ref,
    className: classNames(styles$n.Section, transitionStyles.section, backdropSectionClassNames, _defineProperty({}, styles$n.first, section.sectionIndex === 0), _defineProperty({}, styles$n.narrow, section.width === 'narrow'), section.invert ? styles$n.darkContent : styles$n.lightContent),
    style: _objectSpread2(_objectSpread2({}, useBackdropSectionCustomProperties(backdrop)), useSectionPaddingCustomProperties(section))
  }, /*#__PURE__*/React.createElement(SectionLifecycleProvider, {
    onActivate: onActivate,
    entersWithFadeTransition: (_section$transition = section.transition) === null || _section$transition === void 0 ? void 0 : _section$transition.startsWith('fade')
  }, /*#__PURE__*/React.createElement(SectionIntersectionProbe, {
    section: section
  }), /*#__PURE__*/React.createElement(SectionViewTimelineProvider, {
    backdrop: backdrop
  }, /*#__PURE__*/React.createElement(BackgroundColorProvider, {
    dark: !section.invert
  }, /*#__PURE__*/React.createElement(SectionAtmo, {
    audioFile: atmoAudioFile
  }), /*#__PURE__*/React.createElement(SectionContents, {
    section: section,
    transitions: transitions,
    backdrop: backdrop,
    contentElements: contentElements,
    state: state,
    transitionStyles: transitionStyles
  }), /*#__PURE__*/React.createElement(SectionInlineFileRights, {
    section: section,
    backdrop: backdrop,
    atmoAudioFile: atmoAudioFile,
    state: state
  }), section.sectionIndex === 0 && /*#__PURE__*/React.createElement(SelectableWidget, {
    role: "scrollIndicator",
    props: {
      sectionLayout: section.layout
    }
  })))));
});
Section.defaultProps = {
  domIdPrefix: 'section'
};
function SectionContents(_ref3) {
  var section = _ref3.section,
    backdrop = _ref3.backdrop,
    contentElements = _ref3.contentElements,
    state = _ref3.state,
    transitions = _ref3.transitions,
    transitionStyles = _ref3.transitionStyles;
  var _ref4 = useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1,
    Backdrop = _ref4.Backdrop,
    useMotifAreaState = _ref4.useMotifAreaState;
  var _useSectionLifecycle = useSectionLifecycle(),
    shouldPrepare = _useSectionLifecycle.shouldPrepare;
  var sectionProperties = useMemo(function () {
    return {
      layout: section.layout,
      invert: section.invert,
      sectionIndex: section.sectionIndex
    };
  }, [section.layout, section.invert, section.sectionIndex]);
  var _transitions = _slicedToArray(transitions, 2),
    exitTransition = _transitions[1];
  var _useMotifAreaState = useMotifAreaState({
      backdropContentElement: 'contentElement' in backdrop,
      updateOnScrollAndResize: shouldPrepare,
      exposeMotifArea: section.exposeMotifArea,
      transitions: transitions,
      empty: !contentElements.length,
      fullHeight: section.fullHeight
    }),
    _useMotifAreaState2 = _slicedToArray(_useMotifAreaState, 3),
    motifAreaState = _useMotifAreaState2[0],
    setMotifAreaRef = _useMotifAreaState2[1],
    setContentAreaRef = _useMotifAreaState2[2];
  var _getAppearanceCompone = getAppearanceComponents(section.appearance),
    Shadow = _getAppearanceCompone.Shadow,
    Box = _getAppearanceCompone.Box,
    BoxWrapper = _getAppearanceCompone.BoxWrapper;
  var staticShadowOpacity = percentToFraction(section.staticShadowOpacity, {
    defaultValue: 0.7
  });
  var dynamicShadowOpacity = percentToFraction(section.dynamicShadowOpacity, {
    defaultValue: 0.7
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Backdrop, {
    backdrop: backdrop,
    eagerLoad: section.sectionIndex === 0,
    size: section.backdropSize,
    motifAreaState: motifAreaState,
    onMotifAreaUpdate: setMotifAreaRef,
    state: state,
    transitionStyles: transitionStyles
  }, function (children) {
    return /*#__PURE__*/React.createElement(Shadow, {
      align: section.layout,
      inverted: section.invert,
      motifAreaState: motifAreaState,
      staticShadowOpacity: staticShadowOpacity,
      dynamicShadowOpacity: dynamicShadowOpacity
    }, children);
  }), /*#__PURE__*/React.createElement(BackdropFrameEffect, {
    backdrop: backdrop
  }), /*#__PURE__*/React.createElement(Foreground, {
    transitionStyles: transitionStyles,
    state: state,
    minHeight: motifAreaState.minHeight,
    paddingBottom: !endsWithFullWidthElement(contentElements),
    heightMode: heightMode(section)
  }, /*#__PURE__*/React.createElement(Box, {
    inverted: section.invert,
    coverInvisibleNextSection: exitTransition.startsWith('fade'),
    transitionStyles: transitionStyles,
    state: state,
    motifAreaState: motifAreaState,
    staticShadowOpacity: staticShadowOpacity
  }, /*#__PURE__*/React.createElement(Layout, {
    sectionId: section.id,
    items: contentElements,
    appearance: section.appearance,
    contentAreaRef: setContentAreaRef,
    sectionProps: sectionProperties
  }, function (children, boxProps) {
    return /*#__PURE__*/React.createElement(BoxWrapper, Object.assign({}, boxProps, {
      cardSurfaceColor: section.cardSurfaceColor,
      inverted: section.invert
    }), children);
  }))));
}
function ConnectedSection(props) {
  var contentElements = useSectionForegroundContentElements({
    sectionId: props.section.id,
    layout: props.section.layout,
    phoneLayout: usePhoneLayout()
  });
  var _ref5 = useAdditionalSeedData('frontendVersion') === 2 ? v2 : v1,
    useBackdrop = _ref5.useBackdrop;
  var backdrop = useBackdrop(props.section);
  var transitions = getEnterAndExitTransitions(props.section, props.section.previousSection, props.section.nextSection);
  return /*#__PURE__*/React.createElement(Section, Object.assign({}, props, {
    transitions: transitions,
    backdrop: backdrop,
    contentElements: contentElements
  }));
}
function heightMode(section) {
  if (section.fullHeight) {
    if (section.transition.startsWith('fade') && section.previousSection || section.nextSection && section.nextSection.transition.startsWith('fade')) {
      return 'fullFade';
    } else {
      return 'full';
    }
  }
  return 'dynamic';
}
function endsWithFullWidthElement(elements) {
  var lastElement = elements[elements.length - 1];
  return lastElement && lastElement.position === 'inline' && lastElement.width === widths.full;
}
function percentToFraction(value, _ref6) {
  var defaultValue = _ref6.defaultValue;
  return typeof value !== 'undefined' ? value / 100 : defaultValue;
}

var CurrentChapterContext = React.createContext();
var CurrentSectionIndexStateContext = React.createContext();
function CurrentSectionProvider(_ref) {
  var children = _ref.children;
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    currentSectionIndex = _useState2[0],
    setCurrentSectionIndex = _useState2[1];
  var currentSectionIndexState = useMemo(function () {
    return [currentSectionIndex, setCurrentSectionIndex];
  }, [currentSectionIndex, setCurrentSectionIndex]);
  var sections = useSectionsWithChapter();
  var currentSection = sections[currentSectionIndex];
  return /*#__PURE__*/React.createElement(CurrentChapterContext.Provider, {
    value: currentSection === null || currentSection === void 0 ? void 0 : currentSection.chapter
  }, /*#__PURE__*/React.createElement(CurrentSectionIndexStateContext.Provider, {
    value: currentSectionIndexState
  }, children));
}

/**
 * Returns chapter containing the current scroll position.
 *
 * @example
 *
 * const chapter = useCurrentChapter();
 * chapter // =>
 *  {
 *    id: 3,
 *    permaId: 5,
 *    title: 'Chapter 1',
 *    summary: 'An introductory chapter',
 *    chapterSlug: 'chapter-1'
 *  }
 */
function useCurrentChapter() {
  return useContext(CurrentChapterContext);
}
function useCurrentSectionIndexState() {
  return useContext(CurrentSectionIndexStateContext);
}

function usePostMessageListener(receiveData) {
  useEffect(function () {
    if (window.parent !== window) {
      window.addEventListener('message', receive);
    }
    return function () {
      return window.removeEventListener('message', receive);
    };
    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0) {
        receiveData(message.data);
      }
    }
  }, [receiveData]);
}

var contentStyles = {"Content":"Content-module_Content__m7urk"};

var styles$u = {"focusOutlineDisabled":"focusOutline-module_focusOutlineDisabled__KV7d-"};

var FocusVisibleContext = createContext();
function useFocusOutlineVisible() {
  return useContext(FocusVisibleContext);
}
function FocusOutlineProvider(_ref) {
  var children = _ref.children;
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  useEffect(function () {
    document.body.addEventListener('keydown', enable);
    document.body.addEventListener('mousedown', disable);
    disable();
    return function () {
      document.body.removeEventListener('keydown', enable);
      document.body.removeEventListener('mousedown', disable);
    };
    function enable() {
      document.body.classList.remove(styles$u.focusOutlineDisabled);
      setValue(true);
    }
    function disable() {
      document.body.classList.add(styles$u.focusOutlineDisabled);
      setValue(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement(FocusVisibleContext.Provider, {
    value: value
  }, children);
}

var PhonePlatformProvider = withInlineEditingAlternative('PhonePlatformProvider', function PhonePlatformProvider(_ref) {
  var children = _ref.children;
  var isPhonePlatform = useBrowserFeature('phone platform');
  return /*#__PURE__*/React.createElement(PhonePlatformContext.Provider, {
    value: isPhonePlatform
  }, children);
});

var AudioFocusContext = createContext();
function AudioFocusProvider(_ref) {
  var children = _ref.children;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    currentKey = _useState2[0],
    setCurrentKey = _useState2[1];
  var value = useMemo(function () {
    return [currentKey, setCurrentKey];
  }, [currentKey, setCurrentKey]);
  return /*#__PURE__*/React.createElement(AudioFocusContext.Provider, {
    value: value
  }, children);
}

/**
 * Prevent parallel playback of multiple media elements.
 *
 * @param {Object} options
 * @param {number} options.key - Unique id used to identify the element.
 * @param {boolean} options.request - Set to true to request audio focus.
 * @param {Function} options.onLost -
 *   Callback that will be invoked if another element requests audio
 *   focus, thereby preempting your hold of audio focus. The callback
 *   should pause the element.
 */
function useAudioFocus(_ref2) {
  var key = _ref2.key,
    request = _ref2.request,
    onLost = _ref2.onLost;
  var wasRequested = usePrevious(request);
  var _useContext = useContext(AudioFocusContext),
    _useContext2 = _slicedToArray(_useContext, 2),
    currentKey = _useContext2[0],
    setCurrentKey = _useContext2[1];
  var previousKey = usePrevious(currentKey);
  useEffect(function () {
    if (request && !wasRequested) {
      setCurrentKey(key);
    }
  }, [request, wasRequested, setCurrentKey, key]);
  useEffect(function () {
    if (previousKey === key && currentKey !== key) {
      onLost();
    }
  }, [currentKey, previousKey, key, onLost]);
}

function _regeneratorRuntime() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
var ConsentContext = createContext();
function ConsentProvider(_ref) {
  var consent = _ref.consent,
    children = _ref.children;
  return /*#__PURE__*/React.createElement(ConsentContext.Provider, {
    value: consent
  }, children);
}
function useConsentRequested() {
  var consent = useContext(ConsentContext);
  var _useState = useState({}),
    _useState2 = _slicedToArray(_useState, 2),
    request = _useState2[0],
    setRequest = _useState2[1];
  useIsomorphicLayoutEffect(function () {
    var unmounted = false;
    _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _yield$consent$reques, vendors, _acceptAll, _denyAll, _save;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return consent.requested();
          case 2:
            _yield$consent$reques = _context.sent;
            vendors = _yield$consent$reques.vendors;
            _acceptAll = _yield$consent$reques.acceptAll;
            _denyAll = _yield$consent$reques.denyAll;
            _save = _yield$consent$reques.save;
            if (!unmounted) {
              setRequest({
                vendors: vendors,
                acceptAll: function acceptAll() {
                  _acceptAll();
                  setRequest({});
                },
                denyAll: function denyAll() {
                  _denyAll();
                  setRequest({});
                },
                save: function save(decisions) {
                  _save(decisions);
                  setRequest({});
                }
              });
            }
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
    return function () {
      return unmounted = true;
    };
  }, [consent]);
  return request;
}
function useConsentGiven(vendorName) {
  var consent = useContext(ConsentContext);
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable;
  var isStaticPreview = useIsStaticPreview();
  var _useState3 = useState(isEditable || isStaticPreview),
    _useState4 = _slicedToArray(_useState3, 2),
    consentGiven = _useState4[0],
    setConsentGiven = _useState4[1];
  useIsomorphicLayoutEffect(function () {
    var unmounted = false;
    _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var result;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!vendorName || isEditable || isStaticPreview)) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            _context2.next = 4;
            return consent.requireAccepted(vendorName);
          case 4:
            result = _context2.sent;
            if (!unmounted && result === 'fulfilled') {
              setConsentGiven(true);
            }
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
    return function () {
      return unmounted = true;
    };
  }, [consent, vendorName]);
  var giveConsent = useCallback(function () {
    return consent.accept(vendorName);
  }, [consent, vendorName]);
  return [consentGiven, giveConsent];
}

var styles$v = {"optIn":"OptIn-module_optIn__3nHo1","optInIcon":"OptIn-module_optInIcon__3-81I","optInMessage":"OptIn-module_optInMessage__1OfTR","optInButton":"OptIn-module_optInButton__1LhtX"};

var _excluded$3 = ["styles"];
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var OptInIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded$3);
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 131 95"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M32.01.01C46.678-.01 61.345.009 76.014.002 83.007.007 90-.009 96.99.011c.015 9.157.014 18.316 0 27.474-1.357.073-2.706.259-4.048.478-.01-7.986 0-15.975-.004-23.961-18.958-.003-37.917-.003-56.875 0l-.001 28.916c.01 2.37-.022 4.742.016 7.113 6.173-.025 12.348-.006 18.52-.011 5.804.01 11.609-.022 17.41.013-1 1.28-2.001 2.56-2.844 3.948-12.372.024-24.748-.011-37.12.019-.06-.365-.03-.735-.034-1.1V17.497c.007-5.83-.024-11.659.001-17.486zm17.617 8.004a5.999 5.999 0 014.359 1.49c1.273 1.116 2.048 2.8 2.013 4.498.042 1.806-.845 3.59-2.263 4.702-1.271 1.013-2.975 1.483-4.583 1.228a5.88 5.88 0 01-3.479-1.785c-1.44-1.459-2.013-3.695-1.475-5.67.6-2.448 2.905-4.346 5.428-4.463zm22.106 7.758c.181-.258.332-.54.547-.772 2.325 3.868 4.683 7.717 7.02 11.578.891 1.503 1.85 2.973 2.7 4.5a35.062 35.062 0 00-5.646 3.779c-.154.162-.387.14-.592.143-10.585-.014-21.174.014-31.762-.015.088-.228.308-.367.47-.542 3.79-3.745 7.58-7.484 11.365-11.232.098-.085.217-.265.366-.15 2.65 1.308 5.3 2.62 7.951 3.928 2.545-3.73 5.052-7.48 7.581-11.217zM0 21.042c.256-.058.517-.039.775-.039 9.175.007 18.349-.007 27.523.007l.064.076c.017 1.308-.012 2.618.015 3.927-5.416.038-10.834.001-16.252.018-.01 7.981-.013 15.962.002 23.944 11.917.013 23.834.013 35.752 0 .022-.674-.002-1.35.012-2.023 4.034.01 8.07.01 12.105 0 .002 11.349.01 22.698-.003 34.048-12.082-.025-24.163-.003-36.244-.01-7.911.007-15.823-.015-23.734.01-.02-19.988.01-39.975-.015-59.959zm3.435 4.043c-.904.236-1.577 1.152-1.482 2.086.079.997.994 1.837 1.999 1.82 1.367.002 2.736.015 4.105-.007 1.04-.036 1.928-.995 1.878-2.03-.003-.996-.867-1.896-1.868-1.925-1.294-.01-2.585.002-3.878-.005-.252.004-.51-.013-.754.061zm-.219 8.067c-.815.317-1.373 1.203-1.256 2.076.1.938.94 1.724 1.89 1.756 1.25.016 2.5-.002 3.752.008.439.008.9-.025 1.288-.246.73-.39 1.173-1.257 1.019-2.075-.136-.889-.95-1.62-1.852-1.645-1.328-.007-2.653.002-3.98-.004-.29-.005-.589.016-.86.13zm.219 7.923c-.762.2-1.372.884-1.471 1.665-.128.844.384 1.718 1.158 2.064.403.192.859.19 1.295.181 1.217-.008 2.434.011 3.651-.008 1.032-.047 1.92-.998 1.868-2.034-.007-.994-.87-1.891-1.87-1.922-1.293-.011-2.584.002-3.877-.006-.252-.001-.51-.008-.754.06zm-.01 8.003c-1.018.249-1.706 1.392-1.413 2.403.21.868 1.057 1.512 1.95 1.497 1.364-.003 2.728.01 4.09-.006 1.02-.034 1.906-.958 1.883-1.975.026-1.017-.858-1.958-1.88-1.981-1.252-.011-2.503.002-3.754-.003-.292-.004-.591-.018-.877.065zm48.107 0c-1.117.272-1.79 1.607-1.323 2.66a2.027 2.027 0 001.86 1.238c1.326.003 2.652.003 3.977 0 1.056.025 2.032-.916 1.996-1.978.045-1.022-.86-1.96-1.88-1.984-1.252-.008-2.503.003-3.754-.002-.293 0-.591-.017-.876.066zM12.13 53.016c-.015 7.981-.012 15.961-.001 23.943 11.917.003 23.836.003 35.753 0 .011-7.982.014-15.962-.001-23.943a14203.52 14203.52 0 00-35.75 0zm-8.694 4.05c-.797.208-1.422.943-1.482 1.764-.112 1.07.805 2.103 1.883 2.137 1.371.014 2.743.003 4.113.006 1.035.01 1.977-.89 1.986-1.928.054-1.033-.83-2.003-1.87-2.037-1.254-.01-2.508.003-3.763-.005-.289 0-.584-.014-.867.064zm48.108.003c-.951.235-1.623 1.244-1.456 2.208.123.947 1.016 1.71 1.972 1.696h3.997c1.031.013 1.994-.886 1.984-1.928.071-1.036-.829-2.011-1.866-2.037-1.254-.01-2.51.003-3.764-.005-.29 0-.586-.014-.867.066zM3.425 65.066c-.955.242-1.634 1.262-1.45 2.234.14.9.957 1.638 1.874 1.662 1.364.011 2.727 0 4.09.006 1.06.022 2.023-.925 1.997-1.984.027-1.02-.86-1.952-1.882-1.98-1.211-.012-2.426.002-3.637-.004-.332-.001-.669-.021-.992.066zm48.107.003c-.927.231-1.584 1.195-1.456 2.14.093.935.935 1.723 1.879 1.752 1.365.011 2.73 0 4.093.006 1.055.016 2.043-.917 1.994-1.984.045-1.023-.86-1.958-1.88-1.981-1.252-.011-2.502.002-3.753-.003-.294-.003-.592-.012-.877.07zM3.435 73.057c-.797.204-1.422.94-1.482 1.76-.111 1.07.802 2.112 1.883 2.138 1.371.013 2.743.002 4.113.005 1.035.017 1.977-.891 1.986-1.928.054-1.033-.835-1.997-1.87-2.037-1.254-.01-2.508.003-3.763-.005-.289.001-.584-.01-.867.067zm48.108 0c-.887.22-1.543 1.118-1.476 2.029.035.974.892 1.837 1.874 1.869 1.37.013 2.742.002 4.114.005 1.033.017 1.993-.883 1.985-1.925.071-1.039-.833-2.006-1.868-2.04-1.254-.01-2.509.003-3.763-.005-.289.001-.585-.01-.866.067zM96.83 31.045c6.813-.36 13.73 1.456 19.431 5.154a32.396 32.396 0 019.482 9.342 31.527 31.527 0 015.043 13.773c.625 5.36-.123 10.88-2.225 15.867-1.766 4.254-4.499 8.108-7.91 11.243a32.605 32.605 0 01-11.584 6.844 33.066 33.066 0 01-15.656 1.337 32.59 32.59 0 01-13.329-5.235c-5.2-3.514-9.323-8.551-11.692-14.307a31.532 31.532 0 01-2.327-14.038 31.433 31.433 0 013.839-13.243 32.232 32.232 0 018.329-9.799c5.259-4.156 11.865-6.62 18.6-6.938zm15.6 12.011c-8.543.979-17.086 1.933-25.627 2.92-.013 8.152.006 16.308-.008 24.462-2.325-.848-5.015-.792-7.24.318-1.33.665-2.493 1.763-2.997 3.169-.503 1.356-.289 2.934.528 4.128.752 1.154 1.947 1.978 3.235 2.465 1.48.569 3.115.675 4.68.452 1.888-.295 3.742-1.222 4.862-2.784.67-.936.965-2.102.894-3.237-.014-7.054.008-14.105-.01-21.158 1.976-.282 3.965-.458 5.946-.7 4.944-.56 9.885-1.124 14.827-1.682V67.42c-1.677-.563-3.506-.755-5.247-.362-1.764.38-3.483 1.32-4.479 2.84a4.618 4.618 0 00-.637 3.729c.32 1.196 1.12 2.243 2.139 2.959 1.533 1.101 3.474 1.576 5.355 1.489 2.036-.083 4.111-.843 5.498-2.353a5.078 5.078 0 001.329-3.83c-.007-6.755-.002-13.51-.005-20.265.058-2.962-.002-5.924-.002-8.884-1.018.053-2.03.212-3.04.313z"
  }));
});

/**
 * Render opt in prompt instead of children if third party consent
 * cookie has been configured in theme options and user has not given
 * consent for passed provider.
 *
 * @param {Object} props
 * @param {string} props.providerName -
 *   Only render children if user has given consent for this provider.
 * @param {React.ReactElement} props.children -
 *   Children to conditionally render.
 * @param {function} [props.wrapper] -
 *   Function that receives children to allow wrapping opt-in prompt
 *   in custom elements.
 * @param {boolean} [props.icon=true] -
 *   Allow hiding the icon in the opt-in prompt.
 *
 * @name ThirdPartyOptIn
 */
function OptIn(_ref) {
  var children = _ref.children,
    providerName = _ref.providerName,
    wrapper = _ref.wrapper,
    icon = _ref.icon;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var _useContentElementAtt = useContentElementAttributes(),
    contentElementId = _useContentElementAtt.contentElementId;
  var contentElementConsentVendor = useContentElementConsentVendor({
    contentElementId: contentElementId
  });
  providerName = providerName || (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.name);
  var cookieMessage = (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.optInPrompt) || t("pageflow_scrolled.public.third_party_consent.opt_in_prompt.".concat(providerName));
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    consentedHere = _useState2[0],
    setConsentedHere = _useState2[1];
  var _useConsentGiven = useConsentGiven(providerName),
    _useConsentGiven2 = _slicedToArray(_useConsentGiven, 2),
    consentGiven = _useConsentGiven2[0],
    giveConsent = _useConsentGiven2[1];
  if (consentGiven || !providerName) {
    return typeof children === 'function' ? children({
      consentedHere: consentedHere
    }) : children;
  }
  function accept() {
    giveConsent(providerName);
    setConsentedHere(true);
  }
  return wrapper( /*#__PURE__*/React.createElement("div", {
    className: styles$v.optIn
  }, icon && /*#__PURE__*/React.createElement("div", {
    className: styles$v.optInIcon
  }, /*#__PURE__*/React.createElement(OptInIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: styles$v.optInMessage
  }, cookieMessage), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: styles$v.optInButton,
    onClick: accept
  }, t('pageflow_scrolled.public.third_party_consent.confirm')))));
}
OptIn.defaultProps = {
  icon: true,
  wrapper: function wrapper(children) {
    return children;
  }
};

var styles$w = {"optOut":"OptOutInfo-module_optOut__2Q3d5","tooltip":"OptOutInfo-module_tooltip__2bpU0","icon":"OptOutInfo-module_icon__1kL6Q utils-module_unstyledButton__3rgne","full":"OptOutInfo-module_full__s_Ono"};

/**
 * Display info tooltip with a link to opt out of third party
 * embeds. Opt out url needs to be configured in theme options.
 *
 * @param {Object} props
 * @param {string} props.providerName -
 *   Only display if user has given consent for this provider.
 * @param {boolean} [hide] -
 *   Temporarily hide the tooltip, e.g. while the embed is playing
 *
 * @name ThirdPartyOptOutInfo
 */
function OptOutInfo(_ref) {
  var _theme$options$thirdP;
  var providerName = _ref.providerName,
    hide = _ref.hide,
    inset = _ref.inset;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  var theme = useTheme();
  var optOutUrl = (_theme$options$thirdP = theme.options.thirdPartyConsent) === null || _theme$options$thirdP === void 0 ? void 0 : _theme$options$thirdP.optOutUrl;
  var _useContentElementAtt = useContentElementAttributes(),
    width = _useContentElementAtt.width,
    contentElementId = _useContentElementAtt.contentElementId;
  var contentElementConsentVendor = useContentElementConsentVendor({
    contentElementId: contentElementId
  });
  providerName = providerName || (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.name);
  var _useConsentGiven = useConsentGiven(providerName),
    _useConsentGiven2 = _slicedToArray(_useConsentGiven, 1),
    consentGiven = _useConsentGiven2[0];
  if (!optOutUrl || !consentGiven) {
    return null;
  }
  var linkText = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt_link');
  var linkHtml = "<a href=\"".concat(optOutUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\">").concat(linkText, "</a>");
  var html = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt', {
    link: linkHtml
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$w.optOut, _defineProperty({}, styles$w.full, width === widths.full || inset)),
    style: hide ? {
      opacity: 0,
      visibility: 'hidden'
    } : undefined
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$w.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "information"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$w.tooltip
  }, /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  })));
}

function registerVendors(_ref) {
  var contentElementTypes = _ref.contentElementTypes,
    seed = _ref.seed,
    consent = _ref.consent,
    cookieName = _ref.cookieName;
  var options = seed.config.theme.options.thirdPartyConsent;
  var locale = seed.collections.entries[0].locale;
  cookieName = cookieName || (options === null || options === void 0 ? void 0 : options.cookieName);
  [].concat(_toConsumableArray(seed.config.consentVendors), _toConsumableArray(contentElementTypes.consentVendors({
    contentElements: seed.collections.contentElements,
    t: function t(key, options) {
      return I18n.t(key, _objectSpread2(_objectSpread2({}, options), {}, {
        locale: locale
      }));
    }
  }))).forEach(function (vendor) {
    var _options$cookieProvid;
    consent.registerVendor(vendor.name, {
      displayName: vendor.displayName,
      description: vendor.description,
      paradigm: cookieName ? vendor.paradigm || 'opt-in' : 'skip',
      cookieName: cookieName,
      cookieKey: options === null || options === void 0 ? void 0 : (_options$cookieProvid = options.cookieProviderNameMapping) === null || _options$cookieProvid === void 0 ? void 0 : _options$cookieProvid[vendor.name],
      cookieDomain: options === null || options === void 0 ? void 0 : options.cookieDomain
    });
  });
  consent.closeVendorRegistration();
}

function RootProviders(_ref) {
  var seed = _ref.seed,
    _ref$consent = _ref.consent,
    consent$1 = _ref$consent === void 0 ? consent : _ref$consent,
    children = _ref.children;
  return /*#__PURE__*/React.createElement(FocusOutlineProvider, null, /*#__PURE__*/React.createElement(BrowserFeaturesProvider, null, /*#__PURE__*/React.createElement(PhonePlatformProvider, null, /*#__PURE__*/React.createElement(PhoneLayoutProvider, null, /*#__PURE__*/React.createElement(MediaMutedProvider, null, /*#__PURE__*/React.createElement(AudioFocusProvider, null, /*#__PURE__*/React.createElement(EntryStateProvider, {
    seed: seed
  }, /*#__PURE__*/React.createElement(CurrentSectionProvider, null, /*#__PURE__*/React.createElement(LocaleProvider, null, /*#__PURE__*/React.createElement(ConsentProvider, {
    consent: consent$1
  }, /*#__PURE__*/React.createElement(ScrollTargetEmitterProvider, null, children)))))))))));
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
  return "var(--theme-palette-color-".concat(value, ")");
}

var textStyles = {"text-2xs":"16px","text-xs":"18px","text-s":"20px","text-base":"22px","text-md":"33px","text-l":"40px","text-2l":"50px","text-xl":"66px","text-2xl":"88px","text-3xl":"110px","text-4xl":"200px","text-5xl":"350px","heading-lg":"Text-module_heading-lg__FKxzu typography-headingLg typography-heading","heading-md":"Text-module_heading-md__1q5Ss typography-headingMd typography-heading","heading-sm":"Text-module_heading-sm__2awaz typography-headingSm typography-heading","heading-xs":"Text-module_heading-xs__21nHy typography-headingXs typography-heading","headingTagline-lg":"Text-module_headingTagline-lg__1O2TQ typography-headingTaglineLg typography-headingTagline","headingTagline-md":"Text-module_headingTagline-md__2hrVS typography-headingTaglineMd typography-headingTagline","headingTagline-sm":"Text-module_headingTagline-sm__1Fw2J typography-headingTaglineSm typography-headingTagline","headingSubtitle-lg":"Text-module_headingSubtitle-lg__15kj0 typography-headingSubtitleLg typography-headingSubtitle","headingSubtitle-md":"Text-module_headingSubtitle-md__2_qtz typography-headingSubtitleMd typography-headingSubtitle","headingSubtitle-sm":"Text-module_headingSubtitle-sm__MOc_6 typography-headingSubtitleSm typography-headingSubtitle","body":"Text-module_body__4oWD- typography-body","caption":"Text-module_caption__3_6Au typography-caption","question":"Text-module_question__ByVAq typography-question","questionAnswer":"Text-module_questionAnswer__2Hdmc typography-questionAnswer","quoteText-lg":"Text-module_quoteText-lg__3ZnZi typography-quoteText typography-quoteTextLg","quoteText-md":"Text-module_quoteText-md__2eooO typography-quoteText typography-quoteTextMd","quoteText-sm":"Text-module_quoteText-sm__5nKex typography-quoteText typography-quoteTextSm","quoteText-xs":"Text-module_quoteText-xs__2p5on typography-quoteText typography-quoteTextXs","quoteAttribution":"Text-module_quoteAttribution__VBqLw typography-quoteAttribution","quoteAttribution-lg":"Text-module_quoteAttribution-lg__23pl- Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionLg","quoteAttribution-md":"Text-module_quoteAttribution-md__2BnBN Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionMd","quoteAttribution-sm":"Text-module_quoteAttribution-sm__17vbI Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionSm","quoteAttribution-xs":"Text-module_quoteAttribution-xs__3v3BW Text-module_quoteAttribution__VBqLw typography-quoteAttribution typography-quoteAttributionXs","counterNumber-lg":"Text-module_counterNumber-lg__2myJg typography-counterNumber","counterNumber-md":"Text-module_counterNumber-md__1NC3q typography-counterNumber","counterNumber-sm":"Text-module_counterNumber-sm__2SwHQ typography-counterNumber","counterNumber-xs":"Text-module_counterNumber-xs__1D-YR typography-counterNumber","counterDescription":"Text-module_counterDescription__34NjQ typography-counterDescription","hotspotsTooltipTitle":"Text-module_hotspotsTooltipTitle__2KROf typography-hotspotTooltipTitle","hotspotsTooltipDescription":"Text-module_hotspotsTooltipDescription__2l9v5 typography-hotspotTooltipDescription","hotspotsTooltipLink":"Text-module_hotspotsTooltipLink__2F2aj typography-hotspotTooltipLink","teaserTitle-lg":"Text-module_teaserTitle-lg__K3MFG typography-externalLinkTitle typography-externalLinkTitleLg","teaserTitle-md":"Text-module_teaserTitle-md__tBZIn typography-externalLinkTitle typography-externalLinkTitleMd","teaserTitle-sm":"Text-module_teaserTitle-sm__ZXQCr typography-externalLinkTitle typography-externalLinkTitleSm","teaserTagline-lg":"Text-module_teaserTagline-lg__8JW7Z typography-externalLinkTagline typography-externalLinkTaglineLg","teaserTagline-md":"Text-module_teaserTagline-md__45HLL typography-externalLinkTagline typography-externalLinkTaglineMd","teaserTagline-sm":"Text-module_teaserTagline-sm__1vzOr typography-externalLinkTagline typography-externalLinkTaglineSm","teaserDescription-lg":"Text-module_teaserDescription-lg__1ysIZ typography-externalLinkDescription","teaserDescription-md":"Text-module_teaserDescription-md__1JtRs typography-externalLinkDescription","teaserDescription-sm":"Text-module_teaserDescription-sm__2VRao typography-externalLinkDescription","infoTableLabel":"Text-module_infoTableLabel__w9kbv typography-infoTableLabel","infoTableValue":"Text-module_infoTableValue__2elOY typography-infoTableValue"};

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
 *   `'counterNumber-lg'`, `'counterNumber-md'`, `'counterNumber-sm'`,
 *   `'counterNumber-xs'`, `'counterDescription`'.
 *   `'infoTableLabel'`, `'infoTableValue`'.
 *   `'hotspotsTooltipTitle'`, `'hotspotsTooltipDescription`', `'hotspotsTooltipLink`',
 *   `'teaserTitle-lg'`, `'teaserTitle-md'`, `'teaserTitle-sm'`,
 *   `'teaserTagline-lg'`, `'teaserTagline-md'`, `'teaserTagline-sm'`,
 *   `'teaserDescription-lg'`, `'teaserDescription-md'`, `'teaserDescription-sm'`.
 * @param {string} [props.typographyVariant] - Suffix for variant class name.
 * @param {string} [props.typographySize] - Suffix for size class name.
 * @param {string} [props.inline] - Render a span instread of a div.
 * @param {string} props.children - Nodes to render with specified typography.
 */
function Text(_ref) {
  var inline = _ref.inline,
    scaleCategory = _ref.scaleCategory,
    typographyVariant = _ref.typographyVariant,
    typographySize = _ref.typographySize,
    children = _ref.children;
  var variantClassName = typographyVariant && "typography-".concat(scaleCategory.split('-')[0], "-").concat(typographyVariant);
  var sizeClassName = typographySize && "typography-".concat(scaleCategory, "-").concat(typographySize);
  return React.createElement(inline ? 'span' : 'div', {
    className: classNames(textStyles[scaleCategory], variantClassName, sizeClassName)
  }, children);
}

function Link(_ref) {
  var attributes = _ref.attributes,
    children = _ref.children,
    href = _ref.href,
    openInNewTab = _ref.openInNewTab;
  if (href === null || href === void 0 ? void 0 : href.chapter) {
    return /*#__PURE__*/React.createElement(ChapterLink, {
      attributes: attributes,
      chapterPermaId: href.chapter
    }, children);
  } else if (href === null || href === void 0 ? void 0 : href.section) {
    return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
      href: "#section-".concat(href.section)
    }), children);
  }
  if (href === null || href === void 0 ? void 0 : href.file) {
    return /*#__PURE__*/React.createElement(FileLink, {
      attributes: attributes,
      fileOptions: href.file
    }, children);
  } else {
    var targetAttributes = openInNewTab ? {
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {};
    return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, targetAttributes, {
      href: href
    }), children);
  }
}
function ChapterLink(_ref2) {
  var attributes = _ref2.attributes,
    children = _ref2.children,
    chapterPermaId = _ref2.chapterPermaId;
  var chapter = useChapter({
    permaId: chapterPermaId
  });
  return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
    href: "#".concat((chapter === null || chapter === void 0 ? void 0 : chapter.chapterSlug) || '')
  }), children);
}
function FileLink(_ref3) {
  var attributes = _ref3.attributes,
    children = _ref3.children,
    fileOptions = _ref3.fileOptions;
  var file = useDownloadableFile(fileOptions);
  return /*#__PURE__*/React.createElement("a", Object.assign({}, attributes, {
    target: "_blank",
    rel: "noopener noreferrer",
    href: file === null || file === void 0 ? void 0 : file.urls.download
  }), children);
}

var styles$x = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","contentLinkColor":"var(--content-link-color)","root":"EditableText-module_root__2v1tU","justify":"EditableText-module_justify__1pNdv","light":"EditableText-module_light__2c29h","dark":"EditableText-module_dark__2ym90","link":"EditableText-module_link__3vDbl typography-contentLink","bold":"EditableText-module_bold__tGw26"};

var _excluded$4 = ["key"],
  _excluded2 = ["key"];
var defaultValue = [{
  type: 'paragraph',
  children: [{
    text: ''
  }]
}];
var EditableText = withInlineEditingAlternative('EditableText', function EditableText(_ref) {
  var value = _ref.value,
    className = _ref.className,
    _ref$scaleCategory = _ref.scaleCategory,
    scaleCategory = _ref$scaleCategory === void 0 ? 'body' : _ref$scaleCategory,
    typographyVariant = _ref.typographyVariant,
    typographySize = _ref.typographySize;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$x.root, className)
  }, /*#__PURE__*/React.createElement(Text, {
    scaleCategory: scaleCategory,
    typographyVariant: typographyVariant,
    typographySize: typographySize
  }, render(value || defaultValue)));
});
function render(children) {
  return children.map(function (element, index) {
    if (element.type && element.children) {
      return renderElement({
        attributes: {
          key: index
        },
        element: element,
        children: render(element.children)
      });
    } else {
      return renderLeaf({
        attributes: {
          key: index
        },
        leaf: element,
        children: children.length === 1 && element.text.trim() === '' ? "\uFEFF" : element.text
      });
    }
  });
}
function renderElement(_ref2) {
  var attributes = _ref2.attributes,
    children = _ref2.children,
    element = _ref2.element;
  var variantClassName = element.variant && ['typography-textBlock', camelize(element.type), element.variant].join('-');
  var sizeClassName = element.size && ['typography-textBlock', camelize(element.type), element.size].join('-');
  var className = classNames(variantClassName, sizeClassName, _defineProperty({}, styles$x.justify, element.textAlign === 'justify'));
  var inlineStyles = _objectSpread2({}, element.color && {
    color: paletteColor(element.color)
  });
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
      var key = attributes.key,
        otherAttributes = _objectWithoutProperties(attributes, _excluded$4);
      return /*#__PURE__*/React.createElement(Heading, {
        key: key,
        attributes: otherAttributes,
        className: className,
        inlineStyles: inlineStyles
      }, children);
    case 'link':
      return renderLink({
        attributes: attributes,
        children: children,
        element: element
      });
    default:
      return /*#__PURE__*/React.createElement("p", Object.assign({}, attributes, {
        className: className,
        style: inlineStyles
      }), children);
  }
}
function Heading(_ref3) {
  var attributes = _ref3.attributes,
    className = _ref3.className,
    inlineStyles = _ref3.inlineStyles,
    children = _ref3.children;
  var darkBackground = useDarkBackground();
  return /*#__PURE__*/React.createElement("h2", Object.assign({}, attributes, {
    className: classNames(className, darkBackground ? styles$x.light : styles$x.dark, 'scope-headings', textStyles['heading-xs']),
    style: inlineStyles
  }), children);
}
function renderLink(_ref4) {
  var attributes = _ref4.attributes,
    children = _ref4.children,
    element = _ref4.element;
  var key = attributes.key,
    otherAttributes = _objectWithoutProperties(attributes, _excluded2);
  return /*#__PURE__*/React.createElement(Link, {
    key: key,
    attributes: _objectSpread2(_objectSpread2({}, otherAttributes), {}, {
      className: styles$x.link
    }),
    href: element.href,
    openInNewTab: element.openInNewTab,
    children: children
  });
}
function renderLeaf(_ref5) {
  var attributes = _ref5.attributes,
    children = _ref5.children,
    leaf = _ref5.leaf;
  if (leaf.bold) {
    children = /*#__PURE__*/React.createElement("strong", {
      className: styles$x.bold
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
    children = /*#__PURE__*/React.createElement("sub", null, children);
  }
  if (leaf.sup) {
    children = /*#__PURE__*/React.createElement("sup", null, children);
  }
  return /*#__PURE__*/React.createElement("span", attributes, children);
}

var ContentElementConfigurationUpdateContext = React.createContext(function () {});
function useContentElementConfigurationUpdate() {
  return useContext(ContentElementConfigurationUpdateContext);
}

var styles$y = {"crop":"SectionThumbnail-module_crop__Q1nZj","scale":"SectionThumbnail-module_scale__2tKDG"};

var _excluded$5 = ["seed"];
function StandaloneSectionThumbnail(_ref) {
  var seed = _ref.seed,
    props = _objectWithoutProperties(_ref, _excluded$5);
  return /*#__PURE__*/React.createElement(RootProviders, {
    seed: seed
  }, /*#__PURE__*/React.createElement(SectionThumbnail, props));
}
function SectionThumbnail(_ref2) {
  var sectionPermaId = _ref2.sectionPermaId,
    subscribe = _ref2.subscribe,
    scale = _ref2.scale;
  var dispatch = useEntryStateDispatch();
  useEffect(function () {
    if (subscribe) {
      return subscribe(dispatch);
    }
  }, [subscribe, dispatch]);
  var section = useSection({
    sectionPermaId: sectionPermaId
  });
  var scaleFactor = scale ? 5 : 1;
  if (section) {
    return /*#__PURE__*/React.createElement(StaticPreview, null, /*#__PURE__*/React.createElement(Measure, {
      client: true
    }, function (_ref3) {
      var measureRef = _ref3.measureRef,
        contentRect = _ref3.contentRect;
      return /*#__PURE__*/React.createElement(FullscreenDimensionProvider, clientDimensions(contentRect, scaleFactor), /*#__PURE__*/React.createElement("div", {
        ref: measureRef,
        className: styles$y.crop,
        inert: ""
      }, /*#__PURE__*/React.createElement("div", {
        className: classNames(_defineProperty({}, styles$y.scale, scale))
      }, /*#__PURE__*/React.createElement("div", {
        className: contentStyles.Content,
        style: viewportUnitCustomProperties(clientDimensions(contentRect, scaleFactor))
      }, /*#__PURE__*/React.createElement(ConnectedSection, {
        state: "active",
        domIdPrefix: "section-preview",
        section: _objectSpread2(_objectSpread2({}, section), {}, {
          transition: 'preview'
        })
      })))));
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$y.root
    }, "Not found.");
  }
}
SectionThumbnail.defaultProps = {
  scale: true,
  subscribe: function subscribe() {}
};
function clientDimensions(contentRect, scaleFactor) {
  return {
    width: contentRect.client.width && Math.ceil(contentRect.client.width * scaleFactor),
    height: contentRect.client.height && Math.ceil(contentRect.client.height * scaleFactor)
  };
}
function viewportUnitCustomProperties(_ref4) {
  var width = _ref4.width,
    height = _ref4.height;
  return {
    '--vw': width && "".concat(width / 100, "px"),
    '--vh': height && "".concat(height / 100, "px")
  };
}

var ContentElementEditorCommandEmitterContext = createContext({
  on: function on() {},
  off: function off() {}
});
function useContentElementEditorCommandSubscription(callback) {
  var _useContentElementAtt = useContentElementAttributes(),
    contentElementId = _useContentElementAtt.contentElementId;
  var emitter = useContext(ContentElementEditorCommandEmitterContext);
  useEffect(function () {
    emitter.on("command:".concat(contentElementId), callback);
    return function () {
      return emitter.off("command:".concat(contentElementId), callback);
    };
  }, [emitter, callback, contentElementId]);
}

function capitalize$1(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var utils = {
  capitalize: capitalize$1,
  camelize: camelize,
  isBlank: isBlank,
  isBlankEditableTextValue: isBlankEditableTextValue,
  presence: presence
};

var tableStyles = {"table":"EditableTable-module_table__uncog"};

var defaultValue$1 = [{
  type: 'row',
  children: [{
    type: 'label',
    children: [{
      text: ''
    }]
  }, {
    type: 'value',
    children: [{
      text: ''
    }]
  }]
}];
var EditableTable = withInlineEditingAlternative('EditableTable', function EditableTable(_ref) {
  var value = _ref.value,
    className = _ref.className,
    _ref$labelScaleCatego = _ref.labelScaleCategory,
    labelScaleCategory = _ref$labelScaleCatego === void 0 ? 'body' : _ref$labelScaleCatego,
    _ref$valueScaleCatego = _ref.valueScaleCategory,
    valueScaleCategory = _ref$valueScaleCatego === void 0 ? 'body' : _ref$valueScaleCatego,
    _ref$stackedInPhoneLa = _ref.stackedInPhoneLayout,
    stackedInPhoneLayout = _ref$stackedInPhoneLa === void 0 ? false : _ref$stackedInPhoneLa;
  var phoneLayout = usePhoneLayout();
  var stacked = stackedInPhoneLayout && phoneLayout;
  return /*#__PURE__*/React.createElement("table", {
    className: classNames(className, tableStyles.table),
    "data-stacked": stacked ? '' : undefined
  }, /*#__PURE__*/React.createElement("tbody", null, render$1(value || defaultValue$1, {
    labelScaleCategory: labelScaleCategory,
    valueScaleCategory: valueScaleCategory
  })));
});
function render$1(children, options) {
  return children.map(function (element, index) {
    if (element.type) {
      return createRenderElement(options)({
        attributes: {
          key: index
        },
        element: element,
        children: render$1(element.children, options)
      });
    } else {
      return renderLeaf({
        attributes: {
          key: index
        },
        leaf: element,
        children: children.length === 1 && element.text.trim() === '' ? "\uFEFF" : element.text
      });
    }
  });
}
function createRenderElement(_ref2) {
  var labelScaleCategory = _ref2.labelScaleCategory,
    valueScaleCategory = _ref2.valueScaleCategory;
  return function renderElement(_ref3) {
    var attributes = _ref3.attributes,
      children = _ref3.children,
      element = _ref3.element;
    switch (element.type) {
      case 'row':
        return /*#__PURE__*/React.createElement("tr", attributes, children);
      case 'link':
        return renderLink({
          attributes: attributes,
          children: children,
          element: element
        });
      case 'label':
        return /*#__PURE__*/React.createElement("td", Object.assign({}, attributes, cellAttributes(element)), /*#__PURE__*/React.createElement(Text, {
          scaleCategory: labelScaleCategory
        }, children));
      default:
        return /*#__PURE__*/React.createElement("td", Object.assign({}, attributes, cellAttributes(element)), /*#__PURE__*/React.createElement(Text, {
          scaleCategory: valueScaleCategory
        }, children));
    }
  };
}
function cellAttributes(element) {
  return utils.isBlankEditableTextValue([element]) ? {
    'data-blank': ''
  } : {};
}

var frontendStyles = {"root":"EditableInlineText-module_root__3eA-J","hyphens-manual":"EditableInlineText-module_hyphens-manual__3Lj4H","hyphens-none":"EditableInlineText-module_hyphens-none__1UvNH","textEffects":"EditableInlineText-module_textEffects__Wqvj0"};

var FloatingPortalRootContext = createContext();
function useFloatingPortalRoot() {
  return useContext(FloatingPortalRootContext);
}
var FloatingPortalRootProvider = FloatingPortalRootContext.Provider;

export { FloatingPortalRootProvider as $, AtmoProvider as A, useBackgroundFile as B, ConnectedSection as C, ContentElementAttributesProvider as D, EventContextDataProvider as E, Fullscreen as F, useContentElementEditorCommandSubscription as G, ContentElementEditorCommandEmitterContext as H, InlineFileRights as I, useContentElementLifecycle as J, ContentElementLifecycleContext as K, Link as L, useCurrentChapter as M, useIsStaticPreview as N, useOnUnmuteMedia as O, PlayerEventContextDataProvider as P, usePortraitOrientation as Q, RootProviders as R, SelectableWidget as S, Text as T, EditableTable as U, OptIn as V, Widget as W, OptOutInfo as X, useConsentRequested as Y, useFloatingPortalRoot as Z, _asyncToGenerator as _, useCurrentSectionIndexState as a, SectionIntersectionObserver as a0, getTransitionNames as a1, getAvailableTransitionNames as a2, paletteColor as a3, widthName as a4, Image as a5, MediaPlayer as a6, getInitialPlayerState as a7, playerStateReducer as a8, usePlayerState as a9, VideoPlayer as aa, AudioPlayer as ab, processSources as ac, Atmo as ad, AtmoContext as ae, useAtmo as af, OnScreenObserverRootProvider as ag, useOnScreen as ah, StandaloneSectionThumbnail as ai, SectionThumbnail as aj, MotifAreaVisibilityProvider as ak, ForcePaddingContext as al, ContentElementConfigurationUpdateContext as am, LayoutWithoutInlineEditing as an, renderElement as ao, renderLeaf as ap, createRenderElement as aq, usePhoneLayout as ar, tableStyles as as, useScrollToTarget as b, usePostMessageListener as c, contentStyles as d, withInlineEditingAlternative as e, useDarkBackground as f, getEventObject as g, EditableText as h, isBlankEditableTextValue as i, useContentElementAttributes as j, widths as k, useContentElementConfigurationUpdate as l, useTextTracks as m, useMediaMuted as n, useFocusOutlineVisible as o, useVideoQualitySetting as p, useIsomorphicLayoutEffect as q, frontendStyles as r, utils as s, styles$r as t, usePrevious as u, registerVendors as v, withInlineEditingDecorator as w, api as x, loadInlineEditingComponents as y, useAudioFocus as z };
