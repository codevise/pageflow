import { documentHiddenState, events, browser, PlayerSourceIDMap, media, MultiPlayer, settings, features, consent } from 'pageflow/frontend';
import React, { createContext, useRef, useEffect, useMemo, useContext, useCallback, useReducer, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { t as createScrollPositionLifecycleProvider, v as createScrollPositionLifecycleHook, m as useIsStaticPreview, e as extensible, d as api, x as useMediaQuery, y as TrimDefaultMarginTop, w as widths, B as BackgroundColorProvider, z as ContentElement, A as useScrollTarget, D as Layout, g as useContentElementAttributes, G as ExtensionsProvider, S as ScrollTargetEmitterProvider, H as ActiveExcursionProvider, I as StaticPreview, J as camelize, T as Text, K as renderLink, N as renderLeaf } from './FloatingPortalRootProvider-20c600de.js';
import BackboneEvents from 'backbone-events-standalone';
import { useEntryMetadata, useNestedFiles, useWidget, useContentElement, useFileWithInlineRights, useSectionForegroundContentElements, useSectionsWithChapter, useLegalInfo, useContentElementConsentVendor, useTheme, EntryStateProvider, useEntryStateDispatch, useSection } from 'pageflow-scrolled/entryState';
import I18n from 'i18n-js';
import { u as useI18n, L as LocaleProvider } from './i18n-493cd2a6.js';
import stripTags from 'striptags';
import Measure from 'react-measure';
import { u as useBrowserFeature, P as PhonePlatformContext, B as BrowserFeaturesProvider } from './PhonePlatformContext-035a99fa.js';
import { u as useContentElementEditorState } from './useContentElementEditorState-a084912e.js';
import { T as ThemeIcon } from './ThemeIcon-ab834849.js';

const SectionLifecycleContext = createContext();
const SectionLifecycleProvider = createScrollPositionLifecycleProvider(SectionLifecycleContext);
const useSectionLifecycle = createScrollPositionLifecycleHook(SectionLifecycleContext);

class Atmo {
  constructor({
    atmoSourceId,
    multiPlayer,
    backgroundMedia
  }) {
    this.multiPlayer = multiPlayer;
    this.atmoSourceId = atmoSourceId;
    this.backgroundMedia = backgroundMedia;
    this.backgroundMedia.on('change:muted', () => {
      this.update();
    });
    documentHiddenState(hiddenState => {
      if (hiddenState === 'hidden') {
        this.multiPlayer.fadeOutIfPlaying();
      } else {
        this.update();
      }
    });
    this.listenTo(this.multiPlayer, 'playfailed', () => {
      backgroundMedia.mute(true);
    });
  }
  disable() {
    this.disabled = true;
    this.multiPlayer.fadeOutAndPause();
    events.trigger('atmo:disabled');
  }
  enable() {
    this.disabled = false;
    this.update();
    events.trigger('atmo:enabled');
  }
  pause() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.fadeOutAndPause();
    } else {
      this.multiPlayer.pause();
    }
  }
  turnDown() {
    if (browser.has('volume control support')) {
      return this.multiPlayer.changeVolumeFactor(0.2);
    } else {
      this.multiPlayer.pause();
    }
  }
  resume() {
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
  update() {
    if (!this.disabled) {
      if (this.backgroundMedia.muted) {
        this.multiPlayer.fadeOutAndPause();
      } else {
        this.multiPlayer.fadeTo(this.atmoSourceId);
      }
    }
  }
  createMediaPlayerHooks(atmoDuringPlayback) {
    var atmo = this;
    return {
      before: function () {
        if (atmoDuringPlayback === 'mute') {
          atmo.pause();
        } else if (atmoDuringPlayback === 'turnDown') {
          atmo.turnDown();
        }
      },
      after: function () {
        atmo.resume();
      }
    };
  }
}
Object.assign(Atmo.prototype, BackboneEvents);

