import { useI18n, ThemeIcon, useTheme, paletteColor, useContentElementLifecycle, useFile, Image, useContentElementConfigurationUpdate, useContentElementEditorState, useStorylineActivity, useDelayedBoolean, useDarkBackground, useFileWithInlineRights, useFloatingPortalRoot, utils, InlineFileRights, Text, EditableInlineText, EditableText, LinkButton, usePortraitOrientation, usePhonePlatform, useContentElementEditorCommandSubscription, useIsomorphicLayoutEffect, FullscreenViewer, contentElementWidths, ContentElementBox, ContentElementFigure, FitViewport, FilePlaceholder, ToggleFullscreenCornerButton, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { FloatingPortal, useTransitionStyles, useFloating, offset, shift, flip, arrow, autoUpdate, useRole, useDismiss, useInteractions, CompositeItem, FloatingFocusManager, FloatingArrow, Composite } from '@floating-ui/react';
import classNames from 'classnames';

var styles = {"button":"PagerButton-module_button__1WPOu","icon":"PagerButton-module_icon__346kq","disabled":"PagerButton-module_disabled__1SbjV","visuallyHidden":"PagerButton-module_visuallyHidden__1Hrir"};

const size = 40;
function PagerButton({
  direction,
  disabled,
  onClick
}) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.button, {
      [styles.disabled]: disabled
    }),
    tabIndex: "-1",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.icon
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: direction === 'left' ? 'arrowLeft' : 'arrowRight',
    width: size,
    height: size
  }), /*#__PURE__*/React.createElement("span", {
    className: styles.visuallyHidden
  }, t(direction === 'left' ? 'pageflow_scrolled.public.previous' : 'pageflow_scrolled.public.next'))));
}
function insidePagerButton(element) {
  return !!element.closest(`.${styles.button}`);
}

var styles$1 = {"outer":"Pager-module_outer__2CrMo","customMargin":"Pager-module_customMargin__1qTs3","left":"Pager-module_left__2UmsW","right":"Pager-module_right__2Qn5W","center":"Pager-module_center__1nzq4"};

function Pager({
  areas,
  customMargin,
  panZoomEnabled,
  hideButtons,
  activeIndex,
  activateArea,
  children
}) {
  const theme = useTheme();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.outer, {
      [styles$1.customMargin]: customMargin
    })
  }, renderScrollButtons(), /*#__PURE__*/React.createElement("div", {
    className: styles$1.center
  }, children));
  function renderScrollButtons() {
    if (!panZoomEnabled || theme.options.hotspotsPagerButtonsHidden) {
      return null;
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: styles$1.left
    }, /*#__PURE__*/React.createElement(PagerButton, {
      direction: "left",
      disabled: activeIndex === -1 || hideButtons,
      onClick: () => {
        if (activeIndex >= 0) {
          activateArea(activeIndex - 1);
        }
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: styles$1.right
    }, /*#__PURE__*/React.createElement(PagerButton, {
      direction: "right",
      disabled: activeIndex >= areas.length || hideButtons,
      onClick: () => {
        if (activeIndex < areas.length) {
          activateArea(activeIndex + 1);
        }
      }
    })));
  }
}

var styles$2 = {"scroller":"Scroller-module_scroller__b_jkV","sticky":"Scroller-module_sticky__1nSEO","inner":"Scroller-module_inner__XTNms","step":"Scroller-module_step__1ar7Q"};

const Scroller = React.forwardRef(function Scroller({
  areas,
  disabled,
  setStepRef,
  children
}, ref) {
  if (disabled) {
    return children;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$2.scroller
  }, Array.from({
    length: areas.length + 2
  }, (_, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    ref: setStepRef(index),
    className: styles$2.step
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$2.sticky
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.inner
  }, children))));
});

var styles$3 = {"area":"Area-module_area__2uQD0","clip":"Area-module_clip__TgtiP","outline":"Area-module_outline__bRQqm","noPointerEvents":"Area-module_noPointerEvents__kLM1Z","hidden":"Area-module_hidden__2SAnU","highlighted":"Area-module_highlighted__2hdr1"};

function Area({
  area,
  noPointerEvents,
  highlighted,
  outlined,
  outlineHidden,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.area, className, {
      [styles$3.highlighted]: highlighted,
      [styles$3.noPointerEvents]: noPointerEvents
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.clip,
    style: {
      clipPath: polygon(area.outline)
    },
    tabIndex: "-1",
    onClick: onClick,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }), children, outlined && /*#__PURE__*/React.createElement(Outline, {
    points: area.outline,
    color: areaColor(area),
    hidden: outlineHidden
  }));
}
function areaColor(area) {
  return paletteColor(area.color);
}
function Outline({
  points,
  color,
  hidden
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: classNames(styles$3.outline, {
      [styles$3.hidden]: hidden
    }),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: points.map(coords => coords.map(coord => coord).join(',')).join(' '),
    style: {
      stroke: color
    }
  }));
}
function polygon(points) {
  return `polygon(${points.map(coords => coords.map(coord => `${coord}%`).join(' ')).join(', ')})`;
}

var styles$4 = {"area":"ImageArea-module_area__3rqgC","activeImageVisible":"ImageArea-module_activeImageVisible__oYKOK"};

