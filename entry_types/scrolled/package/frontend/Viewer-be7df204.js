import 'pageflow/frontend';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { b as _defineProperty, T as ThemeIcon, e as _objectWithoutProperties, _ as _slicedToArray } from './ThemeIcon-87fcf0dd.js';
import classNames from 'classnames';
import 'use-context-selector';
import 'reselect';
import 'slugify';
import 'i18n-js';
import { u as useBrowserFeature } from './PhonePlatformContext-8bfbbea8.js';
import { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-ea2bb05c.js';
import { u as usePhonePlatform } from './usePhonePlatform-520f37b0.js';
import { PanoViewer } from '@egjs/view360';
import screenfull from 'screenfull';

var styles = {"wrapper":"Fullscreen-module_wrapper__300hJ"};

function Fullscreen(_ref) {
  var isFullscreen = _ref.isFullscreen,
    children = _ref.children;
  var root = useMemo(function () {
    return document.getElementById('fullscreenRoot');
  }, []);
  useEffect(function () {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }, [isFullscreen]);
  if (isFullscreen) {
    return ReactDOM.createPortal( /*#__PURE__*/React.createElement("div", {
      className: styles.wrapper
    }, children), root);
  } else {
    return children;
  }
}

var styles$1 = {"indicator":"PanoramaIndicator-module_indicator__3A90v","visible":"PanoramaIndicator-module_visible__3LOgm","arrow":"PanoramaIndicator-module_arrow__QV1Pd","arrowLeft":"PanoramaIndicator-module_arrowLeft__Jh7GC PanoramaIndicator-module_arrow__QV1Pd","arrowRight":"PanoramaIndicator-module_arrowRight__ZZBtO PanoramaIndicator-module_arrow__QV1Pd","nudgeLeft":"PanoramaIndicator-module_nudgeLeft__IU_Iy","nudgeRight":"PanoramaIndicator-module_nudgeRight__3XzNu","text":"PanoramaIndicator-module_text__2FzUy"};

function PanoramaIndicator(_ref) {
  var visible = _ref.visible;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.indicator, _defineProperty({}, styles$1.visible, visible))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$1.arrowLeft
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowLeft"
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$1.arrowRight
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowRight"
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$1.text
  }, "360\xB0"));
}

var styles$2 = {"indicator":"FullscreenIndicator-module_indicator__2Jl_-","visible":"FullscreenIndicator-module_visible__2ywsZ","icon":"FullscreenIndicator-module_icon__2Ddof","icons":"FullscreenIndicator-module_icons__3-Xm6","text":"FullscreenIndicator-module_text__3wCW3","pulse":"FullscreenIndicator-module_pulse__1qujU","iconTopLeft":"FullscreenIndicator-module_iconTopLeft__2u7-j FullscreenIndicator-module_icon__2Ddof","iconTopRight":"FullscreenIndicator-module_iconTopRight__14nUk FullscreenIndicator-module_icon__2Ddof","iconBottomRight":"FullscreenIndicator-module_iconBottomRight__lEtN6 FullscreenIndicator-module_icon__2Ddof","iconBottomLeft":"FullscreenIndicator-module_iconBottomLeft__voLm_ FullscreenIndicator-module_icon__2Ddof"};

function FullscreenIndicator(_ref) {
  var visible = _ref.visible,
    onClick = _ref.onClick;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$2.indicator, _defineProperty({}, styles$2.visible, visible))
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.icons
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$2.iconTopLeft
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowLeft"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$2.iconTopRight
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowLeft"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$2.iconBottomRight
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowLeft"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles$2.iconBottomLeft
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "arrowLeft"
  }))), /*#__PURE__*/React.createElement("div", {
    className: styles$2.text
  }, "360\xB0"));
}

var styles$3 = {"full":"Viewer-module_full__1q18y","container":"Viewer-module_container__3eJ34 Viewer-module_full__1q18y","spinner":"Viewer-module_spinner__2oRve","spin":"Viewer-module_spin__3jBR2","isLoading":"Viewer-module_isLoading__sQuGw"};

var _excluded = ["styles"];
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
var SpinnerIcon = (function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4",
    opacity: ".23"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    opacity: ".75"
  }));
});

