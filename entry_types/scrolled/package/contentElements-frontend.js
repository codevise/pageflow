import { useContentElementConfigurationUpdate, useI18n, useDarkBackground, useContentElementEditorState, useIsStaticPreview, useContentElementLifecycle, utils, contentElementWidths, withShadowClassName, paletteColor, Text, EditableInlineText, frontend, useFileWithCropPosition, useFileWithInlineRights, usePortraitOrientation, processImageModifiers, FitViewport, ContentElementBox, ContentElementFigure, ExpandableImage, FilePlaceholder, Image, InlineFileRights, usePhonePlatform, usePlayerControlsInactive, ToggleFullscreenCornerButton, usePlayerState, MediaInteractionTracking, contentElementBoxProps, useBackgroundFile, useAudioFocus, VideoPlayerControls, PlayerEventContextDataProvider, VideoPlayer, AudioPlayerControls, AudioPlayer, useMediaMuted, useTheme, EditableText, ActionButton, Link, LinkButton, EditableLink, ScrollButton as ScrollButton$1, useContentElementEditorCommandSubscription, LinkTooltipProvider, contentElementWidthName, textColorForBackgroundColor, ThirdPartyOptIn, ThirdPartyOptOutInfo, Panorama, Placeholder, ThemeIcon, useLocale, FullscreenViewer, PaginationIndicator, Figure, EditableTable } from 'pageflow-scrolled/frontend';
import React, { useState, useRef, useEffect, createContext, useContext, useCallback, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import { features, media, documentHiddenState } from 'pageflow/frontend';
import screenfull from 'screenfull';
import Measure from 'react-measure';

var styles = {"darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","root":"Heading-module_root__33TFw","animation-fadeIn":"Heading-module_animation-fadeIn__3jlOG","animation-fadeInFast":"Heading-module_animation-fadeInFast__b41KH Heading-module_animation-fadeIn__3jlOG","animation-fadeInSlow":"Heading-module_animation-fadeInSlow__1G1o5 Heading-module_animation-fadeIn__3jlOG","main":"Heading-module_main__35wWK","tagline":"Heading-module_tagline__pvHO5","subtitle":"Heading-module_subtitle__19eD8","animating":"Heading-module_animating__1ziJR","hasTagline":"Heading-module_hasTagline__Pgn8c","defaultSubtitleMargin":"Heading-module_defaultSubtitleMargin__kwuqM","right":"Heading-module_right__1TJKF","light":"Heading-module_light__1TQE8","dark":"Heading-module_dark__18iWa","centerRagged":"Heading-module_centerRagged__388sq","center":"Heading-module_center__38lDY","centerConstrained":"Heading-module_centerConstrained__2eXE6","forcePaddingTop":"Heading-module_forcePaddingTop__30Juh"};

function Heading({
  configuration,
  sectionProps,
  contentElementWidth
}) {
  const level = configuration.level || sectionProps.sectionIndex;
  const firstSectionInEntry = level === 0;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const darkBackground = useDarkBackground();
  const {
    isSelected,
    isEditable
  } = useContentElementEditorState();
  const legacyValue = configuration.children;
  const Tag = firstSectionInEntry ? 'h1' : 'h2';
  const forcePaddingTop = firstSectionInEntry && !('marginTop' in configuration);
  const entranceAnimation = !useIsStaticPreview() && configuration.entranceAnimation || 'none';
  const [animating, setAnimating] = useState(false);
  useContentElementLifecycle({
    onActivate() {
      setAnimating(entranceAnimation !== 'none');
    },
    onInvisible() {
      if (isEditable) {
        setAnimating(false);
      }
    }
  });
  const previousAnimation = useRef(entranceAnimation);
  const previouslySelected = useRef(isSelected);
  useEffect(() => {
    if (isEditable && previousAnimation.current !== entranceAnimation) {
      previousAnimation.current = entranceAnimation;
      setAnimating(false);
      setTimeout(() => setAnimating(true), 100);
    }
  }, [entranceAnimation, isEditable]);
  useEffect(() => {
    if (!previouslySelected.current && isSelected) {
      setAnimating(true);
    }
    previouslySelected.current = isSelected;
  }, [isSelected]);
  function renderSubtitle(name) {
    const value = configuration[name];
    if (!isSelected && utils.isBlankEditableTextValue(value)) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Text, {
      scaleCategory: getScaleCategory(configuration, firstSectionInEntry, name),
      typographyVariant: configuration.typographyVariant
    }, /*#__PURE__*/React.createElement("div", {
      className: styles[name],
      role: "doc-subtitle"
    }, /*#__PURE__*/React.createElement(EditableInlineText, {
      value: value,
      hyphens: configuration.hyphens,
      placeholder: t(`pageflow_scrolled.inline_editing.type_${name}`),
      onChange: value => updateConfiguration({
        [name]: value
      })
    })));
  }
  return /*#__PURE__*/React.createElement("header", {
    className: classNames(styles.root, styles[`animation-${entranceAnimation}`], {
      [styles.animating]: animating
    }, {
      [styles.hasTagline]: !utils.isBlankEditableTextValue(configuration.tagline) || isSelected
    }, {
      [styles.defaultSubtitleMargin]: !utils.isBlankEditableTextValue(configuration.subtitle) && !configuration.marginBottom
    }, {
      [styles.forcePaddingTop]: forcePaddingTop
    }, {
      [styles[sectionProps.layout]]: contentElementWidth > contentElementWidths.md || sectionProps.layout === 'centerRagged'
    }, {
      [styles.centerConstrained]: sectionProps.constrainContentWidth && contentElementWidth === contentElementWidths.lg
    }, {
      [withShadowClassName]: !sectionProps.invert
    })
  }, renderSubtitle('tagline'), /*#__PURE__*/React.createElement(Tag, {
    className: classNames(styles.main, 'scope-headings', configuration.typographyVariant && `typography-heading-${configuration.typographyVariant}`, darkBackground ? styles.light : styles.dark),
    style: {
      color: paletteColor(configuration.color)
    }
  }, /*#__PURE__*/React.createElement(Text, {
    scaleCategory: getScaleCategory(configuration, firstSectionInEntry),
    inline: true
  }, /*#__PURE__*/React.createElement(EditableInlineText, {
    value: configuration.value,
    defaultValue: legacyValue,
    hyphens: configuration.hyphens,
    placeholder: firstSectionInEntry ? t('pageflow_scrolled.inline_editing.type_title') : t('pageflow_scrolled.inline_editing.type_heading'),
    onChange: value => updateConfiguration({
      value
    })
  }))), renderSubtitle('subtitle'));
}
function getScaleCategory(configuration, firstSectionInEntry, suffix = '') {
  const base = `heading${capitalize(suffix)}`;
  switch (configuration.textSize) {
    case 'large':
      return `${base}-lg`;
    case 'medium':
      return `${base}-md`;
    case 'small':
      return `${base}-sm`;
    default:
      return firstSectionInEntry ? `${base}-lg` : `${base}-sm`;
  }
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

frontend.contentElementTypes.register('heading', {
  component: Heading,
  lifecycle: true
});

function InlineImage({
  contentElementId,
  contentElementWidth,
  configuration
}) {
  const imageFile = useFileWithCropPosition(useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'id'
  }), configuration.cropPosition);
  const portraitImageFile = useFileWithCropPosition(useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitId'
  }), configuration.portraitCropPosition);

  // Only render OrientationAwareInlineImage if a portrait image has
  // been selected. This prevents having the component rerender on
  // orientation changes even if it does not depend on orientation at
  // all.
  if (portraitImageFile) {
    return /*#__PURE__*/React.createElement(OrientationAwareInlineImage, {
      landscapeImageFile: imageFile,
      portraitImageFile: portraitImageFile,
      landscapeImageModifiers: configuration.imageModifiers,
      portraitImageModifiers: configuration.portraitImageModifiers,
      contentElementId: contentElementId,
      contentElementWidth: contentElementWidth,
      configuration: configuration
    });
  } else {
    return /*#__PURE__*/React.createElement(ImageWithCaption, {
      imageFile: imageFile,
      imageModifiers: configuration.imageModifiers,
      contentElementId: contentElementId,
      contentElementWidth: contentElementWidth,
      configuration: configuration
    });
  }
}
function OrientationAwareInlineImage({
  landscapeImageFile,
  portraitImageFile,
  landscapeImageModifiers,
  portraitImageModifiers,
  contentElementId,
  contentElementWidth,
  configuration
}) {
  const portraitOrientation = usePortraitOrientation();
  const imageFile = portraitOrientation && portraitImageFile ? portraitImageFile : landscapeImageFile;
  const imageModifiers = portraitOrientation && portraitImageFile ? portraitImageModifiers : landscapeImageModifiers;
  return /*#__PURE__*/React.createElement(ImageWithCaption, {
    imageFile: imageFile,
    imageModifiers: imageModifiers,
    contentElementId: contentElementId,
    contentElementWidth: contentElementWidth,
    configuration: configuration
  });
}
function ImageWithCaption({
  imageFile,
  imageModifiers,
  contentElementId,
  contentElementWidth,
  configuration
}) {
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const {
    enableFullscreen
  } = configuration;
  const supportFullscreen = enableFullscreen && contentElementWidth < contentElementWidths.full;
  const {
    aspectRatio,
    rounded
  } = processImageModifiers(imageModifiers);
  const isCircleCrop = rounded === 'circle';
  return /*#__PURE__*/React.createElement(FitViewport, {
    file: imageFile,
    aspectRatio: aspectRatio,
    fallbackAspectRatio: 0.75
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    borderRadius: isCircleCrop ? 'none' : rounded,
    configuration: isCircleCrop ? undefined : configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(ContentElementBox, {
    borderRadius: isCircleCrop ? 'circle' : 'none',
    configuration: isCircleCrop ? configuration : undefined,
    positioned: isCircleCrop
  }, /*#__PURE__*/React.createElement(ExpandableImage, {
    enabled: supportFullscreen && shouldLoad,
    imageFile: imageFile,
    contentElementId: contentElementId
  }, /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: imageFile
  }), /*#__PURE__*/React.createElement(Image, Object.assign({
    imageFile: imageFile,
    load: shouldLoad,
    structuredData: true
  }, imageVariantAndSizes(contentElementWidth), {
    preferSvg: true
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  }));
}
function imageVariantAndSizes(contentElementWidth) {
  if (!features.isEnabled('image_srcset')) {
    return {
      variant: contentElementWidth === contentElementWidths.full ? 'large' : 'medium'
    };
  }
  if (contentElementWidth >= contentElementWidths.xl) {
    return {
      variant: ['medium', 'large', 'ultra'],
      sizes: contentElementWidth === contentElementWidths.full ? '100vw' : '(min-width: 950px) 1200px, 100vw'
    };
  }
  if (contentElementWidth >= contentElementWidths.md) {
    return {
      variant: ['medium', 'large'],
      sizes: '(min-width: 950px) 950px, 100vw'
    };
  }
  return {
    variant: 'medium'
  };
}

frontend.contentElementTypes.register('inlineImage', {
  component: InlineImage,
  lifecycle: true
});

var styles$1 = {"wrapper":"MutedIndicator-module_wrapper__17JUY","visible":"MutedIndicator-module_visible__3qARn","besideFullscreenButton":"MutedIndicator-module_besideFullscreenButton__2LOsb","eqBar":"MutedIndicator-module_eqBar__1cMDE","eqBar1":"MutedIndicator-module_eqBar1__2Ap_R MutedIndicator-module_eqBar__1cMDE","short-eq":"MutedIndicator-module_short-eq__1OYlk","eqBar2":"MutedIndicator-module_eqBar2__2QTgX MutedIndicator-module_eqBar__1cMDE","tall-eq":"MutedIndicator-module_tall-eq__6gm0B","eqBar3":"MutedIndicator-module_eqBar3__2S-y3 MutedIndicator-module_eqBar__1cMDE"};

function MutedIndicator({
  visible,
  besideFullscreenButton
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, {
      [styles$1.visible]: visible,
      [styles$1.besideFullscreenButton]: besideFullscreenButton
    })
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("rect", {
    className: styles$1.eqBar1,
    x: "4",
    y: "4",
    width: "3.7",
    height: "8"
  }), /*#__PURE__*/React.createElement("rect", {
    className: styles$1.eqBar2,
    x: "10.2",
    y: "4",
    width: "3.7",
    height: "16"
  }), /*#__PURE__*/React.createElement("rect", {
    className: styles$1.eqBar3,
    x: "16.3",
    y: "4",
    width: "3.7",
    height: "11"
  })));
}

var styles$2 = {"container":"FullscreenVideo-module_container__1CBJ8","button":"FullscreenVideo-module_button__Hu9pF","fadedOut":"FullscreenVideo-module_fadedOut__2kQKp"};

const FullscreenActiveContext = createContext(false);

