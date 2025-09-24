import { useI18n, ThemeIcon, paletteColor, useContentElementLifecycle, useFile, Image, useContentElementConfigurationUpdate, useContentElementEditorState, useDarkBackground, useFileWithInlineRights, useFloatingPortalRoot, utils, InlineFileRights, Text, EditableInlineText, EditableText, LinkButton, usePortraitOrientation, usePhonePlatform, useContentElementEditorCommandSubscription, useIsomorphicLayoutEffect, FullscreenViewer, contentElementWidths, ContentElementBox, ContentElementFigure, FitViewport, ToggleFullscreenCornerButton, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { FloatingPortal, useTransitionStyles, useFloating, offset, shift, flip, arrow, autoUpdate, useRole, useDismiss, useInteractions, CompositeItem, FloatingFocusManager, FloatingArrow, Composite } from '@floating-ui/react';
import classNames from 'classnames';

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var styles = {"button":"PagerButton-module_button__1WPOu","icon":"PagerButton-module_icon__346kq","disabled":"PagerButton-module_disabled__1SbjV","visuallyHidden":"PagerButton-module_visuallyHidden__1Hrir"};

var size = 40;
function PagerButton(_ref) {
  var direction = _ref.direction,
    disabled = _ref.disabled,
    onClick = _ref.onClick;
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("button", {
    className: classNames(styles.button, _defineProperty({}, styles.disabled, disabled)),
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
  return !!element.closest(".".concat(styles.button));
}

var styles$1 = {"outer":"Pager-module_outer__2CrMo","customMargin":"Pager-module_customMargin__1qTs3","left":"Pager-module_left__2UmsW","right":"Pager-module_right__2Qn5W","center":"Pager-module_center__1nzq4"};

function Pager(_ref) {
  var areas = _ref.areas,
    customMargin = _ref.customMargin,
    panZoomEnabled = _ref.panZoomEnabled,
    hideButtons = _ref.hideButtons,
    activeIndex = _ref.activeIndex,
    activateArea = _ref.activateArea,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.outer, _defineProperty({}, styles$1.customMargin, customMargin))
  }, renderScrollButtons(), /*#__PURE__*/React.createElement("div", {
    className: styles$1.center
  }, children));
  function renderScrollButtons() {
    if (!panZoomEnabled) {
      return null;
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: styles$1.left
    }, /*#__PURE__*/React.createElement(PagerButton, {
      direction: "left",
      disabled: activeIndex === -1 || hideButtons,
      onClick: function onClick() {
        if (activeIndex >= 0) {
          activateArea(activeIndex - 1);
        }
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: styles$1.right
    }, /*#__PURE__*/React.createElement(PagerButton, {
      direction: "right",
      disabled: activeIndex >= areas.length || hideButtons,
      onClick: function onClick() {
        if (activeIndex < areas.length) {
          activateArea(activeIndex + 1);
        }
      }
    })));
  }
}

var styles$2 = {"scroller":"Scroller-module_scroller__b_jkV","sticky":"Scroller-module_sticky__1nSEO","inner":"Scroller-module_inner__XTNms","step":"Scroller-module_step__1ar7Q"};

var Scroller = React.forwardRef(function Scroller(_ref, ref) {
  var areas = _ref.areas,
    disabled = _ref.disabled,
    setStepRef = _ref.setStepRef,
    children = _ref.children;
  if (disabled) {
    return children;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: styles$2.scroller
  }, Array.from({
    length: areas.length + 2
  }, function (_, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      ref: setStepRef(index),
      className: styles$2.step
    });
  }), /*#__PURE__*/React.createElement("div", {
    className: styles$2.sticky
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.inner
  }, children))));
});

var styles$3 = {"area":"Area-module_area__2uQD0","clip":"Area-module_clip__TgtiP","outline":"Area-module_outline__bRQqm","noPointerEvents":"Area-module_noPointerEvents__kLM1Z","hidden":"Area-module_hidden__2SAnU","highlighted":"Area-module_highlighted__2hdr1"};

function Area(_ref) {
  var area = _ref.area,
    noPointerEvents = _ref.noPointerEvents,
    highlighted = _ref.highlighted,
    outlined = _ref.outlined,
    outlineHidden = _ref.outlineHidden,
    className = _ref.className,
    children = _ref.children,
    onMouseEnter = _ref.onMouseEnter,
    onMouseLeave = _ref.onMouseLeave,
    onClick = _ref.onClick;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$3.area, className, _defineProperty(_defineProperty({}, styles$3.highlighted, highlighted), styles$3.noPointerEvents, noPointerEvents))
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
function Outline(_ref2) {
  var points = _ref2.points,
    color = _ref2.color,
    hidden = _ref2.hidden;
  return /*#__PURE__*/React.createElement("svg", {
    className: classNames(styles$3.outline, _defineProperty({}, styles$3.hidden, hidden)),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: points.map(function (coords) {
      return coords.map(function (coord) {
        return coord;
      }).join(',');
    }).join(' '),
    style: {
      stroke: color
    }
  }));
}
function polygon(points) {
  return "polygon(".concat(points.map(function (coords) {
    return coords.map(function (coord) {
      return "".concat(coord, "%");
    }).join(' ');
  }).join(', '), ")");
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var styles$4 = {"area":"ImageArea-module_area__3rqgC","activeImageVisible":"ImageArea-module_activeImageVisible__oYKOK"};

var _excluded = ["panZoomEnabled", "activeImageVisible"];
function ImageArea(_ref) {
  var panZoomEnabled = _ref.panZoomEnabled,
    activeImageVisible = _ref.activeImageVisible,
    props = _objectWithoutProperties(_ref, _excluded);
  var _useContentElementLif = useContentElementLifecycle(),
    shouldLoad = _useContentElementLif.shouldLoad;
  var activeImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: props.area.activeImage
  });
  var fallbackActiveImageFile = useFile({
    collectionName: 'imageFiles',
    permaId: props.area.fallbackActiveImage
  });
  return /*#__PURE__*/React.createElement(Area, Object.assign({}, props, {
    className: classNames(styles$4.area, _defineProperty({}, styles$4.activeImageVisible, activeImageVisible))
  }), /*#__PURE__*/React.createElement(Image, {
    imageFile: activeImageFile || fallbackActiveImageFile,
    load: shouldLoad,
    variant: panZoomEnabled ? 'ultra' : 'large',
    preferSvg: true
  }));
}