function Viewer(_ref) {
  var imageFile = _ref.imageFile,
    viewerRef = _ref.viewerRef,
    initialYaw = _ref.initialYaw,
    initialPitch = _ref.initialPitch,
    hidePanoramaIndicator = _ref.hidePanoramaIndicator,
    onReady = _ref.onReady,
    onFullscreen = _ref.onFullscreen;
  var elRef = useRef();
  var initialYawRef = useRef(initialYaw);
  var initialPitchRef = useRef(initialPitch);
  var touchSupport = useBrowserFeature('touch support');
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isFullscreen = _useState4[0],
    setIsFullscreen = _useState4[1];
  var isPhonePlatform = usePhonePlatform();

  // When toggling to fullscreen mode, this component renders to a
  // portal div in the body of the document. We do not want to recreate
  // the PanoViewer instead to keep its current state (pitch, yaw etc.).
  // We therefore initialize the PanoViewer on a detached DOM element
  // and render a component called DOMNodeContainer which appends the
  // element on each render. React.memo causes the DOMNodeContainer to
  // render only when either
  // - the parent Viewer component is mounted
  // - Fullscreen component switches between using the portal or not
  function appendViewerTo(parentNode) {
    if (!elRef.current) {
      elRef.current = document.createElement('div');
      elRef.current.className = styles$3.full;
      viewerRef.current = new PanoViewer(elRef.current, {
        image: imageFile.urls.ultra,
        projectionType: imageFile.configuration.projection === 'equirectangular_stereo' ? PanoViewer.PROJECTION_TYPE.STEREOSCOPIC_EQUI : PanoViewer.PROJECTION_TYPE.EQUIRECTANGULAR,
        touchDirection: touchSupport ? PanoViewer.TOUCH_DIRECTION.YAW : PanoViewer.TOUCH_DIRECTION.ALL,
        useZoom: false,
        yaw: initialYawRef.current,
        pitch: initialPitchRef.current
      });
      viewerRef.current.on(PanoViewer.EVENTS.READY, function () {
        viewerRef.current.updateViewportDimensions();
        setIsLoading(false);
        if (onReady) {
          onReady();
        }
      });
    }
    parentNode.appendChild(elRef.current);
    viewerRef.current.updateViewportDimensions();
  }
  useEffect(function () {
    return function () {
      if (elRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        elRef.current = null;
      }
    };
  }, [viewerRef]);
  useEffect(function () {
    if (initialYawRef.current !== initialYaw) {
      initialYawRef.current = initialYaw;
      viewerRef.current.lookAt({
        yaw: initialYaw
      }, 200);
    }
  }, [initialYaw, viewerRef]);
  useEffect(function () {
    if (initialPitchRef.current !== initialPitch) {
      initialPitchRef.current = initialPitch;
      viewerRef.current.lookAt({
        pitch: initialPitch
      }, 200);
    }
  }, [initialPitch, viewerRef]);
  useEffect(function () {
    function onChange() {
      if (!screenfull.isFullscreen) {
        setIsFullscreen(false);
      }
    }
    if (screenfull.isEnabled) {
      screenfull.on('change', onChange);
      return function () {
        return screenfull.off('change', onChange);
      };
    }
  }, []);
  useEffect(function () {
    function onChange() {
      viewerRef.current.updateViewportDimensions();
    }
    window.addEventListener('resize', onChange);
    return function () {
      return window.removeEventListener('resize', onChange);
    };
  }, [viewerRef]);
  useEffect(function () {
    if (isFullscreen) {
      viewerRef.current.setTouchDirection(PanoViewer.TOUCH_DIRECTION.ALL);
      viewerRef.current.setGyroMode(PanoViewer.GYRO_MODE.YAWPITCH);
      viewerRef.current.setUseZoom(true);
    } else {
      if (touchSupport) {
        viewerRef.current.setTouchDirection(PanoViewer.TOUCH_DIRECTION.YAW);
        viewerRef.current.lookAt({
          pitch: 0,
          fov: 65
        });
      } else {
        viewerRef.current.lookAt({
          fov: 65
        });
      }
      viewerRef.current.setGyroMode(PanoViewer.GYRO_MODE.NONE);
      viewerRef.current.setUseZoom(false);
    }
  }, [isFullscreen, viewerRef, touchSupport]);
  function preventDefaultForArrowUpDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }
  function enterFullscreen() {
    if (onFullscreen) {
      onFullscreen();
    }
    if (screenfull.isEnabled) {
      screenfull.request();
    }
    setIsFullscreen(true);
    viewerRef.current.enableSensor();
  }
  function exitFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.exit();
    }
    setIsFullscreen(false);
  }
  return /*#__PURE__*/React.createElement(Fullscreen, {
    isFullscreen: isFullscreen
  }, /*#__PURE__*/React.createElement("div", {
    className: styles$3.container,
    onKeyDown: preventDefaultForArrowUpDown,
    onClick: function onClick() {
      isPhonePlatform && enterFullscreen();
    }
  }, /*#__PURE__*/React.createElement(DOMNodeContainer, {
    className: styles$3.full,
    onUpdate: function onUpdate(el) {
      return appendViewerTo(el);
    }
  })), /*#__PURE__*/React.createElement(SpinnerIcon, {
    className: classNames(styles$3.spinner, _defineProperty({}, styles$3.isLoading, isLoading))
  }), (!isPhonePlatform || isFullscreen) && /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
    isFullscreen: isFullscreen,
    onEnter: enterFullscreen,
    onExit: exitFullscreen
  }), /*#__PURE__*/React.createElement(PanoramaIndicator, {
    visible: !isLoading && !isPhonePlatform && !isFullscreen && !hidePanoramaIndicator
  }), /*#__PURE__*/React.createElement(FullscreenIndicator, {
    visible: !isLoading && isPhonePlatform && !isFullscreen
  }));
}
var DOMNodeContainer = React.memo(function (_ref2) {
  var className = _ref2.className,
    onUpdate = _ref2.onUpdate;
  var ref = useRef();
  useEffect(function () {
    var current = ref.current;
    onUpdate(current);
    return function () {
      current.removeChild(current.firstChild);
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: className
  });
}, function () {
  return true;
});

export default Viewer;