// Whether the surrounding video is currently displayed in fullscreen.
// Lets descendants (e.g. the lifecycle handlers) tell an entering
// fullscreen apart from the element scrolling out of the viewport.
function useFullscreenActive() {
  return useContext(FullscreenActiveContext);
}

// Wraps a video player and adds a corner button that toggles real
// device fullscreen. Uses the Fullscreen API via screenfull where
// available (desktop and Android) so that the custom controls rendered
// inside the container remain visible. On iPhone, where the Fullscreen
// API is not available for arbitrary elements, hands off to the native
// video player overlay via webkitEnterFullscreen. Exiting via the
// platform (Esc, Android back gesture, native player) is picked up
// through the change events.
function FullscreenVideo({
  playerState,
  keepButtonVisible,
  children
}) {
  const {
    mediaElementId
  } = playerState;
  const containerRef = useRef();
  const isPhonePlatform = usePhonePlatform();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsInactive = usePlayerControlsInactive(playerState);
  const fadedOut = playerState.shouldPlay && controlsInactive && !keepButtonVisible;
  const getVideoElement = useCallback(() => {
    var _containerRef$current;
    if (mediaElementId) {
      const element = document.getElementById(mediaElementId);
      if (element) {
        return element;
      }
    }
    return (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.querySelector('video');
  }, [mediaElementId]);
  const enterFullscreen = useCallback(() => {
    const video = getVideoElement();
    if (isPhonePlatform && (video === null || video === void 0 ? void 0 : video.webkitEnterFullscreen)) {
      video.webkitEnterFullscreen();
    } else if (screenfull.isEnabled && containerRef.current) {
      screenfull.request(containerRef.current);
    }
    setIsFullscreen(true);
  }, [getVideoElement, isPhonePlatform]);
  const exitFullscreen = useCallback(() => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit();
    }
    const video = getVideoElement();
    if (video === null || video === void 0 ? void 0 : video.webkitDisplayingFullscreen) {
      video.webkitExitFullscreen();
    }
    setIsFullscreen(false);
  }, [getVideoElement]);
  useEffect(() => {
    function handleScreenfullChange() {
      if (!screenfull.isFullscreen) {
        setIsFullscreen(false);
      }
    }
    function handleNativePlayerExit() {
      setIsFullscreen(false);
    }
    if (screenfull.isEnabled) {
      screenfull.on('change', handleScreenfullChange);
    }
    const video = getVideoElement();
    if (video) {
      video.addEventListener('webkitendfullscreen', handleNativePlayerExit);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleScreenfullChange);
      }
      if (video) {
        video.removeEventListener('webkitendfullscreen', handleNativePlayerExit);
      }
    };
  }, [getVideoElement]);
  return /*#__PURE__*/React.createElement(FullscreenActiveContext.Provider, {
    value: isFullscreen
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: styles$2.container
  }, children, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.button, {
      [styles$2.fadedOut]: fadedOut
    })
  }, /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
    isFullscreen: isFullscreen,
    onEnter: enterFullscreen,
    onExit: exitFullscreen
  }))));
}

function getLifecycleHandlers({
  configuration,
  playerActions,
  mediaMuted,
  isFullscreen
}) {
  return {
    onVisible() {
      if (configuration.playbackMode === 'loop') {
        playerActions.play();
      }
    },
    onActivate() {
      if (configuration.playbackMode === 'autoplay' || !configuration.playbackMode && configuration.autoplay || configuration.playbackMode === 'autoplayIfUnmuted' && !mediaMuted) {
        playerActions.play({
          via: 'autoplay'
        });
      }
    },
    onDeactivate() {
      // Entering fullscreen can move the element out of the viewport
      // center and trigger a spurious deactivation. Keep playing then.
      if (configuration.playbackMode !== 'loop' && !isFullscreen) {
        playerActions.fadeOutAndPause(400);
      }
    },
    onEnterBackground() {
      if (configuration.playbackMode === 'loop') {
        playerActions.changeVolumeFactor(0, 400);
      }
    },
    onEnterForeground() {
      if (configuration.playbackMode === 'loop') {
        playerActions.changeVolumeFactor(1, 400);
      }
    },
    onInvisible() {
      if (configuration.playbackMode === 'loop') {
        playerActions.fadeOutAndPause(400);
      }
    }
  };
}
function getPlayerClickHandler({
  configuration,
  playerActions,
  shouldPlay,
  lastControlledVia,
  mediaMuted,
  isEditable,
  isSelected
}) {
  if (isEditable && !isSelected) {
    return null;
  } else if (configuration.playbackMode === 'loop') {
    if (mediaMuted && !configuration.keepMuted) {
      return () => playerActions.playBlessed();
    } else {
      return null;
    }
  } else if (configuration.keepMuted) {
    return () => {
      if (shouldPlay) {
        playerActions.pause();
      } else {
        playerActions.play();
      }
    };
  } else {
    return () => {
      if (shouldPlay && mediaMuted) {
        if (configuration.rewindOnUnmute && lastControlledVia === 'autoplay') {
          playerActions.seekTo(0);
        }
        playerActions.playBlessed();
      } else if (shouldPlay) {
        playerActions.pause();
      } else {
        playerActions.playBlessed();
      }
    };
  }
}

function InlineVideo({
  contentElementId,
  configuration,
  sectionProps
}) {
  const videoFile = useFileWithCropPosition(useFileWithInlineRights({
    configuration,
    collectionName: 'videoFiles',
    propertyName: 'id'
  }), configuration.cropPosition);
  const posterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'posterId'
  });
  const portraitVideoFile = useFileWithCropPosition(useFileWithInlineRights({
    configuration,
    collectionName: 'videoFiles',
    propertyName: 'portraitId'
  }), configuration.portraitCropPosition);
  const portraitPosterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitPosterId'
  });
  if (portraitVideoFile) {
    return /*#__PURE__*/React.createElement(OrientationAwareInlineVideo, {
      landscapeVideoFile: videoFile,
      portraitVideoFile: portraitVideoFile,
      landscapeMotifArea: configuration.motifArea,
      portraitMotifArea: configuration.portraitMotifArea,
      landscapeImageModifiers: configuration.imageModifiers,
      portraitImageModifiers: configuration.portraitImageModifiers,
      landscapePosterImageFile: posterImageFile,
      portraitPosterImageFile: portraitPosterImageFile,
      contentElementId: contentElementId,
      sectionProps: sectionProps,
      configuration: configuration
    });
  } else {
    return /*#__PURE__*/React.createElement(OrientationUnawareInlineVideo, {
      videoFile: videoFile,
      motifArea: configuration.motifArea,
      imageModifiers: configuration.imageModifiers,
      posterImageFile: posterImageFile,
      contentElementId: contentElementId,
      sectionProps: sectionProps,
      configuration: configuration
    });
  }
}
function OrientationAwareInlineVideo({
  landscapeVideoFile,
  portraitVideoFile,
  landscapePosterImageFile,
  portraitPosterImageFile,
  landscapeMotifArea,
  portraitMotifArea,
  landscapeImageModifiers,
  portraitImageModifiers,
  contentElementId,
  configuration,
  sectionProps
}) {
  const portraitOrientation = usePortraitOrientation();
  const videoFile = portraitOrientation && portraitVideoFile ? portraitVideoFile : landscapeVideoFile;
  const motifArea = portraitOrientation && portraitVideoFile ? portraitMotifArea : landscapeMotifArea;
  const imageModifiers = portraitOrientation && portraitVideoFile ? portraitImageModifiers : landscapeImageModifiers;
  const posterImageFile = portraitOrientation && portraitPosterImageFile ? portraitPosterImageFile : landscapePosterImageFile;
  return /*#__PURE__*/React.createElement(OrientationUnawareInlineVideo, {
    key: portraitOrientation,
    videoFile: videoFile,
    motifArea: motifArea,
    imageModifiers: imageModifiers,
    posterImageFile: posterImageFile,
    contentElementId: contentElementId,
    sectionProps: sectionProps,
    configuration: configuration
  });
}
function OrientationUnawareInlineVideo({
  videoFile,
  posterImageFile,
  imageModifiers,
  contentElementId,
  configuration,
  sectionProps,
  motifArea
}) {
  const [playerState, playerActions] = usePlayerState();
  const inlineFileRightsItems = [{
    label: 'video',
    file: videoFile
  }, {
    label: 'poster',
    file: posterImageFile
  }];
  const Player = (sectionProps === null || sectionProps === void 0 ? void 0 : sectionProps.containerDimension) && motifArea ? CropPositionComputingPlayer : PlayerWithControlBar;
  const {
    aspectRatio,
    rounded
  } = processImageModifiers(imageModifiers);
  const supportFullscreen = configuration.enableFullscreen && configuration.position !== 'backdrop' && configuration.playbackMode !== 'loop';
  const mutedIndicatorVisible = media.muted && playerState.shouldPlay && !configuration.keepMuted;
  const player = /*#__PURE__*/React.createElement(Player, {
    key: configuration.playbackMode === 'loop',
    sectionProps: sectionProps,
    videoFile: videoFile,
    motifArea: motifArea,
    posterImageFile: posterImageFile,
    inlineFileRightsItems: inlineFileRightsItems,
    playerState: playerState,
    playerActions: playerActions,
    contentElementId: contentElementId,
    configuration: configuration,
    fit: aspectRatio || configuration.position === 'backdrop' ? 'cover' : 'contain',
    hideControlBar: rounded === 'circle' || configuration.hideControlBar || configuration.playbackMode === 'loop',
    applyContentElementBoxStyles: rounded === 'circle'
  });
  return /*#__PURE__*/React.createElement(MediaInteractionTracking, {
    playerState: playerState,
    playerActions: playerActions
  }, /*#__PURE__*/React.createElement(FitViewport, {
    file: videoFile,
    aspectRatio: aspectRatio,
    fallbackAspectRatio: fallbackAspectRatio,
    fill: configuration.position === 'backdrop'
  }, renderContentElementBox({
    rounded,
    configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: videoFile
  }), /*#__PURE__*/React.createElement(MutedIndicator, {
    visible: mutedIndicatorVisible,
    besideFullscreenButton: supportFullscreen
  }), supportFullscreen ? /*#__PURE__*/React.createElement(FullscreenVideo, {
    playerState: playerState,
    keepButtonVisible: mutedIndicatorVisible
  }, player) : player))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: inlineFileRightsItems
  })));
}
function renderContentElementBox({
  rounded,
  configuration
}, children) {
  if (rounded === 'circle') {
    const {
      style,
      className
    } = contentElementBoxProps(configuration, {
      borderRadius: 'circle'
    });
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: style
    }, children);
  }
  return /*#__PURE__*/React.createElement(ContentElementBox, {
    borderRadius: rounded,
    configuration: configuration
  }, children);
}
function CropPositionComputingPlayer({
  videoFile,
  motifArea,
  ...props
}) {
  const videoFileWithMotifArea = useBackgroundFile({
    file: videoFile,
    motifArea,
    containerDimension: props.sectionProps.containerDimension
  });
  return /*#__PURE__*/React.createElement(PlayerWithControlBar, Object.assign({}, props, {
    videoFile: videoFileWithMotifArea
  }));
}
function PlayerWithControlBar({
  videoFile,
  posterImageFile,
  inlineFileRightsItems,
  playerState,
  playerActions,
  contentElementId,
  configuration,
  sectionProps,
  fit,
  hideControlBar,
  applyContentElementBoxStyles
}) {
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const isFullscreen = useFullscreenActive();
  const {
    shouldLoad,
    shouldPrepare
  } = useContentElementLifecycle(getLifecycleHandlers({
    configuration,
    playerActions,
    mediaMuted: media.muted,
    isFullscreen
  }));
  useAudioFocus({
    key: contentElementId,
    request: playerState.shouldPlay,
    onLost() {
      if (configuration.playbackMode !== 'loop') {
        playerActions.fadeOutAndPause(400);
      }
    }
  });
  const onPlayerClick = getPlayerClickHandler({
    configuration,
    playerActions,
    shouldPlay: playerState.shouldPlay,
    lastControlledVia: playerState.lastControlledVia,
    mediaMuted: media.muted,
    isEditable,
    isSelected
  });
  useEffect(() => {
    if (configuration.playbackMode !== 'loop') {
      return;
    }
    let documentState = documentHiddenState(visibilityState => {
      if (visibilityState === 'hidden') {
        playerActions.fadeOutAndPause(400);
      } else {
        playerActions.play();
      }
    });
    return () => documentState.removeCallback();
  }, [playerActions, configuration.playbackMode]);
  return /*#__PURE__*/React.createElement(VideoPlayerControls, {
    videoFile: videoFile,
    fadedOut: sectionProps.isIntersecting,
    sticky: configuration.position === 'backdrop',
    defaultTextTrackFilePermaId: configuration.defaultTextTrackFileId,
    playerState: playerState,
    playerActions: playerActions,
    hideControlBar: hideControlBar,
    hideBigPlayButton: configuration.playbackMode === 'loop',
    inlineFileRightsItems: inlineFileRightsItems,
    configuration: configuration,
    onPlayerClick: onPlayerClick
  }, /*#__PURE__*/React.createElement(PlayerEventContextDataProvider, {
    playerDescription: "Inline Video",
    playbackMode: configuration.playbackMode || (configuration.autoplay ? 'autoplay' : 'manual')
  }, /*#__PURE__*/React.createElement(VideoPlayer, {
    load: shouldPrepare ? 'auto' : shouldLoad ? 'poster' : 'none',
    loop: configuration.playbackMode === 'loop',
    fit: fit,
    playerState: playerState,
    playerActions: playerActions,
    videoFile: videoFile,
    posterImageFile: posterImageFile,
    defaultTextTrackFilePermaId: configuration.defaultTextTrackFileId,
    quality: 'high',
    playsInline: true,
    atmoDuringPlayback: configuration.atmoDuringPlayback,
    applyContentElementBoxStyles: applyContentElementBoxStyles
  })));
}
const fallbackAspectRatio = 0.5625;