var styles$5 = {"wrapper":"Indicator-module_wrapper__2b1Mj","indicator":"Indicator-module_indicator__2A3-l","inner":"Indicator-module_inner__2BgbL","hidden":"Indicator-module_hidden__3j1Re","outer":"Indicator-module_outer__36JWr"};

function Indicator(_ref) {
  var area = _ref.area,
    hidden = _ref.hidden,
    panZoomTransform = _ref.panZoomTransform,
    outerRef = _ref.outerRef;
  return /*#__PURE__*/React.createElement("div", {
    className: styles$5.wrapper,
    ref: outerRef,
    style: {
      transform: panZoomTransform
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$5.indicator, _defineProperty({}, styles$5.hidden, hidden)),
    style: {
      '--color': areaColor(area),
      left: "".concat(area.indicatorPosition[0], "%"),
      top: "".concat(area.indicatorPosition[1], "%")
    }
  }));
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var TooltipPortal = FloatingPortal;

var useTooltipTransitionStyles = useTransitionStyles;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function getBoundingRect(area) {
  var xCoords = area.map(function (point) {
    return point[0];
  });
  var yCoords = area.map(function (point) {
    return point[1];
  });
  var minX = Math.min.apply(Math, _toConsumableArray(xCoords));
  var maxX = Math.max.apply(Math, _toConsumableArray(xCoords));
  var minY = Math.min.apply(Math, _toConsumableArray(yCoords));
  var maxY = Math.max.apply(Math, _toConsumableArray(yCoords));
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function getTooltipInlineStyles(_ref) {
  var area = _ref.area,
    panZoomTransform = _ref.panZoomTransform;
  var referencePositionInPercent = getReferencePositionInPercent({
    area: area
  });
  return {
    reference: {
      left: "".concat(referencePositionInPercent.left, "%"),
      top: "".concat(referencePositionInPercent.top, "%"),
      height: "".concat(referencePositionInPercent.height, "%")
    },
    wrapper: {
      transform: panZoomTransform
    }
  };
}
function getReferencePositionInPercent(_ref2) {
  var area = _ref2.area;
  var referenceType = area.tooltipReference;
  var indicatorRect = getIndicatorRect(area.indicatorPosition);
  if (referenceType === 'area') {
    var boundingRect = getBoundingRect(area.outline);
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

var styles$6 = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","darkContentLinkColor":"var(--theme-dark-content-link-color, var(--theme-content-link-color, currentColor))","lightContentLinkColor":"var(--theme-light-content-link-color, var(--theme-content-link-color, currentColor))","compositeItem":"Tooltip-module_compositeItem__3QnpM","wrapper":"Tooltip-module_wrapper__3J6qG","reference":"Tooltip-module_reference__1qjnL","box":"Tooltip-module_box__2MGMl","paddingForScrollButtons":"Tooltip-module_paddingForScrollButtons__3wFKp","light":"Tooltip-module_light__3H6Ii scope-darkContent","dark":"Tooltip-module_dark__2nDMy scope-lightContent","maxWidth-wide":"Tooltip-module_maxWidth-wide__3Vik_","maxWidth-narrow":"Tooltip-module_maxWidth-narrow__foMG0","maxWidth-veryNarrow":"Tooltip-module_maxWidth-veryNarrow__1yS6L","align-center":"Tooltip-module_align-center__jRtdN","align-right":"Tooltip-module_align-right__2ezWZ","minWidth":"Tooltip-module_minWidth__2iAip","imageWrapper":"Tooltip-module_imageWrapper__1BCEJ","textWrapper":"Tooltip-module_textWrapper__Hc0qY","link":"Tooltip-module_link__1xE5O"};

var arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
function Tooltip(_ref) {
  var _tooltipTexts$area$id6, _tooltipTexts$area$id7, _tooltipLinks$area$id, _tooltipLinks$area$id2, _tooltipTexts$area$id8;
  var area = _ref.area,
    panZoomTransform = _ref.panZoomTransform,
    contentElementId = _ref.contentElementId,
    configuration = _ref.configuration,
    visible = _ref.visible,
    active = _ref.active,
    imageFile = _ref.imageFile,
    containerRect = _ref.containerRect,
    keepInViewport = _ref.keepInViewport,
    floatingStrategy = _ref.floatingStrategy,
    aboveNavigationWidgets = _ref.aboveNavigationWidgets,
    wrapperRef = _ref.wrapperRef,
    onMouseEnter = _ref.onMouseEnter,
    onMouseLeave = _ref.onMouseLeave,
    onClick = _ref.onClick,
    onDismiss = _ref.onDismiss;
  var _useI18n = useI18n(),
    translateWithEntryLocale = _useI18n.t;
  var _useI18n2 = useI18n({
      locale: 'ui'
    }),
    t = _useI18n2.t;
  var updateConfiguration = useContentElementConfigurationUpdate();
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable;
  var darkBackground = useDarkBackground();
  var light = configuration.invertTooltips ? !darkBackground : darkBackground;
  var tooltipImageFile = useFileWithInlineRights({
    configuration: area,
    collectionName: 'imageFiles',
    propertyName: 'tooltipImage'
  });
  var inlineStyles = getTooltipInlineStyles({
    area: area,
    panZoomTransform: panZoomTransform
  });
  var tooltipTexts = configuration.tooltipTexts || {};
  var tooltipLinks = configuration.tooltipLinks || {};
  var referenceType = area.tooltipReference;
  var position = area.tooltipPosition;
  var maxWidth = area.tooltipMaxWidth;
  var arrowRef = useRef();
  var _useFloating = useFloating({
      open: containerRect.width > 0 && visible,
      onOpenChange: function onOpenChange(open) {
        return !open && onDismiss();
      },
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
    }),
    refs = _useFloating.refs,
    floatingStyles = _useFloating.floatingStyles,
    context = _useFloating.context;
  var role = useRole(context, {
    role: 'label'
  });
  var dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
    outsidePress: function outsidePress(event) {
      return !insidePagerButton(event.target);
    }
  });
  var _useInteractions = useInteractions([role, dismiss]),
    getReferenceProps = _useInteractions.getReferenceProps,
    getFloatingProps = _useInteractions.getFloatingProps;
  var _useTooltipTransition = useTooltipTransitionStyles(context),
    isMounted = _useTooltipTransition.isMounted,
    transitionStyles = _useTooltipTransition.styles;
  var floatingPortalRoot = useFloatingPortalRoot();
  function handleTextChange(propertyName, value) {
    updateConfiguration({
      tooltipTexts: _objectSpread2(_objectSpread2({}, tooltipTexts), {}, _defineProperty({}, area.id, _objectSpread2(_objectSpread2({}, tooltipTexts[area.id]), {}, _defineProperty({}, propertyName, value))))
    });
  }
  function handleLinkChange(value) {
    var _tooltipTexts$area$id;
    if (utils.isBlankEditableTextValue((_tooltipTexts$area$id = tooltipTexts[area.id]) === null || _tooltipTexts$area$id === void 0 ? void 0 : _tooltipTexts$area$id.link)) {
      handleTextChange('link', [{
        type: 'heading',
        children: [{
          text: translateWithEntryLocale('pageflow_scrolled.public.more')
        }]
      }]);
    }
    updateConfiguration({
      tooltipLinks: _objectSpread2(_objectSpread2({}, tooltipLinks), {}, _defineProperty({}, area.id, value))
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
    className: classNames(styles$6.box, styles$6["maxWidth-".concat(maxWidth)], styles$6["align-".concat(area.tooltipTextAlign)], light ? styles$6.light : styles$6.dark, _defineProperty(_defineProperty({}, styles$6.paddingForScrollButtons, keepInViewport), styles$6.minWidth, presentOrEditing('link'))),
    onMouseEnter: onMouseEnter,
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
    id: "hotspots-tooltip-title-".concat(contentElementId, "-").concat(area.id)
  }, /*#__PURE__*/React.createElement(Text, {
    inline: true,
    scaleCategory: "hotspotsTooltipTitle"
  }, /*#__PURE__*/React.createElement(EditableInlineText, {
    value: (_tooltipTexts$area$id6 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id6 === void 0 ? void 0 : _tooltipTexts$area$id6.title,
    onChange: function onChange(value) {
      return handleTextChange('title', value);
    },
    placeholder: t('pageflow_scrolled.inline_editing.type_heading')
  }))), presentOrEditing('description') && /*#__PURE__*/React.createElement(EditableText, {
    value: (_tooltipTexts$area$id7 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id7 === void 0 ? void 0 : _tooltipTexts$area$id7.description,
    onChange: function onChange(value) {
      return handleTextChange('description', value);
    },
    scaleCategory: "hotspotsTooltipDescription",
    placeholder: t('pageflow_scrolled.inline_editing.type_text')
  }), presentOrEditing('link') && /*#__PURE__*/React.createElement(LinkButton, {
    className: styles$6.link,
    scaleCategory: "hotspotsTooltipLink",
    href: (_tooltipLinks$area$id = tooltipLinks[area.id]) === null || _tooltipLinks$area$id === void 0 ? void 0 : _tooltipLinks$area$id.href,
    openInNewTab: (_tooltipLinks$area$id2 = tooltipLinks[area.id]) === null || _tooltipLinks$area$id2 === void 0 ? void 0 : _tooltipLinks$area$id2.openInNewTab,
    value: (_tooltipTexts$area$id8 = tooltipTexts[area.id]) === null || _tooltipTexts$area$id8 === void 0 ? void 0 : _tooltipTexts$area$id8.link,
    onTextChange: function onTextChange(value) {
      return handleTextChange('link', value);
    },
    onLinkChange: function onLinkChange(value) {
      return handleLinkChange(value);
    }
  })))))));
}