function ImageArea({
  panZoomEnabled,
  activeImageVisible,
  ...props
}) {
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const activeImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: props.area.activeImage
  });
  const fallbackActiveImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: props.area.fallbackActiveImage
  });
  return /*#__PURE__*/React.createElement(Area, Object.assign({}, props, {
    className: classNames(styles$4.area, {
      [styles$4.activeImageVisible]: activeImageVisible
    })
  }), /*#__PURE__*/React.createElement(Image, {
    imageFile: activeImageFile || fallbackActiveImageFile,
    load: shouldLoad,
    variant: panZoomEnabled ? 'ultra' : 'large',
    preferSvg: true
  }));
}

var styles$5 = {"wrapper":"Indicator-module_wrapper__2b1Mj","indicator":"Indicator-module_indicator__2A3-l","inner":"Indicator-module_inner__2BgbL","hidden":"Indicator-module_hidden__3j1Re","outer":"Indicator-module_outer__36JWr"};

function Indicator({
  area,
  hidden,
  panZoomTransform,
  outerRef
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$5.wrapper,
    ref: outerRef,
    style: {
      transform: panZoomTransform
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.indicator, {
      [styles$5.hidden]: hidden
    }),
    style: {
      '--color': areaColor(area),
      left: `${area.indicatorPosition[0]}%`,
      top: `${area.indicatorPosition[1]}%`
    }
  }));
}

const TooltipPortal = FloatingPortal;

const useTooltipTransitionStyles = useTransitionStyles;