frontend.contentElementTypes.register('inlineVideo', {
  component: InlineVideo,
  lifecycle: true
});

function InlineAudio({
  contentElementId,
  configuration
}) {
  const audioFile = useFileWithInlineRights({
    configuration,
    collectionName: 'audioFiles',
    propertyName: 'id'
  });
  const posterImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'posterId'
  });
  const [playerState, playerActions] = usePlayerState();
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    shouldLoad,
    shouldPrepare
  } = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay && !media.muted) {
        playerActions.play();
      }
    },
    onDeactivate() {
      playerActions.fadeOutAndPause(400);
    }
  });
  useAudioFocus({
    key: contentElementId,
    request: playerState.shouldPlay,
    onLost() {
      playerActions.fadeOutAndPause(400);
    }
  });
  const onPlayerClick = () => {
    if (isEditable && !isSelected) {
      return;
    }
    if (playerState.shouldPlay) {
      playerActions.pause();
    } else {
      playerActions.playBlessed();
    }
  };
  const inlineFileRightsItems = [{
    label: 'audio',
    file: audioFile
  }, {
    label: 'image',
    file: posterImageFile
  }];
  return /*#__PURE__*/React.createElement(FitViewport, {
    file: posterImageFile
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: posterImageFile && configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(AudioPlayerControls, {
    audioFile: audioFile,
    defaultTextTrackFilePermaId: configuration.defaultTextTrackFileId,
    playerState: playerState,
    playerActions: playerActions,
    standAlone: !posterImageFile,
    inlineFileRightsItems: inlineFileRightsItems,
    configuration: configuration,
    onPlayerClick: onPlayerClick
  }, /*#__PURE__*/React.createElement(PlayerEventContextDataProvider, {
    playerDescription: "Inline Audio",
    playbackMode: configuration.autoplay ? 'autoplay' : 'manual'
  }, /*#__PURE__*/React.createElement(AudioPlayer, {
    load: shouldPrepare ? 'auto' : shouldLoad ? 'poster' : 'none',
    controls: configuration.controls,
    playerState: playerState,
    playerActions: playerActions,
    audioFile: audioFile,
    posterImageFile: posterImageFile,
    defaultTextTrackFilePermaId: configuration.defaultTextTrackFileId,
    quality: 'high',
    playsInline: true,
    atmoDuringPlayback: configuration.atmoDuringPlayback
  })))))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: inlineFileRightsItems
  }));
}

frontend.contentElementTypes.register('inlineAudio', {
  component: InlineAudio,
  lifecycle: true
});

var styles$3 = {"soundDisclaimer":"SoundDisclaimer-module_soundDisclaimer__31hWh","unmute":"SoundDisclaimer-module_unmute__1V4Ab","unmuted":"SoundDisclaimer-module_unmuted__22CJ5","active":"SoundDisclaimer-module_active__11_kc"};

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
var MutedIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "volume-mute",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-volume-mute"] || "fa-volume-mute") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"
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
var UnmutedIcon = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends$1({
  "aria-hidden": "true",
  "data-prefix": "fas",
  "data-icon": "volume-mute",
  className: (styles["svg-inline--fa"] || "svg-inline--fa") + " " + (styles["fa-volume-mute"] || "fa-volume-mute") + " " + (styles["fa-w-16"] || "fa-w-16"),
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M232.36 64.01a24.007 24.007 0 00-1.176.002c-5.703.15-11.464 2.348-16.155 7.039L126.061 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-14.293-11.514-23.733-23.64-24.01zm149.5 31.994c-8.107-.16-16.098 3.814-20.75 11.217-7.09 11.28-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256c0-63.53-32.06-121.94-85.77-156.24a23.808 23.808 0 00-12.37-3.756zm-55.032 80.174c-8.51-.046-16.795 4.42-21.209 12.402-6.39 11.61-2.159 26.2 9.451 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88 0-31.88-17.54-61.32-45.78-76.86a23.987 23.987 0 00-11.402-2.952z"
})));

function SoundDisclaimer({
  configuration
}) {
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    t
  } = useI18n();
  const muted = useMediaMuted();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.soundDisclaimer),
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$3.unmute, {
      [styles$3.active]: muted
    }),
    onClick: () => media.mute(false)
  }, /*#__PURE__*/React.createElement(MutedIcon, null), /*#__PURE__*/React.createElement("p", null, configuration.mutedText || t('pageflow_scrolled.public.sound_disclaimer.help_muted'))), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.unmuted, {
      [styles$3.active]: !muted
    })
  }, /*#__PURE__*/React.createElement(UnmutedIcon, null), /*#__PURE__*/React.createElement("p", null, configuration.unmutedText || t('pageflow_scrolled.public.sound_disclaimer.help_unmuted'))));
}

frontend.contentElementTypes.register('soundDisclaimer', {
  component: SoundDisclaimer
});

var styles$4 = {"breakpoint-sm":"(min-width: 640px)","text":"TextBlock-module_text__21Hk4","quoteDesign-hanging":"TextBlock-module_quoteDesign-hanging__1c9AW","quoteDesign-largeHanging":"TextBlock-module_quoteDesign-largeHanging__2VkIW","layout-centerRagged":"TextBlock-module_layout-centerRagged__1tjoI"};

function TextBlock(props) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const theme = useTheme();
  const className = classNames(styles$4.text, styles$4[`quoteDesign-${theme.options.quoteDesign || 'largeHanging'}`], styles$4[`layout-${props.sectionProps.layout}`]);
  return /*#__PURE__*/React.createElement(EditableText, {
    value: props.configuration.value,
    contentElementId: props.contentElementId,
    className: className,
    selectionRect: true,
    placeholder: t('pageflow_scrolled.inline_editing.type_text'),
    onChange: (value, options) => updateConfiguration({
      value
    }, options)
  });
}

frontend.contentElementTypes.register('textBlock', {
  component: TextBlock,
  customSelectionRect: true,
  inlineComments: true,
  supportsWrappingAroundFloats: true,
  defaultMarginTop: '1.375rem'
});

var styles$5 = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","breakpoint-sm":"(min-width: 640px)","item":"ExternalLink-module_item__pIdgb","outlined":"ExternalLink-module_outlined__2fwWe","highlighted":"ExternalLink-module_highlighted__3AbWZ","selected":"ExternalLink-module_selected__1GFC_","cardWrapper":"ExternalLink-module_cardWrapper__4IWTr","card":"ExternalLink-module_card__ww6Pq","moreLink":"ExternalLink-module_moreLink__col8J","moreLinkLabel":"ExternalLink-module_moreLinkLabel__3i8kF","titleLink":"ExternalLink-module_titleLink__4imZn","textPosition-below":"ExternalLink-module_textPosition-below__nxm4V","textPosition-right":"ExternalLink-module_textPosition-right__3IHdZ","link":"ExternalLink-module_link__dvyzo","textPosition-overlay":"ExternalLink-module_textPosition-overlay__1Y3PX","textPosition-none":"ExternalLink-module_textPosition-none__3pjcu ExternalLink-module_textPosition-below__nxm4V","textPosition-title":"ExternalLink-module_textPosition-title__2pZoW ExternalLink-module_textPosition-none__3pjcu ExternalLink-module_textPosition-below__nxm4V","thumbnail":"ExternalLink-module_thumbnail__24QzG","thumbnailSize-medium":"ExternalLink-module_thumbnailSize-medium__R0eu7","thumbnailSize-large":"ExternalLink-module_thumbnailSize-large__2siDe","light":"ExternalLink-module_light__3vIh1 scope-darkContent","dark":"ExternalLink-module_dark__1bh5x scope-lightContent","background":"ExternalLink-module_background__3GS-M","front":"ExternalLink-module_front__GnMIq","details":"ExternalLink-module_details__ewX5o","description":"ExternalLink-module_description__2gz2x","button":"ExternalLink-module_button__2lYHG","align-center":"ExternalLink-module_align-center__2c7VT","align-right":"ExternalLink-module_align-right__2qpdE","inlineFileRightsAfterCard":"ExternalLink-module_inlineFileRightsAfterCard__2TLR0"};

var styles$6 = {"outer":"Flippable-module_outer__2mhzE","flippable":"Flippable-module_flippable__x52Ms","flipped":"Flippable-module_flipped__1TbzS","teaseFlip":"Flippable-module_teaseFlip__2X7IU","flipButton":"Flippable-module_flipButton__336gt"};

const FlippedItemContext = React.createContext();
function FlippedItemProvider({
  children
}) {
  const [flippedId, setFlippedId] = useState(null);
  const value = useMemo(() => [flippedId, setFlippedId], [flippedId]);
  const ref = useRef();
  useEffect(() => {
    function reset(event) {
      if (!ref.current.contains(event.target)) {
        setFlippedId(currentFlippedId => {
          if (currentFlippedId !== flippedId) {
            // Do not reset, if state has already been altered in this
            // click event by a flip action button. Since flip action
            // buttons live in floating portals, they are not handled
            // by the the above contains check.
            return currentFlippedId;
          } else {
            return null;
          }
        });
      }
    }
    if (flippedId) {
      document.addEventListener('click', reset);
      return () => document.removeEventListener('click', reset);
    }
  }, [flippedId]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement(FlippedItemContext.Provider, {
    value: value
  }, children));
}
function useFlippedItem(id) {
  const [flippedId, setFlippedId] = useContext(FlippedItemContext);
  const toggle = useCallback(() => {
    setFlippedId(flippedId => flippedId === id ? null : id);
  }, [id, setFlippedId]);
  return [flippedId === id, toggle];
}

function Flippable({
  contentElementId,
  linkId,
  actionButtonVisible,
  front,
  back
}) {
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const {
    t: uiTranslate
  } = useI18n({
    locale: 'ui'
  });
  const {
    t
  } = useI18n();
  const backfaceId = `teaser-${contentElementId}-${linkId}-backface`;
  const [isFlipped, toggle] = useFlippedItem(linkId);
  function handleClick(event) {
    if (!isEditable && !event.target.closest('a, button')) {
      toggle();
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$6.outer
  }, !isEditable && /*#__PURE__*/React.createElement("button", {
    "aria-label": t('pageflow_scrolled.public.flip_card'),
    "aria-expanded": isFlipped ? 'true' : 'false',
    "aria-controls": backfaceId,
    className: styles$6.flipButton,
    onClick: toggle
  }), /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$6.flippable, {
      [styles$6.flipped]: isFlipped
    }, {
      [styles$6.teaseFlip]: !isSelected
    }),
    onClick: handleClick
  }, /*#__PURE__*/React.createElement("div", {
    inert: isFlipped ? 'true' : undefined
  }, front), /*#__PURE__*/React.createElement("div", {
    id: backfaceId,
    inert: isFlipped ? undefined : 'true'
  }, back)), actionButtonVisible && /*#__PURE__*/React.createElement(ActionButton, {
    icon: "background",
    position: "topRight",
    portal: true,
    text: uiTranslate('pageflow_scrolled.inline_editing.flip_card'),
    onClick: toggle
  }));
}

var styles$7 = {"thumbnail":"Thumbnail-module_thumbnail__3t8ND","cover":"Thumbnail-module_cover__3OoBo"};