function getContextValue(updateAtmo, createMediaPlayerHooks) {
  let empty = () => {};
  return {
    updateAtmo: updateAtmo || empty,
    createMediaPlayerHooks: createMediaPlayerHooks || empty
  };
}
const AtmoContext = createContext(getContextValue());
function AtmoProvider({
  children
}) {
  let atmoConfig = useRef({});
  useEffect(() => {
    let currentAtmo = atmoConfig.current;
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
  let updateAtmo = function ({
    audioFilePermaId,
    sources
  }) {
    let currentAtmo = atmoConfig.current;
    if (currentAtmo.atmo) {
      currentAtmo.pool.mapSources(audioFilePermaId, sources);
      currentAtmo.atmo.atmoSourceId = audioFilePermaId;
      currentAtmo.atmo.update();
    }
  };
  let createMediaPlayerHooks = function (options) {
    if (atmoConfig.current.atmo) {
      return atmoConfig.current.atmo.createMediaPlayerHooks(options);
    }
  };
  let contextValue = useMemo(() => {
    return getContextValue(updateAtmo, createMediaPlayerHooks);
  }, []);
  return /*#__PURE__*/React.createElement(AtmoContext.Provider, {
    value: contextValue
  }, children);
}
function useAtmo() {
  return useContext(AtmoContext);
}

function PlayerContainer({
  filePermaId,
  sources,
  textTrackSources,
  type,
  playsInline,
  loop,
  controls,
  altText,
  mediaEventsContextData,
  atmoDuringPlayback,
  onSetup
}) {
  const playerWrapperRef = useRef(null);
  let atmo = useAtmo();
  useEffect(() => {
    let playerWrapper = playerWrapperRef.current;
    if (sources) {
      let disposeHandler;
      let player = media.getPlayer(sources, {
        textTrackSources,
        filePermaId,
        tagName: type,
        playsInline: playsInline,
        loop: loop,
        controls: controls,
        hooks: atmoDuringPlayback ? atmo.createMediaPlayerHooks(atmoDuringPlayback) : {},
        //create hooks only for inline media players
        mediaEventsContextData,
        altText,
        onRelease() {
          playerWrapper.removeChild(player.el());
          player = null;
          if (disposeHandler) {
            disposeHandler();
          }
        }
      });
      playerWrapper.appendChild(player.el());
      if (onSetup) {
        disposeHandler = onSetup(player);
      }
      return () => {
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
  for (let i = 0; i < a.length; i++) {
    let aItem = a[i];
    let bItem = b[i];
    if (Object.keys(aItem).length !== Object.keys(bItem).length) {
      return false;
    }
    for (let key in aItem) {
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
  player.on('loadedmetadata', () => actions.metaDataLoaded(player.currentTime(), player.duration()));
  player.on('loadeddata', () => actions.dataLoaded());
  player.on('progress', () => actions.progress(player.bufferedEnd()));
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
  player.one('loadedmetadata', () => actions.saveMediaElementId(player.getMediaElement().id));
  function handleTimeUpdate() {
    actions.timeUpdate(player.currentTime(), player.duration());
  }
  return () => {
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
  player.one('loadedmetadata', () => player.currentTime(playerState.currentTime));
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
    player.prebuffer().then(() => setTimeout(playerActions.prebuffered, 0));
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
  player.getMediaElement().style.objectPosition = typeof x !== 'undefined' && typeof y !== 'undefined' ? `${x}% ${y}%` : '';
}

function getEventObject({
  section,
  sectionsCount
}) {
  let page = {
    getAnalyticsData: () => ({
      chapterIndex: section === null || section === void 0 ? void 0 : section.chapter.index,
      chapterTitle: section === null || section === void 0 ? void 0 : section.chapter.title,
      index: section ? section.sectionIndex : -1,
      total: sectionsCount
    }),
    index: section ? section.sectionIndex : -1,
    configuration: {
      title: section ? section.chapter.title + ', Section ' + section.sectionIndex : null
    }
  };
  return page;
}
const EventContext = createContext(getEventObject({}));
function EventContextDataProvider({
  section,
  sectionsCount,
  children
}) {
  let contextValue = useMemo(() => {
    return {
      page: getEventObject({
        section,
        sectionsCount
      })
    };
  }, [section, sectionsCount]);
  return /*#__PURE__*/React.createElement(EventContext.Provider, {
    value: contextValue
  }, children);
}
function PlayerEventContextDataProvider({
  playbackMode,
  playerDescription,
  children
}) {
  const original = useEventContextData();
  const value = useMemo(() => ({
    ...original,
    playbackMode,
    playerDescription
  }), [original, playbackMode, playerDescription]);
  return /*#__PURE__*/React.createElement(EventContext.Provider, {
    value: value
  }, children);
}
function useEventContextData() {
  return useContext(EventContext);
}

function updateTextTracksMode(player, activeTextTrackFileId) {
  [].slice.call(player.textTracks()).forEach(textTrack => {
    if (textTrack.id === `text_track_file_${activeTextTrackFileId}`) {
      textTrack.mode = 'showing';
    } else {
      textTrack.mode = 'disabled';
    }
  });
}
function watchTextTracks(player, getActiveTextTrackFileId) {
  function handleTextTracksUpdate() {
    updateTextTracksMode(player, getActiveTextTrackFileId());
  }
  player.on('play', handleTextTracksUpdate);
  player.on('texttrackchange', handleTextTracksUpdate);
  handleTextTracksUpdate();
  return () => {
    player.off('play', handleTextTracksUpdate);
    player.off('texttrackchange', handleTextTracksUpdate);
  };
}
function getTextTrackSources(textTrackFiles, textTracksDisabled) {
  if (textTracksDisabled) {
    return [];
  }
  return textTrackFiles.filter(textTrackFile => textTrackFile.isReady).map(textTrackFile => ({
    id: `text_track_file_${textTrackFile.id}`,
    kind: textTrackFile.configuration.kind,
    label: textTrackFile.displayLabel,
    srclang: textTrackFile.configuration.srclang,
    src: textTrackFile.urls.vtt
  }));
}

function usePlayerTextTracks({
  playerRef,
  activeTextTrackFileId
}) {
  const activeTextTrackFileIdRef = useRef(activeTextTrackFileId);
  useEffect(() => {
    activeTextTrackFileIdRef.current = activeTextTrackFileId;
    if (playerRef.current) {
      updateTextTracksMode(playerRef.current, activeTextTrackFileId);
    }
  }, [activeTextTrackFileId, playerRef]);
  return useCallback(player => {
    const unwatchTextTracks = watchTextTracks(player, () => activeTextTrackFileIdRef.current);
    return () => {
      unwatchTextTracks();
    };
  }, []);
}

var textTrackStyles = {"inset":"textTracks-module_inset__K7DIL"};

var styles = {"wrapper":"MediaPlayer-module_wrapper__1cSGR","cover":"MediaPlayer-module_cover__2wGez","contentElementBox":"MediaPlayer-module_contentElementBox__3zsPl","posterVisible":"MediaPlayer-module_posterVisible__3C_WZ"};

const PLAY = 'MEDIA_PLAY';
const PLAYING = 'MEDIA_PLAYING';
const PLAY_FAILED = 'MEDIA_PLAY_FAILED';
const PAUSE = 'MEDIA_PAUSE';
const PAUSED = 'MEDIA_PAUSED';
const PLAY_AND_FADE_IN = 'MEDIA_PLAY_AND_FADE_IN';
const FADE_OUT_AND_PAUSE = 'MEDIA_FADE_OUT_AND_PAUSE';
const CHANGE_VOLUME_FACTOR = 'CHANGE_VOLUME_FACTOR';
const META_DATA_LOADED = 'MEDIA_META_DATA_LOADED';
const DATA_LOADED = 'MEDIA_DATA_LOADED';
const PROGRESS = 'MEDIA_PROGRESS';
const TIME_UPDATE = 'MEDIA_TIME_UPDATE';
const ENDED = 'MEDIA_ENDED';
const SCRUB_TO = 'MEDIA_SCRUB_TO';
const SEEK_TO = 'MEDIA_SEEK_TO';
const SEEKING = 'MEDIA_SEEKING';
const SEEKED = 'MEDIA_SEEKED';
const WAITING = 'MEDIA_WAITING';
const PREBUFFER = 'MEDIA_PREBUFFER';
const PREBUFFERED = 'MEDIA_PREBUFFERED';
const BUFFER_UNDERRUN = 'MEDIA_BUFFER_UNDERRUN';
const BUFFER_UNDERRUN_CONTINUE = 'MEDIA_BUFFER_UNDERRUN_CONTINUE';
const MOUSE_ENTERED = 'MEDIA_MOUSE_ENTERED';
const MOUSE_LEFT = 'MEDIA_MOUSE_LEFT';
const MOUSE_ENTERED_CONTROLS = 'MEDIA_MOUSE_ENTERED_CONTROLS';
const MOUSE_LEFT_CONTROLS = 'MEDIA_MOUSE_LEFT_CONTROLS';
const FOCUS_ENTERED_CONTROLS = 'MEDIA_FOCUS_ENTERED_CONTROLS';
const FOCUS_LEFT_CONTROLS = 'MEDIA_FOCUS_LEFT_CONTROLS';
const USER_INTERACTION = 'MEDIA_USER_INTERACTION';
const USER_IDLE = 'MEDIA_USER_IDLE';
const SAVE_MEDIA_ELEMENT_ID = 'MEDIA_SAVE_MEDIA_ELEMENT_ID';
const DISCARD_MEDIA_ELEMENT_ID = 'MEDIA_DISCARD_MEDIA_ELEMENT_ID';
function createActions(dispatch) {
  return {
    playBlessed({
      via
    } = {}) {
      media.mute(false);
      dispatch({
        type: PLAY,
        payload: {
          via
        }
      });
    },
    play({
      via
    } = {}) {
      dispatch({
        type: PLAY,
        payload: {
          via
        }
      });
    },
    playing() {
      dispatch({
        type: PLAYING
      });
    },
    playFailed() {
      dispatch({
        type: PLAY_FAILED
      });
    },
    pause({
      via
    } = {}) {
      dispatch({
        type: PAUSE,
        payload: {
          via
        }
      });
    },
    paused() {
      dispatch({
        type: PAUSED
      });
    },
    playAndFadeIn(fadeDuration, {
      via
    } = {}) {
      dispatch({
        type: PLAY_AND_FADE_IN,
        payload: {
          fadeDuration: fadeDuration,
          via
        }
      });
    },
    fadeOutAndPause(fadeDuration, {
      via
    } = {}) {
      dispatch({
        type: FADE_OUT_AND_PAUSE,
        payload: {
          fadeDuration: fadeDuration,
          via
        }
      });
    },
    changeVolumeFactor(volumeFactor, fadeDuration) {
      dispatch({
        type: CHANGE_VOLUME_FACTOR,
        payload: {
          fadeDuration: fadeDuration,
          volumeFactor: volumeFactor
        }
      });
    },
    metaDataLoaded(currentTime, duration) {
      dispatch({
        type: META_DATA_LOADED,
        payload: {
          currentTime: currentTime,
          duration: duration
        }
      });
    },
    dataLoaded() {
      dispatch({
        type: DATA_LOADED
      });
    },
    progress(bufferedEnd) {
      dispatch({
        type: PROGRESS,
        payload: {
          bufferedEnd: bufferedEnd
        }
      });
    },
    timeUpdate(currentTime, duration) {
      dispatch({
        type: TIME_UPDATE,
        payload: {
          currentTime: currentTime,
          duration: duration
        }
      });
    },
    ended() {
      dispatch({
        type: ENDED
      });
    },
    scrubTo(time) {
      dispatch({
        type: SCRUB_TO,
        payload: {
          time: time
        }
      });
    },
    seekTo(time) {
      dispatch({
        type: SEEK_TO,
        payload: {
          time: time
        }
      });
    },
    seeking() {
      dispatch({
        type: SEEKING
      });
    },
    seeked() {
      dispatch({
        type: SEEKED
      });
    },
    waiting() {
      dispatch({
        type: WAITING
      });
    },
    prebuffer() {
      dispatch({
        type: PREBUFFER
      });
    },
    prebuffered() {
      dispatch({
        type: PREBUFFERED
      });
    },
    bufferUnderrun() {
      dispatch({
        type: BUFFER_UNDERRUN
      });
    },
    bufferUnderrunContinue() {
      dispatch({
        type: BUFFER_UNDERRUN_CONTINUE
      });
    },
    mouseEntered() {
      dispatch({
        type: MOUSE_ENTERED
      });
    },
    mouseLeft() {
      dispatch({
        type: MOUSE_LEFT
      });
    },
    mouseEnteredControls() {
      dispatch({
        type: MOUSE_ENTERED_CONTROLS
      });
    },
    mouseLeftControls() {
      dispatch({
        type: MOUSE_LEFT_CONTROLS
      });
    },
    userInteraction() {
      dispatch({
        type: USER_INTERACTION
      });
    },
    userIdle() {
      dispatch({
        type: USER_IDLE
      });
    },
    focusEnteredControls() {
      dispatch({
        type: FOCUS_ENTERED_CONTROLS
      });
    },
    focusLeftControls() {
      dispatch({
        type: FOCUS_LEFT_CONTROLS
      });
    },
    saveMediaElementId(id) {
      dispatch({
        type: SAVE_MEDIA_ELEMENT_ID,
        payload: {
          id: id
        }
      });
    },
    discardMediaElementId() {
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
      return {
        ...state,
        isLoading: true,
        shouldPlay: true,
        playFailed: false,
        lastControlledVia: action.payload.via
      };
    case PLAYING:
      return {
        ...state,
        shouldPlay: true,
        isPlaying: true,
        unplayed: false,
        userIdle: false
      };
    case PLAY_AND_FADE_IN:
      return {
        ...state,
        shouldPlay: true,
        fadeDuration: action.payload.fadeDuration,
        isLoading: true,
        lastControlledVia: action.payload.via
      };
    case FADE_OUT_AND_PAUSE:
      return {
        ...state,
        shouldPlay: false,
        fadeDuration: action.payload.fadeDuration,
        isLoading: false,
        lastControlledVia: action.payload.via
      };
    case PLAY_FAILED:
      return {
        ...state,
        shouldPlay: false,
        playFailed: true,
        fadeDuration: null,
        unplayed: true,
        isLoading: false
      };
    case PAUSE:
      return {
        ...state,
        shouldPlay: false,
        isLoading: false,
        fadeDuration: null,
        lastControlledVia: action.payload.via
      };
    case PAUSED:
      if (state.bufferUnderrun) {
        return {
          ...state,
          isPlaying: false
        };
      } else {
        return {
          ...state,
          shouldPlay: false,
          fadeDuration: null,
          isPlaying: false,
          isLoading: false
        };
      }
    case SCRUB_TO:
      return {
        ...state,
        scrubbingAt: action.payload.time
      };
    case SEEK_TO:
      return {
        ...state,
        shouldSeekTo: action.payload.time
      };
    case SEEKING:
      return {
        ...state,
        isLoading: true
      };
    case SEEKED:
      return {
        ...state,
        shouldSeekTo: undefined,
        scrubbingAt: undefined,
        isLoading: false
      };
    case META_DATA_LOADED:
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration
      };
    case DATA_LOADED:
      return {
        ...state,
        dataLoaded: true
      };
    case PROGRESS:
      return {
        ...state,
        bufferedEnd: action.payload.bufferedEnd
      };
    case TIME_UPDATE:
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration,
        isLoading: false
      };
    case ENDED:
      return {
        ...state,
        shouldPlay: false,
        isPlaying: false,
        unplayed: true,
        lastControlledVia: null
      };
    case WAITING:
      return {
        ...state,
        isLoading: true
      };
    case PREBUFFER:
      return {
        ...state,
        shouldPrebuffer: true
      };
    case PREBUFFERED:
      return {
        ...state,
        shouldPrebuffer: false
      };
    case BUFFER_UNDERRUN:
      return {
        ...state,
        bufferUnderrun: true
      };
    case BUFFER_UNDERRUN_CONTINUE:
      return {
        ...state,
        bufferUnderrun: false
      };
    case MOUSE_ENTERED:
      return {
        ...state,
        userHovering: true
      };
    case MOUSE_LEFT:
      return {
        ...state,
        userHovering: false
      };
    case MOUSE_ENTERED_CONTROLS:
      return {
        ...state,
        userHoveringControls: true
      };
    case MOUSE_LEFT_CONTROLS:
      return {
        ...state,
        userHoveringControls: false
      };
    case FOCUS_ENTERED_CONTROLS:
      return {
        ...state,
        focusInsideControls: true,
        userIdle: false
      };
    case FOCUS_LEFT_CONTROLS:
      return {
        ...state,
        focusInsideControls: false,
        userIdle: false
      };
    case USER_INTERACTION:
      if (!state.userIdle) {
        return state;
      }
      return {
        ...state,
        userIdle: false
      };
    case USER_IDLE:
      return {
        ...state,
        userIdle: true
      };
    case SAVE_MEDIA_ELEMENT_ID:
      return {
        ...state,
        mediaElementId: action.payload.id
      };
    case DISCARD_MEDIA_ELEMENT_ID:
      return {
        ...state,
        dataLoaded: false,
        isPlaying: false,
        mediaElementId: null
      };
    case CHANGE_VOLUME_FACTOR:
      return {
        ...state,
        volumeFactor: action.payload.volumeFactor,
        volumeFactorFadeDuration: action.payload.fadeDuration
      };
    default:
      return state;
  }
}
function usePlayerState() {
  const [state, dispatch] = useReducer(playerStateReducer, getInitialPlayerState());
  const actions = useMemo(() => createActions(dispatch), [dispatch]);
  return [state, actions];
}

function MediaPlayer(props) {
  const isStaticPreview = useIsStaticPreview();
  const load = props.load === 'auto' && isStaticPreview ? 'poster' : props.load;
  const posterVisible = props.posterImageUrl && (props.type !== 'video' || load === 'poster' || !props.playerState.dataLoaded || props.playerState.unplayed);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.wrapper, styles[props.fit], {
      [styles.contentElementBox]: props.applyContentElementBoxStyles,
      [styles.posterVisible]: posterVisible,
      [textTrackStyles.inset]: props.textTracksInset
    })
  }, load === 'auto' && /*#__PURE__*/React.createElement(PreparedMediaPlayer, props), load !== 'none' && /*#__PURE__*/React.createElement(Poster, {
    imageUrl: props.posterImageUrl,
    objectPosition: props.objectPosition
  }));
}
MediaPlayer.defaultProps = {
  load: 'auto'
};
function Poster({
  imageUrl,
  objectPosition
}) {
  if (!imageUrl) {
    return null;
  }
  return /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: "",
    style: {
      objectPosition: objectPosition && `${objectPosition.x}% ${objectPosition.y}%`
    }
  });
}
function PreparedMediaPlayer(props) {
  let playerRef = useRef();
  let previousPlayerState = useRef(props.playerState);
  let eventContextData = useEventContextData();
  const setupTextTracks = usePlayerTextTracks({
    playerRef,
    activeTextTrackFileId: props.textTracks.activeFileId
  });
  let onSetup = newPlayer => {
    playerRef.current = newPlayer;
    const unwatchPlayer = watchPlayer(newPlayer, props.playerActions);
    const unwatchTextTracks = setupTextTracks(newPlayer);
    applyPlayerState(newPlayer, props.playerState, props.playerActions);
    updateObjectPosition(newPlayer, props.objectPosition.x, props.objectPosition.y);
    return () => {
      unwatchTextTracks();
      unwatchPlayer();
      playerRef.current = undefined;
    };
  };
  useEffect(() => {
    let player = playerRef.current;
    if (player) {
      updatePlayerState(player, previousPlayerState.current, props.playerState, props.playerActions);
    }
    previousPlayerState.current = props.playerState;
  }, [props.playerState, props.playerActions]);
  useEffect(() => {
    const player = playerRef.current;
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
    mediaEventsContextData: {
      ...eventContextData,
      ...props.mediaEventsContextData
    },
    atmoDuringPlayback: props.atmoDuringPlayback,
    onSetup: onSetup,
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
  return sources.map(source => ({
    ...source,
    src: `${source.src}${suffix}`
  }));
}

function useSetting(name) {
  const [value, setValue] = useState(settings.get(name));
  useEffect(() => {
    function update() {
      setValue(settings.get(name));
    }
    settings.on(`change:${name}`, update);
    return () => settings.off(undefined, update);
  }, [setValue, name]);
  const setter = useCallback(value => settings.set(name, value), [name]);
  return [value, setter];
}

function useTextTracks({
  file,
  defaultTextTrackFilePermaId,
  captionsByDefault
}) {
  let [setting, setSetting] = useSetting('textTrack');
  setting = setting || {};
  const {
    t
  } = useI18n();
  const {
    locale
  } = useEntryMetadata();
  const textTrackFiles = useTextTrackFiles({
    file
  });
  const autoTextTrackFile = getAutoTextTrackFile(textTrackFiles, defaultTextTrackFilePermaId, locale, captionsByDefault);
  return {
    mode: setting.kind === 'off' ? 'off' : setting.kind ? 'user' : 'auto',
    autoDisplayLabel: autoTextTrackFile ? t('pageflow_scrolled.public.text_track_modes.auto', {
      label: autoTextTrackFile.displayLabel
    }) : t('pageflow_scrolled.public.text_track_modes.auto_off'),
    files: textTrackFiles,
    activeFileId: getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, setting),
    select(textTrackFileIdOrKind) {
      if (textTrackFileIdOrKind === 'off') {
        setSetting({
          kind: 'off'
        });
      } else if (textTrackFileIdOrKind === 'auto') {
        setSetting({});
      } else {
        const textTrackFile = textTrackFiles.find(file => file.id === textTrackFileIdOrKind);
        setSetting({
          kind: textTrackFile.configuration.kind,
          srclang: textTrackFile.configuration.srclang
        });
      }
    }
  };
}
function useTextTrackFiles({
  file
}) {
  const {
    t
  } = useI18n();
  return useNestedFiles({
    collectionName: 'textTrackFiles',
    parent: file
  }).map(file => addDisplayLabel(file, t)).sort((file1, file2) => file1.displayLabel.localeCompare(file2.displayLabel));
}
function getActiveTextTrackFileId(textTrackFiles, autoTextTrackFile, setting) {
  if (setting.kind === 'off') {
    return null;
  }
  const file = textTrackFiles.find(textTrackFile => textTrackFile.configuration.srclang === setting.srclang && textTrackFile.configuration.kind === setting.kind);
  if (file) {
    return file.id;
  }
  return autoTextTrackFile && autoTextTrackFile.id;
}
function getAutoTextTrackFile(textTrackFiles, defaultTextTrackFilePermaId, locale, captionsByDefault) {
  if (defaultTextTrackFilePermaId) {
    const defaultTextTrackFile = textTrackFiles.find(textTrackFile => textTrackFile.permaId === defaultTextTrackFilePermaId);
    if (defaultTextTrackFile) {
      return defaultTextTrackFile;
    }
  }
  const subtitlesInEntryLanguage = textTrackFiles.find(textTrackFile => {
    return textTrackFile.configuration.kind === 'subtitles' && textTrackFile.configuration.srclang === locale;
  });
  const defaultCaptions = captionsByDefault ? textTrackFiles.find(textTrackFile => {
    return textTrackFile.configuration.kind === 'captions';
  }) : null;
  return subtitlesInEntryLanguage || defaultCaptions;
}
function addDisplayLabel(textTrackFile, t) {
  return {
    ...textTrackFile,
    displayLabel: textTrackFile.configuration.label || t('pageflow_scrolled.public.languages.' + textTrackFile.configuration.srclang || 'unknown', {
      defaultValue: t('pageflow_scrolled.public.languages.unknown')
    })
  };
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MediaMutedContext = createContext(false);
function MediaMutedProvider({
  children
}) {
  const [value, setValue] = useState(media.muted);
  useEffect(() => {
    media.on('change:muted', setValue);
    return () => media.off('change:muted', setValue);
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
  const muted = useMediaMuted();
  const wasMuted = usePrevious(muted);
  useIsomorphicLayoutEffect(() => {
    if (wasMuted && !muted) {
      callback();
    }
  }, [wasMuted, muted, callback]);
}

function ensureProtocol(protocol, url) {
  if (url && url.match(/^\/\//)) {
    return `${protocol}:${url}`;
  }
  return url;
}

function formatTimeDuration(durationInMs) {
  const seconds = Math.round(durationInMs / 1000) % 60;
  const minutes = Math.floor(durationInMs / 1000 / 60) % 60;
  const hours = Math.floor(durationInMs / 1000 / 60 / 60);
  let result = 'PT';
  if (hours > 0) {
    result += `${hours}H`;
  }
  if (minutes > 0) {
    result += `${minutes}M`;
  }
  if (seconds > 0 || minutes === 0 && hours === 0) {
    result += `${seconds}S`;
  }
  return result;
}

function StructuredData({
  data
}) {
  return /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data)
    }
  });
}

function AudioStructuredData({
  file
}) {
  const entryMedadata = useEntryMetadata();
  const data = {
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

var styles$1 = {"spaceForTextTracks":"AudioPlayer-module_spaceForTextTracks__169MK","spaceForTextTracksActive":"AudioPlayer-module_spaceForTextTracksActive__99m7R"};

/**
 * Render audio file in MediaPlayer.
 *
 * @param {Object} props
 * @param {Object} props.audioFile - Audio file obtained via `useFile`.
 * @param {number} [props.posterImageFile] - Poster image file obtained via `useFile`.
 * @param {number} [props.defaultTextTrackFileId] - Perma id of default text track file.
 * @param {string} [props.load] - Control lazy loading. `"auto"` (default), `"poster"` or `"none"`.
 */
function AudioPlayer({
  audioFile,
  posterImageFile,
  ...props
}) {
  const textTracks = useTextTracks({
    file: audioFile,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });
  if (audioFile && audioFile.isReady) {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$1.spaceForTextTracks, {
        [styles$1.spaceForTextTracksActive]: !posterImageFile && textTracks.files.length
      })
    }, /*#__PURE__*/React.createElement(MediaPlayer, Object.assign({
      type: 'audio',
      textTracks: textTracks,
      filePermaId: audioFile.permaId,
      sources: processSources(audioFile),
      textTracksInset: !!posterImageFile,
      posterImageUrl: posterImageFile && posterImageFile.isReady ? posterImageFile.urls.large : undefined,
      altText: audioFile.configuration.alt,
      mediaEventsContextData: {
        fileDisplayName: audioFile.displayName
      }
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
      src: `${audioFile.urls['ogg']}?u=1`
    });
  }
  if (audioFile.urls['mp3']) {
    sources.push({
      type: 'audio/mp3',
      src: `${audioFile.urls['mp3']}?u=1`
    });
  }
  if (audioFile.urls['m4a']) {
    sources.push({
      type: 'audio/m4a',
      src: `${audioFile.urls['m4a']}?u=1`
    });
  }
  return sources;
}
function has(featureName) {
  return typeof window !== 'undefined' && browser.has(featureName);
}

function SectionAtmo({
  audioFile
}) {
  const lastAudioFile = usePrevious(audioFile);
  let atmo = useAtmo();
  let processAtmo = useCallback(() => {
    let sources = undefined;
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
    onActivate() {
      processAtmo();
    }
  });
  useEffect(() => {
    if (lastAudioFile !== undefined && (lastAudioFile && lastAudioFile.permaId) !== (audioFile && audioFile.permaId)) {
      processAtmo();
    }
  }, [processAtmo, lastAudioFile, audioFile]);
  return null;
}

var styles$2 = {"Foreground":"Foreground-module_Foreground__13ODU","fullFadeHeight":"Foreground-module_fullFadeHeight__2p9dx","fullHeight":"Foreground-module_fullHeight__1vMXb","spaceAbove":"Foreground-module_spaceAbove__dUi9X","spaceBelow":"Foreground-module_spaceBelow__SF0a9","suppressedPaddingTop":"Foreground-module_suppressedPaddingTop__3rVKd","suppressedPaddingBottom":"Foreground-module_suppressedPaddingBottom__3tvTs","forcePadding":"Foreground-module_forcePadding__3mh-s"};

const ForcePaddingContext = createContext(false);
const Foreground = extensible('Foreground', function Foreground(props) {
  const forcePadding = useContext(ForcePaddingContext);
  return /*#__PURE__*/React.createElement("div", {
    className: className(props, forcePadding),
    style: {
      minHeight: props.minHeight
    }
  }, props.children);
});
function className(props, forcePadding) {
  var _props$suppressedPadd, _props$suppressedPadd2, _props$section;
  return classNames(styles$2.Foreground, props.transitionStyles.foreground, props.transitionStyles[`foreground-${props.state}`], {
    [styles$2.suppressedPaddingTop]: (_props$suppressedPadd = props.suppressedPaddings) === null || _props$suppressedPadd === void 0 ? void 0 : _props$suppressedPadd.top
  }, {
    [styles$2.suppressedPaddingBottom]: (_props$suppressedPadd2 = props.suppressedPaddings) === null || _props$suppressedPadd2 === void 0 ? void 0 : _props$suppressedPadd2.bottom
  }, {
    [styles$2.forcePadding]: forcePadding
  }, styles$2[`${props.heightMode}Height`], styles$2[spaceClassName((_props$section = props.section) === null || _props$section === void 0 ? void 0 : _props$section.remainingVerticalSpace)]);
}
function spaceClassName(remainingVerticalSpace) {
  if (remainingVerticalSpace === 'above') {
    return 'spaceAbove';
  } else if (remainingVerticalSpace === 'below') {
    return 'spaceBelow';
  }
}

function getEffectValue(file, name) {
  var _find;
  return (_find = ((file === null || file === void 0 ? void 0 : file.effects) || []).find(effect => effect.name === name)) === null || _find === void 0 ? void 0 : _find.value;
}

var styles$3 = {"outer":"BackdropFrameEffect-module_outer__1Od-V","inner":"BackdropFrameEffect-module_inner__n74el"};

function BackdropFrameEffect({
  backdrop
}) {
  const value = getEffectValue(backdrop, 'frame');
  if (!value) {
    return null;
  }
  const {
    color,
    design
  } = normalizeFrameValue(value);
  if (!color) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.outer, frameScopeClass(design)),
    style: {
      '--frame-color': color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.inner
  }));
}
function normalizeFrameValue(value) {
  if (typeof value === 'string') {
    return {
      color: value
    };
  }
  return value;
}
function frameScopeClass(design) {
  return `scope-backdropFrame-${design || 'default'}`;
}

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
var ai = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "89.27 100.72 365.5 365.49"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  fillRule: "evenodd",
  d: "M272.03 100.72c100.92 0 182.74 81.82 182.74 182.75s-81.82 182.74-182.74 182.74S89.28 384.39 89.28 283.47s81.82-182.75 182.75-182.75"
}), /*#__PURE__*/React.createElement("path", {
  d: "M170.79 353.74c-1.08 0-2.05-.43-2.92-1.31-.88-.87-1.31-1.84-1.31-2.92 0-.67.07-1.27.2-1.81l47.34-129.32c.4-1.48 1.24-2.79 2.52-3.93 1.27-1.14 3.05-1.71 5.34-1.71h29.81c2.28 0 4.06.57 5.34 1.71 1.27 1.14 2.11 2.45 2.52 3.93l47.14 129.32c.27.54.4 1.14.4 1.81 0 1.08-.44 2.05-1.31 2.92s-1.91 1.31-3.12 1.31h-24.78c-2.01 0-3.52-.5-4.53-1.51-1.01-1.01-1.65-1.91-1.91-2.72l-7.86-20.55h-53.78l-7.65 20.55c-.27.81-.88 1.71-1.81 2.72-.94 1.01-2.55 1.51-4.83 1.51h-24.78zm47.34-53.78h37.47l-18.93-53.18-18.53 53.18zm109.98 53.78c-1.48 0-2.69-.47-3.63-1.41s-1.41-2.15-1.41-3.63V217.77c0-1.48.47-2.68 1.41-3.63s2.15-1.41 3.63-1.41h26.99c1.48 0 2.68.47 3.63 1.41.94.94 1.41 2.15 1.41 3.63V348.7c0 1.48-.47 2.69-1.41 3.63s-2.15 1.41-3.63 1.41h-26.99z",
  fill: "var(--ai-indicator-letter-color, #fff)"
})));