function getBoundingRect(area) {
  const xCoords = area.map(point => point[0]);
  const yCoords = area.map(point => point[1]);
  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function getTooltipInlineStyles({
  area,
  panZoomTransform
}) {
  const referencePositionInPercent = getReferencePositionInPercent({
    area
  });
  return {
    reference: {
      left: `${referencePositionInPercent.left}%`,
      top: `${referencePositionInPercent.top}%`,
      height: `${referencePositionInPercent.height}%`
    },
    wrapper: {
      transform: panZoomTransform
    }
  };
}
function getReferencePositionInPercent({
  area
}) {
  const referenceType = area.tooltipReference;
  const indicatorRect = getIndicatorRect(area.indicatorPosition);
  if (referenceType === 'area') {
    const boundingRect = getBoundingRect(area.outline);
    return {
      top: boundingRect.top,
      height: boundingRect.height,
      left: indicatorRect.left
    };
  } else {
    return indicatorRect;
  }
}
function getIndicatorRect(indicatorPosition) {
  return {
    left: indicatorPosition[0],
    top: indicatorPosition[1],
    height: 0
  };
}

var styles$6 = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","compositeItem":"Tooltip-module_compositeItem__3QnpM","wrapper":"Tooltip-module_wrapper__3J6qG","reference":"Tooltip-module_reference__1qjnL","box":"Tooltip-module_box__2MGMl","paddingForScrollButtons":"Tooltip-module_paddingForScrollButtons__3wFKp","light":"Tooltip-module_light__3H6Ii scope-darkContent","dark":"Tooltip-module_dark__2nDMy scope-lightContent","maxWidth-wide":"Tooltip-module_maxWidth-wide__3Vik_","maxWidth-narrow":"Tooltip-module_maxWidth-narrow__foMG0","maxWidth-veryNarrow":"Tooltip-module_maxWidth-veryNarrow__1yS6L","align-center":"Tooltip-module_align-center__jRtdN","align-right":"Tooltip-module_align-right__2ezWZ","minWidth":"Tooltip-module_minWidth__2iAip","imageWrapper":"Tooltip-module_imageWrapper__1BCEJ","link":"Tooltip-module_link__1xE5O","textWrapper":"Tooltip-module_textWrapper__Hc0qY"};

const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
function Tooltip({
  area,
  panZoomTransform,
  contentElementId,
  configuration,
  visible,
  active,
  imageFile,
  containerRect,
  keepInViewport,
  floatingStrategy,
  aboveNavigationWidgets,
  wrapperRef,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDismiss,
  onLinkClick
}) {
  var _tooltipTexts$area$id6, _tooltipTexts$area$id7, _tooltipLinks$area$id, _tooltipLinks$area$id2, _tooltipTexts$area$id8;
  const {
    t: translateWithEntryLocale
  } = useI18n();
  const {
    t
  } = useI18n({
    locale: 'ui'
  });
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {
    isEditable
  } = useContentElementEditorState();
  const storylineMode = useStorylineActivity();
  const inBackground = useDelayedBoolean(storylineMode !== 'active', {
    fromTrueToFalse: 200
  });
  const darkBackground = useDarkBackground();
  const light = configuration.invertTooltips ? !darkBackground : darkBackground;
  const tooltipImageFile = useFileWithInlineRights({
    configuration: area,
    collectionName: 'imageFiles',
    propertyName: 'tooltipImage'
  });
  const inlineStyles = getTooltipInlineStyles({
    area,
    panZoomTransform
  });
  const tooltipTexts = configuration.tooltipTexts || {};
  const tooltipLinks = configuration.tooltipLinks || {};
  const referenceType = area.tooltipReference;
  const position = area.tooltipPosition;
  const maxWidth = area.tooltipMaxWidth;
  const arrowRef = useRef();
  const {
    refs,
    floatingStyles,
    context
  } = useFloating({
    open: containerRect.width > 0 && visible && !inBackground,
    onOpenChange: open => !open && onDismiss(),
    strategy: floatingStrategy || 'absolute',
    placement: position === 'above' ? 'top' : 'bottom',
    middleware: [offset(referenceType === 'area' ? 7 : 20), shift(keepInViewport ? {
      crossAxis: true,
      padding: {
        left: 40,
        right: 40
      }
    } : {
      padding: {
        left: -5,
        right: -5
      },
      boundary: wrapperRef.current
    }), keepInViewport && flip(), arrow({
      element: arrowRef,
      padding: 5
    })],
    whileElementsMounted: autoUpdate
  });
  const role = useRole(context, {
    role: 'label'
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
    outsidePress: event => !insidePagerButton(event.target),
    capture: {
      outsidePress: false
    }
  });
  const {
    getReferenceProps,
    getFloatingProps
  } = useInteractions([role, dismiss]);
  const {
    isMounted,
    styles: transitionStyles
  } = useTooltipTransitionStyles(context);
  const floatingPortalRoot = useFloatingPortalRoot();
  function handleTextChange(propertyName, value) {
    updateConfiguration({
      tooltipTexts: {
        ...tooltipTexts,
        [area.id]: {
          ...tooltipTexts[area.id],
          [propertyName]: value
        }
      }
    });
  }
  function handleLinkChange(value) {
    if (value) {
      var _tooltipTexts$area$id;
      if (utils.isBlankEditableTextValue((_tooltipTexts$area$id = tooltipTexts[area.id]) === null || _tooltipTexts$area$id === void 0 ? void 0 : _tooltipTexts$area$id.link)) {
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
      tooltipLinks: {
        ...tooltipLinks,
        [area.id]: value
      }
    });
  }
  function handleKeyDown(event) {
    if (arrowKeys.includes(event.key) && isEditable) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  function presentOrEditing(propertyName) {
    var _tooltipTexts$area$id2, _tooltipTexts$area$id3, _tooltipTexts$area$id4, _tooltipTexts$area$id5;
    return !utils.isBlankEditableTextValue((_tooltipTexts$area$id2 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id2 === void 0 ? void 0 : _tooltipTexts$area$id2[propertyName]) || isEditable && active || isEditable && utils.isBlankEditableTextValue((_tooltipTexts$area$id3 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id3 === void 0 ? void 0 : _tooltipTexts$area$id3.title) && utils.isBlankEditableTextValue((_tooltipTexts$area$id4 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id4 === void 0 ? void 0 : _tooltipTexts$area$id4.description) && utils.isBlankEditableTextValue((_tooltipTexts$area$id5 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id5 === void 0 ? void 0 : _tooltipTexts$area$id5.link);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CompositeItem, {
    render: /*#__PURE__*/React.createElement("div", {
      className: styles$6.compositeItem
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$6.wrapper,
    style: inlineStyles.wrapper
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    ref: refs.setReference,
    className: styles$6.reference,
    style: inlineStyles.reference
  }, getReferenceProps())))), isMounted && /*#__PURE__*/React.createElement(TooltipPortal, {
    id: aboveNavigationWidgets && 'floating-ui-above-navigation-widgets',
    root: floatingPortalRoot
  }, /*#__PURE__*/React.createElement(FloatingFocusManager, {
    context: context,
    modal: false,
    initialFocus: -1,
    returnFocus: false
  }, /*#__PURE__*/React.createElement("div", {
    style: transitionStyles
  }, /*#__PURE__*/React.createElement("div", Object.assign({
    ref: refs.setFloating,
    style: floatingStyles,
    className: classNames(styles$6.box, styles$6[`maxWidth-${maxWidth}`], styles$6[`align-${area.tooltipTextAlign}`], configuration.linkButtonVariant && `scope-linkButton-${configuration.linkButtonVariant}`, light ? styles$6.light : styles$6.dark, {
      [styles$6.paddingForScrollButtons]: keepInViewport,
      [styles$6.minWidth]: presentOrEditing('link')
    }),
    onMouseEnter: () => storylineMode === 'active' && onMouseEnter(),
    onMouseLeave: onMouseLeave,
    onClick: onClick
  }, getFloatingProps()), /*#__PURE__*/React.createElement(FloatingArrow, {
    ref: arrowRef,
    context: context,
    strokeWidth: 1
  }), tooltipImageFile && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles$6.imageWrapper
  }, /*#__PURE__*/React.createElement(Image, {
    imageFile: tooltipImageFile,
    variant: 'medium',
    fill: false,
    width: tooltipImageFile.width,
    height: tooltipImageFile.height,
    preferSvg: true
  }), /*#__PURE__*/React.createElement(InlineFileRights, {
    context: "insideElement",
    items: [{
      file: tooltipImageFile,
      label: 'image'
    }]
  }), /*#__PURE__*/React.createElement(InlineFileRights, {
    context: "afterElement",
    items: [{
      file: tooltipImageFile,
      label: 'image'
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$6.textWrapper,
    onKeyDown: handleKeyDown
  }, presentOrEditing('title') && /*#__PURE__*/React.createElement("h3", {
    id: `hotspots-tooltip-title-${contentElementId}-${area.id}`
  }, /*#__PURE__*/React.createElement(Text, {
    inline: true,
    scaleCategory: "hotspotsTooltipTitle"
  }, /*#__PURE__*/React.createElement(EditableInlineText, {
    value: (_tooltipTexts$area$id6 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id6 === void 0 ? void 0 : _tooltipTexts$area$id6.title,
    onChange: value => handleTextChange('title', value),
    placeholder: t('pageflow_scrolled.inline_editing.type_heading')
  }))), presentOrEditing('description') && /*#__PURE__*/React.createElement(EditableText, {
    value: (_tooltipTexts$area$id7 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id7 === void 0 ? void 0 : _tooltipTexts$area$id7.description,
    onChange: value => handleTextChange('description', value),
    scaleCategory: "hotspotsTooltipDescription",
    placeholder: t('pageflow_scrolled.inline_editing.type_text')
  }), presentOrEditing('link') && /*#__PURE__*/React.createElement(LinkButton, {
    className: styles$6.link,
    scaleCategory: "hotspotsTooltipLink",
    href: (_tooltipLinks$area$id = tooltipLinks[area.id]) === null || _tooltipLinks$area$id === void 0 ? void 0 : _tooltipLinks$area$id.href,
    openInNewTab: (_tooltipLinks$area$id2 = tooltipLinks[area.id]) === null || _tooltipLinks$area$id2 === void 0 ? void 0 : _tooltipLinks$area$id2.openInNewTab,
    value: (_tooltipTexts$area$id8 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id8 === void 0 ? void 0 : _tooltipTexts$area$id8.link,
    allowRemove: true,
    onTextChange: value => handleTextChange('link', value),
    onLinkChange: value => handleLinkChange(value),
    onClick: onLinkClick
  })))))));
}

function useHotspotsConfiguration(configuration) {
  const defaultImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  const portraitImageFile = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitImage'
  });
  const portraitOrientation = usePortraitOrientation();
  const portraitMode = !!(portraitOrientation && portraitImageFile);
  const imageFile = portraitMode ? portraitImageFile : defaultImageFile;
  return {
    panZoomEnabled: usePanZoomEnabled(configuration),
    areas: useAreas(configuration, portraitMode),
    imageFile,
    portraitMode
  };
}
function useAreas(configuration, portraitMode) {
  return useMemo(() => {
    return (configuration.areas || []).map(area => {
      if (portraitMode) {
        return applyAreaDefaults({
          ...area,
          outline: area.portraitOutline,
          zoom: area.portraitZoom,
          activeImage: area.portraitActiveImage,
          fallbackActiveImage: area.activeImage,
          indicatorPosition: area.portraitIndicatorPosition,
          color: area.portraitColor || area.color,
          tooltipReference: area.portraitTooltipReference,
          tooltipPosition: area.portraitTooltipPosition,
          tooltipMaxWidth: area.portraitTooltipMaxWidth
        });
      } else {
        return applyAreaDefaults(area);
      }
    });
  }, [configuration.areas, portraitMode]);
}
function applyAreaDefaults(area) {
  var _area$outline;
  return {
    ...area,
    outline: ((_area$outline = area.outline) === null || _area$outline === void 0 ? void 0 : _area$outline.length) ? area.outline : [[50, 50]],
    zoom: area.zoom || 0,
    indicatorPosition: area.indicatorPosition || [50, 50]
  };
}
function usePanZoomEnabled(configuration) {
  const isPhonePlatform = usePhonePlatform();
  return configuration.enablePanZoom === 'always' || configuration.enablePanZoom === 'phonePlatform' && isPhonePlatform;
}

function useHotspotsEditorCommandSubscriptions({
  setHighlightedIndex,
  activateArea
}) {
  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_AREA') {
      setHighlightedIndex(command.index);
    } else if (command.type === 'RESET_AREA_HIGHLIGHT') {
      setHighlightedIndex(-1);
    } else if (command.type === 'SET_ACTIVE_AREA') {
      activateArea(command.index);
    }
  });
}

function useHotspotsState({
  areas,
  initialActiveArea
}) {
  const {
    setTransientState,
    select,
    isSelected
  } = useContentElementEditorState();
  const [activeIndex, setActiveIndexState] = useState(typeof initialActiveArea === 'undefined' ? -1 : initialActiveArea);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const setActiveIndex = useCallback(index => {
    var _areas$index;
    setTransientState({
      activeAreaId: (_areas$index = areas[index]) === null || _areas$index === void 0 ? void 0 : _areas$index.id
    });
    setActiveIndexState(activeIndex => {
      if (activeIndex !== index && index >= 0 && isSelected) {
        select();
      }
      return index;
    });
  }, [setActiveIndexState, setTransientState, areas, select, isSelected]);
  return {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setActiveIndex,
    setHoveredIndex,
    setHighlightedIndex
  };
}

function useContentRect({
  enabled
}) {
  const [contentRect, setContentRect] = useState({
    width: 0,
    height: 0
  });
  const ref = useRef();
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const current = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      requestAnimationFrame(() => {
        setContentRect(entries[entries.length - 1].contentRect);
      });
    });
    resizeObserver.observe(current);
    return () => {
      resizeObserver.unobserve(current);
    };
  }, [enabled]);
  return [contentRect, ref];
}