function Thumbnail({
  imageFile,
  aspectRatio,
  cropPosition,
  fit,
  linkWidth,
  load,
  showPlaceholder,
  renderImageLink,
  children
}) {
  imageFile = {
    ...imageFile,
    cropPosition
  };
  const aspectRatioPadding = getAspectRatioPadding(aspectRatio, imageFile);
  const {
    variant,
    sizes
  } = variantAndSizes({
    aspectRatio,
    cropPosition,
    fit,
    linkWidth
  });
  const image = /*#__PURE__*/React.createElement(Image, {
    imageFile: imageFile,
    load: load,
    preferSvg: true,
    variant: variant,
    sizes: sizes,
    fit: fit
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$7.thumbnail, {
      [styles$7.cover]: fit === 'cover'
    }),
    style: {
      paddingTop: aspectRatioPadding
    }
  }, showPlaceholder && /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: imageFile
  }), renderImageLink ? renderImageLink(image) : image, children);
}
function variantAndSizes({
  aspectRatio,
  cropPosition,
  fit,
  linkWidth
}) {
  const needsUncropped = aspectRatio && aspectRatio !== 'wide' || cropPosition || fit === 'contain';
  const bucket = linkWidthBucket(linkWidth);
  if (!features.isEnabled('image_srcset') || bucket === 'small') {
    return {
      variant: needsUncropped ? 'medium' : 'linkThumbnailLarge'
    };
  }
  if (bucket === 'medium') {
    return {
      variant: ['medium', 'large'],
      sizes: '(min-width: 950px) 50vw, 100vw'
    };
  }
  return {
    variant: ['medium', 'large', 'ultra']
  };
}
function linkWidthBucket(linkWidth) {
  if (linkWidth === 'xl' || linkWidth === 'xxl') {
    return 'large';
  }
  if (linkWidth === 'm' || linkWidth === 'l') {
    return 'medium';
  }
  return 'small';
}
function getAspectRatioPadding(aspectRatio, imageFile) {
  if (aspectRatio === 'original' && imageFile) {
    return `${imageFile.height / imageFile.width * 100}%`;
  }
}

const scaleCategorySuffixes = {
  small: 'sm',
  medium: 'md',
  large: 'lg'
};
function ExternalLink({
  id,
  configuration,
  contentElementId,
  ...props
}) {
  var _itemLinks$id, _itemLinks$id2;
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    t: translateWithEntryLocale
  } = useI18n();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const itemTexts = configuration.itemTexts || {};
  const itemLinks = configuration.itemLinks || {};
  const thumbnailImageFile = useFileWithInlineRights({
    configuration: props,
    collectionName: 'imageFiles',
    propertyName: 'thumbnail'
  });
  function handleTextChange(propertyName, value) {
    updateConfiguration({
      itemTexts: {
        ...itemTexts,
        [id]: {
          ...itemTexts[id],
          [propertyName]: value
        }
      }
    });
  }
  function handleLinkChange(value) {
    if (value) {
      var _itemTexts$id;
      if (utils.isBlankEditableTextValue((_itemTexts$id = itemTexts[id]) === null || _itemTexts$id === void 0 ? void 0 : _itemTexts$id.link)) {
        handleTextChange('link', [{
          type: 'heading',
          children: [{
            text: translateWithEntryLocale('pageflow_scrolled.public.more')
          }]
        }]);
      }
    } else {
      handleTextChange('link', [{
        type: 'heading',
        children: [{
          text: ''
        }]
      }]);
    }
    updateConfiguration({
      itemLinks: {
        ...itemLinks,
        [id]: value
      }
    });
  }
  const legacyTexts = useMemo(() => ({
    title: [{
      type: 'heading',
      children: [{
        text: props.title || ''
      }]
    }],
    description: [{
      type: 'paragraph',
      children: [{
        text: props.description || ''
      }]
    }]
  }), [props.title, props.description]);
  function presentOrEditing(propertyName) {
    var _itemTexts$id2, _itemTexts$id3, _itemTexts$id4, _itemTexts$id5;
    return !utils.isBlankEditableTextValue(((_itemTexts$id2 = itemTexts[id]) === null || _itemTexts$id2 === void 0 ? void 0 : _itemTexts$id2[propertyName]) || legacyTexts[propertyName]) || isEditable && props.selected || isEditable && utils.isBlankEditableTextValue((_itemTexts$id3 = itemTexts[id]) === null || _itemTexts$id3 === void 0 ? void 0 : _itemTexts$id3.tagline) && utils.isBlankEditableTextValue(((_itemTexts$id4 = itemTexts[id]) === null || _itemTexts$id4 === void 0 ? void 0 : _itemTexts$id4.title) || legacyTexts.title) && utils.isBlankEditableTextValue(((_itemTexts$id5 = itemTexts[id]) === null || _itemTexts$id5 === void 0 ? void 0 : _itemTexts$id5.description) || legacyTexts.description);
  }
  function getCardLinkMode() {
    if (isEditable || !href || displayButtons) {
      return 'none';
    }
    if (props.textPosition === 'none') {
      return 'image';
    }
    if (titlePresent) {
      return 'title';
    }
    return 'more';
  }
  const href = itemLinks[id] ? (_itemLinks$id = itemLinks[id]) === null || _itemLinks$id === void 0 ? void 0 : _itemLinks$id.href : ensureAbsolute(props.url);
  const openInNewTab = itemLinks[id] ? (_itemLinks$id2 = itemLinks[id]) === null || _itemLinks$id2 === void 0 ? void 0 : _itemLinks$id2.openInNewTab : props.open_in_new_tab;
  const scaleCategorySuffix = scaleCategorySuffixes[props.textSize || 'small'];
  const displayButtons = configuration.displayButtons || configuration.backfaces;
  const inlineFileRightsAfterCard = props.textPosition === 'right' || props.textPosition === 'overlay' || props.textPosition === 'none';
  const inlineFileRightsItems = [{
    file: thumbnailImageFile,
    label: 'image'
  }];
  const titlePresent = presentOrEditing('title');
  const descriptionPresent = presentOrEditing('description');
  const cardLinkMode = getCardLinkMode();
  const descriptionElementId = `external-link-${contentElementId}-${id}-description`;
  return /*#__PURE__*/React.createElement("li", {
    className: classNames(styles$5.item, styles$5[`textPosition-${props.textPosition}`], {
      [styles$5.link]: !!href && !displayButtons
    }, {
      [styles$5.outlined]: props.outlined
    }, {
      [styles$5.highlighted]: props.highlighted
    }, {
      [styles$5.selected]: props.selected
    }),
    onClick: props.onClick
  }, /*#__PURE__*/React.createElement(EditorLinkWrapper, {
    isEditable: isEditable,
    linkPreviewDisabled: props.selected && configuration.backfaces,
    actionButtonVisible: props.selected,
    actionButtonPortal: true,
    href: href,
    openInNewTab: openInNewTab,
    onChange: handleLinkChange
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$5.cardWrapper
  }, renderItemContent(), cardLinkMode === 'more' && /*#__PURE__*/React.createElement(MoreLink, {
    href: href,
    openInNewTab: openInNewTab,
    describedBy: descriptionPresent ? descriptionElementId : undefined
  }))));
  function renderItemContent() {
    if (configuration.backfaces) {
      return /*#__PURE__*/React.createElement(Flippable, {
        contentElementId: contentElementId,
        linkId: id,
        actionButtonVisible: props.selected,
        front: renderFront(),
        back: renderBack()
      });
    } else {
      return renderFront();
    }
  }
  function renderFront() {
    var _itemTexts$id6, _itemTexts$id7, _itemTexts$id8, _itemTexts$id9;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$5.card, styles$5.front, styles$5[`thumbnailSize-${props.thumbnailSize}`])
    }, /*#__PURE__*/React.createElement("div", {
      className: styles$5.thumbnail,
      style: {
        backgroundColor: props.thumbnailBackgroundColor
      }
    }, /*#__PURE__*/React.createElement(Thumbnail, {
      imageFile: thumbnailImageFile,
      aspectRatio: props.thumbnailAspectRatio,
      cropPosition: props.thumbnailCropPosition,
      fit: props.thumbnailFit,
      linkWidth: props.linkWidth,
      load: props.loadImages,
      showPlaceholder: isEditable,
      renderImageLink: cardLinkMode === 'image' ? image => /*#__PURE__*/React.createElement(Link, {
        href: href,
        openInNewTab: openInNewTab
      }, image) : undefined
    }, /*#__PURE__*/React.createElement(InlineFileRights, {
      configuration: configuration,
      context: "insideElement",
      position: props.textPosition === 'overlay' ? 'top' : 'bottom',
      items: inlineFileRightsItems
    }))), /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$5.background, styles$5[`align-${configuration.textAlign}`], props.darkBackground ? styles$5.light : styles$5.dark),
      style: {
        pointerEvents: !isEditable || isSelected ? undefined : 'none'
      }
    }, !inlineFileRightsAfterCard && /*#__PURE__*/React.createElement(InlineFileRights, {
      configuration: configuration,
      context: "afterElement",
      items: inlineFileRightsItems
    }), /*#__PURE__*/React.createElement("div", {
      className: styles$5.details
    }, presentOrEditing('tagline') && /*#__PURE__*/React.createElement(Text, {
      scaleCategory: `teaserTagline-${scaleCategorySuffix}`
    }, /*#__PURE__*/React.createElement(EditableInlineText, {
      value: (_itemTexts$id6 = itemTexts[id]) === null || _itemTexts$id6 === void 0 ? void 0 : _itemTexts$id6.tagline,
      placeholder: t('pageflow_scrolled.inline_editing.type_tagline'),
      onChange: value => handleTextChange('tagline', value)
    })), titlePresent && /*#__PURE__*/React.createElement(Text, {
      scaleCategory: `teaserTitle-${scaleCategorySuffix}`
    }, /*#__PURE__*/React.createElement(TitleLink, {
      isEnabled: cardLinkMode === 'title',
      href: href,
      openInNewTab: openInNewTab
    }, /*#__PURE__*/React.createElement(EditableInlineText, {
      value: ((_itemTexts$id7 = itemTexts[id]) === null || _itemTexts$id7 === void 0 ? void 0 : _itemTexts$id7.title) || legacyTexts.title,
      placeholder: t('pageflow_scrolled.inline_editing.type_heading'),
      onChange: value => handleTextChange('title', value)
    }))), descriptionPresent && /*#__PURE__*/React.createElement("div", {
      className: styles$5.description,
      id: descriptionElementId
    }, /*#__PURE__*/React.createElement(EditableText, {
      value: ((_itemTexts$id8 = itemTexts[id]) === null || _itemTexts$id8 === void 0 ? void 0 : _itemTexts$id8.description) || legacyTexts.description,
      scaleCategory: `teaserDescription-${scaleCategorySuffix}`,
      placeholder: t('pageflow_scrolled.inline_editing.type_text'),
      onChange: value => handleTextChange('description', value)
    })), configuration.displayButtons && !configuration.backfaces && presentOrEditing('link') && /*#__PURE__*/React.createElement("div", {
      className: styles$5.button
    }, /*#__PURE__*/React.createElement(LinkButton, {
      scaleCategory: "teaserLink",
      href: href,
      openInNewTab: openInNewTab,
      value: (_itemTexts$id9 = itemTexts[id]) === null || _itemTexts$id9 === void 0 ? void 0 : _itemTexts$id9.link,
      linkPreviewDisabled: true,
      actionButtonVisible: false,
      onTextChange: value => handleTextChange('link', value),
      onLinkChange: value => handleLinkChange(value)
    }))))), inlineFileRightsAfterCard && /*#__PURE__*/React.createElement("div", {
      className: styles$5.inlineFileRightsAfterCard
    }, /*#__PURE__*/React.createElement(InlineFileRights, {
      configuration: configuration,
      context: "afterElement",
      items: inlineFileRightsItems
    })));
  }
  function renderBack() {
    var _itemTexts$id10, _itemTexts$id11, _itemTexts$id12;
    return /*#__PURE__*/React.createElement("div", {
      className: styles$5.card
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames(styles$5.background, styles$5[`align-${configuration.textAlign}`], props.darkBackground ? styles$5.light : styles$5.dark),
      style: {
        pointerEvents: !isEditable || isSelected ? undefined : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: styles$5.details
    }, presentOrEditing('backfaceTitle') && /*#__PURE__*/React.createElement(Text, {
      scaleCategory: `teaserTitle-${scaleCategorySuffix}`
    }, /*#__PURE__*/React.createElement(EditableInlineText, {
      value: (_itemTexts$id10 = itemTexts[id]) === null || _itemTexts$id10 === void 0 ? void 0 : _itemTexts$id10.backfaceTitle,
      placeholder: t('pageflow_scrolled.inline_editing.type_heading'),
      onChange: value => handleTextChange('backfaceTitle', value)
    })), presentOrEditing('backfaceDescription') && /*#__PURE__*/React.createElement(EditableText, {
      value: (_itemTexts$id11 = itemTexts[id]) === null || _itemTexts$id11 === void 0 ? void 0 : _itemTexts$id11.backfaceDescription,
      scaleCategory: `teaserDescription-${scaleCategorySuffix}`,
      placeholder: t('pageflow_scrolled.inline_editing.type_text'),
      onChange: value => handleTextChange('backfaceDescription', value)
    }), presentOrEditing('link') && /*#__PURE__*/React.createElement("div", {
      className: styles$5.button
    }, /*#__PURE__*/React.createElement(LinkButton, {
      scaleCategory: "teaserLink",
      href: href,
      openInNewTab: openInNewTab,
      value: (_itemTexts$id12 = itemTexts[id]) === null || _itemTexts$id12 === void 0 ? void 0 : _itemTexts$id12.link,
      actionButtonVisible: false,
      onTextChange: value => handleTextChange('link', value),
      onLinkChange: value => handleLinkChange(value)
    })))));
  }
}
function TitleLink({
  isEnabled,
  href,
  openInNewTab,
  children
}) {
  if (isEnabled) {
    return /*#__PURE__*/React.createElement(Link, {
      href: href,
      openInNewTab: openInNewTab,
      attributes: {
        className: styles$5.titleLink
      }
    }, children);
  } else {
    return children;
  }
}
function MoreLink({
  href,
  openInNewTab,
  describedBy
}) {
  const {
    t: translateWithEntryLocale
  } = useI18n();
  return /*#__PURE__*/React.createElement(Link, {
    href: href,
    openInNewTab: openInNewTab,
    attributes: {
      className: styles$5.moreLink,
      'aria-describedby': describedBy
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: styles$5.moreLinkLabel
  }, translateWithEntryLocale('pageflow_scrolled.public.more')));
}
function EditorLinkWrapper({
  isEditable,
  ...props
}) {
  if (isEditable) {
    return /*#__PURE__*/React.createElement(EditableLink, Object.assign({}, props, {
      allowRemove: true
    }));
  } else {
    return props.children;
  }
}
function ensureAbsolute(url) {
  if (!url || url.match(/^(https?:)?\/\//)) {
    return url;
  } else {
    return `http://${url}`;
  }
}

function Scroller({
  enabled,
  measureKey,
  children
}) {
  const ref = useRef();
  if (!enabled) {
    return children({});
  }
  return /*#__PURE__*/React.createElement(Measure, {
    scroll: true,
    client: true,
    innerRef: ref
  }, ({
    contentRect,
    measureRef,
    measure
  }) => {
    const canScrollLeft = contentRect.scroll.left > 0;
    const canScrollRight = contentRect.scroll.width > contentRect.client.width && contentRect.scroll.left < contentRect.scroll.width - contentRect.client.width - 5;
    function scrollBy(x) {
      const list = ref.current;
      const listRect = list.getBoundingClientRect();
      if (x > 0) {
        for (let i = 0; i < list.children.length; i++) {
          const child = list.children[i];
          const rect = child.getBoundingClientRect();
          if (Math.floor(rect.right - listRect.left) > contentRect.client.width) {
            ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0);
            break;
          }
        }
      } else {
        let lastPartiallyVisibleChildRect;
        for (let i = list.children.length - 1; i >= 0; i--) {
          const child = list.children[i];
          const rect = child.getBoundingClientRect();
          if (rect.left < listRect.left) {
            lastPartiallyVisibleChildRect = rect;
            break;
          }
        }
        if (!lastPartiallyVisibleChildRect) {
          return;
        }
        for (let i = 0; i < list.children.length - 1; i++) {
          const child = list.children[i];
          const rect = child.getBoundingClientRect();
          if (Math.floor(lastPartiallyVisibleChildRect.right - rect.left) <= contentRect.client.width) {
            ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0);
            break;
          }
        }
      }
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Watch, {
      value: measureKey,
      onChange: measure
    }), /*#__PURE__*/React.createElement(ScrollButton$1, {
      direction: "left",
      disabled: !canScrollLeft,
      onClick: () => scrollBy(-1)
    }), /*#__PURE__*/React.createElement(ScrollButton$1, {
      direction: "right",
      disabled: !canScrollRight,
      onClick: () => scrollBy(1)
    }), children({
      scrollerRef: measureRef,
      handleScroll: () => measure()
    }));
  });
}
function Watch({
  value,
  onChange
}) {
  useEffect(() => onChange(), [value, onChange]);
  return null;
}