function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$1.apply(this, arguments);
}
var aiGenerated = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "207.3 144.35 1384.24 266.42"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  fillRule: "evenodd",
  d: "M352.84 410.77H1446c85.55 0 145.54-59.94 145.54-133.2 0-73.27-59.99-133.21-145.54-133.21H352.84c-85.55 0-145.54 59.94-145.54 133.2 0 73.26 64.99 133.2 150.54 133.2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M326.09 341c-.98 0-1.87-.4-2.66-1.19-.8-.8-1.19-1.68-1.19-2.66 0-.61.06-1.16.18-1.65l43.18-117.96c.37-1.35 1.13-2.54 2.3-3.58 1.16-1.04 2.79-1.56 4.87-1.56h27.19c2.08 0 3.7.52 4.87 1.56 1.16 1.04 1.93 2.24 2.3 3.58l42.99 117.96c.24.49.37 1.04.37 1.65 0 .98-.4 1.87-1.19 2.66-.8.8-1.75 1.19-2.85 1.19h-22.6c-1.84 0-3.22-.46-4.13-1.38-.92-.92-1.5-1.75-1.75-2.48l-7.17-18.74h-49.06l-6.98 18.74c-.25.73-.8 1.56-1.65 2.48-.86.92-2.33 1.38-4.41 1.38h-22.6zm43.18-49.06h34.18l-17.27-48.51-16.9 48.51zM469.58 341c-1.35 0-2.45-.43-3.31-1.29-.86-.86-1.29-1.96-1.29-3.31V216.97c0-1.35.43-2.45 1.29-3.31s1.96-1.29 3.31-1.29h24.62c1.35 0 2.45.43 3.31 1.29.86.86 1.29 1.96 1.29 3.31V336.4c0 1.35-.43 2.45-1.29 3.31s-1.96 1.29-3.31 1.29h-24.62zm169.67-15.13c-8.43 0-15.63-1.41-21.59-4.24-5.97-2.83-10.58-6.95-13.86-12.38-3.27-5.43-5.04-11.99-5.31-19.71-.09-3.85-.13-7.98-.13-12.38s.04-8.56.13-12.51c.27-7.53 2.04-13.94 5.31-19.24 3.27-5.29 7.94-9.35 13.99-12.17 6.05-2.83 13.2-4.24 21.46-4.24 6.64 0 12.46.85 17.49 2.56 5.02 1.7 9.24 3.92 12.65 6.66s6.01 5.72 7.8 8.95c1.79 3.23 2.74 6.32 2.83 9.28 0 .81-.27 1.5-.81 2.08-.54.58-1.26.87-2.15.87h-16.68c-.9 0-1.59-.18-2.08-.54-.49-.36-.92-.9-1.28-1.61-.63-1.61-1.64-3.25-3.03-4.91-1.39-1.66-3.25-3.07-5.58-4.24-2.33-1.16-5.38-1.75-9.15-1.75-5.65 0-10.11 1.48-13.39 4.44-3.27 2.96-5.04 7.8-5.31 14.53-.27 7.71-.27 15.56 0 23.54.27 7 2.08 12.02 5.45 15.07 3.36 3.05 7.87 4.57 13.52 4.57 3.68 0 6.97-.65 9.89-1.95 2.91-1.3 5.22-3.34 6.93-6.12 1.7-2.78 2.56-6.32 2.56-10.63v-3.36h-14.66c-.9 0-1.66-.34-2.29-1.01-.63-.67-.94-1.46-.94-2.35v-8.61c0-.99.31-1.79.94-2.42.63-.63 1.39-.94 2.29-.94h32.96c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v14.66c0 7.71-1.68 14.31-5.04 19.77-3.36 5.47-8.16 9.66-14.39 12.58s-13.52 4.37-21.86 4.37zm71.48-1.35c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94h60.94c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v10.76c0 .9-.32 1.66-.94 2.29-.63.63-1.44.94-2.42.94h-43.59v21.12h40.63c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v9.95c0 .9-.32 1.66-.94 2.29s-1.44.94-2.42.94h-40.63v21.79h44.66c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v10.63c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-62.02zm95.15 0c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94h12.24c1.34 0 2.33.31 2.96.94.63.63 1.03 1.12 1.21 1.48l35.92 56.1v-55.15c0-.99.31-1.79.94-2.42.63-.63 1.39-.94 2.29-.94h13.72c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v87.44c0 .9-.32 1.68-.94 2.35-.63.67-1.44 1.01-2.42 1.01h-12.38c-1.35 0-2.31-.34-2.89-1.01a29.53 29.53 0 00-1.28-1.41l-35.78-54.35v53.41c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-13.59zm106.31 0c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94h60.94c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v10.76c0 .9-.32 1.66-.94 2.29-.63.63-1.44.94-2.42.94h-43.59v21.12h40.63c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v9.95c0 .9-.32 1.66-.94 2.29s-1.44.94-2.42.94h-40.63v21.79h44.66c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v10.63c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-62.02zm95.16 0c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94H1043c11.21 0 20.04 2.58 26.5 7.73 6.46 5.16 9.69 12.58 9.69 22.26 0 6.55-1.57 12.02-4.71 16.41-3.14 4.4-7.35 7.67-12.65 9.82l18.97 33.63c.27.54.4 1.03.4 1.48 0 .72-.27 1.37-.81 1.95-.54.58-1.21.87-2.02.87h-14.93c-1.61 0-2.82-.42-3.63-1.28-.81-.85-1.39-1.64-1.75-2.35l-16.41-30.81h-16.28v31.07c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-14.66zm18.03-51.52h17.22c4.93 0 8.59-1.12 10.96-3.36 2.38-2.24 3.56-5.38 3.56-9.42s-1.17-7.22-3.5-9.55c-2.33-2.33-6.01-3.5-11.03-3.5h-17.22V273zm75.24 51.52c-.81 0-1.48-.29-2.02-.87-.54-.58-.81-1.23-.81-1.95 0-.45.04-.85.13-1.21l32.02-86.5c.27-.99.81-1.84 1.61-2.56.81-.72 1.93-1.08 3.36-1.08h17.22c1.43 0 2.56.36 3.36 1.08.81.72 1.35 1.57 1.61 2.56l32.02 86.5c.09.36.13.76.13 1.21 0 .72-.27 1.37-.81 1.95-.54.58-1.21.87-2.02.87h-13.99c-1.35 0-2.33-.31-2.96-.94-.63-.63-1.03-1.21-1.21-1.75l-5.78-15.07h-37.94l-5.78 15.07c-.18.54-.58 1.12-1.21 1.75-.63.63-1.61.94-2.96.94h-13.99zm28.92-35.11h27.85l-13.86-38.74-13.99 38.74zm96.1 35.11c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-72.1h-24.48c-.9 0-1.66-.31-2.29-.94-.63-.63-.94-1.39-.94-2.29v-12.11c0-.99.31-1.79.94-2.42.63-.63 1.39-.94 2.29-.94h70.49c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v12.11c0 .9-.32 1.66-.94 2.29-.63.63-1.44.94-2.42.94h-24.35v72.1c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-14.93zm72.68 0c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94h60.94c.99 0 1.79.31 2.42.94.63.63.94 1.44.94 2.42v10.76c0 .9-.32 1.66-.94 2.29-.63.63-1.44.94-2.42.94h-43.59v21.12h40.63c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v9.95c0 .9-.32 1.66-.94 2.29s-1.44.94-2.42.94h-40.63v21.79h44.66c.99 0 1.79.32 2.42.94.63.63.94 1.44.94 2.42v10.63c0 .99-.32 1.8-.94 2.42s-1.44.94-2.42.94h-62.02zm95.16 0c-.99 0-1.79-.31-2.42-.94-.63-.63-.94-1.43-.94-2.42v-87.44c0-.99.31-1.79.94-2.42.63-.63 1.43-.94 2.42-.94h33.77c8.97 0 16.46 1.41 22.46 4.24 6.01 2.83 10.6 6.95 13.79 12.38 3.18 5.43 4.86 12.13 5.04 20.11.09 3.95.13 7.4.13 10.36s-.05 6.37-.13 10.22c-.27 8.34-1.93 15.25-4.98 20.72-3.05 5.47-7.53 9.53-13.45 12.17-5.92 2.65-13.32 3.97-22.2 3.97h-34.44zm18.03-17.35h15.74c4.48 0 8.16-.67 11.03-2.02 2.87-1.35 5-3.47 6.39-6.39 1.39-2.91 2.13-6.7 2.22-11.37.09-2.6.16-4.93.2-7 .04-2.06.04-4.12 0-6.19-.05-2.06-.11-4.35-.2-6.86-.18-6.73-1.91-11.68-5.18-14.86-3.27-3.18-8.32-4.78-15.13-4.78h-15.07v59.46z",
  fill: "var(--ai-indicator-letter-color, #fff)"
})));