function useHotspotsConfiguration(configuration) {
  var defaultImageFile = useFileWithInlineRights({
    configuration: configuration,
    collectionName: 'imageFiles',
    propertyName: 'image'
  });
  var portraitImageFile = useFileWithInlineRights({
    configuration: configuration,
    collectionName: 'imageFiles',
    propertyName: 'portraitImage'
  });
  var portraitOrientation = usePortraitOrientation();
  var portraitMode = !!(portraitOrientation && portraitImageFile);
  var imageFile = portraitMode ? portraitImageFile : defaultImageFile;
  return {
    panZoomEnabled: usePanZoomEnabled(configuration),
    areas: useAreas(configuration, portraitMode),
    imageFile: imageFile,
    portraitMode: portraitMode
  };
}
function useAreas(configuration, portraitMode) {
  return useMemo(function () {
    return (configuration.areas || []).map(function (area) {
      if (portraitMode) {
        return applyAreaDefaults(_objectSpread2(_objectSpread2({}, area), {}, {
          outline: area.portraitOutline,
          zoom: area.portraitZoom,
          activeImage: area.portraitActiveImage,
          fallbackActiveImage: area.activeImage,
          indicatorPosition: area.portraitIndicatorPosition,
          color: area.portraitColor || area.color,
          tooltipReference: area.portraitTooltipReference,
          tooltipPosition: area.portraitTooltipPosition,
          tooltipMaxWidth: area.portraitTooltipMaxWidth
        }));
      } else {
        return applyAreaDefaults(area);
      }
    });
  }, [configuration.areas, portraitMode]);
}
function applyAreaDefaults(area) {
  var _area$outline;
  return _objectSpread2(_objectSpread2({}, area), {}, {
    outline: ((_area$outline = area.outline) === null || _area$outline === void 0 ? void 0 : _area$outline.length) ? area.outline : [[50, 50]],
    zoom: area.zoom || 0,
    indicatorPosition: area.indicatorPosition || [50, 50]
  });
}
function usePanZoomEnabled(configuration) {
  var isPhonePlatform = usePhonePlatform();
  return configuration.enablePanZoom === 'always' || configuration.enablePanZoom === 'phonePlatform' && isPhonePlatform;
}