var styles$8 = {"contentColorScope":"colors-module_contentColorScope__3zLO1","contentMargin":"ExternalLinkList-module_contentMargin__2NpqM","scrollButtons-below":"ExternalLinkList-module_scrollButtons-below__2yP5A","container":"ExternalLinkList-module_container__3fVf0","fullContainer":"ExternalLinkList-module_fullContainer__3M7uT","list":"ExternalLinkList-module_list__2w4qM scope-externalLinks colors-module_contentColorScope__3zLO1","full":"ExternalLinkList-module_full__2l4qw","textPosition-below":"ExternalLinkList-module_textPosition-below__2zC66","textPosition-overlay":"ExternalLinkList-module_textPosition-overlay__3h5MM","scroller":"ExternalLinkList-module_scroller__30plD","layout-center":"ExternalLinkList-module_layout-center__3qU6q"};

var textPositionBelowStyles = {"list":"below-module_list__19HmU","scroller":"below-module_scroller__1NsM2","linkAlignment-left":"below-module_linkAlignment-left__3jA80","linkAlignment-right":"below-module_linkAlignment-right__1Z8_U","linkAlignment-center":"below-module_linkAlignment-center__2YvPE","linkWidth-full-xs":"below-module_linkWidth-full-xs__3uist","linkWidth-full-s":"below-module_linkWidth-full-s__1_4ij","linkWidth-full-m":"below-module_linkWidth-full-m__1Oy7S","linkWidth-full-l":"below-module_linkWidth-full-l__3HSsg","linkWidth-full-xl":"below-module_linkWidth-full-xl__2ZPa4","linkWidth-full-xxl":"below-module_linkWidth-full-xxl__Ttr0e","width-lg":"below-module_width-lg__2z5Fx","layout-center":"below-module_layout-center__2Q6iw","linkWidth-l":"below-module_linkWidth-l__1YJZr","width-xl":"below-module_width-xl__Bgvca","linkWidth-xl":"below-module_linkWidth-xl__1sGf5","linkWidth-s":"below-module_linkWidth-s__24kC5","linkWidth-xs":"below-module_linkWidth-xs__2sJdn","linkWidth-m":"below-module_linkWidth-m__3Nxbl"};

var textPositionRightStyles = {"list":"right-module_list__3z04e","scroller":"right-module_scroller__2FyXd","width-full":"right-module_width-full__22RJL","layout-center":"right-module_layout-center__3I_Ow","layout-right":"right-module_layout-right__1rFiS","linkWidth-full-xs":"right-module_linkWidth-full-xs__1d1Iy","linkWidth-full-s":"right-module_linkWidth-full-s__2-rCJ","linkWidth-full-m":"right-module_linkWidth-full-m__2VY87","linkWidth-full-l":"right-module_linkWidth-full-l__1Bql_","linkWidth-full-xl":"right-module_linkWidth-full-xl__iEoAg","linkWidth-full-xxl":"right-module_linkWidth-full-xxl__1a3HZ","linkWidth-xs":"right-module_linkWidth-xs__3kCk5","linkWidth-s":"right-module_linkWidth-s__1YNwt","linkWidth-l":"right-module_linkWidth-l__1OLzb","width-xl":"right-module_width-xl__2xDcy","layout-left":"right-module_layout-left__1P-tW","linkWidth-m":"right-module_linkWidth-m__18F2B"};

const linkWidths = value => ['xs', 's', 'm', 'l', 'xl', 'xxl'][value + 2];
function ExternalLinkList(props) {
  const linkList = props.configuration.links || [];
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const darkBackground = useDarkBackground();
  const theme = useTheme();
  const {
    setTransientState,
    isSelected
  } = useContentElementEditorState();
  const [selectedItemId, setSelectedItemId] = useState();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_ITEM') {
      setHighlightedIndex(command.index);
    } else if (command.type === 'RESET_ITEM_HIGHLIGHT') {
      setHighlightedIndex(-1);
    } else if (command.type === 'SET_SELECTED_ITEM') {
      var _linkList$command$ind;
      setSelectedItemId((_linkList$command$ind = linkList[command.index]) === null || _linkList$command$ind === void 0 ? void 0 : _linkList$command$ind.id);
    }
  });
  function handleItemClick(event, id) {
    if (isSelected) {
      setTransientState({
        selectedItemId: id
      });
      setSelectedItemId(id);
      event.preventDefault();
    }
  }
  function handleListClick(event) {
    if (!event.defaultPrevented) {
      setTransientState({
        selectedItemId: null
      });
      setSelectedItemId(null);
    }
  }
  const layout = props.sectionProps.layout === 'centerRagged' ? 'center' : props.sectionProps.layout;
  const linkWidth = linkWidths('linkWidth' in props.configuration ? props.configuration.linkWidth : -1);
  const textPosition = props.configuration.textPosition || 'below';
  const textPositionStyles = textPosition === 'right' ? textPositionRightStyles : textPositionBelowStyles;
  const scrollerEnabled = props.configuration.enableScroller === 'always';
  const fullWidth = props.contentElementWidth === contentElementWidths.full;
  const linkAlignment = scrollerEnabled ? 'left' : props.configuration.linkAlignment;
  const overlayOpacity = props.configuration.overlayOpacity !== undefined ? props.configuration.overlayOpacity / 100 : 0.7;
  const boxProps = contentElementBoxProps(props.configuration);
  return wrapWithFlippedItemProvider( /*#__PURE__*/React.createElement("div", {
    className: classNames({
      [styles$8.contentMargin]: props.customMargin || fullWidth
    }, props.configuration.linkButtonVariant && `scope-linkButton-${props.configuration.linkButtonVariant}`, styles$8[`scrollButtons-${theme.options.teasersScrollButtons}`]),
    onClick: handleListClick
  }, /*#__PURE__*/React.createElement(Scroller, {
    enabled: scrollerEnabled,
    measureKey: linkList.length
  }, ({
    scrollerRef,
    handleScroll
  }) => /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$8.container, {
      [styles$8.fullContainer]: fullWidth
    })
  }, /*#__PURE__*/React.createElement(LinkTooltipProvider, {
    align: "center"
  }, /*#__PURE__*/React.createElement("ul", {
    ref: scrollerRef,
    className: classNames(styles$8.list, styles$8[`textPosition-${textPosition}`], styles$8[`layout-${layout}`], {
      [styles$8.full]: fullWidth
    }, {
      [styles$8.scroller]: scrollerEnabled
    }, props.configuration.variant && `scope-externalLinkList-${props.configuration.variant}`, boxProps.className, textPositionStyles.list, textPositionStyles[`layout-${layout}`], textPositionStyles[`width-${contentElementWidthName(props.contentElementWidth)}`], textPositionStyles[`linkWidth-${fullWidth ? 'full-' : ''}${linkWidth}`], textPositionStyles[`linkAlignment-${linkAlignment}`], textPositionStyles[`textPosition-${textPosition}`], {
      [textPositionStyles.scroller]: scrollerEnabled
    }),
    style: {
      '--overlay-opacity': overlayOpacity,
      '--thumbnail-aspect-ratio': `var(--theme-aspect-ratio-${props.configuration.thumbnailAspectRatio || 'wide'})`,
      ...boxProps.style
    },
    onScroll: handleScroll
  }, linkList.map((link, index) => /*#__PURE__*/React.createElement(ExternalLink, Object.assign({}, link, {
    key: link.id,
    contentElementId: props.contentElementId,
    configuration: props.configuration,
    thumbnailAspectRatio: props.configuration.thumbnailAspectRatio,
    thumbnailSize: props.configuration.thumbnailSize || 'small',
    thumbnailFit: props.configuration.thumbnailFit || 'cover',
    textPosition: props.configuration.textPosition || 'below',
    textSize: props.configuration.textSize || 'small',
    linkWidth: linkWidth,
    darkBackground: darkBackground,
    loadImages: shouldLoad,
    outlined: isSelected,
    highlighted: highlightedIndex === index,
    selected: link.id === selectedItemId && isSelected,
    onClick: event => handleItemClick(event, link.id)
  })))))))));
  function wrapWithFlippedItemProvider(children) {
    if (props.configuration.backfaces) {
      return /*#__PURE__*/React.createElement(FlippedItemProvider, null, children);
    } else {
      return children;
    }
  }
}

frontend.contentElementTypes.register('externalLinkList', {
  component: ExternalLinkList,
  customMargin({
    configuration
  }) {
    return configuration.enableScroller === 'always';
  },
  lifecycle: true
});

function useIframeHeight(url) {
  const [height, setHeight] = useState('400px');
  useEffect(() => {
    window.addEventListener('message', receive);
    function receive(event) {
      if (typeof event.data['datawrapper-height'] !== 'undefined') {
        for (var chartId in event.data['datawrapper-height']) {
          if ((url === null || url === void 0 ? void 0 : url.indexOf(chartId)) > -1) {
            setHeight(event.data['datawrapper-height'][chartId] + 'px');
          }
        }
      }
    }
    return () => window.removeEventListener('message', receive);
  }, [url]);
  return height;
}