function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$2.apply(this, arguments);
}
var aiModified = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$2({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "231.11 144.35 1230.56 266.42"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: "currentColor",
  fillRule: "evenodd",
  d: "M376.65 410.77h939.48c85.55 0 145.54-59.94 145.54-133.2 0-73.27-59.99-133.21-145.54-133.21H381.65c-85.55 0-150.54 59.94-150.54 133.2 0 73.26 64.99 133.2 150.54 133.2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M626.46 325.63c-.92 0-1.72-.32-2.4-.96-.69-.64-1.03-1.46-1.03-2.47v-89.25c0-1.01.34-1.83 1.03-2.47.69-.64 1.49-.96 2.4-.96h12.77c1.37 0 2.4.37 3.09 1.1.69.73 1.17 1.28 1.44 1.65l25.27 46.55 25.54-46.55c.18-.36.62-.91 1.3-1.65.69-.73 1.72-1.1 3.09-1.1h12.77c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v89.25c0 1.01-.32 1.83-.96 2.47s-1.47.96-2.47.96h-14.01c-.92 0-1.69-.32-2.33-.96-.64-.64-.96-1.46-.96-2.47v-55.48l-17.44 32.68c-.46.82-1.05 1.56-1.79 2.2-.73.64-1.69.96-2.88.96h-6.45c-1.19 0-2.15-.32-2.88-.96a8.203 8.203 0 01-1.79-2.2l-17.44-32.68v55.48c0 1.01-.32 1.83-.96 2.47-.64.64-1.42.96-2.33.96h-14.01zM784.28 327c-8.33 0-15.52-1.37-21.56-4.12-6.04-2.75-10.76-6.89-14.14-12.43-3.39-5.54-5.22-12.52-5.49-20.94-.09-3.94-.14-7.85-.14-11.74s.04-7.85.14-11.88c.27-8.24 2.13-15.17 5.56-20.8 3.43-5.63 8.19-9.86 14.28-12.7s13.2-4.26 21.35-4.26 15.13 1.42 21.21 4.26c6.09 2.84 10.87 7.07 14.35 12.7 3.48 5.63 5.31 12.56 5.49 20.8.18 4.03.28 7.99.28 11.88s-.09 7.81-.28 11.74c-.27 8.42-2.11 15.4-5.49 20.94-3.39 5.54-8.1 9.68-14.14 12.43-6.04 2.75-13.18 4.12-21.42 4.12zm0-17.71c5.31 0 9.68-1.62 13.11-4.88 3.43-3.25 5.24-8.44 5.42-15.58.18-4.03.27-7.8.27-11.33s-.09-7.25-.27-11.19c-.09-4.76-.96-8.65-2.61-11.67-1.65-3.02-3.82-5.24-6.52-6.66-2.7-1.42-5.84-2.13-9.41-2.13s-6.73.71-9.47 2.13c-2.75 1.42-4.92 3.64-6.52 6.66-1.6 3.02-2.5 6.91-2.68 11.67-.09 3.94-.14 7.67-.14 11.19s.04 7.3.14 11.33c.27 7.14 2.1 12.34 5.49 15.58 3.39 3.25 7.78 4.88 13.18 4.88zm72.41 16.34c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h34.47c9.15 0 16.8 1.44 22.93 4.33 6.13 2.88 10.82 7.1 14.07 12.63 3.25 5.54 4.96 12.38 5.15 20.53.09 4.03.14 7.55.14 10.57s-.05 6.5-.14 10.44c-.27 8.51-1.97 15.56-5.08 21.15-3.11 5.58-7.69 9.73-13.73 12.43-6.04 2.7-13.59 4.05-22.66 4.05h-35.15zm18.4-17.71h16.07c4.58 0 8.33-.69 11.26-2.06 2.93-1.37 5.1-3.55 6.52-6.52 1.42-2.97 2.17-6.84 2.27-11.6.09-2.65.16-5.03.21-7.14.04-2.1.04-4.21 0-6.32-.05-2.1-.12-4.44-.21-7-.18-6.87-1.95-11.92-5.29-15.17s-8.49-4.87-15.45-4.87h-15.38v60.69zm89.58 17.71c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h15.52c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v89.25c0 1.01-.32 1.83-.96 2.47-.64.64-1.46.96-2.47.96h-15.52zm53.33 0c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h61.24c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v11.67c0 1.01-.32 1.83-.96 2.47-.64.64-1.47.96-2.47.96h-43.25v23.21h40.51c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v11.67c0 .92-.32 1.69-.96 2.33-.64.64-1.46.96-2.47.96h-40.51v32.54c0 1.01-.32 1.83-.96 2.47-.64.64-1.46.96-2.47.96H1018zm94.25 0c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h15.52c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v89.25c0 1.01-.32 1.83-.96 2.47-.64.64-1.46.96-2.47.96h-15.52zm53.32 0c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h62.2c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v10.99c0 .92-.32 1.69-.96 2.33-.64.64-1.47.96-2.47.96h-44.49v21.56h41.47c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v10.16c0 .92-.32 1.7-.96 2.33-.64.64-1.47.96-2.47.96h-41.47v22.25h45.59c1.01 0 1.83.32 2.47.96.64.64.96 1.47.96 2.47v10.85c0 1.01-.32 1.83-.96 2.47-.64.64-1.47.96-2.47.96h-63.3zm97.13 0c-1.01 0-1.83-.32-2.47-.96-.64-.64-.96-1.46-.96-2.47v-89.25c0-1.01.32-1.83.96-2.47.64-.64 1.46-.96 2.47-.96h34.47c9.15 0 16.8 1.44 22.93 4.33 6.13 2.88 10.82 7.1 14.07 12.63 3.25 5.54 4.96 12.38 5.15 20.53.09 4.03.14 7.55.14 10.57s-.05 6.5-.14 10.44c-.27 8.51-1.97 15.56-5.08 21.15-3.11 5.58-7.69 9.73-13.73 12.43-6.04 2.7-13.59 4.05-22.66 4.05h-35.15zm18.4-17.71h16.07c4.58 0 8.33-.69 11.26-2.06 2.93-1.37 5.1-3.55 6.52-6.52 1.42-2.97 2.17-6.84 2.27-11.6.09-2.65.16-5.03.21-7.14.04-2.1.04-4.21 0-6.32-.05-2.1-.12-4.44-.21-7-.18-6.87-1.95-11.92-5.29-15.17s-8.49-4.87-15.45-4.87h-15.38v60.69zM349.9 341c-.98 0-1.87-.4-2.66-1.19-.8-.8-1.19-1.68-1.19-2.66 0-.61.06-1.16.18-1.65l43.18-117.96c.37-1.35 1.13-2.54 2.3-3.58 1.16-1.04 2.78-1.56 4.87-1.56h27.19c2.08 0 3.7.52 4.87 1.56 1.16 1.04 1.93 2.24 2.3 3.58l42.99 117.96c.24.49.37 1.04.37 1.65 0 .98-.4 1.87-1.19 2.66-.8.8-1.75 1.19-2.85 1.19h-22.6c-1.84 0-3.22-.46-4.13-1.38s-1.5-1.75-1.75-2.48l-7.17-18.74h-49.06l-6.98 18.74c-.25.73-.8 1.56-1.65 2.48-.86.92-2.33 1.38-4.41 1.38h-22.6zm43.18-49.06h34.18l-17.27-48.51-16.9 48.51zM493.39 341c-1.35 0-2.45-.43-3.31-1.29-.86-.86-1.29-1.96-1.29-3.31V216.97c0-1.35.43-2.45 1.29-3.31s1.96-1.29 3.31-1.29h24.62c1.35 0 2.45.43 3.31 1.29.86.86 1.29 1.96 1.29 3.31V336.4c0 1.35-.43 2.45-1.29 3.31s-1.96 1.29-3.31 1.29h-24.62z",
  fill: "var(--ai-indicator-letter-color, #fff)"
})));

var styles$4 = {"icon":"AiIndicatorIcon-module_icon__1g9xt"};

const icons = {
  ai,
  ai_generated: aiGenerated,
  ai_modified: aiModified
};

/**
 * Render one of the EU icons for labelling AI generated content.
 *
 * @param {Object} props
 * @param {string} props.kind - Either: ai, ai_generated, ai_modified.
 * @param {string} [props.className]
 */
function AiIndicatorIcon({
  kind,
  className
}) {
  const aiIndicatorLabel = useAiIndicatorLabel();
  const Icon = icons[kind];
  if (!Icon) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Icon, {
    className: classNames(styles$4.icon, className),
    role: "img",
    "aria-label": aiIndicatorLabel(kind)
  });
}
function useAiIndicatorLabel() {
  const {
    t
  } = useI18n();
  return kind => t(kind, {
    scope: 'pageflow_scrolled.public.ai_indicators'
  });
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

const Widget = extensible('Widget', function Widget({
  role,
  props,
  children,
  renderFallback
}) {
  const widget = useWidget({
    role
  });
  if (!widget) {
    return renderFallback ? renderFallback({
      ...props,
      children
    }) : null;
  }
  const Component = api.widgetTypes.getComponent(widget.typeName);
  return /*#__PURE__*/React.createElement(Component, Object.assign({
    configuration: widget.configuration
  }, props, {
    children: children
  }));
});

var styles$5 = {"list":"InlineFileRights-module_list__2OuO5","aiIcon":"InlineFileRights-module_aiIcon__2QpAh"};

function InlineFileRights({
  items = [],
  context = 'standAlone',
  position,
  playerControlsFadedOut,
  playerControlsStandAlone,
  configuration = {}
}) {
  const filteredItems = items.filter(item => item.file && (hasRights(item.file) || hasAiIndicator(item.file)));
  if (!filteredItems.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Widget, {
    role: "inlineFileRights",
    props: {
      context,
      position,
      playerControlsFadedOut,
      playerControlsStandAlone,
      configuration,
      hasRights: filteredItems.some(({
        file
      }) => hasRights(file)),
      hasAiIndicators: filteredItems.some(({
        file
      }) => hasAiIndicator(file))
    }
  }, /*#__PURE__*/React.createElement("ul", {
    className: styles$5.list
  }, filteredItems.map(({
    label,
    file
  }) => /*#__PURE__*/React.createElement(Item, {
    key: `${label}-${file.id}`,
    label: label,
    file: file
  }))));
}
function Item({
  label,
  file
}) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("li", {
    "data-rights": hasRights(file) ? '' : undefined
  }, (label || hasRights(file)) && /*#__PURE__*/React.createElement("span", {
    "data-part": "rights"
  }, label && /*#__PURE__*/React.createElement("span", {
    "data-label": true
  }, t(label, {
    scope: 'pageflow_scrolled.public.inline_file_rights_labels'
  }), ": "), hasRights(file) && renderRights(file), hasRights(file) && renderLicense(file)), hasAiIndicator(file) && ' ', renderAiIndicator(file));
}
function hasRights(file) {
  return file.inlineRights && !isBlank(file.rights);
}
function hasAiIndicator(file) {
  return !!file.configuration.ai_indicator;
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
function renderAiIndicator(file) {
  if (!hasAiIndicator(file)) {
    return null;
  }
  return /*#__PURE__*/React.createElement("span", {
    "data-part": "ai-indicator"
  }, /*#__PURE__*/React.createElement(AiIndicatorIcon, {
    kind: file.configuration.ai_indicator,
    className: styles$5.aiIcon
  }), !isBlank(file.configuration.ai_indicator_text) && ` ${file.configuration.ai_indicator_text}`);
}

var styles$6 = {"fade-duration":"0.5s","wrapper":"SectionInlineFileRights-module_wrapper__1l6rr","fade":"SectionInlineFileRights-module_fade__1Snfk","inactive":"SectionInlineFileRights-module_inactive__1VpQh"};

function SectionInlineFileRights({
  section,
  state,
  backdrop,
  atmoAudioFile
}) {
  var _section$nextSection, _section$nextSection$;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.wrapper, {
      [styles$6.fade]: (_section$nextSection = section.nextSection) === null || _section$nextSection === void 0 ? void 0 : (_section$nextSection$ = _section$nextSection.transition) === null || _section$nextSection$ === void 0 ? void 0 : _section$nextSection$.startsWith('fade'),
      [styles$6.inactive]: state !== 'active'
    })
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

var breakpoints = {"breakpoint-sm":"(min-width: 640px)","breakpoint-md":"(min-width: 768px)","breakpoint-lg":"(min-width: 1024px)","breakpoint-xl":"(min-width: 1280px)","breakpoint-below-sm":"(max-width: 639px)","breakpoint-below-md":"(max-width: 767px)","breakpoint-below-lg":"(max-width: 1023px)","breakpoint-below-xl":"(max-width: 1279px)"};

const PhoneLayoutContext = createContext(false);
function PhoneLayoutProvider({
  children
}) {
  const phoneLayout = useMediaQuery(breakpoints['breakpoint-below-sm']);
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

const SectionViewTimelineContext = React.createContext();
function SectionViewTimelineProvider({
  backdrop,
  children
}) {
  var _backdrop$effects;
  const [timeline, setTimeline] = useState();
  const ref = useRef();
  const isNeeded = backdrop === null || backdrop === void 0 ? void 0 : (_backdrop$effects = backdrop.effects) === null || _backdrop$effects === void 0 ? void 0 : _backdrop$effects.some(effect => effect.name === 'scrollParallax');
  useEffect(() => {
    if (!isNeeded || !window.ViewTimeline || prefersReducedMotion()) {
      return;
    }
    setTimeline(new window.ViewTimeline({
      subject: ref.current
    }));
    return () => setTimeline(null);
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

const SelectableWidget = extensible('SelectableWidget', Widget);

function useSectionPadding(section, {
  portrait
} = {}) {
  const usePortraitPaddings = section.customPortraitPaddings !== false && portrait;
  const paddingTop = usePortraitPaddings && section.portraitPaddingTop ? section.portraitPaddingTop : section.paddingTop;
  const paddingBottom = usePortraitPaddings && section.portraitPaddingBottom ? section.portraitPaddingBottom : section.paddingBottom;
  const styles = {};
  if (paddingTop) {
    styles['--foreground-padding-top'] = `var(--theme-section-padding-top-${paddingTop})`;
  }
  if (paddingBottom) {
    styles['--foreground-padding-bottom'] = `var(--theme-section-padding-bottom-${paddingBottom})`;
  }
  return {
    styles,
    paddingTop,
    paddingBottom
  };
}

var styles$7 = {"probe":"SectionIntersectionObserver-module_probe__1_1UM"};

const SectionIntersectionObserverContext = createContext([]);
function SectionIntersectionObserver({
  sections,
  probeClassName,
  onChange,
  children
}) {
  const sectionsByIdRef = useRef();
  const callbackRef = useRef();
  const [observer, setObserver] = useState(null);
  useEffect(() => {
    sectionsByIdRef.current = sections.reduce((result, section) => {
      result[section.id] = section;
      return result;
    }, {});
  }, [sections]);
  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    let visibleSection = null;
    const newObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const section = sectionsByIdRef.current[entry.target.dataset.id];
        if (entry.isIntersecting) {
          visibleSection = section;
          callbackRef.current(visibleSection);
        } else if (visibleSection === section) {
          visibleSection = null;
          callbackRef.current(visibleSection);
        }
      });
    }, {
      rootMargin: '0px 0px -100% 0px'
    });
    setObserver(newObserver);
    return () => newObserver.disconnect();
  }, [sections]);
  const previousContextValue = useContext(SectionIntersectionObserverContext);
  const contextValue = useMemo(() => [...previousContextValue, {
    observer,
    probeClassName
  }], [previousContextValue, observer, probeClassName]);
  return /*#__PURE__*/React.createElement(SectionIntersectionObserverContext.Provider, {
    value: contextValue
  }, children);
}
function SectionIntersectionProbe({
  section
}) {
  const isStaticPreview = useIsStaticPreview();
  const observers = useContext(SectionIntersectionObserverContext);
  const probeRefs = useRef([]);
  useEffect(() => {
    if (isStaticPreview) {
      return;
    }
    const elements = probeRefs.current.slice();
    observers.forEach(({
      observer
    }, index) => {
      if (observer && elements[index]) {
        observer.observe(elements[index]);
      }
    });
    return () => {
      observers.forEach(({
        observer
      }, index) => {
        if (observer && elements[index]) {
          observer.unobserve(elements[index]);
        }
      });
    };
  }, [observers, isStaticPreview]);
  return observers.map(({
    probeClassName
  }, index) => /*#__PURE__*/React.createElement("div", {
    ref: el => probeRefs.current[index] = el,
    key: index,
    className: classNames(styles$7.probe, probeClassName),
    "data-id": section.id
  }));
}

function NoOpShadow(props) {
  return /*#__PURE__*/React.createElement("div", null, props.children);
}

var styles$8 = {"root":"Fullscreen-module_root__1N3CI"};

const DimensionContext = React.createContext({});
function useFullscreenDimensions() {
  return useContext(DimensionContext);
}
function FullscreenDimensionProvider({
  width,
  height,
  children
}) {
  const value = useMemo(() => ({
    width,
    height
  }), [width, height]);
  return /*#__PURE__*/React.createElement(DimensionContext.Provider, {
    value: value
  }, children);
}
var Fullscreen = React.forwardRef(function Fullscreen(props, ref) {
  const {
    height
  } = useFullscreenDimensions();
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$8.root,
    style: {
      height
    }
  }, props.children);
});

var styles$9 = {"static":"GradientShadow-module_static__rXNpZ","dynamic":"GradientShadow-module_dynamic__2v2JU","align-right":"GradientShadow-module_align-right__3iXZs","dark":"GradientShadow-module_dark__1YuV5","align-left":"GradientShadow-module_align-left__3qcNM","align-center":"GradientShadow-module_align-center__2C7cl","align-centerRagged":"GradientShadow-module_align-centerRagged__2-iv8","light":"GradientShadow-module_light__Vn92v","shadow":"GradientShadow-module_shadow__2UiDH"};