function useHotspotsEditorCommandSubscriptions(_ref) {
  var setHighlightedIndex = _ref.setHighlightedIndex,
    activateArea = _ref.activateArea;
  useContentElementEditorCommandSubscription(function (command) {
    if (command.type === 'HIGHLIGHT_AREA') {
      setHighlightedIndex(command.index);
    } else if (command.type === 'RESET_AREA_HIGHLIGHT') {
      setHighlightedIndex(-1);
    } else if (command.type === 'SET_ACTIVE_AREA') {
      activateArea(command.index);
    }
  });
}

function useHotspotsState(_ref) {
  var areas = _ref.areas,
    initialActiveArea = _ref.initialActiveArea;
  var _useContentElementEdi = useContentElementEditorState(),
    setTransientState = _useContentElementEdi.setTransientState,
    select = _useContentElementEdi.select,
    isSelected = _useContentElementEdi.isSelected;
  var _useState = useState(typeof initialActiveArea === 'undefined' ? -1 : initialActiveArea),
    _useState2 = _slicedToArray(_useState, 2),
    activeIndex = _useState2[0],
    setActiveIndexState = _useState2[1];
  var _useState3 = useState(-1),
    _useState4 = _slicedToArray(_useState3, 2),
    hoveredIndex = _useState4[0],
    setHoveredIndex = _useState4[1];
  var _useState5 = useState(-1),
    _useState6 = _slicedToArray(_useState5, 2),
    highlightedIndex = _useState6[0],
    setHighlightedIndex = _useState6[1];
  var setActiveIndex = useCallback(function (index) {
    var _areas$index;
    setTransientState({
      activeAreaId: (_areas$index = areas[index]) === null || _areas$index === void 0 ? void 0 : _areas$index.id
    });
    setActiveIndexState(function (activeIndex) {
      if (activeIndex !== index && index >= 0 && isSelected) {
        select();
      }
      return index;
    });
  }, [setActiveIndexState, setTransientState, areas, select, isSelected]);
  return {
    activeIndex: activeIndex,
    hoveredIndex: hoveredIndex,
    highlightedIndex: highlightedIndex,
    setActiveIndex: setActiveIndex,
    setHoveredIndex: setHoveredIndex,
    setHighlightedIndex: setHighlightedIndex
  };
}