var styles$9 = {"container":"DataWrapperChart-module_container__2eZ15"};

function DataWrapperChart({
  configuration
}) {
  const {
    t
  } = useI18n();
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const height = useIframeHeight(configuration.url);

  // remove url protocol, so that it is selected by the browser itself
  var srcURL = '';
  if (configuration.url) {
    srcURL = configuration.url.replace(/http(s|):/, '');
  }
  const backgroundColor = configuration.backgroundColor || '#323d4d';
  return /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$9.container,
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined,
      backgroundColor,
      color: textColorForBackgroundColor(backgroundColor),
      height: height
    },
    "data-percy": "hide"
  }, /*#__PURE__*/React.createElement(ThirdPartyOptIn, {
    providerName: "datawrapper"
  }, shouldLoad && renderIframe(srcURL, configuration.title || t('pageflow_scrolled.public.chart.default_title'))), /*#__PURE__*/React.createElement(DatawrapperOptOutInfo, {
    providerName: "datawrapper"
  }))));
}
function DatawrapperOptOutInfo(props) {
  if (!features.isEnabled('datawrapper_chart_embed_opt_in')) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, Object.assign({
    providerName: "datawrapper"
  }, props));
}
function renderIframe(url, title) {
  if (!url) {
    return null;
  }
  return /*#__PURE__*/React.createElement("iframe", {
    src: url,
    title: title,
    scrolling: "no",
    allowFullScreen: true,
    mozallowfullscreen: "true",
    webkitallowfullscreen: "true"
  });
}

frontend.contentElementTypes.register('dataWrapperChart', {
  component: DataWrapperChart,
  lifecycle: true,
  consentVendors({
    configuration,
    t
  }) {
    const prefix = 'pageflow_scrolled.public.chart';
    return [{
      name: 'datawrapper',
      displayName: t(`${prefix}.consent_vendor_name`),
      description: t(`${prefix}.consent_vendor_description`),
      paradigm: features.isEnabled('datawrapper_chart_embed_opt_in') ? 'lazy opt-in' : 'skip'
    }];
  }
});

function useAutoCruising({
  viewerRef,
  onCancel
}) {
  const autoCruisingRef = useRef(false);
  const rafIdRef = useRef();
  const lastYawRef = useRef(null);
  const start = useCallback(function () {
    let viewer = viewerRef.current;
    let start = new Date().getTime();
    let pitch = viewer.getPitch();
    let yaw = viewer.getYaw();
    let delta = 0;
    if (!autoCruisingRef.current) {
      rafIdRef.current = window.requestAnimationFrame(tick);
      autoCruisingRef.current = true;
    }
    function tick() {
      delta = new Date().getTime() - start;
      if (autoCruisingRef.current && lastYawRef.current !== null && (Math.abs(pitch - viewer.getPitch()) > 0.1 || Math.abs(lastYawRef.current - viewer.getYaw()) > 0.1)) {
        autoCruisingRef.current = false;
        lastYawRef.current = null;
        onCancel();
        return;
      }
      lastYawRef.current = yaw - delta / 1000 % 360;
      viewer.lookAt({
        yaw: lastYawRef.current,
        pitch: pitch
      }, 0);
      autoCruisingRef.current && (rafIdRef.current = window.requestAnimationFrame(tick));
    }
  }, [viewerRef, onCancel]);
  const stop = useCallback(function () {
    window.cancelAnimationFrame(rafIdRef.current);
    autoCruisingRef.current = false;
    lastYawRef.current = null;
  }, []);
  useEffect(() => stop, [stop]);
  return [start, stop];
}

const aspectRatios = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};
function getAspectRatio({
  configuration,
  contentElementWidth,
  portraitOrientation
}) {
  const effectiveAspectRatio = portraitOrientation && configuration.portraitAspectRatio ? configuration.portraitAspectRatio : configuration.aspectRatio;
  if (!effectiveAspectRatio) {
    return getAutoAspectRatio(contentElementWidth);
  }
  return aspectRatios[effectiveAspectRatio] || 0.75;
}
function getAutoAspectRatio(contentElementWidth) {
  return contentElementWidth === contentElementWidths.full ? 0.5 : 0.75;
}

function VrImage({
  configuration,
  contentElementWidth
}) {
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const portraitOrientation = usePortraitOrientation();
  const imageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  const aspectRatio = getAspectRatio({
    configuration,
    contentElementWidth,
    portraitOrientation
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, /*#__PURE__*/React.createElement(FitViewport, {
    aspectRatio: aspectRatio,
    fill: configuration.position === 'backdrop'
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, renderLazyPanorama(configuration, imageFile, shouldLoad, aspectRatio), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  })));
}
function renderLazyPanorama(configuration, imageFile, shouldLoad, aspectRatio) {
  if (shouldLoad && imageFile && imageFile.isReady) {
    return /*#__PURE__*/React.createElement(AutoCruisingPanorama, {
      imageFile: imageFile,
      key: aspectRatio,
      initialYaw: configuration.initialYaw,
      initialPitch: configuration.initialPitch
    });
  }
}
function AutoCruisingPanorama({
  imageFile,
  initialYaw,
  initialPitch
}) {
  const viewerRef = useRef();
  const [hidePanoramaIndicator, setHidePanoramaIndicator] = useState(false);
  const [startAutoCruising, stopAutoCruising] = useAutoCruising({
    viewerRef,
    onCancel: () => setHidePanoramaIndicator(true)
  });
  useContentElementLifecycle({
    onActivate() {
      if (viewerRef.current) {
        startAutoCruising();
      }
    }
  });
  return /*#__PURE__*/React.createElement(Panorama, {
    imageFile: imageFile,
    initialYaw: initialYaw,
    initialPitch: initialPitch,
    viewerRef: viewerRef,
    hidePanoramaIndicator: hidePanoramaIndicator,
    onReady: startAutoCruising,
    onFullscreen: stopAutoCruising
  });
}

frontend.contentElementTypes.register('vrImage', {
  component: VrImage,
  lifecycle: true
});

function useIframeHeight$1({
  src,
  active
}) {
  const [height, setHeight] = useState('400px');
  useEffect(() => {
    if (!active) {
      return;
    }
    window.addEventListener('message', receive);
    function receive(event) {
      const data = parse(event.data);
      if (src && data.context === 'iframe.resize' && data.src === src) {
        setHeight(data.height + 'px');
      }
    }
    return () => window.removeEventListener('message', receive);
  }, [active, src]);
  return height;
}
function parse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

var styles$a = {"wrapper":"IframeEmbed-module_wrapper__3w_LN","iframe":"IframeEmbed-module_iframe__3QVCA","scale-p33":"IframeEmbed-module_scale-p33__MRjVy","scale-p50":"IframeEmbed-module_scale-p50__1EKxu","scale-p75":"IframeEmbed-module_scale-p75__1yT4D"};

const aspectRatios$1 = {
  wide: 0.5625,
  narrow: 0.75,
  square: 1,
  portrait: 1.7777
};
function IframeEmbed({
  configuration
}) {
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const portraitOrientation = usePortraitOrientation();
  const height = useIframeHeight$1({
    src: configuration.source,
    active: configuration.autoResize
  });
  const aspectRatio = portraitOrientation && configuration.portraitAspectRatio ? configuration.portraitAspectRatio : configuration.aspectRatio;
  function renderSpanningWrapper(children) {
    if (configuration.autoResize) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          height
        }
      }, children);
    } else {
      return /*#__PURE__*/React.createElement(FitViewport.Content, null, children);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: styles$a.wrapper,
    style: {
      pointerEvents: isEditable && !isSelected ? 'none' : undefined
    }
  }, /*#__PURE__*/React.createElement(FitViewport, {
    aspectRatio: configuration.autoResize ? null : aspectRatios$1[aspectRatio || 'wide']
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, utils.isBlank(configuration.source) && /*#__PURE__*/React.createElement(Placeholder, null), renderSpanningWrapper( /*#__PURE__*/React.createElement(ThirdPartyOptIn, null, shouldLoad && /*#__PURE__*/React.createElement("iframe", {
    className: classNames(styles$a.iframe, styles$a[`scale-${configuration.scale}`]),
    title: configuration.title,
    src: configuration.source
  }))), /*#__PURE__*/React.createElement(OptOutInfo, {
    configuration: configuration
  })))));
}
function OptOutInfo({
  configuration
}) {
  if (!configuration.requireConsent) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ThirdPartyOptOutInfo, null);
}

frontend.contentElementTypes.register('iframeEmbed', {
  component: IframeEmbed,
  lifecycle: true
});

var styles$b = {"details":"Question-module_details__3FxH-","answer":"Question-module_answer__2jMt6","layout-centerRagged":"Question-module_layout-centerRagged__1hovs"};

function Question({
  configuration,
  contentElementId,
  sectionProps
}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  return /*#__PURE__*/React.createElement("details", {
    open: configuration.expandByDefault || isEditable && isSelected,
    className: classNames(styles$b.details, styles$b[`layout-${sectionProps.layout}`])
  }, /*#__PURE__*/React.createElement("summary", {
    onClick: isEditable ? event => event.preventDefault() : undefined,
    style: {
      color: paletteColor(configuration.color)
    }
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "expand"
  }), /*#__PURE__*/React.createElement(Text, {
    scaleCategory: "question",
    typographyVariant: configuration.typographyVariant,
    typographySize: configuration.typographySize
  }, /*#__PURE__*/React.createElement(EditableInlineText, {
    value: configuration.question,
    onChange: question => updateConfiguration({
      question
    }),
    hyphens: "none",
    placeholder: t('pageflow_scrolled.inline_editing.type_question')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: paletteColor(configuration.answerColor)
    }
  }, /*#__PURE__*/React.createElement(EditableText, {
    value: configuration.answer,
    contentElementId: contentElementId,
    scaleCategory: "questionAnswer",
    typographyVariant: configuration.typographyVariant,
    typographySize: configuration.typographySize,
    className: styles$b.answer,
    onChange: answer => updateConfiguration({
      answer
    }),
    onlyParagraphs: true,
    hyphens: "none",
    placeholder: t('pageflow_scrolled.inline_editing.type_answer')
  })));
}

frontend.contentElementTypes.register('question', {
  component: Question,
  defaultMarginTop: '1.375rem'
});

var styles$c = {"wrapper":"Counter-module_wrapper__3XTil","number":"Counter-module_number__1Y4AV","numberCenter":"Counter-module_numberCenter__2mw-T","numberRight":"Counter-module_numberRight__3WHh6","center":"Counter-module_center__1SCJY","left":"Counter-module_left__3fJKD","right":"Counter-module_right__3DE0D","textCenter":"Counter-module_textCenter__33nVt","textRight":"Counter-module_textRight__2fzb0","animation-fadeIn":"Counter-module_animation-fadeIn__3Hyky","animation-fadeIn-active":"Counter-module_animation-fadeIn-active__16DIk","animation-fadeInFromBelow":"Counter-module_animation-fadeInFromBelow__3l1qX","animation-fadeInFromAbove":"Counter-module_animation-fadeInFromAbove__3iGf-","animation-fadeInFromAbove-active":"Counter-module_animation-fadeInFromAbove-active__37UsW","animation-fadeInFromBelow-active":"Counter-module_animation-fadeInFromBelow-active__2CSjv","animation-fadeInScaleUp":"Counter-module_animation-fadeInScaleUp__1ngk5","animation-fadeInScaleDown":"Counter-module_animation-fadeInScaleDown__SpNGu","animation-fadeInScaleUp-active":"Counter-module_animation-fadeInScaleUp-active__1GEXn","animation-fadeInScaleDown-active":"Counter-module_animation-fadeInScaleDown-active__3gaYM"};

var styles$d = {"numberGrid":"PlainNumber-module_numberGrid__3HIW4","numberPlaceholder":"PlainNumber-module_numberPlaceholder__2ygt0"};

function PlainNumber({
  value,
  targetValue,
  formatOptions
}) {
  const needsPlaceholder = targetValue != null && targetValue >= value;
  function format(val) {
    return val.toLocaleString(formatOptions.locale, {
      useGrouping: formatOptions.useGrouping,
      minimumFractionDigits: formatOptions.decimalPlaces,
      maximumFractionDigits: formatOptions.decimalPlaces
    });
  }
  if (!needsPlaceholder) {
    return format(value);
  }
  return /*#__PURE__*/React.createElement("span", {
    className: styles$d.numberGrid
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: styles$d.numberPlaceholder
  }, format(targetValue)), /*#__PURE__*/React.createElement("span", null, format(value)));
}

var styles$e = {"number":"WheelNumber-module_number__3IUvp","wheel":"WheelNumber-module_wheel__3mf6H","text":"WheelNumber-module_text__EWt7A","hidden":"WheelNumber-module_hidden__vnh6v"};