const fullRect = {
  left: 0,
  top: 0,
  width: 100,
  height: 100
};
function getInitialTransform({
  containerWidth,
  containerHeight,
  imageFileWidth,
  imageFileHeight,
  areasBoundingRect,
  indicatorPositions = [],
  containerSafeAreaMargin = 0
}) {
  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;
  const scaleCover = getScaleToCoverContainerWithRect({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    rect: fullRect
  });
  const scaleContainMotif = getScaleToContainRectInContainer({
    baseImageWidth,
    baseImageHeight,
    containerWidth: containerWidth * (1 - 2 * containerSafeAreaMargin / 100),
    containerHeight,
    rect: areasBoundingRect
  });
  const scale = Math.min(scaleCover, scaleContainMotif);
  const [translateX, translateY] = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    scale,
    unbounded: scaleContainMotif < scaleCover,
    rect: areasBoundingRect
  });
  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale
    },
    indicators: transformIndicators({
      indicatorPositions,
      baseImageWidth,
      baseImageHeight,
      translateX,
      translateY,
      scale
    })
  };
}
function getPanZoomStepTransform({
  containerWidth,
  containerHeight,
  imageFileWidth,
  imageFileHeight,
  areaOutline,
  areaZoom,
  indicatorPositions = [],
  initialScale
}) {
  const areaRect = getBoundingRect(areaOutline);
  const baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  const baseImageHeight = containerHeight;
  const scale = getAreaScale({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    areaRect,
    areaZoom,
    initialScale
  });
  const [translateX, translateY] = center({
    baseImageWidth,
    baseImageHeight,
    containerWidth,
    containerHeight,
    rect: areaRect,
    scale
  });
  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale
    },
    indicators: transformIndicators({
      indicatorPositions,
      baseImageWidth,
      baseImageHeight,
      translateX,
      translateY,
      scale
    })
  };
}
function transformIndicators({
  indicatorPositions,
  baseImageWidth,
  baseImageHeight,
  translateX,
  translateY,
  scale
}) {
  return indicatorPositions.map(indicatorPosition => ({
    x: translateX + baseImageWidth * indicatorPosition[0] / 100 * (scale - 1),
    y: translateY + baseImageHeight * indicatorPosition[1] / 100 * (scale - 1)
  }));
}
function getAreaScale({
  containerWidth,
  containerHeight,
  baseImageWidth,
  baseImageHeight,
  areaRect,
  areaZoom,
  initialScale = 1
}) {
  const scale = getScaleToContainRectInContainer({
    containerWidth,
    containerHeight,
    baseImageWidth,
    baseImageHeight,
    rect: areaRect
  });
  return (100 - areaZoom) / 100 * initialScale + areaZoom / 100 * scale;
}
function getScaleToCoverContainerWithRect({
  containerWidth,
  containerHeight,
  baseImageWidth,
  baseImageHeight,
  rect
}) {
  const [scaleX, scaleY] = getScalesToFit({
    containerWidth,
    containerHeight,
    baseImageWidth,
    baseImageHeight,
    rect
  });
  return Math.max(scaleX, scaleY);
}
function getScaleToContainRectInContainer({
  containerWidth,
  containerHeight,
  baseImageWidth,
  baseImageHeight,
  rect
}) {
  const [scaleX, scaleY] = getScalesToFit({
    containerWidth,
    containerHeight,
    baseImageWidth,
    baseImageHeight,
    rect
  });
  return Math.min(scaleX, scaleY);
}
function getScalesToFit({
  containerWidth,
  containerHeight,
  baseImageWidth,
  baseImageHeight,
  rect
}) {
  const baseRectWidth = rect.width / 100 * baseImageWidth;
  const baseRectHeight = rect.height / 100 * baseImageHeight;
  return [containerWidth / baseRectWidth, containerHeight / baseRectHeight];
}
function center({
  baseImageWidth,
  baseImageHeight,
  containerWidth,
  containerHeight,
  unbounded,
  rect,
  scale
}) {
  const displayImageWidth = baseImageWidth * scale;
  const displayImageHeight = baseImageHeight * scale;
  const displayRectWidth = rect.width / 100 * displayImageWidth;
  const displayRectLeft = rect.left / 100 * displayImageWidth;
  const displayRectHeight = rect.height / 100 * displayImageHeight;
  const displayRectTop = rect.top / 100 * displayImageHeight;
  let translateX;
  let translateY;
  if (displayImageWidth < containerWidth) {
    translateX = (containerWidth - displayImageWidth) / 2;
  } else {
    translateX = (containerWidth - displayRectWidth) / 2 - displayRectLeft;
    if (!unbounded) {
      translateX = Math.min(0, Math.max(containerWidth - displayImageWidth, translateX));
    }
  }
  if (displayImageHeight < containerHeight) {
    translateY = (containerHeight - displayImageHeight) / 2;
  } else {
    translateY = (containerHeight - displayRectHeight) / 2 - displayRectTop;
    if (!unbounded) {
      translateY = Math.min(0, Math.max(containerHeight - displayImageHeight, translateY));
    }
  }
  return [translateX, translateY];
}

