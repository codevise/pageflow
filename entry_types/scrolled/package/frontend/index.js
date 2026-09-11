import { browser, events, features, consent } from 'pageflow/frontend';
import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense, useContext } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { e as extensible, u as useScrollToTarget, a as useActiveExcursion, M as MainStorylineCoverageProvider, b as MainStorylineActivity, c as useMainStorylineCoverage, d as api, p as provideExtensions, f as useDarkBackground, E as EditableText, g as useContentElementAttributes, w as widths, L as Link, T as Text } from './FloatingPortalRootProvider-20c600de.js';
export { C as ContentElementAttributesProvider, i as ContentElementLifecycleContext, k as ContentElementViewTimelineContext, E as EditableText, F as FloatingPortalRootProvider, L as Link, b as MainStorylineActivity, O as OnScreenObserverRootProvider, T as Text, r as contentElementWidthName, w as contentElementWidths, d as frontend, l as getViewTimelineProgress, q as paletteColor, h as useContentElementLifecycle, j as useContentElementViewTimelineProgress, f as useDarkBackground, o as useFloatingPortalRoot, m as useIsStaticPreview, s as useOnScreen, n as useStorylineActivity } from './FloatingPortalRootProvider-20c600de.js';
export { u as useDelayedBoolean } from './useDelayedBoolean-a387d85b.js';
import { E as EventContextDataProvider, C as ConnectedSection, g as getEventObject, u as useCurrentSectionIndexState, a as usePostMessageListener, c as contentStyles, A as AtmoProvider, W as Widget, S as SelectableWidget, i as isBlankEditableTextValue, b as useContentElementConfigurationUpdate, d as usePrevious, I as InlineFileRights, e as useFocusOutlineVisible, f as useTextTracks, h as useMediaMuted, j as useVideoQualitySetting, k as useIsomorphicLayoutEffect, l as frontendStyles, s as styles$e, F as Fullscreen, m as utils, n as styles$f, r as registerVendors, R as RootProviders } from './Placeholder.module-d22a9335.js';
export { G as AiIndicatorIcon, $ as Atmo, a0 as AtmoContext, A as AtmoProvider, Z as AudioPlayer, v as ContentElementEditorCommandEmitterContext, z as EditableTable, Q as Image, I as InlineFileRights, T as MediaPlayer, P as PlayerEventContextDataProvider, R as RootProviders, J as SectionIntersectionObserver, a3 as SectionThumbnail, S as SelectableWidget, a2 as StandaloneSectionThumbnail, O as ThirdPartyOptIn, B as ThirdPartyOptOutInfo, Y as VideoPlayer, W as Widget, N as getAppearanceSectionScopeName, M as getAvailableTransitionNames, U as getInitialPlayerState, L as getTransitionNames, V as playerStateReducer, _ as processSources, r as registerConsentVendors, H as useAiIndicatorLabel, a1 as useAtmo, o as useAudioFocus, p as useBackgroundFile, D as useConsentRequested, b as useContentElementConfigurationUpdate, t as useContentElementEditorCommandSubscription, w as useCurrentChapter, k as useIsomorphicLayoutEffect, h as useMediaMuted, x as useOnUnmuteMedia, X as usePlayerState, y as usePortraitOrientation, K as usePrivacyLink, q as useWidgetConfigurationUpdate, m as utils } from './Placeholder.module-d22a9335.js';
import 'backbone-events-standalone';
import { useEntryStructure, useActiveWidgets, getFileUrlTemplateHost, useTheme, useAvailableQualities } from 'pageflow-scrolled/entryState';
export { useAdditionalSeedData, useChapters, useCredits, useCutOff, useDarkWidgets, useEntryMetadata, useEntryStateDispatch, useEntryTranslations, useFile, useFileRights, useFileWithInlineRights, useLegalInfo, useMainChapters, useShareProviders, useShareUrl, useTheme } from 'pageflow-scrolled/entryState';
import 'i18n-js';
import { u as useI18n, s as setupI18n } from './i18n-493cd2a6.js';
export { L as LocaleProvider, s as setupI18n, u as useI18n, a as useLocale } from './i18n-493cd2a6.js';
import 'striptags';
import Measure from 'react-measure';
export { P as PhonePlatformContext } from './PhonePlatformContext-035a99fa.js';
import { u as useContentElementEditorState } from './useContentElementEditorState-a084912e.js';
export { C as ContentElementEditorStateContext, u as useContentElementEditorState } from './useContentElementEditorState-a084912e.js';
import { T as ThemeIcon } from './ThemeIcon-ab834849.js';
export { T as ThemeIcon } from './ThemeIcon-ab834849.js';
import { DraggableCore } from 'react-draggable';
export { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-30fd1124.js';
export { F as FullscreenViewer } from './index-2e5546f7.js';
import { useI18n as useI18n$1, useTheme as useTheme$1 } from 'pageflow-scrolled/frontend';
export { u as usePhonePlatform } from './usePhonePlatform-ce9ff08d.js';
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

// Make sure we're in a Browser-like environment before importing the
// polyfill. This prevents it from being imported in a Node test
// environment.
if (typeof window !== 'undefined') {
  require('scroll-timeline');
}

var styles = {"wrapper":"Chapter-module_wrapper__3Pdly"};

function Chapter(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: props.chapterSlug,
    className: styles.wrapper
  }, renderSections(props.sections, props.currentSectionIndex, props.setCurrentSection));
}
function renderSections(sections, currentSectionIndex, setCurrentSection) {
  function onActivate(section) {
    setCurrentSection(section);
  }
  return sections.map(section => {
    return /*#__PURE__*/React.createElement(EventContextDataProvider, {
      key: section.permaId,
      section: section,
      sectionsCount: sections.length
    }, /*#__PURE__*/React.createElement(ConnectedSection, {
      state: section.sectionIndex > currentSectionIndex ? 'below' : section.sectionIndex < currentSectionIndex ? 'above' : 'active',
      onActivate: () => onActivate(section),
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
function VhFix({
  children
}) {
  const probeRef = useRef();
  const [height, setHeight] = useState();
  useEffect(() => {
    if (!browser.has('ios platform')) {
      return;
    }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    function update() {
      setHeight(previousHeight => getHeight({
        windowHeight: window.innerHeight,
        probeHeight: probeRef.current.clientHeight,
        previousHeight
      }));
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: height && {
      '--vh': `${height / 100}px`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      position: 'absolute'
    },
    ref: probeRef
  }), children);
}
function getHeight({
  windowHeight,
  probeHeight,
  previousHeight
}) {
  if (probeHeight < windowHeight || previousHeight) {
    if (!previousHeight || windowHeight > previousHeight || windowHeight < previousHeight * 0.7) {
      return windowHeight;
    } else {
      return previousHeight;
    }
  }
}

function useSectionChangeEvents(events) {
  const previousSectionPermaIdRef = useRef();
  return useCallback((section, sectionsCount) => {
    if (previousSectionPermaIdRef.current !== (section === null || section === void 0 ? void 0 : section.permaId)) {
      events.trigger('page:change', getEventObject({
        section,
        sectionsCount
      }));
      previousSectionPermaIdRef.current = section === null || section === void 0 ? void 0 : section.permaId;
    }
  }, [events]);
}

const sectionChangeMessagePoster = (sectionIndex, excursionId) => {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'CHANGE_SECTION',
      payload: {
        sectionIndex,
        excursionId
      }
    }, window.location.origin);
  }
};

function useChapterSlugUpdater() {
  const windowLoadedRef = useRef(false);
  useWindowLoadTracking(windowLoadedRef);
  const updateChapterSlug = useCallback(section => {
    if (!windowLoadedRef.current) {
      return;
    }
    if (section.sectionIndex > 0) {
      window.history.replaceState(null, null, '#' + section.chapter.chapterSlug);
    } else {
      window.history.replaceState(null, null, window.location.href.split('#')[0]);
    }
  }, []);
  const updateExcursionChapterSlug = useCallback(section => {
    if (!windowLoadedRef.current) {
      return;
    }
    window.history.replaceState(null, null, '#' + section.chapter.chapterSlug);
  }, []);
  return {
    updateChapterSlug,
    updateExcursionChapterSlug
  };
}
function useWindowLoadTracking(windowLoadedRef) {
  useEffect(() => {
    if (document.readyState === 'complete') {
      windowLoadedRef.current = true;
      return;
    }
    const handleLoad = () => {
      windowLoadedRef.current = true;
    };
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [windowLoadedRef]);
}

const Content = extensible('Content', function Content(props) {
  const entryStructure = useEntryStructure();
  const scrollToTarget = useScrollToTarget();
  const {
    activeExcursion,
    activateExcursionOfSection,
    returnFromExcursion
  } = useActiveExcursion();
  const [currentSectionIndex, setCurrentSectionIndexState] = useCurrentSectionIndexState();
  const [currentExcursionSectionIndex, setCurrentExcursionSectionIndex] = useState(0);
  const {
    updateChapterSlug,
    updateExcursionChapterSlug
  } = useChapterSlugUpdater();
  const triggerSectionChange = useSectionChangeEvents(events);
  const setCurrentSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex);
    setCurrentSectionIndexState(section.sectionIndex);
    updateChapterSlug(section);
    triggerSectionChange(section, entryStructure.mainSectionsCount);
  }, [setCurrentSectionIndexState, updateChapterSlug, triggerSectionChange, entryStructure.mainSectionsCount]);
  const setCurrentExcursionSection = useCallback(section => {
    sectionChangeMessagePoster(section.sectionIndex, section.chapter.id);
    setCurrentExcursionSectionIndex(section.sectionIndex);
    updateExcursionChapterSlug(section);
    triggerSectionChange(section, activeExcursion.sections.length);
  }, [updateExcursionChapterSlug, triggerSectionChange, activeExcursion]);
  const receiveMessage = useCallback(data => {
    if (data.type === 'SCROLL_TO_SECTION') {
      activateExcursionOfSection({
        id: data.payload.id
      });
      scrollToTarget({
        id: data.payload.id,
        align: data.payload.align,
        ifNeeded: data.payload.ifNeeded,
        behavior: data.payload.behavior
      });
    }
  }, [scrollToTarget, activateExcursionOfSection]);
  usePostMessageListener(receiveMessage);
  return /*#__PURE__*/React.createElement("div", {
    className: contentStyles.Content,
    id: "goToContent"
  }, /*#__PURE__*/React.createElement(VhFix, null, /*#__PURE__*/React.createElement(MainStorylineCoverageProvider, null, /*#__PURE__*/React.createElement(AtmoProvider, null, renderMainStoryline(entryStructure.main, activeExcursion, currentSectionIndex, setCurrentSection), /*#__PURE__*/React.createElement(ActiveExcursion, {
    excursion: activeExcursion,
    currentExcursionSectionIndex: currentExcursionSectionIndex,
    setCurrentExcursionSection: setCurrentExcursionSection,
    onClose: () => {
      returnFromExcursion();
      sectionChangeMessagePoster(currentSectionIndex);
    }
  })))));
});
function renderMainStoryline(chapters, activeExcursion, currentSectionIndex, setCurrentSection) {
  return /*#__PURE__*/React.createElement(Widget, {
    role: "mainStoryline",
    props: {
      activeExcursion
    },
    renderFallback: ({
      children
    }) => children
  }, /*#__PURE__*/React.createElement(MainStorylineActivity, {
    activeExcursion: activeExcursion
  }, renderChapters(chapters, currentSectionIndex, setCurrentSection)), /*#__PURE__*/React.createElement(Widget, {
    role: "footer"
  }));
}
function ActiveExcursion({
  excursion,
  currentExcursionSectionIndex,
  setCurrentExcursionSection,
  onClose
}) {
  const {
    setMainStorylineCovered
  } = useMainStorylineCoverage();
  if (!excursion) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Widget, {
    role: "excursion",
    props: {
      excursion,
      onClose: () => {
        onClose();
        setMainStorylineCovered(false);
      },
      setIsCoveringBackground: setMainStorylineCovered
    }
  }, renderChapters([excursion], currentExcursionSectionIndex, setCurrentExcursionSection));
}
function renderChapters(chapters, currentSectionIndex, setCurrentSection) {
  return chapters.map((chapter, index) => {
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

function WidgetPresenceWrapper({
  children
}) {
  const widgets = useActiveWidgets();
  return /*#__PURE__*/React.createElement(PresenceProviders, {
    widgets: widgets
  }, children);
}
function PresenceProviders({
  widgets,
  children
}) {
  if (widgets.length === 0) {
    return children;
  }
  const [first, ...rest] = widgets;
  const Provider = api.widgetTypes.getPresenceProvider(first.typeName);
  if (Provider) {
    return /*#__PURE__*/React.createElement(Provider, {
      configuration: first.configuration
    }, /*#__PURE__*/React.createElement(PresenceProviders, {
      widgets: rest
    }, children));
  }
  return /*#__PURE__*/React.createElement(PresenceProviders, {
    widgets: rest
  }, children);
}

const Entry = extensible('Entry', function Entry() {
  return /*#__PURE__*/React.createElement(WidgetPresenceWrapper, null, /*#__PURE__*/React.createElement(Widget, {
    role: "consent"
  }), /*#__PURE__*/React.createElement(SelectableWidget, {
    role: "header"
  }), /*#__PURE__*/React.createElement(Content, null));
});

function loadInlineEditingExtensions() {
  return import('./extensions-a461fd13.js').then(({
    extensions
  }) => {
    provideExtensions(extensions);
  });
}

function loadCommentingExtensions() {
  return import( /* webpackPreload: true */'./extensions-167ae143.js').then(({
    extensions
  }) => {
    provideExtensions(extensions);
  });
}

async function loadDashUnlessHlsSupported(seed) {
  if (!hasHlsSupport({
    seed,
    agent: browser.agent
  })) {
    await import('@videojs/http-streaming');
  }
}
function hasHlsSupport({
  agent,
  seed
}) {
  return agent.matchesSafari() || agent.matchesMobilePlatform() && (!agent.matchesAndroid() || hlsHostSupportedByAndroid(seed));
}
function hlsHostSupportedByAndroid(seed) {
  return getFileUrlTemplateHost(seed, 'videoFiles', 'hls-playlist').indexOf('_') < 0;
}

const ActionButton = extensible('ActionButton', function ActionButton() {
  return null;
});

var styles$1 = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","contentColorScope":"colors-module_contentColorScope__2Zizr","root":"Figure-module_root__3FC-x colors-module_contentColorScope__2Zizr","invert":"Figure-module_invert___0BJP"};

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
function Figure({
  children,
  variant,
  caption,
  onCaptionChange,
  addCaptionButtonVisible = true,
  addCaptionButtonPosition = 'outside',
  renderInsideCaption
}) {
  const darkBackground = useDarkBackground();
  const {
    isSelected,
    isEditable
  } = useContentElementEditorState();
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const theme = useTheme();
  const captionAbove = theme.options.figureCaptionPosition === 'above';
  caption = useMemo(() => typeof caption === 'string' ? [{
    type: 'paragraph',
    children: [{
      text: caption
    }]
  }] : caption, [caption]);
  if (!isBlankEditableTextValue(caption) || isEditable) {
    return /*#__PURE__*/React.createElement("figure", {
      className: classNames(styles$1.root, {
        [styles$1.invert]: !darkBackground
      })
    }, !captionAbove && children, isBlankEditableTextValue(caption) && isSelected && !isEditingCaption && addCaptionButtonVisible && /*#__PURE__*/React.createElement(ActionButton, {
      position: addCaptionButtonPosition,
      icon: "pencil",
      text: t('pageflow_scrolled.inline_editing.add_caption'),
      onClick: () => setIsEditingCaption(true)
    }), (!isBlankEditableTextValue(caption) || isEditingCaption) && /*#__PURE__*/React.createElement("figcaption", {
      className: classNames(variant && `scope-figureCaption-${variant}`),
      onBlur: () => setIsEditingCaption(false)
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

var styles$2 = {"properties":"ContentElementBox-module_properties__1ljc9","wrapper":"ContentElementBox-module_wrapper__3wZgP","full":"ContentElementBox-module_full__AfWPr","positioned":"ContentElementBox-module_positioned__3R1dq"};

function contentElementBoxProps(configuration, {
  borderRadius
} = {}) {
  return {
    className: styles$2.properties,
    style: {
      ...(borderRadius && borderRadius !== 'none' && {
        '--content-element-box-border-radius': `var(--theme-content-element-box-border-radius-${borderRadius})`
      }),
      ...((configuration === null || configuration === void 0 ? void 0 : configuration.boxShadow) && {
        '--content-element-box-shadow': `var(--theme-content-element-box-shadow-${configuration.boxShadow})`
      }),
      ...((configuration === null || configuration === void 0 ? void 0 : configuration.outlineColor) && {
        '--content-element-box-outline-color': configuration.outlineColor
      })
    }
  };
}

/**
 * Wrap content element that render a visible box in this component to
 * apply theme specific styles like rounded corners.
 *
 * @param {Object} props
 * @param {string} props.children - Content of box.
 * @param {Object} [props.configuration] - Content element configuration. Used to read box shadow and outline styles.
 * @param {string} [props.borderRadius] - Border radius value from theme scale, or "none" to render no wrapper.
 */
function ContentElementBox({
  children,
  configuration,
  borderRadius,
  positioned
}) {
  const {
    position,
    width
  } = useContentElementAttributes();
  const {
    style
  } = contentElementBoxProps(configuration, {
    borderRadius
  });
  if (position === 'backdrop') {
    return children;
  }
  if (borderRadius === 'none' && !Object.keys(style).length) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.properties, styles$2.wrapper, {
      [styles$2.full]: width === widths.full,
      [styles$2.positioned]: positioned
    }),
    style: style
  }, children);
}

/**
 * @param {Object} props
 * @param {Object} props.configuration - Configuration of the content element.
 * @param {string} props.children - Content of box.
 */
function ContentElementFigure({
  configuration,
  children
}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    width,
    position
  } = useContentElementAttributes();
  const {
    isEditable
  } = useContentElementEditorState();
  if (position === 'backdrop') {
    return children;
  }
  return /*#__PURE__*/React.createElement(Figure, {
    caption: configuration.caption,
    variant: configuration.captionVariant,
    renderInsideCaption: () => isEditable && /*#__PURE__*/React.createElement(HasCaptionTransientState, null),
    onCaptionChange: caption => updateConfiguration({
      caption
    }),
    addCaptionButtonPosition: width === widths.full ? 'outsideIndented' : 'outside'
  }, children);
}
function HasCaptionTransientState() {
  const {
    setTransientState
  } = useContentElementEditorState();
  useEffect(() => {
    setTransientState({
      hasCaption: true
    });
    return () => setTransientState({
      hasCaption: false
    });
  }, [setTransientState]);
  return null;
}

function processImageModifiers(imageModifiers) {
  const cropValue = getModifierValue(imageModifiers, 'crop');
  const isCircleCrop = cropValue === 'circle';
  return {
    aspectRatio: isCircleCrop ? 'square' : cropValue,
    rounded: isCircleCrop ? 'circle' : getModifierValue(imageModifiers, 'rounded')
  };
}
function getModifierValue(imageModifiers, name) {
  var _find;
  return (_find = (imageModifiers || []).find(imageModifier => imageModifier.name === name)) === null || _find === void 0 ? void 0 : _find.value;
}

function useFileWithCropPosition(file, cropPosition) {
  return file && {
    ...file,
    cropPosition
  };
}

function MediaInteractionTracking({
  playerState,
  playerActions,
  idleDelay,
  children
}) {
  const hideControlsTimeout = useRef();
  const wasPlaying = usePrevious(playerState.isPlaying);
  const focusWasInside = usePrevious(playerState.focusInsideControls);
  const setHideControlsTimeout = useCallback(() => {
    clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(playerActions.userIdle, idleDelay);
  }, [playerActions.userIdle, idleDelay]);
  useEffect(() => {
    if (!wasPlaying && playerState.isPlaying || focusWasInside !== playerState.focusInsideControls) {
      setHideControlsTimeout();
    }
  }, [wasPlaying, playerState.isPlaying, setHideControlsTimeout, playerState.focusInsideControls, focusWasInside]);
  useEffect(() => {
    return () => clearTimeout(hideControlsTimeout.current);
  }, []);
  const handleInteraction = function () {
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

function RemotePeakData({
  audioFile,
  children
}) {
  const peakDataUrl = audioFile === null || audioFile === void 0 ? void 0 : audioFile.urls.peakData;
  const [peakData, setPeakData] = useState('pending');
  useEffect(() => {
    if (peakDataUrl) {
      fetch(peakDataUrl).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} while loading peaks.`);
        }
        return response.json();
      }).then(peaks => {
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

const defaultRemainingWaveformColor = '#828282ed';
const defaultRemainingWaveformColorInverted = 'rgba(0, 0, 0, 0.5)';
const defaultWaveformCursorColor = '#fff';
const defaultWaveformCursorColorInverted = '#888';

var styles$3 = {"container":"Waveform-module_container__1Dxdv","clickMask":"Waveform-module_clickMask__3LYAT","menuBar":"Waveform-module_menuBar__342n-","menuBarInner":"Waveform-module_menuBarInner__3wjQs","timeDisplay":"Waveform-module_timeDisplay__1v4Tl","playControl":"Waveform-module_playControl__QWTsJ","invertPlayButton":"Waveform-module_invertPlayButton__kfCbL","waveWrapper":"Waveform-module_waveWrapper__3gamc"};

const Wavesurfer = React.lazy(() => import('./Wavesurfer-656e3c36.js'));
const waveformStyles = {
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
  const [height, setHeight] = useState(90);
  if (props.mediaElementId) {
    return /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement("div", null)
    }, /*#__PURE__*/React.createElement(Measure, {
      client: true,
      onResize: contentRect => setHeight(contentRect.client.height)
    }, ({
      measureRef
    }) => /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      className: styles$3.waveWrapper
    }, /*#__PURE__*/React.createElement(RemotePeakData, {
      audioFile: props.audioFile
    }, peakData => /*#__PURE__*/React.createElement(Wavesurfer, {
      key: props.variant,
      mediaElt: `#${props.mediaElementId}`,
      audioPeaks: peakData,
      options: {
        ...waveformStyles[props.variant],
        normalize: true,
        removeMediaElementOnDestroy: false,
        hideScrollbar: true,
        progressColor: props.progressWaveformColor || props.mainColor,
        waveColor: props.remainingWaveformColor || (props.inverted ? defaultRemainingWaveformColorInverted : defaultRemainingWaveformColor),
        cursorColor: props.waveformCursorColor || (props.inverted ? defaultWaveformCursorColorInverted : defaultWaveformCursorColor),
        height
      }
    })))));
  } else {
    return null;
  }
}

var styles$4 = {"timeDisplay":"TimeDisplay-module_timeDisplay__2UwqM","time":"TimeDisplay-module_time__li1ZU"};

const unknownTimePlaceholder = '-:--';
function formatTime(value) {
  if (isNaN(value)) {
    return unknownTimePlaceholder;
  }
  const seconds = Math.floor(value) % 60;
  const minutes = Math.floor(value / 60) % 60;
  const hours = Math.floor(value / 60 / 60);
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${minutes}:${pad(seconds)}`;
  }
}
function pad(value) {
  return value < 10 ? '0' + value : value;
}

function TimeDisplay(props) {
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": 'time-display',
    className: styles$4.timeDisplay
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$4.time
  }, formatTime(props.currentTime)), "/", /*#__PURE__*/React.createElement("span", {
    className: styles$4.time
  }, formatTime(props.duration)));
}

var styles$5 = {"wrapper":"MenuBarButton-module_wrapper__2lFoI","button":"MenuBarButton-module_button__2sY0F ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne","subMenuItemAnnotation":"MenuBarButton-module_subMenuItemAnnotation__32Quc","subMenu":"MenuBarButton-module_subMenu__f-E-X","subMenuExpanded":"MenuBarButton-module_subMenuExpanded__2UvkJ","subMenuItem":"MenuBarButton-module_subMenuItem__1pyn_","subMenuItemButton":"MenuBarButton-module_subMenuItemButton__2QnUz utils-module_unstyledButton__3rgne"};

function MenuBarButton(props) {
  const {
    subMenuItems,
    onClick
  } = props;
  const [subMenuExpanded, setSubMenuExpanded] = useState(props.subMenuExpanded);
  const closeMenuTimeout = useRef();
  const openMenu = useCallback(() => {
    if (subMenuItems.length > 0) {
      setSubMenuExpanded(true);
    }
  }, [subMenuItems.length]);
  const closeMenu = useCallback(() => {
    setSubMenuExpanded(false);
  }, []);
  const onButtonClick = useCallback(event => {
    openMenu();
    if (onClick) {
      onClick();
    }
  }, [onClick, openMenu]);
  const onFocus = useCallback(() => {
    clearTimeout(closeMenuTimeout.current);
  }, []);
  const onBlur = useCallback(() => {
    clearTimeout(closeMenuTimeout.current);
    closeMenuTimeout.current = setTimeout(() => {
      setSubMenuExpanded(false);
    }, 100);
  }, []);
  const onKeyDown = useCallback(event => {
    if (event.key === 'Escape') {
      setSubMenuExpanded(false);
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles$5.subMenuExpanded]: subMenuExpanded
    }, styles$5.wrapper),
    onMouseEnter: openMenu,
    onMouseLeave: closeMenu,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyDown: onKeyDown
  }, /*#__PURE__*/React.createElement("button", {
    className: styles$5.button,
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
      className: styles$5.subMenu,
      role: "menu"
    }, renderSubMenuItems(props, closeMenu));
  }
}
function renderSubMenuItems(props, closeMenu) {
  return props.subMenuItems.map(item => {
    return /*#__PURE__*/React.createElement("li", {
      className: styles$5.subMenuItem,
      key: item.value
    }, /*#__PURE__*/React.createElement("button", {
      className: styles$5.subMenuItemButton,
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
      className: styles$5.subMenuItemAnnotation
    }, item.annotation);
  }
}
function subMenuItemClickHandler(props, value, closeMenu) {
  return event => {
    event.preventDefault();
    closeMenu();
    if (props.onSubMenuItemClick) {
      props.onSubMenuItemClick(value);
    }
  };
}

function TextTracksMenu(props) {
  const {
    t
  } = useI18n();
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

var styles$6 = {"container":"ControlBar-module_container__1GH64","sticky":"ControlBar-module_sticky__6qVoI","lightBackground":"ControlBar-module_lightBackground__3-tGf","darkBackground":"ControlBar-module_darkBackground__31Wv7","controlBarContainer":"ControlBar-module_controlBarContainer__1cxRO","inset":"ControlBar-module_inset__JvBh9","controlBarInner":"ControlBar-module_controlBarInner__39fE9","fadedOut":"ControlBar-module_fadedOut__2sP_3","button":"ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne","playControl":"ControlBar-module_playControl__Vg5et ControlBar-module_button___4aXE utils-module_unstyledButton__3rgne"};

function PlayPauseButton(props) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("button", {
    className: styles$6.playControl,
    "aria-label": t(props.isPlaying ? 'pause' : 'play', {
      scope: 'pageflow_scrolled.public.player_controls'
    }),
    onClick: () => props.isPlaying ? props.pause({
      via: 'playPauseButton'
    }) : props.play({
      via: 'playPauseButton'
    })
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
  const darkBackground = useDarkBackground();
  const theme = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    "data-testid": "waveform-controls",
    className: classNames(styles$3.container)
  }, props.children, /*#__PURE__*/React.createElement("div", {
    className: styles$3.clickMask,
    onClick: props.onPlayerClick
  }), /*#__PURE__*/React.createElement(Waveform, {
    audioFile: props.file,
    isPlaying: props.isPlaying,
    inverted: !darkBackground,
    variant: props.variant,
    progressWaveformColor: props.waveformColor,
    remainingWaveformColor: props.remainingWaveformColor,
    waveformCursorColor: props.waveformCursorColor,
    mainColor: ((_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : (_theme$options$proper2 = _theme$options$proper.root) === null || _theme$options$proper2 === void 0 ? void 0 : _theme$options$proper2.accentColor) || ((_theme$options$colors = theme.options.colors) === null || _theme$options$colors === void 0 ? void 0 : _theme$options$colors.accent),
    play: props.play,
    pause: props.pause,
    mediaElementId: props.mediaElementId
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.playControl, {
      [styles$3.invertPlayButton]: props.invertPlayButton
    })
  }, /*#__PURE__*/React.createElement(PlayPauseButton, {
    isPlaying: props.isPlaying,
    play: props.play,
    pause: props.pause
  })), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.menuBar, darkBackground ? styles$6.darkBackground : styles$6.lightBackground, {
      [styles$6.inset]: !props.standAlone
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.menuBarInner
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

var styles$7 = {"container":"BigPlayPauseButton-module_container__19sKj","fadeOutDelay":"BigPlayPauseButton-module_fadeOutDelay__yoaW6","pointerCursor":"BigPlayPauseButton-module_pointerCursor__2A55P","hideCursor":"BigPlayPauseButton-module_hideCursor__2Hyys","button":"BigPlayPauseButton-module_button__10g4Q utils-module_unstyledButton__3rgne","hidden":"BigPlayPauseButton-module_hidden__1KUzr","animated":"BigPlayPauseButton-module_animated__1MMNq","fadeOut":"BigPlayPauseButton-module_fadeOut__2vcA_","fadeIn":"BigPlayPauseButton-module_fadeIn__1Ge1-"};

function useFocusHandoff() {
  const ref1 = useRef();
  const ref2 = useRef();
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
function usePassFocus(inert, {
  name,
  sourceRef,
  targetRef
}) {
  const hasFocusRef = useRef();
  const passFocusRef = useRef();
  const setSourceRef = useCallback(source => {
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
  useEffect(() => {
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
  const {
    t
  } = useI18n();
  const c = classNames(styles$7.button, {
    [styles$7.hidden]: props.hidden || props.lastControlledVia === 'playPauseButton',
    [styles$7.fadeIn]: props.unplayed,
    [styles$7.animated]: !props.unplayed
  });
  const inert = props.hidden || !props.unplayed;
  const ref = usePassFocus(inert, props.focusHandoff);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$7.container, {
      [styles$7.hideCursor]: props.hideCursor,
      [styles$7.hidden]: props.fadedOut,
      [styles$7.fadeOutDelay]: props.isPlaying,
      [styles$7.pointerCursor]: !!props.onClick
    }),
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

var styles$8 = {"container":"ProgressIndicators-module_container__1QiQJ","wrapper":"ProgressIndicators-module_wrapper__2PCVv","draggable":"ProgressIndicators-module_draggable__1iAE8","bars":"ProgressIndicators-module_bars__2-ddd","progressBar":"ProgressIndicators-module_progressBar__2PYn-","background":"ProgressIndicators-module_background__-x5f_ ProgressIndicators-module_progressBar__2PYn-","loadingProgressBar":"ProgressIndicators-module_loadingProgressBar__YD2GH ProgressIndicators-module_progressBar__2PYn-","playProgressBar":"ProgressIndicators-module_playProgressBar__3mCSX ProgressIndicators-module_progressBar__2PYn-","sliderHandle":"ProgressIndicators-module_sliderHandle__3ArIf","dragging":"ProgressIndicators-module_dragging__3yY3t"};

function ProgressIndicators({
  currentTime,
  duration,
  bufferedEnd,
  scrubTo,
  seekTo
}) {
  const {
    t
  } = useI18n();
  const [dragging, setDragging] = useState();
  const progressBarsContainerWidth = useRef();
  const positionToTime = useCallback(x => {
    if (duration && progressBarsContainerWidth.current) {
      const fraction = Math.max(0, Math.min(1, x / progressBarsContainerWidth.current));
      return fraction * duration;
    } else {
      return 0;
    }
  }, [duration]);
  const handleStop = useCallback((mouseEvent, dragEvent) => {
    setDragging(false);
    seekTo(positionToTime(dragEvent.x));
  }, [seekTo, positionToTime]);
  const handleDrag = useCallback((mouseEvent, dragEvent) => {
    setDragging(true);
    scrubTo(positionToTime(dragEvent.x));
  }, [scrubTo, positionToTime]);
  const handleKeyDown = useCallback(event => {
    let destination;
    if (event.key === 'ArrowLeft') {
      destination = Math.max(0, currentTime - 1);
    } else if (event.key === 'ArrowRight') {
      destination = Math.min(currentTime + 1, duration || Infinity);
    }
    seekTo(destination);
  }, [seekTo, currentTime, duration]);
  const loadProgress = duration > 0 ? Math.min(1, bufferedEnd / duration) : 0;
  const playProgress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$8.container, {
      [styles$8.dragging]: dragging
    }),
    "aria-label": t('pageflow_scrolled.public.player_controls.progress', {
      currentTime: formatTime(currentTime),
      duration: formatTime(duration)
    }),
    onKeyDown: handleKeyDown,
    tabIndex: "0"
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$8.wrapper
  }, /*#__PURE__*/React.createElement(Measure, {
    client: true,
    onResize: contentRect => progressBarsContainerWidth.current = contentRect.client.width
  }, ({
    measureRef
  }) => /*#__PURE__*/React.createElement(DraggableCore, {
    onStart: handleDrag,
    onDrag: handleDrag,
    onStop: handleStop
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$8.draggable)
  }, /*#__PURE__*/React.createElement("div", {
    ref: measureRef,
    className: styles$8.bars
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$8.background
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$8.loadingProgressBar,
    style: {
      width: toPercent(loadProgress)
    },
    "data-testid": "loading-progress-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$8.playProgressBar,
    style: {
      width: toPercent(playProgress)
    },
    "data-testid": "play-progress-bar"
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$8.sliderHandle,
    style: {
      left: toPercent(playProgress)
    },
    "data-testid": "slider-handle"
  })))))));
}
function toPercent(value) {
  return value > 0 ? value * 100 + '%' : 0;
}

function QualityMenu(props) {
  const {
    t
  } = useI18n();
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

function ClassicPlayerControls(props) {
  const darkBackground = useDarkBackground();
  const [bigPlayButtonFocusHandoff, controlBarFocusHandoff] = useFocusHandoff();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.container, {
      [styles$6.sticky]: props.sticky
    })
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
function ControlBar({
  darkBackground,
  focusHandoff,
  ...props
}) {
  const hidden = !props.standAlone && props.unplayed || props.fadedOut;
  const inactive = props.isPlaying && props.inactive;
  const fadedOut = hidden || inactive;
  const focusHandoffRef = usePassFocus(hidden, focusHandoff);
  return /*#__PURE__*/React.createElement("div", {
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    className: classNames(styles$6.controlBarContainer, darkBackground ? styles$6.darkBackground : styles$6.lightBackground, {
      [styles$6.inset]: !props.standAlone,
      [styles$6.fadedOut]: fadedOut
    })
  }, /*#__PURE__*/React.createElement("div", {
    ref: focusHandoffRef,
    inert: hidden ? 'true' : undefined,
    className: styles$6.controlBarInner
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
  const ControlComponent = ((_props$variant = props.variant) === null || _props$variant === void 0 ? void 0 : _props$variant.startsWith('waveform')) ? WaveformPlayerControls : ClassicPlayerControls;
  return /*#__PURE__*/React.createElement(ControlComponent, props);
}
PlayerControls.defaultProps = {
  currentTime: 200,
  duration: 600,
  bufferedEnd: 400,
  isPlaying: false,
  play: () => {},
  pause: () => {},
  scrubTo: () => {},
  seekTo: () => {},
  inset: false
};

// Whether the player controls should auto-hide because the user is
// idle and not interacting with them. Shared by the control bar and by
// chrome rendered alongside it (e.g. the fullscreen button) so they
// fade in sync.
function usePlayerControlsInactive(playerState) {
  const focusOutlineVisible = useFocusOutlineVisible();
  return (playerState.userIdle || !playerState.userHovering) && (!focusOutlineVisible || !playerState.focusInsideControls) && !playerState.userHoveringControls;
}

function MediaPlayerControls(props) {
  const playerState = props.playerState;
  const playerActions = props.playerActions;
  const {
    t
  } = useI18n();
  const textTracks = useTextTracks({
    file: props.file,
    defaultTextTrackFilePermaId: props.defaultTextTrackFilePermaId,
    captionsByDefault: useMediaMuted()
  });
  const controlsInactive = usePlayerControlsInactive(playerState);
  return /*#__PURE__*/React.createElement(PlayerControls, Object.assign({
    type: props.type,
    variant: props.configuration.playerControlVariant,
    waveformColor: props.configuration.waveformColor,
    remainingWaveformColor: props.configuration.remainingWaveformColor,
    waveformCursorColor: props.configuration.waveformCursorColor,
    invertPlayButton: props.configuration.invertPlayButton,
    mediaElementId: playerState.mediaElementId,
    currentTime: playerState.scrubbingAt !== undefined ? playerState.scrubbingAt : playerState.currentTime,
    bufferedEnd: playerState.bufferedEnd,
    duration: playerState.duration,
    isPlaying: playerState.shouldPlay,
    unplayed: playerState.unplayed,
    lastControlledVia: playerState.lastControlledVia,
    inactive: props.autoHide && controlsInactive,
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
  }, ...textTracks.files.map(textTrackFile => ({
    value: textTrackFile.id,
    label: textTrackFile.displayLabel,
    active: textTracks.mode === 'user' && textTrackFile.id === textTracks.activeFileId
  }))];
}

function VideoPlayerControls({
  videoFile,
  ...props
}) {
  const [activeQuality, setActiveQuality] = useVideoQualitySetting();
  const availableQualities = useAvailableQualities(videoFile);
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement(MediaPlayerControls, Object.assign({}, props, {
    file: videoFile,
    autoHide: true,
    qualityMenuItems: getQualityMenuItems(availableQualities, activeQuality, t),
    onQualityMenuItemClick: setActiveQuality
  }));
}
function getQualityMenuItems(availableQualities, activeQuality, t) {
  return availableQualities.map(quality => ({
    value: quality,
    label: t(`pageflow_scrolled.public.video_qualities.labels.${quality}`),
    annotation: t(`pageflow_scrolled.public.video_qualities.annotations.${quality}`, {
      defaultValue: ''
    }),
    active: activeQuality === quality
  }));
}

function AudioPlayerControls({
  audioFile,
  ...props
}) {
  return /*#__PURE__*/React.createElement(MediaPlayerControls, Object.assign({}, props, {
    file: audioFile
  }));
}

const Viewer = React.lazy(() => import('./Viewer-cc8d4072.js'));
function Panorama(props) {
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null)
  }, /*#__PURE__*/React.createElement(Viewer, props));
}

const Viewer$1 = React.lazy(() => import('./Viewer-1074fd59.js'));
function ExpandableImage({
  enabled,
  ...props
}) {
  if (!enabled) {
    return props.children;
  }
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null)
  }, /*#__PURE__*/React.createElement(Viewer$1, props));
}

var styles$9 = {"nav":"PaginationIndicator-module_nav__cY6JE","item":"PaginationIndicator-module_item__O7cZ-","current":"PaginationIndicator-module_current__1wxHj"};

function PaginationIndicator({
  itemCount,
  currentIndex,
  scrollerRef,
  navAriaLabelTranslationKey,
  itemAriaLabelTranslationKey,
  onItemClick
}) {
  const {
    t
  } = useI18n$1();
  const navRef = useRef();
  const theme = useTheme$1();
  const currentItemFlex = theme.options.properties.root.paginationIndicatorCurrentItemFlex || 3;
  useEffect(() => {
    if (!(currentItemFlex > 1)) {
      return;
    }
    const timeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });
    const animations = [...navRef.current.children].map((element, index) => {
      const start = 1 / Math.max(itemCount - 1, 1) * (index - 1);
      const end = 1 / Math.max(itemCount - 1, 1) * (index + 1);
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
        timeline
      });
    });
    return () => animations.forEach(animation => animation.cancel());
  }, [currentItemFlex, scrollerRef, itemCount]);
  return /*#__PURE__*/React.createElement("nav", {
    ref: navRef,
    className: styles$9.nav,
    "aria-label": t(navAriaLabelTranslationKey),
    style: {
      aspectRatio: `${itemCount + 2} / 1`
    }
  }, Array(itemCount).fill().map((_, index) => /*#__PURE__*/React.createElement("button", {
    key: index,
    className: classNames(styles$9.item, {
      [styles$9.current]: index === currentIndex
    }),
    "aria-label": t(itemAriaLabelTranslationKey, {
      index
    }),
    "aria-current": index === currentIndex,
    onClick: () => onItemClick(index)
  })));
}

// from https://github.com/n8tb1t/use-scroll-position
const isBrowser = typeof window !== `undefined`;
function getScrollPosition({
  element,
  useWindow
}) {
  if (!isBrowser) return {
    x: 0,
    y: 0
  };
  const target = element ? element.current : document.body;
  const position = target.getBoundingClientRect();
  return useWindow ? {
    x: window.scrollX,
    y: window.scrollY
  } : {
    x: position.left,
    y: position.top
  };
}
function useScrollPosition(effect, deps, element, useWindow, wait) {
  const position = useRef(getScrollPosition({
    useWindow
  }));
  let throttleTimeout = null;
  const callBack = () => {
    const currPos = getScrollPosition({
      element,
      useWindow
    });
    effect({
      prevPos: position.current,
      currPos
    });
    position.current = currPos;
    throttleTimeout = null;
  };
  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) {
      return;
    }
    const handleScroll = () => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, deps);
}
useScrollPosition.defaultProps = {
  deps: [],
  element: false,
  useWindow: false,
  wait: null
};

const EditableInlineText = extensible('EditableInlineText', function EditableInlineText({
  value,
  hyphens,
  defaultValue = ''
}) {
  var _value$, _value$$children$;
  const text = value ? (_value$ = value[0]) === null || _value$ === void 0 ? void 0 : (_value$$children$ = _value$.children[0]) === null || _value$$children$ === void 0 ? void 0 : _value$$children$.text : defaultValue;
  return /*#__PURE__*/React.createElement("span", {
    className: classNames(frontendStyles.root, frontendStyles.textEffects, frontendStyles[`hyphens-${hyphens}`])
  }, /*#__PURE__*/React.createElement("span", null, text));
});

const EditableLink = extensible('EditableLink', function EditableLink({
  className,
  href,
  openInNewTab,
  onClick,
  children
}) {
  return /*#__PURE__*/React.createElement(Link, {
    href: href,
    openInNewTab: openInNewTab,
    attributes: {
      className,
      onClick
    },
    children: children
  });
});

const Placeholder = extensible('Placeholder', function Placeholder() {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$e.placeholder
  });
});

function FilePlaceholder({
  file
}) {
  if (file === null || file === void 0 ? void 0 : file.isReady) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Placeholder, null);
}

const LinkTooltipProvider = extensible('LinkTooltipProvider', function LinkTooltipProvider({
  children
}) {
  return children;
});

var styles$a = {"container":"FitViewport-module_container__-awVj","content":"FitViewport-module_content__1_K5a","inner":"FitViewport-module_inner__3psd1"};

const AspectRatioContext = React.createContext();

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
 * @param {string} [props.fill] - Ignore aspect ration and fill viewport vertically.
 */
function FitViewport({
  file,
  aspectRatio,
  fallbackAspectRatio,
  children,
  fill,
  scale
}) {
  if (!file && !aspectRatio && !fallbackAspectRatio) return children;
  if (typeof aspectRatio === 'string') {
    aspectRatio = `var(--theme-aspect-ratio-${aspectRatio})`;
  }
  aspectRatio = fill ? 'fill' : aspectRatio || ((file === null || file === void 0 ? void 0 : file.width) ? file.height / file.width : fallbackAspectRatio);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$a.container,
    style: {
      '--fit-viewport-aspect-ratio': fill ? undefined : aspectRatio,
      '--fit-viewport-scale': scale
    }
  }, /*#__PURE__*/React.createElement(AspectRatioContext.Provider, {
    value: aspectRatio
  }, children));
}
FitViewport.Content = function FitViewportContent({
  children
}) {
  let aspectRatio = useContext(AspectRatioContext);
  if (aspectRatio === 'fill') {
    return /*#__PURE__*/React.createElement(Fullscreen, {
      children: children
    });
  } else if (!aspectRatio) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$a.content
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
    className: styles$a.inner
  }, children));
};

var styles$b = {"container":"Tooltip-module_container__3V63U","bubble":"Tooltip-module_bubble__FIL1C scope-tooltip","open":"Tooltip-module_open__1avQa","fixed":"Tooltip-module_fixed__3NGyG","openOnHover":"Tooltip-module_openOnHover__1EeI5","fadeIn":"Tooltip-module_fadeIn__3g9QH","inner":"Tooltip-module_inner__E2hsp","highlight":"Tooltip-module_highlight__2NpuQ","arrow":"Tooltip-module_arrow__3LxXo"};

function Tooltip({
  bubbleClassName,
  arrowPos,
  children,
  content,
  fixed,
  highlight,
  name,
  openOnHover,
  verticalOffset,
  horizontalOffset
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipId = `tooltip-${name}`;
  const handleClick = () => {
    setIsOpen(prev => !prev);
  };
  const handleKeyDown = event => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        var _buttonRef$current;
        return (_buttonRef$current = buttonRef.current) === null || _buttonRef$current === void 0 ? void 0 : _buttonRef$current.focus();
      }, 0);
    }
  };
  const handleBlur = event => {
    var _containerRef$current;
    if (isOpen && event.relatedTarget && !((_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.contains(event.relatedTarget))) {
      setIsOpen(false);
    }
  };
  const isControlled = !openOnHover && !fixed;
  useEffect(() => {
    if (!isControlled || !isOpen) {
      return;
    }
    const handleDocumentClick = event => {
      var _containerRef$current2;
      if (!((_containerRef$current2 = containerRef.current) === null || _containerRef$current2 === void 0 ? void 0 : _containerRef$current2.contains(event.target))) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isControlled, isOpen]);
  const triggerProps = isControlled ? {
    onClick: handleClick,
    ref: buttonRef,
    'aria-expanded': isOpen,
    'aria-controls': tooltipId
  } : openOnHover ? {
    'aria-describedby': tooltipId
  } : {};
  return /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: classNames(styles$b.container, {
      [styles$b.openOnHover]: openOnHover,
      [styles$b.fixed]: fixed
    }),
    onKeyDown: isControlled ? handleKeyDown : undefined,
    onBlur: isControlled ? handleBlur : undefined
  }, typeof children === 'function' ? children(triggerProps) : children, /*#__PURE__*/React.createElement(Bubble, {
    className: bubbleClassName,
    highlight: highlight,
    arrowPos: arrowPos,
    verticalOffset: verticalOffset,
    horizontalOffset: horizontalOffset,
    isOpen: isOpen,
    id: tooltipId
  }, content));
}
function Bubble({
  className,
  arrowPos,
  children,
  highlight,
  horizontalOffset,
  verticalOffset,
  isOpen,
  id
}) {
  let inlineStyle = {
    marginLeft: horizontalOffset,
    marginTop: verticalOffset
  };
  return /*#__PURE__*/React.createElement("div", {
    style: inlineStyle,
    id: id,
    className: classNames(className, styles$b.bubble, {
      [styles$b.highlight]: highlight,
      [styles$b.open]: isOpen
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      left: arrowPos
    },
    className: styles$b.arrow
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$b.inner
  }, children));
}
Tooltip.defaultProps = {
  arrowPos: '50%',
  fixed: false,
  openOnHover: false,
  verticalOffset: 7,
  horizontalOffset: 0
};

var styles$c = {"button":"ScrollButton-module_button__3rrDc","icon":"ScrollButton-module_icon__128_J","disabled":"ScrollButton-module_disabled__35fFF","visuallyHidden":"ScrollButton-module_visuallyHidden__36chO"};

const size = 40;
function ScrollButton({
  direction,
  disabled,
  onClick
}) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$c.button, {
      [styles$c.disabled]: disabled
    }),
    tabIndex: "-1",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$c.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: direction === 'left' ? 'arrowLeft' : 'arrowRight',
    width: size,
    height: size
  }), /*#__PURE__*/React.createElement("span", {
    className: styles$c.visuallyHidden
  }, t(direction === 'left' ? 'pageflow_scrolled.public.previous' : 'pageflow_scrolled.public.next'))));
}

function textColorForBackgroundColor(hex) {
  return invert(hex, true);
}

function registerTemplateWidgetType (typeName, callback) {
  let element = document.getElementById('template-widget-container');
  callback(element);
}

const WidgetSelectionRect = extensible('WidgetSelectionRect', function WidgetSelectionRect({
  children
}) {
  return children;
});

var styles$d = {"button":"LinkButton-module_button__33q1F scope-linkButton","editable":"LinkButton-module_editable__FzuA4"};

function LinkButton({
  href,
  openInNewTab,
  value,
  onTextChange,
  onLinkChange,
  scaleCategory,
  className,
  actionButtonVisible,
  linkPreviewPosition,
  linkPreviewDisabled,
  children,
  ...props
}) {
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    isEditable
  } = useContentElementEditorState();
  return /*#__PURE__*/React.createElement(Text, {
    inline: true,
    scaleCategory: scaleCategory
  }, /*#__PURE__*/React.createElement(EditableLink, Object.assign({
    href: href,
    openInNewTab: openInNewTab,
    linkPreviewPosition: linkPreviewPosition,
    linkPreviewDisabled: utils.isBlankEditableTextValue(value) || linkPreviewDisabled,
    actionButtonVisible: actionButtonVisible,
    className: classNames(styles$d.button, className, {
      [styles$d.editable]: isEditable
    }),
    onChange: onLinkChange
  }, props), /*#__PURE__*/React.createElement(EditableInlineText, {
    value: value,
    onChange: onTextChange,
    placeholder: t('pageflow_scrolled.inline_editing.type_text')
  }), children));
}

const editMode = typeof window !== 'undefined' && window.location.pathname.indexOf('/editor/entries') === 0;
const withShadowClassName = styles$f.withShadow;
global.pageflowScrolledRender = async function (seed) {
  setupI18n(seed.i18n);
  features.enable('frontend', seed.config.enabledFeatureNames);
  await browser.detectFeatures();
  await loadDashUnlessHlsSupported(seed);
  if (seed.config.loadInlineEditing) {
    await loadInlineEditingExtensions();
  } else {
    registerVendors({
      contentElementTypes: api.contentElementTypes,
      consent,
      seed
    });
  }
  render(seed);
  if (seed.config.loadCommenting) {
    loadCommentingExtensions();
  }
};
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
function bootFromSeedElement() {
  const element = document.querySelector('script[type="application/json"][data-pageflow-scrolled-seed]');
  if (element) {
    global.pageflowScrolledRender(JSON.parse(element.textContent));
  }
}
if (typeof document !== 'undefined') {
  // Widget packs (defaultNavigation, consentBar, mainStorylineSheet, ...) are
  // separate scripts that load after this entry bundle and register their widget
  // types on execution. All deferred pack scripts run before DOMContentLoaded, so
  // waiting for that event is what guarantees every widget type - and the seed
  // element that follows the scripts - is present before we render.
  if (document.readyState === 'complete') {
    bootFromSeedElement();
  } else {
    document.addEventListener('DOMContentLoaded', bootFromSeedElement);
  }
}
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
function Root({
  seed
}) {
  return /*#__PURE__*/React.createElement(RootProviders, {
    seed: seed
  }, /*#__PURE__*/React.createElement(Entry, null));
}

export { ActionButton, AudioPlayerControls, ClassicPlayerControls, ContentElementBox, ContentElementFigure, EditableInlineText, EditableLink, Entry, ExpandableImage, Figure, FilePlaceholder, FitViewport, LinkButton, LinkTooltipProvider, MediaInteractionTracking, MediaPlayerControls, PaginationIndicator, Panorama, Placeholder, PlayerControls, Root, ScrollButton, Tooltip, VideoPlayerControls, WaveformPlayerControls, WidgetSelectionRect, contentElementBoxProps, processImageModifiers, registerTemplateWidgetType, textColorForBackgroundColor, useFileWithCropPosition, usePlayerControlsInactive, useScrollPosition, withShadowClassName };