function useWheelCharacters({
  startValue,
  targetValue,
  decimalPlaces = 0,
  locale = 'en',
  useGrouping = false
}) {
  return useMemo(() => createWheelCharacterFunctions({
    startValue,
    targetValue,
    decimalPlaces,
    locale,
    useGrouping
  }), [startValue, targetValue, decimalPlaces, locale, useGrouping]);
}
function createWheelCharacterFunctions({
  startValue,
  targetValue,
  decimalPlaces = 0,
  locale = 'en',
  useGrouping = false
}) {
  const hasNegative = startValue < 0 || targetValue < 0;
  const crossesZero = startValue > 0 && targetValue < 0 || startValue < 0 && targetValue > 0;
  const absStartValue = Math.abs(startValue);
  const absTargetValue = Math.abs(targetValue);
  const integerDigitCount = Math.max(String(Math.round(absTargetValue)).length, String(Math.round(absStartValue)).length);
  const formatted = absTargetValue.toLocaleString(locale, {
    minimumIntegerDigits: integerDigitCount,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping
  });
  let digitIndex = 0;
  const charFunctions = [...formatted].map(char => {
    if (/\d/.test(char)) {
      const position = integerDigitCount - digitIndex++ - 1;
      const divisor = Math.pow(10, position);
      if (crossesZero) {
        const toZero = createDigitCharFunction(position, divisor, absStartValue, 0);
        const fromZero = createDigitCharFunction(position, divisor, 0, absTargetValue);
        const inFirstSegment = value => startValue < 0 ? value < 0 : value > 0;
        return (value, progress) => inFirstSegment(value) ? toZero(value, (value - startValue) / -startValue) : fromZero(value, value / targetValue);
      } else {
        return createDigitCharFunction(position, divisor, absStartValue, absTargetValue);
      }
    } else if (digitIndex < integerDigitCount) {
      const threshold = Math.pow(10, integerDigitCount - digitIndex);
      return value => ({
        text: char,
        hide: Math.abs(value) < threshold
      });
    } else {
      return () => ({
        text: char
      });
    }
  });
  if (hasNegative) {
    const minusThreshold = -Math.pow(10, -decimalPlaces);
    charFunctions.unshift(value => ({
      text: '-',
      hide: value > minusThreshold
    }));
  }
  const range = targetValue - startValue;
  return value => {
    const progress = range === 0 ? 0 : (value - startValue) / range;
    return charFunctions.map(fn => fn(value, progress));
  };
}
function createDigitCharFunction(position, divisor, segmentStart, segmentEnd) {
  const startDigit = getDigitAtPosition(segmentStart, divisor);
  const endDigit = getDigitAtPosition(segmentEnd, divisor);
  const fullRotations = Math.floor(segmentEnd / (divisor * 10)) - Math.floor(segmentStart / (divisor * 10));
  const distance = endDigit - startDigit + fullRotations * 10;
  return (value, progress) => ({
    value: ((startDigit + progress * distance) % 10 + 10) % 10,
    hideZero: position > 0 && Math.abs(value) < divisor * 1.9
  });
}
function getDigitAtPosition(value, divisor) {
  // Multiply by integer instead of dividing by fraction to avoid floating point errors
  // (e.g., 0.7 / 0.1 = 6.999... but 0.7 * 10 = 7)
  if (divisor < 1) {
    const multiplier = Math.round(1 / divisor);
    return Math.floor(value * multiplier) % 10;
  }
  return Math.floor(value / divisor) % 10;
}

function WheelNumber({
  value,
  startValue,
  targetValue,
  decimalPlaces,
  locale,
  useGrouping
}) {
  const effectiveStartValue = startValue !== null && startValue !== void 0 ? startValue : value;
  const effectiveTargetValue = targetValue !== null && targetValue !== void 0 ? targetValue : value;
  const getCharacters = useWheelCharacters({
    startValue: effectiveStartValue,
    targetValue: effectiveTargetValue,
    decimalPlaces,
    locale,
    useGrouping
  });
  const rotationValues = getCharacters(value);
  return /*#__PURE__*/React.createElement("span", {
    className: styles$e.number
  }, rotationValues.map((entry, index) => 'text' in entry ? /*#__PURE__*/React.createElement("span", {
    key: index,
    className: classNames(styles$e.text, {
      [styles$e.hidden]: entry.hide
    })
  }, entry.text) : /*#__PURE__*/React.createElement("span", {
    key: index,
    className: styles$e.wheel,
    style: {
      '--val': entry.value
    }
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => {
    const isHiddenZero = digit === 0 && entry.hideZero && entry.value < 1;
    return /*#__PURE__*/React.createElement("span", {
      key: digit,
      style: {
        '--digit': digit,
        visibility: isHiddenZero ? 'hidden' : undefined
      }
    }, digit);
  }))));
}

function Counter({
  configuration,
  contentElementId,
  contentElementWidth,
  sectionProps
}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const locale = useLocale();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const targetValue = configuration.targetValue || 0;
  const decimalPlaces = Number(configuration.decimalPlaces) || 0;
  const startValue = configuration.startValue || 0;
  const countingAnimation = configuration.countingAnimation || (configuration.countingSpeed && configuration.countingSpeed !== 'none' ? 'plain' : 'none');
  const countingDuration = countingAnimation === 'none' ? 0 : countingDurations[configuration.countingSpeed] || countingDurations.medium;
  const startAnimationTrigger = configuration.startAnimationTrigger || 'onActivate';
  const [currentValue, setCurrentValue] = useState(countingDuration > 0 ? startValue : targetValue);
  const [animated, setAnimated] = useState(false);
  const intervalRef = useRef();
  const timeoutRef = useRef();
  const {
    isEditable
  } = useContentElementEditorState();
  const animate = useCallback(() => {
    setAnimated(true);
    if (!intervalRef.current && countingDuration > 0) {
      const startTime = new Date().getTime();
      const ease = configuration.entranceAnimation && configuration.entranceAnimation !== 'none' ? easeOut : easeInOut;
      intervalRef.current = setInterval(() => {
        const t = (new Date().getTime() - startTime) / countingDuration;
        if (t < 1) {
          setCurrentValue(startValue + (targetValue - startValue) * ease(t));
        } else {
          clearInterval(intervalRef.current);
          setCurrentValue(targetValue);
        }
      }, 10);
    }
  }, [targetValue, startValue, countingDuration, configuration.entranceAnimation]);
  const resetAnimation = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentValue(countingDuration > 0 ? startValue : targetValue);
    setAnimated(false);
  }, [startValue, targetValue, countingDuration]);
  useEffect(() => {
    if (isEditable) {
      resetAnimation();
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(animate, 500);
    }
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [animate, resetAnimation, isEditable, countingAnimation]);
  useContentElementLifecycle({
    onActivate: startAnimationTrigger === 'onActivate' ? animate : undefined,
    onVisible: startAnimationTrigger === 'onVisible' ? animate : undefined,
    onInvisible() {
      if (isEditable) {
        resetAnimation();
      }
    }
  });
  function renderUnit() {
    if (!configuration.unit) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Text, {
      scaleCategory: "counterUnit",
      typographySize: configuration.unitSize || 'md',
      inline: true
    }, /*#__PURE__*/React.createElement("span", {
      style: configuration.unitColor ? {
        color: paletteColor(configuration.unitColor)
      } : undefined
    }, configuration.unit));
  }
  const textAlign = configuration.textAlign || (sectionProps.layout === 'centerRagged' ? 'centerRagged' : 'auto');
  const wrapperAlignment = {
    auto: contentElementWidth > contentElementWidths.md ? 'center' : null,
    center: 'center',
    centerRagged: 'center',
    left: 'left',
    right: 'right'
  }[textAlign];
  const numberAlignment = {
    center: 'numberCenter',
    centerRagged: 'numberCenter',
    right: 'numberRight'
  }[textAlign];
  const descriptionAlignment = {
    centerRagged: 'textCenter',
    right: 'textRight'
  }[textAlign];
  return /*#__PURE__*/React.createElement("div", {
    className: styles$c[wrapperAlignment]
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$c.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(`typography-counter-${configuration.typographyVariant}`, styles$c.number, styles$c[numberAlignment], styles$c[`animation-${configuration.entranceAnimation}`], {
      [styles$c[`animation-${configuration.entranceAnimation}-active`]]: animated
    }),
    style: {
      '--counting-duration': `${countingDuration || 1000}ms`
    }
  }, /*#__PURE__*/React.createElement(Text, {
    scaleCategory: "counterNumber",
    typographySize: configuration.numberSize || legacyTextSizes[configuration.textSize] || 'xl',
    inline: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: paletteColor(configuration.numberColor)
    }
  }, configuration.unitPlacement === 'leading' && renderUnit(), countingAnimation === 'wheel' && startValue !== targetValue ? /*#__PURE__*/React.createElement(WheelNumber, {
    value: currentValue,
    startValue: countingDuration > 0 ? startValue : null,
    targetValue: countingDuration > 0 ? targetValue : null,
    decimalPlaces: decimalPlaces,
    locale: locale,
    useGrouping: !configuration.hideThousandsSeparators
  }) : /*#__PURE__*/React.createElement(PlainNumber, {
    value: currentValue,
    targetValue: countingDuration > 0 ? targetValue : null,
    formatOptions: {
      locale,
      decimalPlaces,
      useGrouping: !configuration.hideThousandsSeparators
    }
  }), configuration.unitPlacement !== 'leading' && renderUnit()))), /*#__PURE__*/React.createElement("div", {
    className: styles$c[descriptionAlignment],
    style: {
      color: paletteColor(configuration.descriptionColor)
    }
  }, /*#__PURE__*/React.createElement(EditableText, {
    value: configuration.description,
    contentElementId: contentElementId,
    className: styles$c.description,
    onChange: description => updateConfiguration({
      description
    }),
    onlyParagraphs: true,
    scaleCategory: "counterDescription",
    typographySize: configuration.descriptionSize || 'md',
    placeholder: t('pageflow_scrolled.inline_editing.type_description')
  }))));
}
const countingDurations = {
  none: 0,
  fast: 500,
  medium: 2000,
  slow: 5000
};
const legacyTextSizes = {
  verySmall: 'xs',
  small: 'md',
  medium: 'xl',
  large: 'xxxl'
};
function easeInOut(t) {
  t = t * 2;
  if (t < 1) return t ** 2 / 2;
  t = t - 1;
  return t - t ** 2 / 2 + 1 / 2;
}
function easeOut(t) {
  return (t - t ** 2 / 2) * 2;
}

frontend.contentElementTypes.register('counter', {
  component: Counter,
  lifecycle: true
});

var styles$f = {"breakpoint-sm":"(min-width: 640px)","figure":"Quote-module_figure__1Q3tJ","design-largeCentered":"Quote-module_design-largeCentered__2f6qW","text":"Quote-module_text__C0md2","design-largeHanging":"Quote-module_design-largeHanging__1TVQh","design-hanging":"Quote-module_design-hanging__4aDVU","centerRagged":"Quote-module_centerRagged__1CeFH","maskedMark":"Quote-module_maskedMark__2n08e","attribution":"Quote-module_attribution__3iXxu"};

function Quote({
  configuration,
  contentElementId,
  sectionProps
}) {
  var _theme$options$proper, _theme$options$proper2;
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    isSelected
  } = useContentElementEditorState();
  const theme = useTheme();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const design = configuration.variant ? configuration.variant.split('-')[0] : theme.options.quoteDesign;
  return /*#__PURE__*/React.createElement("figure", {
    className: classNames(styles$f.figure, styles$f[`design-${design || 'largeHanging'}`], `scope-quote-${configuration.variant}`, {
      [styles$f.maskedMark]: (_theme$options$proper = theme.options.properties) === null || _theme$options$proper === void 0 ? void 0 : (_theme$options$proper2 = _theme$options$proper.root) === null || _theme$options$proper2 === void 0 ? void 0 : _theme$options$proper2.quoteLeftMarkMaskImage
    }, {
      [styles$f.centerRagged]: sectionProps.layout === 'centerRagged'
    }),
    style: {
      '--palette-color': paletteColor(configuration.color)
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    className: styles$f.text
  }, /*#__PURE__*/React.createElement(EditableText, {
    value: configuration.text,
    contentElementId: contentElementId,
    onChange: text => updateConfiguration({
      text
    }),
    onlyParagraphs: true,
    scaleCategory: getTextScaleCategory(configuration, 'Text')
  })), (isSelected || !utils.isBlankEditableTextValue(configuration.attribution || [])) && /*#__PURE__*/React.createElement("figcaption", {
    className: styles$f.attribution
  }, /*#__PURE__*/React.createElement(EditableText, {
    value: configuration.attribution,
    contentElementId: contentElementId,
    onChange: attribution => updateConfiguration({
      attribution
    }),
    onlyParagraphs: true,
    scaleCategory: getTextScaleCategory(configuration, 'Attribution'),
    placeholder: t('pageflow_scrolled.inline_editing.type_attribution')
  })));
}
function getTextScaleCategory(configuration, suffix) {
  const base = `quote${suffix}`;
  switch (configuration.textSize) {
    case 'large':
      return `${base}-lg`;
    case 'small':
      return `${base}-sm`;
    case 'verySmall':
      return `${base}-xs`;
    default:
      return `${base}-md`;
  }
}