function usePanZoomTransforms({
  containerRect,
  imageFile,
  areas,
  initialTransformEnabled,
  panZoomEnabled
}) {
  const imageFileWidth = imageFile === null || imageFile === void 0 ? void 0 : imageFile.width;
  const imageFileHeight = imageFile === null || imageFile === void 0 ? void 0 : imageFile.height;
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  return useMemo(() => {
    if (!panZoomEnabled && !initialTransformEnabled || !containerWidth || !containerHeight || !imageFileWidth || !imageFileHeight) {
      return nullTransforms;
    }
    const indicatorPositions = areas.map(area => area.indicatorPosition);
    const areasBoundingRect = getBoundingRect(areas.flatMap(area => area.outline));
    const initialTransform = initialTransformEnabled ? getInitialTransform({
      areasBoundingRect,
      imageFileWidth,
      imageFileHeight,
      containerWidth,
      containerHeight,
      indicatorPositions,
      containerSafeAreaMargin: getContainerSafeAreaMargin({
        panZoomEnabled,
        areasBoundingRect
      })
    }) : nullTransform;
    const initialTransformString = toString(initialTransform.wrapper);
    const areaTransformStrings = [];
    const tooltipTransformStrings = [];
    areas.forEach((area, index) => {
      if (panZoomEnabled) {
        var _initialTransform$wra;
        const transform = getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom,
          initialScale: ((_initialTransform$wra = initialTransform.wrapper) === null || _initialTransform$wra === void 0 ? void 0 : _initialTransform$wra.scale) || 1,
          imageFileWidth,
          imageFileHeight,
          containerWidth,
          containerHeight,
          indicatorPositions
        });
        const transformString = toString(transform.wrapper);
        areaTransformStrings.push({
          wrapper: transformString,
          indicators: transform.indicators.map(toString)
        });
        tooltipTransformStrings.push(transformString);
      } else {
        tooltipTransformStrings.push(initialTransformString);
      }
    });
    return {
      initial: {
        wrapper: initialTransformString,
        indicators: initialTransform.indicators.map(toString),
        tooltips: tooltipTransformStrings
      },
      areas: areaTransformStrings
    };
  }, [panZoomEnabled, initialTransformEnabled, containerWidth, containerHeight, imageFileWidth, imageFileHeight, areas]);
}
const pagerButtonsMargin = 8;
function getContainerSafeAreaMargin({
  panZoomEnabled,
  areasBoundingRect
}) {
  return panZoomEnabled && insideSafeArea(areasBoundingRect) ? pagerButtonsMargin : 0;
}
function insideSafeArea(rect) {
  return rect.left >= pagerButtonsMargin && rect.left + rect.width <= 100 - pagerButtonsMargin;
}
function toString(transform) {
  return transform && `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale || 1})`;
}
const nullTransforms = {
  initial: {
    indicators: [],
    tooltips: []
  },
  areas: []
};
const nullTransform = {
  indicators: []
};