function GradientShadow(props) {
  // Hide static shadow if motif area intersects with content area.
  const staticShadowOpacity = props.motifAreaState.isContentPadded ? 0 : props.staticShadowOpacity;

  // If motif area intersects with content area horizontally, fade in
  // shadow soon as the content has been scrolled far enough to start
  // intersecting with the motif area vertically.
  const opacityFactor =
  // Make shadow reach full opacity when content has been scrolled
  // up half way across the motif area.
  roundToFirstDecimalPlace(Math.min(1, props.motifAreaState.intersectionRatioY * 2));
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$9[`align-${props.align}`], props.inverted ? styles$9.light : styles$9.dark),
    style: props.overlayStyle
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$9.dynamic,
    style: {
      opacity: props.dynamicShadowOpacity * opacityFactor
    }
  }, /*#__PURE__*/React.createElement(Fullscreen, null)), /*#__PURE__*/React.createElement("div", {
    className: styles$9.static,
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

var styles$a = {"wrapper":"SplitShadow-module_wrapper__2yZUo","overlay":"SplitShadow-module_overlay__1LVuY","align-left":"SplitShadow-module_align-left__22AzL","align-right":"SplitShadow-module_align-right__F-YIn","align-center":"SplitShadow-module_align-center__3PKJV","align-centerRagged":"SplitShadow-module_align-centerRagged__3YTll","dark":"SplitShadow-module_dark__3BOPU","light":"SplitShadow-module_light__jF6Hb"};

function SplitShadow(props) {
  if (props.motifAreaState.isContentPadded) {
    return /*#__PURE__*/React.createElement("div", null, props.children);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$a.wrapper, styles$a[`align-${props.align}`], props.inverted ? styles$a.light : styles$a.dark)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$a.overlay,
    style: props.overlayStyle
  }, /*#__PURE__*/React.createElement(Fullscreen, null)), props.children);
}

var styles$b = {"start":"InvisibleBoxWrapper-module_start__F1nZ7","end":"InvisibleBoxWrapper-module_end__nphD-"};

var boundaryMarginStyles = {"noTopMargin":"BoxBoundaryMargin-module_noTopMargin__2jB2d","noBottomMargin":"BoxBoundaryMargin-module_noBottomMargin__22VC_"};

function InvisibleBoxWrapper({
  position,
  width,
  openStart,
  openEnd,
  atSectionStart,
  atSectionEnd,
  children
}) {
  const full = width === widths.full;
  return /*#__PURE__*/React.createElement(TrimDefaultMarginTop, {
    value: atSectionStart
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles$b.start]: !openStart && !full,
      [styles$b.end]: !openEnd && !full,
      [boundaryMarginStyles.noTopMargin]: atSectionStart,
      [boundaryMarginStyles.noBottomMargin]: atSectionEnd
    })
  }, children));
}

var styles$c = {"wrapper":"GradientBox-module_wrapper__1Jj7N","content":"GradientBox-module_content__96lDk","shadow":"GradientBox-module_shadow__2XilX","gradient":"GradientBox-module_gradient__31tJ-","long":"GradientBox-module_long__10s6v","root":"GradientBox-module_root__8Xn9W","withShadow":"GradientBox-module_withShadow__3mhPR","shadowDark":"GradientBox-module_shadowDark__3Tv0L","shadowLight":"GradientBox-module_shadowLight__Bieg6"};

function GradientBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$c.root, {
      [styles$c.gradient]: props.motifAreaState.isContentPadded,
      [styles$c.long]: props.coverInvisibleNextSection
    }),
    style: {
      ...props.overlayStyle,
      paddingTop: props.motifAreaState.paddingTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$c.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$c.shadow, props.inverted ? styles$c.shadowLight : styles$c.shadowDark, props.transitionStyles.boxShadow, props.transitionStyles[`boxShadow-${props.state}`]),
    style: {
      top: props.motifAreaState.paddingTop,
      opacity: props.staticShadowOpacity
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$c.content
  }, props.children)));
}

var styles$d = {"content":"CardBox-module_content__36v7J","wrapper":"CardBox-module_wrapper__3vnaH"};

function CardBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$d.wrapper,
    style: {
      paddingTop: props.motifAreaState.paddingTop
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$d.content
  }, props.children));
}

var styles$e = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","card":"CardBoxWrapper-module_card__hvRUa scope-cardsAppearance","cardContent":"CardBoxWrapper-module_cardContent__39rPo","cardBg":"CardBoxWrapper-module_cardBg__154o2","cardStart":"CardBoxWrapper-module_cardStart__2NywG","cardEnd":"CardBoxWrapper-module_cardEnd__x4Ye6","cardEndPadding":"CardBoxWrapper-module_cardEndPadding__3oLd8","cardBgWhite":"CardBoxWrapper-module_cardBgWhite__xXhg7 scope-darkContent","cardBgBlack":"CardBoxWrapper-module_cardBgBlack__Ahp3s scope-lightContent"};

function CardBoxWrapper(props) {
  if (outsideBox(props)) {
    return /*#__PURE__*/React.createElement(TrimDefaultMarginTop, {
      value: props.atSectionStart
    }, /*#__PURE__*/React.createElement("div", {
      className: props.transitionStyles.foregroundOpacity
    }, props.children));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className$1(props)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$e.cardBg, props.transitionStyles.foregroundOpacity),
    style: props.overlayStyle
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$e.cardContent, props.transitionStyles.foregroundOpacity)
  }, /*#__PURE__*/React.createElement(BackgroundColorProvider, {
    invert: true
  }, props.children)));
}
function outsideBox(props) {
  return props.position === 'sticky' || props.position === 'inline' && props.width > widths.md || props.customMargin;
}
function className$1(props) {
  return classNames(styles$e.card, props.inverted ? styles$e.cardBgBlack : styles$e.cardBgWhite, {
    [styles$e.cardStart]: !props.openStart
  }, {
    [styles$e.cardEnd]: !props.openEnd
  }, {
    [styles$e.cardEndPadding]: !props.openEnd && !props.lastMarginBottom
  }, {
    [boundaryMarginStyles.noTopMargin]: props.atSectionStart
  }, {
    [boundaryMarginStyles.noBottomMargin]: props.atSectionEnd
  });
}

var styles$f = {"wrapper":"SplitBox-module_wrapper__36ofK","content":"SplitBox-module_content__2jasQ","overlay":"SplitBox-module_overlay__1XXB3","overlayDark":"SplitBox-module_overlayDark__hTqkR SplitBox-module_overlay__1XXB3","overlayLight":"SplitBox-module_overlayLight__3nAl1 SplitBox-module_overlay__1XXB3","long":"SplitBox-module_long__Zw0dc"};

function SplitBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$f.wrapper,
    style: {
      paddingTop: props.motifAreaState.paddingTop
    }
  }, props.motifAreaState.isContentPadded && /*#__PURE__*/React.createElement("div", {
    className: classNames(props.inverted ? styles$f.overlayLight : styles$f.overlayDark, props.transitionStyles.foregroundOpacity, {
      [styles$f.long]: props.coverInvisibleNextSection
    }, props.transitionStyles.boxShadow, props.transitionStyles[`boxShadow-${props.state}`]),
    style: {
      top: props.motifAreaState.paddingTop,
      ...props.overlayStyle
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$f.content, props.transitionStyles.foregroundOpacity)
  }, props.children));
}

function isTranslucentColor(color) {
  return !!color && color.length > 7 && color.slice(-2).toLowerCase() !== 'ff';
}

function useAppearanceOverlayStyle(section) {
  const {
    appearance,
    cardSurfaceColor,
    splitOverlayColor,
    shadowColor,
    overlayBackdropBlur
  } = section;
  return useMemo(() => {
    if (appearance === 'cards') {
      return overlayStyle(cardSurfaceColor, overlayBackdropBlur);
    } else if (appearance === 'split') {
      return overlayStyle(splitOverlayColor, overlayBackdropBlur, true);
    } else if (!appearance || appearance === 'shadow') {
      return shadowColor ? {
        '--shadow-color': shadowColor
      } : {};
    }
    return {};
  }, [appearance, cardSurfaceColor, splitOverlayColor, shadowColor, overlayBackdropBlur]);
}
function overlayStyle(color, backdropBlur, blurByDefault) {
  const style = {};
  if (color) {
    style.backgroundColor = color;
  }
  const blur = resolvedBackdropBlur(color, backdropBlur, blurByDefault);
  if (blur > 0) {
    style.backdropFilter = `blur(${blur / 100 * 10}px)`;
  }
  return style;
}
function resolvedBackdropBlur(color, backdropBlur, blurByDefault) {
  if (blurByDefault) {
    if (color && !isTranslucentColor(color)) {
      return 0;
    }
  } else if (!isTranslucentColor(color)) {
    return 0;
  }
  return backdropBlur !== null && backdropBlur !== void 0 ? backdropBlur : 100;
}