frontend.contentElementTypes.register('quote', {
  component: Quote
});

var styles$g = {"button":"ScrollButton-module_button__3DeL7","left":"ScrollButton-module_left__3uACk","right":"ScrollButton-module_right__25CLO","disabled":"ScrollButton-module_disabled__3fQR1","icon":"ScrollButton-module_icon__35w1l"};

const size = 40;
function ScrollButton({
  direction,
  disabled,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles$g.button, styles$g[direction], {
      [styles$g.disabled]: disabled
    }),
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$g.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: direction === 'left' ? 'arrowLeft' : 'arrowRight',
    width: size,
    height: size
  })));
}

function useIntersectionObserver({
  threshold,
  onVisibleIndexChange
}) {
  const containerRef = useRef();
  const childRefs = useRef([]);
  const observerRef = useRef();
  useEffect(() => {
    const observer = observerRef.current = new IntersectionObserver(entries => {
      const containerElement = containerRef.current;
      entries.forEach(entry => {
        const entryIndex = Array.from(containerElement.children).findIndex(child => child === entry.target);
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          onVisibleIndexChange(entryIndex);
        }
      });
    }, {
      root: containerRef.current,
      threshold
    });
    childRefs.current.forEach(child => {
      if (child) {
        observer.observe(child);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, [threshold, onVisibleIndexChange]);
  const setChildRef = index => ref => {
    if (observerRef.current) {
      if (ref) {
        observerRef.current.observe(ref);
      } else {
        observerRef.current.unobserve(childRefs.current[index]);
      }
    }
    childRefs.current[index] = ref;
  };
  return {
    containerRef,
    setChildRef
  };
}

var styles$h = {"lightContentTextColor":"var(--theme-light-content-text-color, #fff)","wrapper":"ImageGallery-module_wrapper__2H9en","wide":"ImageGallery-module_wide__xGLuJ","customMargin":"ImageGallery-module_customMargin__1VxM6","clip":"ImageGallery-module_clip__f_FU4","full":"ImageGallery-module_full__Qu2GB","hidePeeks":"ImageGallery-module_hidePeeks__2QyST","button":"ImageGallery-module_button__35bDf","leftButton":"ImageGallery-module_leftButton__3V-J6 ImageGallery-module_button__35bDf","rightButton":"ImageGallery-module_rightButton__ba0q5 ImageGallery-module_button__35bDf","paginationIndicator":"ImageGallery-module_paginationIndicator__2F5Y0","items":"ImageGallery-module_items__1q4QG","item":"ImageGallery-module_item__iqvfP","current":"ImageGallery-module_current__2Mm11","figure":"ImageGallery-module_figure__3zkJb","placeholder":"ImageGallery-module_placeholder__39Vq4"};

function ImageGallery({
  configuration,
  contentElementId,
  contentElementWidth,
  customMargin
}) {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const isPhonePlatform = usePhonePlatform();
  return /*#__PURE__*/React.createElement(FullscreenViewer, {
    contentElementId: contentElementId,
    renderChildren: ({
      enterFullscreen,
      isFullscreen
    }) => /*#__PURE__*/React.createElement(Scroller$1, {
      customMargin: customMargin,
      configuration: configuration,
      contentElementWidth: contentElementWidth,
      controlled: isFullscreen,
      displayFullscreenToggle: !isPhonePlatform && contentElementWidth !== contentElementWidths.full && configuration.enableFullscreenOnDesktop,
      visibleIndex: visibleIndex,
      setVisibleIndex: setVisibleIndex,
      onFullscreenEnter: enterFullscreen
    }),
    renderFullscreenChildren: ({
      exitFullscreen
    }) => {
      return /*#__PURE__*/React.createElement(Scroller$1, {
        configuration: configuration,
        contentElementWidth: contentElementWidth,
        visibleIndex: visibleIndex,
        setVisibleIndex: setVisibleIndex,
        displayFullscreenToggle: false,
        onBump: exitFullscreen,
        onFullscreenExit: exitFullscreen
      });
    }
  });
}
function Scroller$1({
  visibleIndex,
  setVisibleIndex,
  displayFullscreenToggle,
  customMargin,
  onFullscreenEnter,
  onFullscreenExit,
  onBump,
  configuration,
  contentElementWidth,
  controlled
}) {
  const lastVisibleIndex = useRef(null);
  const {
    isSelected,
    isEditable
  } = useContentElementEditorState();
  let items = configuration.items || [];
  if (!items.length && isEditable) {
    items = [{
      id: 1,
      placeholder: true
    }];
  }
  const onVisibleIndexChange = useCallback(index => {
    if (!controlled) {
      lastVisibleIndex.current = index;
      setVisibleIndex(index);
    }
  }, [controlled, setVisibleIndex]);
  const {
    containerRef: scrollerRef,
    setChildRef
  } = useIntersectionObserver({
    onVisibleIndexChange,
    threshold: 0.7
  });
  useEffect(() => {
    if (lastVisibleIndex.current !== visibleIndex && visibleIndex >= 0 && (controlled || lastVisibleIndex.current === null)) {
      lastVisibleIndex.current = visibleIndex;
      const scroller = scrollerRef.current;
      const item = scroller.children[visibleIndex];
      scroller.style.scrollBehavior = 'auto';
      scroller.scrollTo(Math.abs(scroller.offsetLeft - item.offsetLeft), 0);
      scroller.style.scrollBehavior = null;
    }
  }, [visibleIndex, scrollerRef, controlled]);
  const scrollToItem = useCallback(index => {
    const scroller = scrollerRef.current;
    const child = scroller.children[index];
    if (child) {
      scroller.scrollTo(child.offsetLeft - scroller.offsetLeft, 0);
    }
  }, [scrollerRef]);
  useContentElementEditorCommandSubscription(useCallback(command => {
    if (command.type === 'SET_CURRENT_ITEM') {
      scrollToItem(command.index);
    }
  }, [scrollToItem]));
  function scrollBy(delta) {
    scrollToItem(visibleIndex + delta);
  }
  function handleClick(event) {
    if (isEditable && !isSelected) {
      return;
    }
    const rect = scrollerRef.current.getBoundingClientRect();
    if ((event.pageX - rect.x) / rect.width < 0.5) {
      if (visibleIndex > 0) {
        scrollBy(-1);
      } else if (onBump) {
        onBump();
      }
    } else {
      if (visibleIndex < items.length - 1) {
        scrollBy(1);
      } else if (onBump) {
        onBump();
      }
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.wrapper, {
      [styles$h.wide]: contentElementWidth === contentElementWidths.lg || contentElementWidth === contentElementWidths.xl
    }, {
      [styles$h.full]: contentElementWidth === contentElementWidths.full
    }, {
      [styles$h.hidePeeks]: configuration.hidePeeks
    }, {
      [styles$h.customMargin]: customMargin
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$h.leftButton
  }, /*#__PURE__*/React.createElement(ScrollButton, {
    direction: "left",
    disabled: visibleIndex <= 0,
    onClick: () => scrollBy(-1)
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$h.rightButton
  }, /*#__PURE__*/React.createElement(ScrollButton, {
    direction: "right",
    disabled: visibleIndex >= items.length - 1,
    onClick: () => scrollBy(1)
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$h.items,
    ref: scrollerRef
  }, items.map((item, index) => /*#__PURE__*/React.createElement(Item, {
    key: item.id,
    ref: setChildRef(index),
    item: item,
    current: index === visibleIndex,
    configuration: configuration,
    onClick: handleClick
  }, displayFullscreenToggle && /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
    isFullscreen: false,
    onEnter: onFullscreenEnter
  })))), configuration.displayPaginationIndicator && /*#__PURE__*/React.createElement("div", {
    className: styles$h.paginationIndicator
  }, /*#__PURE__*/React.createElement(PaginationIndicator, {
    itemCount: items.length,
    currentIndex: visibleIndex,
    scrollerRef: scrollerRef,
    navAriaLabelTranslationKey: "pageflow_scrolled.public.image_gallery_pagination",
    itemAriaLabelTranslationKey: "pageflow_scrolled.public.go_to_image_gallery_item",
    onItemClick: index => scrollToItem(index)
  })));
}
const Item = forwardRef(function ({
  item,
  configuration,
  current,
  onClick,
  children
}, ref) {
  const imageFile = useFileWithInlineRights({
    configuration: item,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration: item,
    collectionName: 'imageFiles',
    propertyName: 'portraitImage'
  });
  const ItemImageComponent = portraitImageFile ? OrientationAwareItemImage : ItemImageWithCaption;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$h.item, {
      [styles$h.current]: current,
      [styles$h.placeholder]: item.placeholder
    }),
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$h.figure
  }, /*#__PURE__*/React.createElement(ItemImageComponent, {
    item: item,
    imageFile: imageFile,
    portraitImageFile: portraitImageFile,
    configuration: configuration,
    current: current,
    onClick: onClick,
    children: children
  })));
});
function OrientationAwareItemImage({
  imageFile,
  portraitImageFile,
  ...props
}) {
  const portraitOrientation = usePortraitOrientation();
  imageFile = portraitOrientation && portraitImageFile ? portraitImageFile : imageFile;
  return /*#__PURE__*/React.createElement(ItemImageWithCaption, Object.assign({
    imageFile: imageFile
  }, props));
}
function ItemImageWithCaption({
  item,
  imageFile,
  configuration,
  current,
  onClick,
  children
}) {
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const captions = configuration.captions || {};
  const caption = captions[item.id];
  const handleCaptionChange = function (caption) {
    updateConfiguration({
      captions: {
        ...captions,
        [item.id]: caption
      }
    });
  };
  return /*#__PURE__*/React.createElement(FitViewport, {
    file: imageFile,
    fallbackAspectRatio: 0.75,
    scale: 0.8
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(Figure, {
    caption: caption,
    variant: configuration.captionVariant,
    onCaptionChange: handleCaptionChange,
    addCaptionButtonVisible: current && !item.placeholder,
    addCaptionButtonPosition: "inside"
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: imageFile
  }), /*#__PURE__*/React.createElement("div", {
    onClick: onClick
  }, /*#__PURE__*/React.createElement(Image, {
    imageFile: imageFile,
    load: shouldLoad
  })), children, /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  }));
}

frontend.contentElementTypes.register('imageGallery', {
  component: ImageGallery,
  lifecycle: true,
  customMargin: true
});

var styles$i = {"breakpoint-md":"(min-width: 768px)","table":"InfoTable-module_table__3_afx","center":"InfoTable-module_center__2qGe6","labelColumnAlign-left":"InfoTable-module_labelColumnAlign-left__1k-J2","valueColumnAlign-left":"InfoTable-module_valueColumnAlign-left__3beY0","singleColumnAlign-left":"InfoTable-module_singleColumnAlign-left__27P3d","labelColumnAlign-center":"InfoTable-module_labelColumnAlign-center__3XIqd","valueColumnAlign-center":"InfoTable-module_valueColumnAlign-center__UUf8M","singleColumnAlign-center":"InfoTable-module_singleColumnAlign-center__3b_77","labelColumnAlign-right":"InfoTable-module_labelColumnAlign-right__3bm_l","valueColumnAlign-right":"InfoTable-module_valueColumnAlign-right__2PrQt","singleColumnAlign-right":"InfoTable-module_singleColumnAlign-right__194EU","selected":"InfoTable-module_selected__unFZr"};

function InfoTable({
  configuration,
  sectionProps
}) {
  const {
    isSelected
  } = useContentElementEditorState();
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      '--label-color': paletteColor(configuration.labelColor),
      '--value-color': paletteColor(configuration.valueColor)
    }
  }, /*#__PURE__*/React.createElement(EditableTable, {
    className: classNames(styles$i.table, styles$i[`labelColumnAlign-${configuration.labelColumnAlign}`], styles$i[`valueColumnAlign-${configuration.valueColumnAlign}`], styles$i[`singleColumnAlign-${configuration.singleColumnAlign}`], {
      [styles$i.selected]: isSelected,
      [styles$i.center]: sectionProps.layout === 'centerRagged'
    }),
    labelScaleCategory: "infoTableLabel",
    valueScaleCategory: "infoTableValue",
    labelPlaceholder: t('pageflow_scrolled.inline_editing.type_text'),
    valuePlaceholder: t('pageflow_scrolled.inline_editing.type_text'),
    value: configuration.value,
    stackedInPhoneLayout: configuration.singleColumnInPhoneLayout,
    onChange: value => updateConfiguration({
      value
    })
  }));
}

frontend.contentElementTypes.register('infoTable', {
  component: InfoTable
});