function useIntersectionObserver({
  threshold,
  onVisibleIndexChange,
  enabled
}) {
  const containerRef = useRef();
  const childRefs = useRef([]);
  const observerRef = useRef();
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const observer = observerRef.current = new IntersectionObserver(entries => {
      const containerElement = containerRef.current;
      if (!containerElement) {
        return;
      }
      let found = false;
      entries.forEach(entry => {
        const entryIndex = Array.from(containerElement.children).findIndex(child => child === entry.target);
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          found = true;
          onVisibleIndexChange(entryIndex);
        }
      });
      if (!found) {
        onVisibleIndexChange(-1);
      }
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
  }, [enabled, threshold, onVisibleIndexChange]);
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
  return [containerRef, setChildRef];
}

function useScrollPanZoom({
  panZoomTransforms,
  enabled,
  onChange
}) {
  const wrapperRef = useRef();
  const scrollerAreasRef = useRef();
  const indicatorRefs = useRef([]);
  const onVisibleIndexChange = useCallback(index => onChange(index - 1), [onChange]);
  const [scrollerRef, setStepRef] = useIntersectionObserver({
    enabled,
    threshold: 0.7,
    onVisibleIndexChange
  });
  const steps = useMemo(() => {
    if (!enabled || !panZoomTransforms.areas.length) {
      return;
    }
    return [panZoomTransforms.initial, ...panZoomTransforms.areas, panZoomTransforms.initial];
  }, [panZoomTransforms, enabled]);
  const scrollFromToArea = useCallback((from, to) => {
    const scroller = scrollerRef.current;
    const step = scroller.children[to + 1];
    scroller.scrollTo(Math.abs(scroller.offsetLeft - step.offsetLeft), 0);
    if (!steps) {
      return;
    }
    wrapperRef.current.animate([keyframe(steps[from + 1].wrapper), keyframe(steps[to + 1].wrapper)], {
      duration: 200
    });
    panZoomTransforms.areas.forEach((_, index) => {
      indicatorRefs.current[index].animate([keyframe(steps[from + 1].indicators[index]), keyframe(steps[to + 1].indicators[index])], {
        duration: 200
      });
    });
  }, [scrollerRef, steps, panZoomTransforms]);
  useIsomorphicLayoutEffect(() => {
    if (!steps) {
      return;
    }
    const scrollTimeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });
    const animations = [];
    [wrapperRef.current, scrollerAreasRef.current].forEach(element => animations.push(element.animate(steps.map(step => keyframe(step.wrapper)), {
      fill: 'both',
      timeline: scrollTimeline
    })));
    panZoomTransforms.areas.forEach((_, index) => {
      animations.push(indicatorRefs.current[index].animate(steps.map(step => keyframe(step.indicators[index])), {
        fill: 'both',
        timeline: scrollTimeline
      }));
    });
    return () => animations.forEach(animation => animation.cancel());
  }, [panZoomTransforms, steps]);
  const setIndicatorRef = index => ref => {
    indicatorRefs.current[index] = ref;
  };
  return {
    panZoomRefs: {
      wrapper: wrapperRef,
      scroller: scrollerRef,
      scrollerAreas: scrollerAreasRef,
      setStep: setStepRef,
      setIndicator: setIndicatorRef
    },
    scrollFromToArea
  };
}
function keyframe(transform) {
  return {
    transform: transform || 'translate(0px, 0px)',
    easing: 'ease'
  };
}