function useContentRect(_ref) {
  var enabled = _ref.enabled;
  var _useState = useState({
      width: 0,
      height: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    contentRect = _useState2[0],
    setContentRect = _useState2[1];
  var ref = useRef();
  useEffect(function () {
    if (!enabled) {
      return;
    }
    var current = ref.current;
    var resizeObserver = new ResizeObserver(function (entries) {
      requestAnimationFrame(function () {
        setContentRect(entries[entries.length - 1].contentRect);
      });
    });
    resizeObserver.observe(current);
    return function () {
      resizeObserver.unobserve(current);
    };
  }, [enabled]);
  return [contentRect, ref];
}

var fullRect = {
  left: 0,
  top: 0,
  width: 100,
  height: 100
};
function getInitialTransform(_ref) {
  var containerWidth = _ref.containerWidth,
    containerHeight = _ref.containerHeight,
    imageFileWidth = _ref.imageFileWidth,
    imageFileHeight = _ref.imageFileHeight,
    areasBoundingRect = _ref.areasBoundingRect,
    _ref$indicatorPositio = _ref.indicatorPositions,
    indicatorPositions = _ref$indicatorPositio === void 0 ? [] : _ref$indicatorPositio,
    _ref$containerSafeAre = _ref.containerSafeAreaMargin,
    containerSafeAreaMargin = _ref$containerSafeAre === void 0 ? 0 : _ref$containerSafeAre;
  var baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  var baseImageHeight = containerHeight;
  var scaleCover = getScaleToCoverContainerWithRect({
    baseImageWidth: baseImageWidth,
    baseImageHeight: baseImageHeight,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    rect: fullRect
  });
  var scaleContainMotif = getScaleToContainRectInContainer({
    baseImageWidth: baseImageWidth,
    baseImageHeight: baseImageHeight,
    containerWidth: containerWidth * (1 - 2 * containerSafeAreaMargin / 100),
    containerHeight: containerHeight,
    rect: areasBoundingRect
  });
  var scale = Math.min(scaleCover, scaleContainMotif);
  var _center = center({
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      scale: scale,
      unbounded: scaleContainMotif < scaleCover,
      rect: areasBoundingRect
    }),
    _center2 = _slicedToArray(_center, 2),
    translateX = _center2[0],
    translateY = _center2[1];
  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale: scale
    },
    indicators: transformIndicators({
      indicatorPositions: indicatorPositions,
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      translateX: translateX,
      translateY: translateY,
      scale: scale
    })
  };
}
function getPanZoomStepTransform(_ref2) {
  var containerWidth = _ref2.containerWidth,
    containerHeight = _ref2.containerHeight,
    imageFileWidth = _ref2.imageFileWidth,
    imageFileHeight = _ref2.imageFileHeight,
    areaOutline = _ref2.areaOutline,
    areaZoom = _ref2.areaZoom,
    _ref2$indicatorPositi = _ref2.indicatorPositions,
    indicatorPositions = _ref2$indicatorPositi === void 0 ? [] : _ref2$indicatorPositi,
    initialScale = _ref2.initialScale;
  var areaRect = getBoundingRect(areaOutline);
  var baseImageWidth = imageFileWidth * containerHeight / imageFileHeight;
  var baseImageHeight = containerHeight;
  var scale = getAreaScale({
    baseImageWidth: baseImageWidth,
    baseImageHeight: baseImageHeight,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    areaRect: areaRect,
    areaZoom: areaZoom,
    initialScale: initialScale
  });
  var _center3 = center({
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      rect: areaRect,
      scale: scale
    }),
    _center4 = _slicedToArray(_center3, 2),
    translateX = _center4[0],
    translateY = _center4[1];
  return {
    wrapper: {
      x: translateX,
      y: translateY,
      scale: scale
    },
    indicators: transformIndicators({
      indicatorPositions: indicatorPositions,
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      translateX: translateX,
      translateY: translateY,
      scale: scale
    })
  };
}
function transformIndicators(_ref3) {
  var indicatorPositions = _ref3.indicatorPositions,
    baseImageWidth = _ref3.baseImageWidth,
    baseImageHeight = _ref3.baseImageHeight,
    translateX = _ref3.translateX,
    translateY = _ref3.translateY,
    scale = _ref3.scale;
  return indicatorPositions.map(function (indicatorPosition) {
    return {
      x: translateX + baseImageWidth * indicatorPosition[0] / 100 * (scale - 1),
      y: translateY + baseImageHeight * indicatorPosition[1] / 100 * (scale - 1)
    };
  });
}
function getAreaScale(_ref4) {
  var containerWidth = _ref4.containerWidth,
    containerHeight = _ref4.containerHeight,
    baseImageWidth = _ref4.baseImageWidth,
    baseImageHeight = _ref4.baseImageHeight,
    areaRect = _ref4.areaRect,
    areaZoom = _ref4.areaZoom,
    _ref4$initialScale = _ref4.initialScale,
    initialScale = _ref4$initialScale === void 0 ? 1 : _ref4$initialScale;
  var scale = getScaleToContainRectInContainer({
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    baseImageWidth: baseImageWidth,
    baseImageHeight: baseImageHeight,
    rect: areaRect
  });
  return (100 - areaZoom) / 100 * initialScale + areaZoom / 100 * scale;
}
function getScaleToCoverContainerWithRect(_ref5) {
  var containerWidth = _ref5.containerWidth,
    containerHeight = _ref5.containerHeight,
    baseImageWidth = _ref5.baseImageWidth,
    baseImageHeight = _ref5.baseImageHeight,
    rect = _ref5.rect;
  var _getScalesToFit = getScalesToFit({
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      rect: rect
    }),
    _getScalesToFit2 = _slicedToArray(_getScalesToFit, 2),
    scaleX = _getScalesToFit2[0],
    scaleY = _getScalesToFit2[1];
  return Math.max(scaleX, scaleY);
}
function getScaleToContainRectInContainer(_ref6) {
  var containerWidth = _ref6.containerWidth,
    containerHeight = _ref6.containerHeight,
    baseImageWidth = _ref6.baseImageWidth,
    baseImageHeight = _ref6.baseImageHeight,
    rect = _ref6.rect;
  var _getScalesToFit3 = getScalesToFit({
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      baseImageWidth: baseImageWidth,
      baseImageHeight: baseImageHeight,
      rect: rect
    }),
    _getScalesToFit4 = _slicedToArray(_getScalesToFit3, 2),
    scaleX = _getScalesToFit4[0],
    scaleY = _getScalesToFit4[1];
  return Math.min(scaleX, scaleY);
}
function getScalesToFit(_ref7) {
  var containerWidth = _ref7.containerWidth,
    containerHeight = _ref7.containerHeight,
    baseImageWidth = _ref7.baseImageWidth,
    baseImageHeight = _ref7.baseImageHeight,
    rect = _ref7.rect;
  var baseRectWidth = rect.width / 100 * baseImageWidth;
  var baseRectHeight = rect.height / 100 * baseImageHeight;
  return [containerWidth / baseRectWidth, containerHeight / baseRectHeight];
}
function center(_ref8) {
  var baseImageWidth = _ref8.baseImageWidth,
    baseImageHeight = _ref8.baseImageHeight,
    containerWidth = _ref8.containerWidth,
    containerHeight = _ref8.containerHeight,
    unbounded = _ref8.unbounded,
    rect = _ref8.rect,
    scale = _ref8.scale;
  var displayImageWidth = baseImageWidth * scale;
  var displayImageHeight = baseImageHeight * scale;
  var displayRectWidth = rect.width / 100 * displayImageWidth;
  var displayRectLeft = rect.left / 100 * displayImageWidth;
  var displayRectHeight = rect.height / 100 * displayImageHeight;
  var displayRectTop = rect.top / 100 * displayImageHeight;
  var translateX;
  var translateY;
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

function usePanZoomTransforms(_ref) {
  var containerRect = _ref.containerRect,
    imageFile = _ref.imageFile,
    areas = _ref.areas,
    initialTransformEnabled = _ref.initialTransformEnabled,
    panZoomEnabled = _ref.panZoomEnabled;
  var imageFileWidth = imageFile === null || imageFile === void 0 ? void 0 : imageFile.width;
  var imageFileHeight = imageFile === null || imageFile === void 0 ? void 0 : imageFile.height;
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  return useMemo(function () {
    if (!panZoomEnabled && !initialTransformEnabled || !containerWidth || !containerHeight || !imageFileWidth || !imageFileHeight) {
      return nullTransforms;
    }
    var indicatorPositions = areas.map(function (area) {
      return area.indicatorPosition;
    });
    var areasBoundingRect = getBoundingRect(areas.flatMap(function (area) {
      return area.outline;
    }));
    var initialTransform = initialTransformEnabled ? getInitialTransform({
      areasBoundingRect: areasBoundingRect,
      imageFileWidth: imageFileWidth,
      imageFileHeight: imageFileHeight,
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      indicatorPositions: indicatorPositions,
      containerSafeAreaMargin: getContainerSafeAreaMargin({
        panZoomEnabled: panZoomEnabled,
        areasBoundingRect: areasBoundingRect
      })
    }) : nullTransform;
    var initialTransformString = toString(initialTransform.wrapper);
    var areaTransformStrings = [];
    var tooltipTransformStrings = [];
    areas.forEach(function (area, index) {
      if (panZoomEnabled) {
        var _initialTransform$wra;
        var transform = getPanZoomStepTransform({
          areaOutline: area.outline,
          areaZoom: area.zoom,
          initialScale: ((_initialTransform$wra = initialTransform.wrapper) === null || _initialTransform$wra === void 0 ? void 0 : _initialTransform$wra.scale) || 1,
          imageFileWidth: imageFileWidth,
          imageFileHeight: imageFileHeight,
          containerWidth: containerWidth,
          containerHeight: containerHeight,
          indicatorPositions: indicatorPositions
        });
        var transformString = toString(transform.wrapper);
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
var pagerButtonsMargin = 8;
function getContainerSafeAreaMargin(_ref2) {
  var panZoomEnabled = _ref2.panZoomEnabled,
    areasBoundingRect = _ref2.areasBoundingRect;
  return panZoomEnabled && insideSafeArea(areasBoundingRect) ? pagerButtonsMargin : 0;
}
function insideSafeArea(rect) {
  return rect.left >= pagerButtonsMargin && rect.left + rect.width <= 100 - pagerButtonsMargin;
}
function toString(transform) {
  return transform && "translate(".concat(transform.x, "px, ").concat(transform.y, "px) scale(").concat(transform.scale || 1, ")");
}
var nullTransforms = {
  initial: {
    indicators: [],
    tooltips: []
  },
  areas: []
};
var nullTransform = {
  indicators: []
};

function useIntersectionObserver(_ref) {
  var threshold = _ref.threshold,
    onVisibleIndexChange = _ref.onVisibleIndexChange,
    enabled = _ref.enabled;
  var containerRef = useRef();
  var childRefs = useRef([]);
  var observerRef = useRef();
  useEffect(function () {
    if (!enabled) {
      return;
    }
    var observer = observerRef.current = new IntersectionObserver(function (entries) {
      var containerElement = containerRef.current;
      if (!containerElement) {
        return;
      }
      var found = false;
      entries.forEach(function (entry) {
        var entryIndex = Array.from(containerElement.children).findIndex(function (child) {
          return child === entry.target;
        });
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
      threshold: threshold
    });
    childRefs.current.forEach(function (child) {
      if (child) {
        observer.observe(child);
      }
    });
    return function () {
      observer.disconnect();
    };
  }, [enabled, threshold, onVisibleIndexChange]);
  var setChildRef = function setChildRef(index) {
    return function (ref) {
      if (observerRef.current) {
        if (ref) {
          observerRef.current.observe(ref);
        } else {
          observerRef.current.unobserve(childRefs.current[index]);
        }
      }
      childRefs.current[index] = ref;
    };
  };
  return [containerRef, setChildRef];
}

function useScrollPanZoom(_ref) {
  var panZoomTransforms = _ref.panZoomTransforms,
    enabled = _ref.enabled,
    onChange = _ref.onChange;
  var wrapperRef = useRef();
  var scrollerAreasRef = useRef();
  var indicatorRefs = useRef([]);
  var onVisibleIndexChange = useCallback(function (index) {
    return onChange(index - 1);
  }, [onChange]);
  var _useIntersectionObser = useIntersectionObserver({
      enabled: enabled,
      threshold: 0.7,
      onVisibleIndexChange: onVisibleIndexChange
    }),
    _useIntersectionObser2 = _slicedToArray(_useIntersectionObser, 2),
    scrollerRef = _useIntersectionObser2[0],
    setStepRef = _useIntersectionObser2[1];
  var steps = useMemo(function () {
    if (!enabled || !panZoomTransforms.areas.length) {
      return;
    }
    return [panZoomTransforms.initial].concat(_toConsumableArray(panZoomTransforms.areas), [panZoomTransforms.initial]);
  }, [panZoomTransforms, enabled]);
  var scrollFromToArea = useCallback(function (from, to) {
    var scroller = scrollerRef.current;
    var step = scroller.children[to + 1];
    scroller.scrollTo(Math.abs(scroller.offsetLeft - step.offsetLeft), 0);
    if (!steps) {
      return;
    }
    wrapperRef.current.animate([keyframe(steps[from + 1].wrapper), keyframe(steps[to + 1].wrapper)], {
      duration: 200
    });
    panZoomTransforms.areas.forEach(function (_, index) {
      indicatorRefs.current[index].animate([keyframe(steps[from + 1].indicators[index]), keyframe(steps[to + 1].indicators[index])], {
        duration: 200
      });
    });
  }, [scrollerRef, steps, panZoomTransforms]);
  useIsomorphicLayoutEffect(function () {
    if (!steps) {
      return;
    }
    var scrollTimeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });
    var animations = [];
    [wrapperRef.current, scrollerAreasRef.current].forEach(function (element) {
      return animations.push(element.animate(steps.map(function (step) {
        return keyframe(step.wrapper);
      }), {
        fill: 'both',
        timeline: scrollTimeline
      }));
    });
    panZoomTransforms.areas.forEach(function (_, index) {
      animations.push(indicatorRefs.current[index].animate(steps.map(function (step) {
        return keyframe(step.indicators[index]);
      }), {
        fill: 'both',
        timeline: scrollTimeline
      }));
    });
    return function () {
      return animations.forEach(function (animation) {
        return animation.cancel();
      });
    };
  }, [panZoomTransforms, steps]);
  var setIndicatorRef = function setIndicatorRef(index) {
    return function (ref) {
      indicatorRefs.current[index] = ref;
    };
  };
  return {
    panZoomRefs: {
      wrapper: wrapperRef,
      scroller: scrollerRef,
      scrollerAreas: scrollerAreasRef,
      setStep: setStepRef,
      setIndicator: setIndicatorRef
    },
    scrollFromToArea: scrollFromToArea
  };
}
function keyframe(transform) {
  return {
    transform: transform || 'translate(0px, 0px)',
    easing: 'ease'
  };
}

var styles$7 = {"tooltipsWrapper":"Hotspots-module_tooltipsWrapper__3EEZA","clip":"Hotspots-module_clip__2wfxm","stack":"Hotspots-module_stack__3Vpw6","letterboxBackground":"Hotspots-module_letterboxBackground__3GNSI","wrapper":"Hotspots-module_wrapper__1TvVX","compositeItem":"Hotspots-module_compositeItem__BZtU-"};

function Hotspots(_ref) {
  var contentElementId = _ref.contentElementId,
    contentElementWidth = _ref.contentElementWidth,
    customMargin = _ref.customMargin,
    configuration = _ref.configuration,
    _ref$sectionProps = _ref.sectionProps,
    sectionProps = _ref$sectionProps === void 0 ? {} : _ref$sectionProps;
  return /*#__PURE__*/React.createElement(FullscreenViewer, {
    contentElementId: contentElementId,
    renderChildren: function renderChildren(_ref2) {
      var enterFullscreen = _ref2.enterFullscreen;
      return /*#__PURE__*/React.createElement(HotspotsImage, {
        contentElementId: contentElementId,
        contentElementWidth: contentElementWidth,
        customMargin: customMargin,
        configuration: configuration,
        isIntersecting: sectionProps.isIntersecting,
        displayFullscreenToggle: contentElementWidth !== contentElementWidths.full && configuration.enableFullscreen,
        keepTooltipsInViewport: configuration.position === 'backdrop',
        onFullscreenEnter: enterFullscreen,
        floatingStrategy: configuration.position === 'standAlone' || configuration.position === 'backdrop' ? 'fixed' : 'absolute'
      }, function (children) {
        return /*#__PURE__*/React.createElement(ContentElementBox, null, /*#__PURE__*/React.createElement(ContentElementFigure, {
          configuration: configuration
        }, /*#__PURE__*/React.createElement("div", {
          className: styles$7.clip
        }, children)));
      });
    },
    renderFullscreenChildren: function renderFullscreenChildren() {
      return /*#__PURE__*/React.createElement(HotspotsImage, {
        contentElementId: contentElementId,
        contentElementWidth: contentElementWidth,
        configuration: configuration,
        displayFullscreenToggle: false,
        keepTooltipsInViewport: true,
        tooltipsAboveNavigationWidgets: true
      });
    }
  });
}
function HotspotsImage(_ref3) {
  var contentElementId = _ref3.contentElementId,
    contentElementWidth = _ref3.contentElementWidth,
    customMargin = _ref3.customMargin,
    configuration = _ref3.configuration,
    keepTooltipsInViewport = _ref3.keepTooltipsInViewport,
    floatingStrategy = _ref3.floatingStrategy,
    tooltipsAboveNavigationWidgets = _ref3.tooltipsAboveNavigationWidgets,
    isIntersecting = _ref3.isIntersecting,
    displayFullscreenToggle = _ref3.displayFullscreenToggle,
    onFullscreenEnter = _ref3.onFullscreenEnter,
    _ref3$children = _ref3.children,
    children = _ref3$children === void 0 ? function (children) {
      return children;
    } : _ref3$children;
  var _useHotspotsConfigura = useHotspotsConfiguration(configuration),
    imageFile = _useHotspotsConfigura.imageFile,
    areas = _useHotspotsConfigura.areas,
    panZoomEnabled = _useHotspotsConfigura.panZoomEnabled;
  var _useHotspotsState = useHotspotsState({
      areas: areas,
      initialActiveArea: configuration.initialActiveArea
    }),
    activeIndex = _useHotspotsState.activeIndex,
    hoveredIndex = _useHotspotsState.hoveredIndex,
    highlightedIndex = _useHotspotsState.highlightedIndex,
    setActiveIndex = _useHotspotsState.setActiveIndex,
    setHoveredIndex = _useHotspotsState.setHoveredIndex,
    setHighlightedIndex = _useHotspotsState.setHighlightedIndex;
  var _useContentElementLif = useContentElementLifecycle(),
    shouldLoad = _useContentElementLif.shouldLoad;
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable,
    isSelected = _useContentElementEdi.isSelected;
  var aspectRatio = imageFile ? "".concat(imageFile.width, " / ").concat(imageFile.height) : '3 / 4';
  var _useContentRect = useContentRect({
      enabled: shouldLoad
    }),
    _useContentRect2 = _slicedToArray(_useContentRect, 2),
    containerRect = _useContentRect2[0],
    containerRef = _useContentRect2[1];
  var panZoomTransforms = usePanZoomTransforms({
    containerRect: containerRect,
    imageFile: imageFile,
    areas: areas,
    initialTransformEnabled: configuration.position === 'backdrop',
    panZoomEnabled: panZoomEnabled
  });
  var _useScrollPanZoom = useScrollPanZoom({
      panZoomTransforms: panZoomTransforms,
      enabled: shouldLoad,
      onChange: setActiveIndex
    }),
    panZoomRefs = _useScrollPanZoom.panZoomRefs,
    scrollFromToArea = _useScrollPanZoom.scrollFromToArea;
  var scrollToArea = useCallback(function (index) {
    scrollFromToArea(activeIndex, index);
  }, [scrollFromToArea, activeIndex]);
  var activateArea = panZoomEnabled ? scrollToArea : setActiveIndex;
  useHotspotsEditorCommandSubscriptions({
    setHighlightedIndex: setHighlightedIndex,
    activateArea: activateArea
  });
  function renderVisibleAreas() {
    return areas.map(function (area, index) {
      return /*#__PURE__*/React.createElement(ImageArea, {
        key: index,
        area: area,
        panZoomEnabled: panZoomEnabled,
        activeImageVisible: activeIndex === index || !panZoomEnabled && activeIndex < 0 && hoveredIndex === index,
        outlined: isEditable && isSelected,
        outlineHidden: isIntersecting,
        highlighted: hoveredIndex === index || highlightedIndex === index || activeIndex === index
      });
    });
  }
  function renderClickableAreas() {
    return areas.map(function (area, index) {
      return /*#__PURE__*/React.createElement(Area, {
        key: index,
        area: area,
        noPointerEvents: panZoomEnabled && activeIndex >= 0 && activeIndex < areas.length,
        onMouseEnter: function onMouseEnter() {
          return setHoveredIndex(index);
        },
        onMouseLeave: function onMouseLeave() {
          return setHoveredIndex(-1);
        },
        onClick: function onClick() {
          if (!isEditable || isSelected) {
            activateArea(index);
          }
        }
      });
    });
  }
  function renderIndicators() {
    return areas.map(function (area, index) {
      return /*#__PURE__*/React.createElement(Indicator, {
        key: index,
        area: area,
        hidden: isIntersecting || panZoomEnabled && activeIndex >= 0 && activeIndex < areas.length && activeIndex !== index,
        panZoomTransform: panZoomTransforms.initial.indicators[index],
        outerRef: panZoomRefs.setIndicator(index)
      });
    });
  }
  function renderTooltips() {
    return areas.map(function (area, index) {
      return /*#__PURE__*/React.createElement(Tooltip, {
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
        onMouseEnter: function onMouseEnter() {
          return setHoveredIndex(index);
        },
        onMouseLeave: function onMouseLeave() {
          return setHoveredIndex(-1);
        },
        onClick: function onClick() {
          return setActiveIndex(index);
        },
        onDismiss: function onDismiss() {
          return activateArea(-1);
        }
      });
    });
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
    aspectRatio: imageFile ? undefined : 0.75,
    fill: configuration.position === 'backdrop',
    opaque: !imageFile
  }, /*#__PURE__*/React.createElement(Composite, {
    activeIndex: activeIndex + 1,
    loop: false,
    onNavigate: function onNavigate(index) {
      return activateArea(index - 1);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$7.tooltipsWrapper,
    style: {
      '--hotspots-image-aspect-ratio': aspectRatio,
      '--hotspots-container-height': "".concat(containerRect.height, "px")
    }
  }, children( /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement("div", {
    className: styles$7.stack,
    ref: containerRef
  }, renderLetterboxBackground(), /*#__PURE__*/React.createElement("div", {
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