const components = {
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
  },
  split: {
    Shadow: SplitShadow,
    Box: SplitBox,
    BoxWrapper: InvisibleBoxWrapper
  }
};
const sectionScopeNames = {
  shadow: 'shadowAppearanceSection',
  transparent: 'transparentAppearanceSection',
  cards: 'cardsAppearanceSection',
  split: 'splitAppearanceSection'
};
function getAppearanceComponents(appearance) {
  return components[appearance || 'shadow'];
}
function getAppearanceSectionScopeName(appearance) {
  return sectionScopeNames[appearance || 'shadow'];
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
  const [componentSize, setComponentSize] = useState(getSize(null));
  const [currentNode, setCurrentNode] = useState(null);
  const measuredRef = useCallback(node => {
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

var styles$g = {"FillColor":"FillColor-module_FillColor__S1uEG"};

function FillColor(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$g.FillColor,
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
function useBackgroundFile({
  file,
  motifArea,
  containerDimension,
  effects
}) {
  if (!file) {
    return null;
  }

  // Calculate scale factor required to make the file cover the container:

  const originalRatio = file.width / file.height;
  const containerRatio = containerDimension.width / containerDimension.height;
  const scale = containerRatio > originalRatio ? containerDimension.width / file.width : containerDimension.height / file.height;

  // Calculate the pixel size the image will have inside the container:

  const displayFileWidth = file.width * scale;
  const displayFileHeight = file.height * scale;

  // Calculate the pixel position of the center of the motif area in
  // the scaled image:

  const motifCenterX = motifArea ? motifArea.left + motifArea.width / 2 : 50;
  const motifCenterY = motifArea ? motifArea.top + motifArea.height / 2 : 50;
  const displayMotifCenterX = motifCenterX * displayFileWidth / 100;
  const displayMotifCenterY = motifCenterY * displayFileHeight / 100;

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

  const Ax = containerDimension.width / 2;
  const Ay = containerDimension.height / 2;
  const Bx = displayFileWidth - containerDimension.width / 2;
  const By = displayFileHeight - containerDimension.height / 2;
  const cropPosition = {
    x: Bx - Ax > 0 ? Math.min(100, Math.max(0, (displayMotifCenterX - Ax) / (Bx - Ax) * 100)) : 50,
    y: By - Ay > 0 ? Math.min(100, Math.max(0, (displayMotifCenterY - Ay) / (By - Ay) * 100)) : 50
  };

  // Calculate the amount of pixels the image will be shifted
  // when the crop position is applied:

  const cropLeft = (displayFileWidth - containerDimension.width) * cropPosition.x / 100;
  const cropTop = (displayFileHeight - containerDimension.height) * cropPosition.y / 100;

  // Calculate the pixel position and dimension of the motif area
  // relative to the container assuming the crop position has been
  // applied:

  const motifAreaOffsetRect = motifArea && {
    top: Math.round(displayFileHeight * motifArea.top / 100 - cropTop),
    left: Math.round(displayFileWidth * motifArea.left / 100 - cropLeft),
    width: Math.round(displayFileWidth * motifArea.width / 100),
    height: Math.round(displayFileHeight * motifArea.height / 100)
  };
  return {
    ...file,
    cropPosition,
    motifArea,
    motifAreaOffsetRect,
    effects
  };
}

function useVideoQualitySetting() {
  const [value, setValue] = useSetting('videoQuality');
  return [value || 'auto', setValue];
}

browser.feature('dash', () => true);
browser.feature('video', () => true);
browser.feature('highdef', () => true);
function sources(videoFile, {
  quality = 'auto',
  adaptiveMinQuality
} = {}) {
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
    let result = [{
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
  const key = adaptiveMinQuality ? `${format}-playlist-${adaptiveMinQuality}-and-up` : `${format}-playlist`;
  const result = videoFile.urls[key];
  if (!result && adaptiveMinQuality) {
    return getPlaylistSrc(videoFile, format);
  }
  return result;
}

function VideoStructuredData({
  file
}) {
  const entryMedadata = useEntryMetadata();
  const data = {
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
function VideoPlayer({
  videoFile,
  posterImageFile,
  adaptiveMinQuality,
  ...props
}) {
  const [activeQuality] = useVideoQualitySetting();
  const textTracks = useTextTracks({
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
        adaptiveMinQuality
      }),
      textTracksInset: true,
      posterImageUrl: posterImageFile && posterImageFile.isReady ? posterImageFile.urls.large : videoFile.urls.posterLarge,
      altText: videoFile.configuration.alt,
      objectPosition: props.fit === 'cover' ? videoFile.cropPosition : undefined,
      mediaEventsContextData: {
        fileDisplayName: videoFile.displayName
      }
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

var styles$h = {"root":"MotifArea-module_root__1_ACd","visible":"MotifArea-module_visible__18Kln","corner":"MotifArea-module_corner__3hB5t","topLeft":"MotifArea-module_topLeft__3vHHi","topRight":"MotifArea-module_topRight__2gNmC","bottomLeft":"MotifArea-module_bottomLeft__2qEqb","bottomRight":"MotifArea-module_bottomRight__3OjTb"};

const MotifAreaVisibilityContext = React.createContext(false);
function MotifAreaVisibilityProvider({
  visible,
  children
}) {
  return /*#__PURE__*/React.createElement(MotifAreaVisibilityContext.Provider, {
    value: visible
  }, children);
}

const MotifArea = function MotifArea(props) {
  var _props$file;
  const lastPosition = useRef();
  const position = ((_props$file = props.file) === null || _props$file === void 0 ? void 0 : _props$file.isReady) && getPosition(props);
  const visible = useContext(MotifAreaVisibilityContext);
  const elementRef = useRef();
  const onUpdate = props.onUpdate;
  const setElementRef = useCallback(element => {
    elementRef.current = element;
    onUpdate(element);
  }, [elementRef, onUpdate]);
  useEffect(() => {
    if (lastPosition.current && position && (lastPosition.current.top !== position.top || lastPosition.current.left !== position.left || lastPosition.current.width !== position.width || lastPosition.current.height !== position.height)) {
      onUpdate(elementRef.current);
    }
    lastPosition.current = position;
  });
  if (!position) {
    return null;
  }
  const hasMotifArea = !!props.file.motifAreaOffsetRect;
  return /*#__PURE__*/React.createElement("div", {
    ref: setElementRef,
    className: classNames(styles$h.root, {
      [styles$h.visible]: visible && hasMotifArea
    }),
    style: position,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.corner, styles$h.topLeft)
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.corner, styles$h.topRight)
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.corner, styles$h.bottomLeft)
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.corner, styles$h.bottomRight)
  }));
};
MotifArea.defaultProps = {
  onUpdate: () => {}
};
function getPosition(props) {
  return props.file.motifAreaOffsetRect || {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  };
}

var styles$i = {"effects":"Effects-module_effects__14Z24","autoZoom":"Effects-module_autoZoom__9JEWM"};

function Effects({
  file,
  children
}) {
  const ref = useRef();
  const sectionViewTimeline = useSectionViewTimeline();
  const isStaticPreview = useIsStaticPreview();
  const {
    isVisible
  } = useSectionLifecycle();
  const scrollParallaxValue = getEffectValue(file, 'scrollParallax');
  const autoZoomValue = getEffectValue(file, 'autoZoom');
  const [autoZoomRunning, setAutoZoomRunning] = useState(false);
  useIsomorphicLayoutEffect(() => {
    if (scrollParallaxValue && !isStaticPreview && sectionViewTimeline) {
      const max = 20 * scrollParallaxValue / 100;
      const scale = 100 + 2 * max;
      const animation = ref.current.animate({
        transform: [`translateY(${max}%) scale(${scale}%)`, `translateY(${-max}%) scale(${scale}%)`]
      }, {
        fill: 'forwards',
        timeline: sectionViewTimeline,
        rangeStart: 'cover 0%',
        composite: 'add',
        rangeEnd: 'cover 100%'
      });
      return () => animation.cancel();
    }
  }, [sectionViewTimeline, scrollParallaxValue, isStaticPreview]);
  useIsomorphicLayoutEffect(() => {
    setAutoZoomRunning(autoZoomValue && isVisible && !prefersReducedMotion());
  }, [autoZoomValue, isVisible]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classNames(styles$i.effects, {
      [styles$i.autoZoom]: autoZoomRunning
    }),
    style: {
      filter: getFilter((file === null || file === void 0 ? void 0 : file.effects) || []),
      ...getAutoZoomProperties(autoZoomValue, file)
    }
  }, children);
}
function getFilter(effects) {
  const components = effects.map(effect => {
    if (effect.name === 'blur') {
      return `blur(${effect.value / 100 * 10}px)`;
    } else if (['brightness', 'contrast', 'saturate'].includes(effect.name)) {
      const value = Math.round(effect.value < 0 ? 100 + effect.value * 0.6 : 100 + effect.value);
      return `${effect.name}(${value}%)`;
    } else if (['grayscale', 'sepia'].includes(effect.name)) {
      return `${effect.name}(${effect.value}%)`;
    }
    return null;
  }).filter(Boolean);
  return components.length ? components.join(' ') : null;
}
function getAutoZoomProperties(autoZoomValue, file) {
  if (!autoZoomValue) {
    return null;
  }
  const x = (file === null || file === void 0 ? void 0 : file.motifArea) ? 50 - (file.motifArea.left + file.motifArea.width / 2) : 0;
  const y = (file === null || file === void 0 ? void 0 : file.motifArea) ? 50 - (file.motifArea.top + file.motifArea.height / 2) : 0;
  return {
    '--auto-zoom-origin-x': `${x}%`,
    '--auto-zoom-origin-y': `${y}%`,
    '--auto-zoom-duration': `${1000 * (autoZoomValue / 100) + 40000 * (1 - autoZoomValue / 100)}ms`
  };
}

function BackgroundVideo({
  video,
  onMotifAreaUpdate,
  containerDimension
}) {
  const [playerState, playerActions] = usePlayerState();
  const {
    shouldLoad,
    shouldPrepare
  } = useSectionLifecycle({
    onVisible() {
      playerActions.changeVolumeFactor(0, 0);
      playerActions.play();
    },
    onActivate() {
      playerActions.changeVolumeFactor(1, 1000);
    },
    onDeactivate() {
      playerActions.changeVolumeFactor(0, 1000);
    },
    onInvisible() {
      playerActions.pause();
    }
  });
  useEffect(() => {
    let documentState = documentHiddenState(visibilityState => {
      if (visibilityState === 'hidden') {
        playerActions.pause();
      } else {
        playerActions.play();
      }
    });
    return () => {
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

var styles$j = {"fill":"Image-module_fill__1D1wH","contain":"Image-module_contain__3_XWB"};

function ImageStructuredData({
  file
}) {
  const entryMedadata = useEntryMetadata();
  const data = {
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

/**
 * Render an image file.
 *
 * @param {Object} props
 * @param {Object} props.imageFile - Image file obtained via `useFile`.
 * @param {string|string[]} [props.variant] - Paperclip style to use. Defaults to
 *   large. Pass an array (e.g. `['large', 'ultra']`) to emit a `srcset` with
 *   width descriptors. The first entry is used as `src` fallback.
 * @param {string} [props.sizes] - Sizes attribute for srcset. Defaults to `"100vw"`.
 * @param {boolean} [props.load] - Whether to load the image. Can be used for lazy loading.
 * @param {boolean} [props.structuredData] - Whether to render a JSON+LD script tag.
 * @param {boolean} [props.preferSvg] - Use original if image is SVG.
 * @param {boolean} [props.fill=true] - Position absolute and fill parent.
 * @param {boolean} [props.fit=cover] - `"contain"` or `"cover"`.
 */
function Image({
  imageFile,
  ...props
}) {
  if (imageFile && imageFile.isReady && props.load) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, renderImageTag(props, imageFile), renderStructuredData(props, imageFile));
  }
  return null;
}
function renderImageTag(props, imageFile) {
  const cropPositionX = imageFile.cropPosition ? imageFile.cropPosition.x : 50;
  const cropPositionY = imageFile.cropPosition ? imageFile.cropPosition.y : 50;
  return /*#__PURE__*/React.createElement("img", {
    className: classNames({
      [styles$j.fill]: props.fill,
      [styles$j.contain]: props.fit === 'contain'
    }),
    src: imageSrc(imageFile, props),
    srcSet: imageSrcSet(imageFile, props),
    sizes: imageSizes(imageFile, props),
    alt: imageFile.configuration.alt ? imageFile.configuration.alt : '',
    width: props.width,
    height: props.height,
    style: {
      objectPosition: `${cropPositionX}% ${cropPositionY}%`
    }
  });
}
function imageSrc(imageFile, props) {
  const {
    variant
  } = props;
  if (Array.isArray(variant)) {
    return imageUrl(imageFile, {
      ...props,
      variant: variant[0]
    });
  }
  return imageUrl(imageFile, props);
}
function imageSrcSet(imageFile, {
  variant,
  preferSvg
}) {
  var _imageFile$extension;
  if (!Array.isArray(variant)) return undefined;
  if (preferSvg && ((_imageFile$extension = imageFile.extension) === null || _imageFile$extension === void 0 ? void 0 : _imageFile$extension.toLowerCase()) === 'svg') return undefined;
  if (!imageFile.variantWidths) return undefined;
  const entries = imageFile.variantWidths.filter(([, v]) => variant.includes(v) && imageFile.urls[v]).map(([w, v]) => `${imageFile.urls[v]} ${w}`);
  if (entries.length <= 1) return undefined;
  return entries.join(', ');
}
function imageSizes(imageFile, props) {
  if (imageSrcSet(imageFile, props)) {
    return props.sizes || '100vw';
  }
  return undefined;
}
function imageUrl(imageFile, {
  variant,
  preferSvg
}) {
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

function BackgroundImage({
  image,
  onMotifAreaUpdate,
  containerDimension
}) {
  const {
    shouldLoad
  } = useSectionLifecycle();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Effects, {
    file: image
  }, /*#__PURE__*/React.createElement(Image, {
    imageFile: image,
    load: shouldLoad,
    structuredData: true,
    preferSvg: true,
    variant: features.isEnabled('image_srcset') ? ['medium', 'large', 'ultra'] : 'large'
  })), /*#__PURE__*/React.createElement(MotifArea, {
    key: image === null || image === void 0 ? void 0 : image.permaId,
    onUpdate: onMotifAreaUpdate,
    file: image,
    containerWidth: containerDimension.width,
    containerHeight: containerDimension.height
  }));
}

const BackgroundContentElement = extensible('BackgroundContentElement', function BackgroundContentElement({
  contentElement,
  isIntersecting,
  onMotifAreaUpdate,
  containerDimension
}) {
  const sectionLifecycle = useSectionLifecycle();
  const lifecycleOverride = useMemo(() => ({
    ...sectionLifecycle,
    isActive: sectionLifecycle.isActive && !isIntersecting
  }), [sectionLifecycle, isIntersecting]);
  const sectionProps = useMemo(() => ({
    isIntersecting,
    containerDimension
  }), [isIntersecting, containerDimension]);
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
  const backgroundFile = useBackgroundFile({
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

var styles$k = {"Backdrop":"Backdrop-module_Backdrop__1w4UZ","noCompositionLayer":"Backdrop-module_noCompositionLayer__33IlH","coverSection":"Backdrop-module_coverSection__201GK","defaultBackground":"Backdrop-module_defaultBackground__1YQQL"};

var sharedStyles = {"fade-duration":"0.5s","fixed":"shared-module_fixed__3T2AK","justifyBottom":"shared-module_justifyBottom__22ncu","fadedOut":"shared-module_fadedOut__D8bt8","perElementFade":"shared-module_perElementFade__3MhBy","foregroundOpacity":"shared-module_foregroundOpacity__8EnGc"};

const Backdrop = extensible('Backdrop', function Backdrop(props) {
  const [containerDimension, setContainerRef] = useDimension();
  const {
    shouldLoad
  } = useSectionLifecycle();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$k.Backdrop, {
      [styles$k.noCompositionLayer]: !shouldLoad && !props.eagerLoad
    }, {
      [styles$k.coverSection]: props.size === 'coverSection'
    }, props.transitionStyles.backdrop, props.transitionStyles[`backdrop-${props.state}`])
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(props.transitionStyles.backdropInner, {
      [sharedStyles.justifyBottom]: props.backdrop.contentElement
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$k.defaultBackground, props.transitionStyles.backdropInner2)
  }, props.children( /*#__PURE__*/React.createElement(BackgroundAsset, Object.assign({}, props, {
    containerDimension: containerDimension,
    setContainerRef: setContainerRef
  }))))));
});
Backdrop.defaultProps = {
  children: children => children,
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
function useBoundingClientRect({
  updateOnScrollAndResize = true,
  dependencies = []
} = {}) {
  const [boundingClientRect, setBoundingClientRect] = useState(getBoundingClientRect(null));
  const [currentNode, setCurrentNode] = useState(null);
  const measureRef = useCallback(node => {
    setCurrentNode(node);
    setBoundingClientRect(getBoundingClientRect(node));
  }, []);
  useIsomorphicLayoutEffect(() => {
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
function useMotifAreaState({
  backdropContentElement,
  transitions,
  fullHeight,
  empty,
  exposeMotifArea,
  updateOnScrollAndResize
} = {}) {
  const [motifAreaRect, setMotifAreaRectRef] = useBoundingClientRect({
    updateOnScrollAndResize
  });
  const [motifAreaDimension, setMotifAreaDimensionRef] = useDimension();
  const [isPadded, setIsPadded] = useState(false);
  const setMotifAreaRef = useCallback(node => {
    setMotifAreaRectRef(node);
    setMotifAreaDimensionRef(node);
  }, [setMotifAreaRectRef, setMotifAreaDimensionRef]);
  const [contentAreaRect, setContentAreaRef] = useBoundingClientRect({
    updateOnScrollAndResize,
    dependencies: [isPadded]
  });
  const contentRequiresPadding = exposeMotifArea && isIntersectingX(motifAreaRect, contentAreaRect) && motifAreaRect.height > 0 && !empty;
  const paddingTop = getMotifAreaPadding(contentRequiresPadding, transitions, motifAreaDimension, backdropContentElement, empty);

  // Force measuring content area again since applying the padding
  // changes the intersection ratio.
  const willBePadded = !!paddingTop;
  useEffect(() => {
    setIsPadded(willBePadded);
  }, [willBePadded]);
  const intersectionRatioY = getIntersectionRatioY(motifAreaRect, contentAreaRect);
  return [{
    paddingTop,
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
  const motifAreaOverlap = Math.max(0, Math.min(motifAreaRect.height, motifAreaRect.bottom - contentAreaRect.top));
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

/**
 * Returns boolean indicating whether viewport orientation is currently
 * portrait.
 */
function usePortraitOrientation(options) {
  return useMediaQuery('(orientation: portrait)', options);
}

function useBackdrop(section) {
  var _section$backdrop, _section$backdrop2, _section$backdrop3;
  const videoBackdrop = useFileBackdrop({
    section,
    collectionName: 'videoFiles',
    propertyName: 'video'
  });
  const imageBackdrop = useFileBackdrop({
    section,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  const contentElement = useContentElement({
    permaId: (_section$backdrop = section.backdrop) === null || _section$backdrop === void 0 ? void 0 : _section$backdrop.contentElement,
    layout: 'backdrop'
  });
  if (contentElement && contentElement.sectionId === section.id) {
    return {
      contentElement
    };
  } else if (((_section$backdrop2 = section.backdrop) === null || _section$backdrop2 === void 0 ? void 0 : _section$backdrop2.color) || ((_section$backdrop3 = section.backdrop) === null || _section$backdrop3 === void 0 ? void 0 : _section$backdrop3.image) && section.backdrop.image.toString().startsWith('#')) {
    return {
      color: section.backdrop.color || section.backdrop.image,
      effects: section.backdropEffects
    };
  } else {
    return videoBackdrop || imageBackdrop || {};
  }
}
function useFileBackdrop({
  section,
  collectionName,
  propertyName
}) {
  const file = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName,
    propertyName
  });
  const mobileFile = useFileWithInlineRights({
    configuration: section.backdrop || {},
    collectionName,
    propertyName: `${propertyName}Mobile`
  });
  const mobile = usePortraitOrientation({
    active: file && mobileFile
  });
  if (mobileFile && (mobile || !file)) {
    return {
      [propertyName]: mobileFile,
      motifArea: section.backdrop[`${propertyName}MobileMotifArea`],
      effects: section.backdropEffectsMobile,
      portrait: true
    };
  } else if (file) {
    return {
      [propertyName]: file,
      motifArea: section.backdrop[`${propertyName}MotifArea`],
      effects: section.backdropEffects,
      portrait: false
    };
  } else {
    return null;
  }
}

var styles$l = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","Section":"Section-module_Section__Yo58b","first":"Section-module_first__1vLBH","narrow":"Section-module_narrow__3Dawu","lightContent":"Section-module_lightContent__1hqim scope-lightContent","darkContent":"Section-module_darkContent__20cnO scope-darkContent"};

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

const styles$m = {
  fadeInBgConceal,
  fadeInBgFadeOut,
  fadeInBgFadeOutBg,
  fadeInBgScrollOut,
  fadeInConceal,
  fadeInFadeOut,
  fadeInFadeOutBg,
  fadeInScrollOut,
  revealConceal,
  revealFadeOut,
  revealFadeOutBg,
  revealScrollOut,
  scrollInConceal,
  scrollInFadeOut,
  scrollInFadeOutBg,
  scrollInScrollOut
};
const enterTransitions = {
  fade: 'fadeIn',
  fadeBg: 'fadeInBg',
  scroll: 'scrollIn',
  scrollOver: 'scrollIn',
  reveal: 'reveal',
  beforeAfter: 'reveal'
};
const exitTransitions = {
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
    return getTransitionNames().filter(name => !name.startsWith('fade'));
  }
  return getTransitionNames();
}
function getTransitionStyles(section, overlayStyle) {
  const name = getTransitionStylesName(section);
  if (!styles$m[name]) {
    throw new Error(`Unknown transition ${name}`);
  }
  const base = styles$m[name];
  const [enter, exit] = getEnterAndExitTransitions(section);
  if ((overlayStyle === null || overlayStyle === void 0 ? void 0 : overlayStyle.backdropFilter) && (enter.startsWith('fade') || exit.startsWith('fade'))) {
    return {
      ...base,
      foreground: base.foreground ? `${base.foreground} ${sharedStyles.perElementFade}` : sharedStyles.perElementFade,
      foregroundOpacity: sharedStyles.foregroundOpacity
    };
  }
  return base;
}
function getEnterAndExitTransitions(section) {
  return [enterTransitions[getTransitionName(section.previousSection, section)], exitTransitions[getTransitionName(section, section.nextSection)]];
}
function getTransitionStylesName(section) {
  const [enter, exit] = getEnterAndExitTransitions(section);
  return `${enter}${capitalize(exit)}`;
}
function getTransitionName(previousSection, section) {
  if (!section) {
    var _previousSection$chap;
    if ((previousSection === null || previousSection === void 0 ? void 0 : (_previousSection$chap = previousSection.chapter) === null || _previousSection$chap === void 0 ? void 0 : _previousSection$chap.isExcursion) || !(previousSection === null || previousSection === void 0 ? void 0 : previousSection.fullHeight)) {
      return 'scroll';
    }
    return 'fadeBg';
  }
  if (!previousSection) {
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

const Section = extensible('Section', function Section({
  section,
  transitions,
  backdrop,
  contentElements,
  state,
  onActivate,
  domIdPrefix
}) {
  var _section$chapter, _section$transition;
  const ref = useScrollTarget(section.id);
  const sectionOverlayStyle = useAppearanceOverlayStyle(section);
  const transitionStyles = getTransitionStyles(section, sectionOverlayStyle);
  const atmoAudioFile = useFileWithInlineRights({
    configuration: section,
    collectionName: 'audioFiles',
    propertyName: 'atmoAudioFileId'
  });
  const sectionPadding = useSectionPadding(section, {
    portrait: backdrop.portrait
  });
  return /*#__PURE__*/React.createElement("section", {
    id: `${domIdPrefix}-${section.permaId}`,
    ref: ref,
    className: classNames(styles$l.Section, transitionStyles.section, {
      [styles$l.first]: section.sectionIndex === 0 && !((_section$chapter = section.chapter) === null || _section$chapter === void 0 ? void 0 : _section$chapter.isExcursion)
    }, {
      [styles$l.narrow]: section.width === 'narrow'
    }, `scope-${getAppearanceSectionScopeName(section.appearance)}`, section.invert ? styles$l.darkContent : styles$l.lightContent),
    style: sectionPadding.styles
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
    transitionStyles: transitionStyles,
    sectionOverlayStyle: sectionOverlayStyle,
    sectionPadding: sectionPadding
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
function SectionContents({
  section,
  backdrop,
  contentElements,
  state,
  transitions,
  transitionStyles,
  sectionOverlayStyle,
  sectionPadding
}) {
  const {
    shouldPrepare
  } = useSectionLifecycle();
  const [, exitTransition] = transitions;
  const [motifAreaState, setMotifAreaRef, setContentAreaRef] = useMotifAreaState({
    backdropContentElement: 'contentElement' in backdrop,
    updateOnScrollAndResize: shouldPrepare,
    exposeMotifArea: section.exposeMotifArea,
    transitions,
    empty: !contentElements.length,
    fullHeight: section.fullHeight
  });
  const sectionProperties = useMemo(() => ({
    layout: section.layout,
    invert: section.invert,
    sectionIndex: section.sectionIndex,
    constrainContentWidth: section.appearance === 'split' && !motifAreaState.isContentPadded
  }), [section.layout, section.invert, section.sectionIndex, section.appearance, motifAreaState.isContentPadded]);
  const {
    Shadow,
    Box,
    BoxWrapper
  } = getAppearanceComponents(section.appearance);
  const staticShadowOpacity = percentToFraction(section.staticShadowOpacity, {
    defaultValue: 0.7
  });
  const dynamicShadowOpacity = percentToFraction(section.dynamicShadowOpacity, {
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
  }, children => /*#__PURE__*/React.createElement(Shadow, {
    align: section.layout,
    inverted: section.invert,
    motifAreaState: motifAreaState,
    staticShadowOpacity: staticShadowOpacity,
    dynamicShadowOpacity: dynamicShadowOpacity,
    overlayStyle: sectionOverlayStyle
  }, children)), /*#__PURE__*/React.createElement(BackdropFrameEffect, {
    backdrop: backdrop
  }), /*#__PURE__*/React.createElement(Foreground, {
    section: section,
    transitionStyles: transitionStyles,
    state: state,
    motifAreaState: motifAreaState,
    sectionPadding: sectionPadding,
    minHeight: motifAreaState.minHeight,
    suppressedPaddings: getSuppressedPaddings(contentElements, motifAreaState),
    heightMode: heightMode(section)
  }, /*#__PURE__*/React.createElement(Box, {
    inverted: section.invert,
    coverInvisibleNextSection: exitTransition.startsWith('fade'),
    transitionStyles: transitionStyles,
    state: state,
    motifAreaState: motifAreaState,
    staticShadowOpacity: staticShadowOpacity,
    overlayStyle: sectionOverlayStyle
  }, /*#__PURE__*/React.createElement(Layout, {
    sectionId: section.id,
    items: contentElements,
    appearance: section.appearance,
    constrainContentWidth: sectionProperties.constrainContentWidth,
    contentAreaRef: setContentAreaRef,
    sectionProps: sectionProperties,
    isContentPadded: motifAreaState.isContentPadded
  }, (children, boxProps) => /*#__PURE__*/React.createElement(BoxWrapper, Object.assign({}, boxProps, {
    transitionStyles: transitionStyles,
    overlayStyle: sectionOverlayStyle,
    inverted: section.invert
  }), children)))));
}
function ConnectedSection(props) {
  const contentElements = useSectionForegroundContentElements({
    sectionId: props.section.id,
    layout: props.section.layout,
    phoneLayout: usePhoneLayout()
  });
  const backdrop = useBackdrop(props.section);
  const transitions = getEnterAndExitTransitions(props.section);
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
function getSuppressedPaddings(contentElements, motifAreaState) {
  return {
    top: isFullWidthElement(contentElements[0]) || motifAreaState.isContentPadded,
    bottom: isFullWidthElement(contentElements[contentElements.length - 1])
  };
}
function isFullWidthElement(element) {
  return element && element.position === 'inline' && element.width === widths.full;
}
function percentToFraction(value, {
  defaultValue
}) {
  return typeof value !== 'undefined' ? value / 100 : defaultValue;
}

const CurrentChapterContext = React.createContext();
const CurrentSectionIndexStateContext = React.createContext();
function CurrentSectionProvider({
  children
}) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSectionIndexState = useMemo(() => [currentSectionIndex, setCurrentSectionIndex], [currentSectionIndex, setCurrentSectionIndex]);
  const sections = useSectionsWithChapter();
  const currentSection = sections[currentSectionIndex];
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
  useEffect(() => {
    if (window.parent !== window) {
      window.addEventListener('message', receive);
    }
    return () => window.removeEventListener('message', receive);
    function receive(message) {
      if (window.location.href.indexOf(message.origin) === 0) {
        receiveData(message.data);
      }
    }
  }, [receiveData]);
}

var contentStyles = {"Content":"Content-module_Content__m7urk"};

var styles$n = {"focusOutlineDisabled":"focusOutline-module_focusOutlineDisabled__KV7d-"};

const FocusVisibleContext = createContext();
function useFocusOutlineVisible() {
  return useContext(FocusVisibleContext);
}
function FocusOutlineProvider({
  children
}) {
  const [value, setValue] = useState();
  useEffect(() => {
    document.body.addEventListener('keydown', enable);
    document.body.addEventListener('mousedown', disable);
    disable();
    return () => {
      document.body.removeEventListener('keydown', enable);
      document.body.removeEventListener('mousedown', disable);
    };
    function enable() {
      document.body.classList.remove(styles$n.focusOutlineDisabled);
      setValue(true);
    }
    function disable() {
      document.body.classList.add(styles$n.focusOutlineDisabled);
      setValue(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement(FocusVisibleContext.Provider, {
    value: value
  }, children);
}

const PhonePlatformProvider = extensible('PhonePlatformProvider', function PhonePlatformProvider({
  children
}) {
  const isPhonePlatform = useBrowserFeature('phone platform');
  return /*#__PURE__*/React.createElement(PhonePlatformContext.Provider, {
    value: isPhonePlatform
  }, children);
});

const AudioFocusContext = createContext();
function AudioFocusProvider({
  children
}) {
  const [currentKey, setCurrentKey] = useState([]);
  const value = useMemo(() => [currentKey, setCurrentKey], [currentKey, setCurrentKey]);
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
function useAudioFocus({
  key,
  request,
  onLost
}) {
  const wasRequested = usePrevious(request);
  const [currentKey, setCurrentKey] = useContext(AudioFocusContext);
  const previousKey = usePrevious(currentKey);
  useEffect(() => {
    if (request && !wasRequested) {
      setCurrentKey(key);
    }
  }, [request, wasRequested, setCurrentKey, key]);
  useEffect(() => {
    if (previousKey === key && currentKey !== key) {
      onLost();
    }
  }, [currentKey, previousKey, key, onLost]);
}

const ConsentContext = createContext();
function ConsentProvider({
  consent,
  children
}) {
  return /*#__PURE__*/React.createElement(ConsentContext.Provider, {
    value: consent
  }, children);
}
function useConsentRequested() {
  const consent = useContext(ConsentContext);
  const [request, setRequest] = useState({});
  useIsomorphicLayoutEffect(() => {
    let unmounted = false;
    (async () => {
      const {
        vendors,
        acceptAll,
        denyAll,
        save
      } = await consent.requested();
      if (!unmounted) {
        setRequest({
          vendors,
          acceptAll() {
            acceptAll();
            setRequest({});
          },
          denyAll() {
            denyAll();
            setRequest({});
          },
          save(decisions) {
            save(decisions);
            setRequest({});
          }
        });
      }
    })();
    return () => unmounted = true;
  }, [consent]);
  return request;
}
function useConsentGiven(vendorName) {
  const consent = useContext(ConsentContext);
  const {
    isEditable
  } = useContentElementEditorState();
  const isStaticPreview = useIsStaticPreview();
  const [consentGiven, setConsentGiven] = useState(isEditable || isStaticPreview);
  useIsomorphicLayoutEffect(() => {
    let unmounted = false;
    (async () => {
      if (!vendorName || isEditable || isStaticPreview) {
        return;
      }
      const result = await consent.requireAccepted(vendorName);
      if (!unmounted && result === 'fulfilled') {
        setConsentGiven(true);
      }
    })();
    return () => unmounted = true;
  }, [consent, vendorName]);
  const giveConsent = useCallback(() => consent.accept(vendorName), [consent, vendorName]);
  return [consentGiven, giveConsent];
}

// eslint-disable-next-line no-script-url
const displayPrivacySettingsUrl = 'javascript:pageflowDisplayPrivacySettings()';

/**
 * Returns the privacy link URL, label and link props. When vendors
 * are passed, the vendors query parameter and consent hash are
 * appended to the URL. Handles absolute, protocol-relative and
 * relative URLs.
 *
 * @param {Object} [options]
 * @param {string} [options.vendors] - Comma-separated vendor names.
 *
 * @example
 *
 * const {url, label, props} = usePrivacyLink({vendors: 'youtube'});
 * // props => {href: '...', target: '_blank', rel: 'noreferrer noopener'}
 */
function usePrivacyLink({
  vendors
} = {}) {
  const {
    privacy
  } = useLegalInfo();
  const url = vendors && privacy.url && privacy.url !== displayPrivacySettingsUrl ? appendVendorsParam(privacy.url, vendors) : privacy.url;
  return {
    url,
    label: privacy.label,
    props: linkProps(url)
  };
}
function linkProps(url) {
  if (url === displayPrivacySettingsUrl) {
    return {
      href: '#privacySettings',
      onClick(event) {
        window.pageflowDisplayPrivacySettings();
        event.preventDefault();
      }
    };
  }
  return {
    href: url,
    target: '_blank',
    rel: 'noreferrer noopener'
  };
}
function appendVendorsParam(privacyLinkUrl, vendors) {
  const isProtocolRelative = privacyLinkUrl.startsWith('//');
  const urlString = isProtocolRelative ? 'https:' + privacyLinkUrl : privacyLinkUrl;
  const url = new URL(urlString, 'https://localhost');
  url.searchParams.set('vendors', vendors);
  url.hash = '#consent';
  if (isProtocolRelative) {
    return url.toString().replace('https:', '');
  } else if (!privacyLinkUrl.includes('://')) {
    return url.pathname + url.search + url.hash;
  }
  return url.toString();
}

var styles$o = {"optIn":"OptIn-module_optIn__3nHo1","optInIcon":"OptIn-module_optInIcon__3-81I","optInMessage":"OptIn-module_optInMessage__1OfTR","optInButton":"OptIn-module_optInButton__1LhtX","privacyLink":"OptIn-module_privacyLink__1dekq"};

function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function (target) {
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
  return _extends$3.apply(this, arguments);
}
var OptInIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$3({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 131 95"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M32.01.01C46.678-.01 61.345.009 76.014.002 83.007.007 90-.009 96.99.011c.015 9.157.014 18.316 0 27.474-1.357.073-2.706.259-4.048.478-.01-7.986 0-15.975-.004-23.961-18.958-.003-37.917-.003-56.875 0l-.001 28.916c.01 2.37-.022 4.742.016 7.113 6.173-.025 12.348-.006 18.52-.011 5.804.01 11.609-.022 17.41.013-1 1.28-2.001 2.56-2.844 3.948-12.372.024-24.748-.011-37.12.019-.06-.365-.03-.735-.034-1.1V17.497c.007-5.83-.024-11.659.001-17.486zm17.617 8.004a5.999 5.999 0 014.359 1.49c1.273 1.116 2.048 2.8 2.013 4.498.042 1.806-.845 3.59-2.263 4.702-1.271 1.013-2.975 1.483-4.583 1.228a5.88 5.88 0 01-3.479-1.785c-1.44-1.459-2.013-3.695-1.475-5.67.6-2.448 2.905-4.346 5.428-4.463zm22.106 7.758c.181-.258.332-.54.547-.772 2.325 3.868 4.683 7.717 7.02 11.578.891 1.503 1.85 2.973 2.7 4.5a35.062 35.062 0 00-5.646 3.779c-.154.162-.387.14-.592.143-10.585-.014-21.174.014-31.762-.015.088-.228.308-.367.47-.542 3.79-3.745 7.58-7.484 11.365-11.232.098-.085.217-.265.366-.15 2.65 1.308 5.3 2.62 7.951 3.928 2.545-3.73 5.052-7.48 7.581-11.217zM0 21.042c.256-.058.517-.039.775-.039 9.175.007 18.349-.007 27.523.007l.064.076c.017 1.308-.012 2.618.015 3.927-5.416.038-10.834.001-16.252.018-.01 7.981-.013 15.962.002 23.944 11.917.013 23.834.013 35.752 0 .022-.674-.002-1.35.012-2.023 4.034.01 8.07.01 12.105 0 .002 11.349.01 22.698-.003 34.048-12.082-.025-24.163-.003-36.244-.01-7.911.007-15.823-.015-23.734.01-.02-19.988.01-39.975-.015-59.959zm3.435 4.043c-.904.236-1.577 1.152-1.482 2.086.079.997.994 1.837 1.999 1.82 1.367.002 2.736.015 4.105-.007 1.04-.036 1.928-.995 1.878-2.03-.003-.996-.867-1.896-1.868-1.925-1.294-.01-2.585.002-3.878-.005-.252.004-.51-.013-.754.061zm-.219 8.067c-.815.317-1.373 1.203-1.256 2.076.1.938.94 1.724 1.89 1.756 1.25.016 2.5-.002 3.752.008.439.008.9-.025 1.288-.246.73-.39 1.173-1.257 1.019-2.075-.136-.889-.95-1.62-1.852-1.645-1.328-.007-2.653.002-3.98-.004-.29-.005-.589.016-.86.13zm.219 7.923c-.762.2-1.372.884-1.471 1.665-.128.844.384 1.718 1.158 2.064.403.192.859.19 1.295.181 1.217-.008 2.434.011 3.651-.008 1.032-.047 1.92-.998 1.868-2.034-.007-.994-.87-1.891-1.87-1.922-1.293-.011-2.584.002-3.877-.006-.252-.001-.51-.008-.754.06zm-.01 8.003c-1.018.249-1.706 1.392-1.413 2.403.21.868 1.057 1.512 1.95 1.497 1.364-.003 2.728.01 4.09-.006 1.02-.034 1.906-.958 1.883-1.975.026-1.017-.858-1.958-1.88-1.981-1.252-.011-2.503.002-3.754-.003-.292-.004-.591-.018-.877.065zm48.107 0c-1.117.272-1.79 1.607-1.323 2.66a2.027 2.027 0 001.86 1.238c1.326.003 2.652.003 3.977 0 1.056.025 2.032-.916 1.996-1.978.045-1.022-.86-1.96-1.88-1.984-1.252-.008-2.503.003-3.754-.002-.293 0-.591-.017-.876.066zM12.13 53.016c-.015 7.981-.012 15.961-.001 23.943 11.917.003 23.836.003 35.753 0 .011-7.982.014-15.962-.001-23.943a14203.52 14203.52 0 00-35.75 0zm-8.694 4.05c-.797.208-1.422.943-1.482 1.764-.112 1.07.805 2.103 1.883 2.137 1.371.014 2.743.003 4.113.006 1.035.01 1.977-.89 1.986-1.928.054-1.033-.83-2.003-1.87-2.037-1.254-.01-2.508.003-3.763-.005-.289 0-.584-.014-.867.064zm48.108.003c-.951.235-1.623 1.244-1.456 2.208.123.947 1.016 1.71 1.972 1.696h3.997c1.031.013 1.994-.886 1.984-1.928.071-1.036-.829-2.011-1.866-2.037-1.254-.01-2.51.003-3.764-.005-.29 0-.586-.014-.867.066zM3.425 65.066c-.955.242-1.634 1.262-1.45 2.234.14.9.957 1.638 1.874 1.662 1.364.011 2.727 0 4.09.006 1.06.022 2.023-.925 1.997-1.984.027-1.02-.86-1.952-1.882-1.98-1.211-.012-2.426.002-3.637-.004-.332-.001-.669-.021-.992.066zm48.107.003c-.927.231-1.584 1.195-1.456 2.14.093.935.935 1.723 1.879 1.752 1.365.011 2.73 0 4.093.006 1.055.016 2.043-.917 1.994-1.984.045-1.023-.86-1.958-1.88-1.981-1.252-.011-2.502.002-3.753-.003-.294-.003-.592-.012-.877.07zM3.435 73.057c-.797.204-1.422.94-1.482 1.76-.111 1.07.802 2.112 1.883 2.138 1.371.013 2.743.002 4.113.005 1.035.017 1.977-.891 1.986-1.928.054-1.033-.835-1.997-1.87-2.037-1.254-.01-2.508.003-3.763-.005-.289.001-.584-.01-.867.067zm48.108 0c-.887.22-1.543 1.118-1.476 2.029.035.974.892 1.837 1.874 1.869 1.37.013 2.742.002 4.114.005 1.033.017 1.993-.883 1.985-1.925.071-1.039-.833-2.006-1.868-2.04-1.254-.01-2.509.003-3.763-.005-.289.001-.585-.01-.866.067zM96.83 31.045c6.813-.36 13.73 1.456 19.431 5.154a32.396 32.396 0 019.482 9.342 31.527 31.527 0 015.043 13.773c.625 5.36-.123 10.88-2.225 15.867-1.766 4.254-4.499 8.108-7.91 11.243a32.605 32.605 0 01-11.584 6.844 33.066 33.066 0 01-15.656 1.337 32.59 32.59 0 01-13.329-5.235c-5.2-3.514-9.323-8.551-11.692-14.307a31.532 31.532 0 01-2.327-14.038 31.433 31.433 0 013.839-13.243 32.232 32.232 0 018.329-9.799c5.259-4.156 11.865-6.62 18.6-6.938zm15.6 12.011c-8.543.979-17.086 1.933-25.627 2.92-.013 8.152.006 16.308-.008 24.462-2.325-.848-5.015-.792-7.24.318-1.33.665-2.493 1.763-2.997 3.169-.503 1.356-.289 2.934.528 4.128.752 1.154 1.947 1.978 3.235 2.465 1.48.569 3.115.675 4.68.452 1.888-.295 3.742-1.222 4.862-2.784.67-.936.965-2.102.894-3.237-.014-7.054.008-14.105-.01-21.158 1.976-.282 3.965-.458 5.946-.7 4.944-.56 9.885-1.124 14.827-1.682V67.42c-1.677-.563-3.506-.755-5.247-.362-1.764.38-3.483 1.32-4.479 2.84a4.618 4.618 0 00-.637 3.729c.32 1.196 1.12 2.243 2.139 2.959 1.533 1.101 3.474 1.576 5.355 1.489 2.036-.083 4.111-.843 5.498-2.353a5.078 5.078 0 001.329-3.83c-.007-6.755-.002-13.51-.005-20.265.058-2.962-.002-5.924-.002-8.884-1.018.053-2.03.212-3.04.313z"
})));

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
function OptIn({
  children,
  providerName,
  wrapper,
  icon
}) {
  const {
    t
  } = useI18n();
  const {
    contentElementId
  } = useContentElementAttributes();
  const contentElementConsentVendor = useContentElementConsentVendor({
    contentElementId
  });
  providerName = providerName || (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.name);
  const privacyLink = usePrivacyLink({
    vendors: providerName
  });
  const cookieMessage = (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.optInPrompt) || t(`pageflow_scrolled.public.third_party_consent.opt_in_prompt.${providerName}`);
  const [consentedHere, setConsentedHere] = useState(false);
  const [consentGiven, giveConsent] = useConsentGiven(providerName);
  if (consentGiven || !providerName) {
    return typeof children === 'function' ? children({
      consentedHere
    }) : children;
  }
  function accept() {
    giveConsent(providerName);
    setConsentedHere(true);
  }
  return wrapper( /*#__PURE__*/React.createElement("div", {
    className: styles$o.optIn
  }, icon && /*#__PURE__*/React.createElement("div", {
    className: styles$o.optInIcon
  }, /*#__PURE__*/React.createElement(OptInIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: styles$o.optInMessage
  }, cookieMessage), privacyLink.url && /*#__PURE__*/React.createElement("div", {
    className: styles$o.privacyLink
  }, /*#__PURE__*/React.createElement("a", privacyLink.props, privacyLink.label)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: styles$o.optInButton,
    onClick: accept
  }, t('pageflow_scrolled.public.third_party_consent.confirm')))));
}
OptIn.defaultProps = {
  icon: true,
  wrapper: children => children
};

var styles$p = {"optOut":"OptOutInfo-module_optOut__2Q3d5","tooltip":"OptOutInfo-module_tooltip__2bpU0","icon":"OptOutInfo-module_icon__1kL6Q utils-module_unstyledButton__3rgne","full":"OptOutInfo-module_full__s_Ono"};

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
function OptOutInfo({
  providerName,
  hide,
  inset
}) {
  var _theme$options$thirdP;
  const {
    t
  } = useI18n();
  const theme = useTheme();
  const optOutUrl = (_theme$options$thirdP = theme.options.thirdPartyConsent) === null || _theme$options$thirdP === void 0 ? void 0 : _theme$options$thirdP.optOutUrl;
  const {
    width,
    contentElementId
  } = useContentElementAttributes();
  const contentElementConsentVendor = useContentElementConsentVendor({
    contentElementId
  });
  providerName = providerName || (contentElementConsentVendor === null || contentElementConsentVendor === void 0 ? void 0 : contentElementConsentVendor.name);
  const [consentGiven] = useConsentGiven(providerName);
  if (!optOutUrl || !consentGiven) {
    return null;
  }
  const linkText = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt_link');
  const linkHtml = `<a href="${optOutUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  const html = t('pageflow_scrolled.public.third_party_consent.opt_out.prompt', {
    link: linkHtml
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$p.optOut, {
      [styles$p.full]: width === widths.full || inset
    }),
    style: hide ? {
      opacity: 0,
      visibility: 'hidden'
    } : undefined
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$p.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "information"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$p.tooltip
  }, /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  })));
}

function registerVendors({
  contentElementTypes,
  seed,
  consent,
  cookieName
}) {
  const options = seed.config.theme.options.thirdPartyConsent;
  const locale = seed.collections.entries[0].locale;
  cookieName = cookieName || (options === null || options === void 0 ? void 0 : options.cookieName);
  [...seed.config.consentVendors, ...contentElementTypes.consentVendors({
    contentElements: seed.collections.contentElements,
    t(key, options) {
      return I18n.t(key, {
        ...options,
        locale
      });
    }
  })].forEach(vendor => {
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

function RootProviders({
  seed,
  consent: consent$1 = consent,
  children
}) {
  return /*#__PURE__*/React.createElement(FocusOutlineProvider, null, /*#__PURE__*/React.createElement(BrowserFeaturesProvider, null, /*#__PURE__*/React.createElement(ExtensionsProvider, null, /*#__PURE__*/React.createElement(PhonePlatformProvider, null, /*#__PURE__*/React.createElement(PhoneLayoutProvider, null, /*#__PURE__*/React.createElement(MediaMutedProvider, null, /*#__PURE__*/React.createElement(AudioFocusProvider, null, /*#__PURE__*/React.createElement(EntryStateProvider, {
    seed: seed
  }, /*#__PURE__*/React.createElement(CurrentSectionProvider, null, /*#__PURE__*/React.createElement(LocaleProvider, null, /*#__PURE__*/React.createElement(ConsentProvider, {
    consent: consent$1
  }, /*#__PURE__*/React.createElement(ScrollTargetEmitterProvider, null, /*#__PURE__*/React.createElement(ActiveExcursionProvider, null, children)))))))))))));
}

const ContentElementConfigurationUpdateContext = React.createContext(() => {});
function useContentElementConfigurationUpdate() {
  return useContext(ContentElementConfigurationUpdateContext);
}

var styles$q = {"crop":"SectionThumbnail-module_crop__Q1nZj","scale":"SectionThumbnail-module_scale__2tKDG"};

function StandaloneSectionThumbnail({
  seed,
  ...props
}) {
  return /*#__PURE__*/React.createElement(RootProviders, {
    seed: seed
  }, /*#__PURE__*/React.createElement(SectionThumbnail, props));
}
function SectionThumbnail({
  sectionPermaId,
  subscribe,
  scale
}) {
  const dispatch = useEntryStateDispatch();
  useEffect(() => {
    if (subscribe) {
      return subscribe(dispatch);
    }
  }, [subscribe, dispatch]);
  const section = useSection({
    sectionPermaId
  });
  const scaleFactor = scale ? 5 : 1;
  if (section) {
    return /*#__PURE__*/React.createElement(StaticPreview, null, /*#__PURE__*/React.createElement(Measure, {
      client: true
    }, ({
      measureRef,
      contentRect
    }) => /*#__PURE__*/React.createElement(FullscreenDimensionProvider, clientDimensions(contentRect, scaleFactor), /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styles$q.crop,
      inert: ""
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames({
        [styles$q.scale]: scale
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: contentStyles.Content,
      style: viewportUnitCustomProperties(clientDimensions(contentRect, scaleFactor))
    }, /*#__PURE__*/React.createElement(ConnectedSection, {
      state: "active",
      domIdPrefix: "section-preview",
      section: {
        ...section,
        transition: 'preview'
      }
    })))))));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: styles$q.root
    }, "Not found.");
  }
}
SectionThumbnail.defaultProps = {
  scale: true,
  subscribe: () => {}
};
function clientDimensions(contentRect, scaleFactor) {
  return {
    width: contentRect.client.width && Math.ceil(contentRect.client.width * scaleFactor),
    height: contentRect.client.height && Math.ceil(contentRect.client.height * scaleFactor)
  };
}
function viewportUnitCustomProperties({
  width,
  height
}) {
  return {
    '--vw': width && `${width / 100}px`,
    '--vh': height && `${height / 100}px`
  };
}

const WidgetConfigurationUpdateContext = React.createContext(() => {});
function useWidgetConfigurationUpdate() {
  return useContext(WidgetConfigurationUpdateContext);
}

const ContentElementEditorCommandEmitterContext = createContext({
  on() {},
  off() {}
});
function useContentElementEditorCommandSubscription(callback) {
  const {
    contentElementId
  } = useContentElementAttributes();
  const emitter = useContext(ContentElementEditorCommandEmitterContext);
  useEffect(() => {
    emitter.on(`command:${contentElementId}`, callback);
    return () => emitter.off(`command:${contentElementId}`, callback);
  }, [emitter, callback, contentElementId]);
}

function capitalize$1(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const utils = {
  capitalize: capitalize$1,
  camelize,
  isBlank,
  isBlankEditableTextValue,
  isTranslucentColor,
  presence
};

var tableStyles = {"table":"EditableTable-module_table__uncog"};

const defaultValue = [{
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
const EditableTable = extensible('EditableTable', function EditableTable({
  value,
  className,
  labelScaleCategory = 'body',
  valueScaleCategory = 'body',
  stackedInPhoneLayout = false
}) {
  const phoneLayout = usePhoneLayout();
  const stacked = stackedInPhoneLayout && phoneLayout;
  return /*#__PURE__*/React.createElement("table", {
    className: classNames(className, tableStyles.table),
    "data-stacked": stacked ? '' : undefined
  }, /*#__PURE__*/React.createElement("tbody", null, render(value || defaultValue, {
    labelScaleCategory,
    valueScaleCategory
  })));
});
function render(children, options) {
  return children.map((element, index) => {
    if (element.type) {
      return createRenderElement(options)({
        attributes: {
          key: index
        },
        element,
        children: render(element.children, options)
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
function createRenderElement({
  labelScaleCategory,
  valueScaleCategory
}) {
  return function renderElement({
    attributes,
    children,
    element
  }) {
    switch (element.type) {
      case 'row':
        return /*#__PURE__*/React.createElement("tr", attributes, children);
      case 'link':
        return renderLink({
          attributes,
          children,
          element
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

var styles$r = {"placeholder":"Placeholder-module_placeholder__L1CTm"};

export { Atmo as $, AtmoProvider as A, OptOutInfo as B, ConnectedSection as C, useConsentRequested as D, EventContextDataProvider as E, Fullscreen as F, AiIndicatorIcon as G, useAiIndicatorLabel as H, InlineFileRights as I, SectionIntersectionObserver as J, usePrivacyLink as K, getTransitionNames as L, getAvailableTransitionNames as M, getAppearanceSectionScopeName as N, OptIn as O, PlayerEventContextDataProvider as P, Image as Q, RootProviders as R, SelectableWidget as S, MediaPlayer as T, getInitialPlayerState as U, playerStateReducer as V, Widget as W, usePlayerState as X, VideoPlayer as Y, AudioPlayer as Z, processSources as _, usePostMessageListener as a, AtmoContext as a0, useAtmo as a1, StandaloneSectionThumbnail as a2, SectionThumbnail as a3, MotifAreaVisibilityProvider as a4, ForcePaddingContext as a5, ContentElementConfigurationUpdateContext as a6, WidgetConfigurationUpdateContext as a7, createRenderElement as a8, usePhoneLayout as a9, tableStyles as aa, useContentElementConfigurationUpdate as b, contentStyles as c, usePrevious as d, useFocusOutlineVisible as e, useTextTracks as f, getEventObject as g, useMediaMuted as h, isBlankEditableTextValue as i, useVideoQualitySetting as j, useIsomorphicLayoutEffect as k, frontendStyles as l, utils as m, styles$c as n, useAudioFocus as o, useBackgroundFile as p, useWidgetConfigurationUpdate as q, registerVendors as r, styles$r as s, useContentElementEditorCommandSubscription as t, useCurrentSectionIndexState as u, ContentElementEditorCommandEmitterContext as v, useCurrentChapter as w, useOnUnmuteMedia as x, usePortraitOrientation as y, EditableTable as z };