var styles$7 = {"tooltipsWrapper":"Hotspots-module_tooltipsWrapper__3EEZA","clip":"Hotspots-module_clip__2wfxm","stack":"Hotspots-module_stack__3Vpw6","letterboxBackground":"Hotspots-module_letterboxBackground__3GNSI","wrapper":"Hotspots-module_wrapper__1TvVX","compositeItem":"Hotspots-module_compositeItem__BZtU-"};

function Hotspots({
  contentElementId,
  contentElementWidth,
  customMargin,
  configuration,
  sectionProps = {}
}) {
  return /*#__PURE__*/React.createElement(FullscreenViewer, {
    contentElementId: contentElementId,
    renderChildren: ({
      enterFullscreen
    }) => /*#__PURE__*/React.createElement(HotspotsImage, {
      contentElementId: contentElementId,
      contentElementWidth: contentElementWidth,
      customMargin: customMargin,
      configuration: configuration,
      isIntersecting: sectionProps.isIntersecting,
      displayFullscreenToggle: contentElementWidth !== contentElementWidths.full && configuration.enableFullscreen,
      keepTooltipsInViewport: configuration.position === 'backdrop',
      onFullscreenEnter: enterFullscreen,
      floatingStrategy: configuration.position === 'standAlone' || configuration.position === 'backdrop' ? 'fixed' : 'absolute'
    }, children => /*#__PURE__*/React.createElement(ContentElementBox, {
      configuration: configuration
    }, /*#__PURE__*/React.createElement(ContentElementFigure, {
      configuration: configuration
    }, /*#__PURE__*/React.createElement("div", {
      className: styles$7.clip
    }, children)))),
    renderFullscreenChildren: () => /*#__PURE__*/React.createElement(HotspotsImage, {
      contentElementId: contentElementId,
      contentElementWidth: contentElementWidth,
      configuration: configuration,
      displayFullscreenToggle: false,
      keepTooltipsInViewport: true,
      tooltipsAboveNavigationWidgets: true
    })
  });
}
function HotspotsImage({
  contentElementId,
  contentElementWidth,
  customMargin,
  configuration,
  keepTooltipsInViewport,
  floatingStrategy,
  tooltipsAboveNavigationWidgets,
  isIntersecting,
  displayFullscreenToggle,
  onFullscreenEnter,
  children = children => children
}) {
  const {
    imageFile,
    areas,
    panZoomEnabled
  } = useHotspotsConfiguration(configuration);
  const {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setActiveIndex,
    setHoveredIndex,
    setHighlightedIndex
  } = useHotspotsState({
    areas,
    initialActiveArea: configuration.initialActiveArea
  });
  const {
    shouldLoad
  } = useContentElementLifecycle();
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  const aspectRatio = imageFile ? `${imageFile.width} / ${imageFile.height}` : '4 / 3';
  const [containerRect, containerRef] = useContentRect({
    enabled: shouldLoad
  });
  const panZoomTransforms = usePanZoomTransforms({
    containerRect,
    imageFile,
    areas,
    initialTransformEnabled: configuration.position === 'backdrop',
    panZoomEnabled
  });
  const {
    panZoomRefs,
    scrollFromToArea
  } = useScrollPanZoom({
    panZoomTransforms,
    enabled: shouldLoad,
    onChange: setActiveIndex
  });
  const scrollToArea = useCallback(index => {
    scrollFromToArea(activeIndex, index);
  }, [scrollFromToArea, activeIndex]);
  const activateArea = panZoomEnabled ? scrollToArea : setActiveIndex;
  useHotspotsEditorCommandSubscriptions({
    setHighlightedIndex,
    activateArea
  });
  function renderVisibleAreas() {
    return areas.map((area, index) => /*#__PURE__*/React.createElement(ImageArea, {
      key: index,
      area: area,
      panZoomEnabled: panZoomEnabled,
      activeImageVisible: activeIndex === index || !panZoomEnabled && activeIndex < 0 && hoveredIndex === index,
      outlined: isEditable && isSelected,
      outlineHidden: isIntersecting,
      highlighted: hoveredIndex === index || highlightedIndex === index || activeIndex === index
    }));
  }
  function renderClickableAreas() {
    return areas.map((area, index) => /*#__PURE__*/React.createElement(Area, {
      key: index,
      area: area,
      noPointerEvents: panZoomEnabled && activeIndex >= 0 && activeIndex < areas.length,
      onMouseEnter: () => setHoveredIndex(index),
      onMouseLeave: () => setHoveredIndex(-1),
      onClick: () => {
        if (!isEditable || isSelected) {
          activateArea(index);
        }
      }
    }));
  }
  function renderIndicators() {
    return areas.map((area, index) => /*#__PURE__*/React.createElement(Indicator, {
      key: index,
      area: area,
      hidden: isIntersecting || panZoomEnabled && activeIndex >= 0 && activeIndex < areas.length && activeIndex !== index,
      panZoomTransform: panZoomTransforms.initial.indicators[index],
      outerRef: panZoomRefs.setIndicator(index)
    }));
  }
  function renderTooltips() {
    return areas.map((area, index) => /*#__PURE__*/React.createElement(Tooltip, {
      key: index,
      area: area,
      contentElementId: contentElementId,
      containerRect: containerRect,
      imageFile: imageFile,
      panZoomTransform: panZoomTransforms.initial.tooltips[index],
      configuration: configuration,
      visible: !isIntersecting && (activeIndex === index || !panZoomEnabled && activeIndex < 0 && hoveredIndex === index),
      active: activeIndex === index,
      keepInViewport: keepTooltipsInViewport,
      aboveNavigationWidgets: tooltipsAboveNavigationWidgets,
      wrapperRef: containerRef,
      floatingStrategy: floatingStrategy,
      onMouseEnter: () => setHoveredIndex(index),
      onMouseLeave: () => setHoveredIndex(-1),
      onClick: () => setActiveIndex(index),
      onLinkClick: event => {
        activateArea(-1);
        setHoveredIndex(-1);
        event.stopPropagation();
      },
      onDismiss: () => activateArea(-1)
    }));
  }
  function renderFullscreenToggle() {
    if (!displayFullscreenToggle) {
      return null;
    }
    return /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
      isFullscreen: false,
      onEnter: onFullscreenEnter
    });
  }
  function renderLetterboxBackground() {
    if (configuration.position !== 'backdrop') {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: styles$7.letterboxBackground
    }, /*#__PURE__*/React.createElement(Image, {
      imageFile: imageFile,
      load: shouldLoad,
      variant: 'medium'
    }));
  }
  return /*#__PURE__*/React.createElement(Pager, {
    areas: areas,
    customMargin: customMargin,
    panZoomEnabled: panZoomEnabled,
    hideButtons: isIntersecting,
    activeIndex: activeIndex,
    activateArea: activateArea
  }, /*#__PURE__*/React.createElement(FitViewport, {
    file: imageFile,
    fallbackAspectRatio: 0.75,
    fill: configuration.position === 'backdrop'
  }, /*#__PURE__*/React.createElement(Composite, {
    activeIndex: activeIndex + 1,
    loop: false,
    onNavigate: index => activateArea(index - 1)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$7.tooltipsWrapper,
    style: {
      '--hotspots-image-aspect-ratio': aspectRatio,
      '--hotspots-container-height': `${containerRect.height}px`
    }
  }, children( /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement("div", {
    className: styles$7.stack,
    ref: containerRef
  }, /*#__PURE__*/React.createElement(FilePlaceholder, {
    file: imageFile
  }), renderLetterboxBackground(), /*#__PURE__*/React.createElement("div", {
    className: styles$7.wrapper,
    ref: panZoomRefs.wrapper,
    style: {
      transform: panZoomTransforms.initial.wrapper
    }
  }, /*#__PURE__*/React.createElement(Image, {
    imageFile: imageFile,
    load: shouldLoad,
    fill: false,
    structuredData: true,
    variant: panZoomEnabled ? 'ultra' : 'large',
    preferSvg: true
  }), renderVisibleAreas()), /*#__PURE__*/React.createElement(Scroller, {
    disabled: !panZoomEnabled,
    areas: areas,
    ref: panZoomRefs.scroller,
    setStepRef: panZoomRefs.setStep
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$7.wrapper,
    ref: panZoomRefs.scrollerAreas,
    style: {
      transform: panZoomTransforms.initial.wrapper
    }
  }, renderClickableAreas())), renderIndicators()), renderFullscreenToggle(), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  }))), /*#__PURE__*/React.createElement(CompositeItem, {
    render: /*#__PURE__*/React.createElement("div", {
      className: styles$7.compositeItem
    })
  }), renderTooltips(), /*#__PURE__*/React.createElement(CompositeItem, {
    render: /*#__PURE__*/React.createElement("div", {
      className: styles$7.compositeItem
    })
  }))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: [{
      file: imageFile,
      label: 'image'
    }]
  })));
}

frontend.contentElementTypes.register('hotspots', {
  component: Hotspots,
  lifecycle: true,
  customMargin: true
});
