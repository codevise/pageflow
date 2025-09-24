import React, { useRef, useCallback, useState } from 'react';
import 'react-dom';
import { _ as _slicedToArray, b as _defineProperty } from './ThemeIcon-87fcf0dd.js';
import classNames from 'classnames';
import { a as useContentElementEditorState } from './useContentElementEditorState-cd3c272d.js';
import 'use-context-selector';
import 'reselect';
import 'slugify';
import 'i18n-js';
import { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-ea2bb05c.js';
import { F as FullscreenViewer } from './index-68b25ca2.js';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

var styles = {"outer":"SwipeToClose-module_outer__1fl2h","inner":"SwipeToClose-module_inner__NOg1v"};

function SwipeToClose(_ref) {
  var onClose = _ref.onClose,
    children = _ref.children;
  var start = useRef();
  var inner = useRef();
  var ratio = useRef(0);
  var handleTouchStart = useCallback(function (event) {
    start.current = event.touches[0].pageY;
  }, []);
  var handleTouchMove = useCallback(function (event) {
    var offset = Math.max(-200, Math.min(200, event.touches[0].pageY - start.current));
    ratio.current = Math.abs(offset / 200);
    requestAnimationFrame(function () {
      if (inner.current) {
        inner.current.style.setProperty('transition', "none");
        inner.current.style.setProperty('transform', "translate3d(0, ".concat(offset, "px, 0)"));
        inner.current.style.setProperty('opacity', 1 - ratio.current);
      }
    });
  }, []);
  var handleTouchEnd = useCallback(function (event) {
    event.preventDefault();
    if (ratio.current > 0.5) {
      onClose();
    }
    requestAnimationFrame(function () {
      if (inner.current) {
        inner.current.style.setProperty('transition', "opacity 0.2s linear, transform 0.2s ease");
        inner.current.style.setProperty('transform', "translate3d(0, 0, 0)");
        inner.current.style.setProperty('opacity', 1);
      }
    });
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.outer,
    onClick: onClose,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.inner,
    ref: inner
  }, children));
}

var styles$1 = {"full":"ZoomableImage-module_full__1YJoO","container":"ZoomableImage-module_container__RTuPI","img":"ZoomableImage-module_img__3Vnst","visible":"ZoomableImage-module_visible__2ez0D"};

function ZoomableImage(_ref) {
  var onClose = _ref.onClose,
    imageFile = _ref.imageFile;
  var imgRef = useRef();
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isVisible = _useState2[0],
    setIsVisible = _useState2[1];
  var onUpdate = useCallback(function (_ref2) {
    var x = _ref2.x,
      y = _ref2.y,
      scale = _ref2.scale;
    if (imgRef.current) {
      imgRef.current.style.setProperty('transform', make3dTransformValue({
        x: x,
        y: y,
        scale: scale
      }));
    }
  }, []);
  var handleClose = useCallback(function () {
    onClose();
    setIsVisible(false);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.full
  }, /*#__PURE__*/React.createElement(SwipeToClose, {
    onClose: handleClose
  }, /*#__PURE__*/React.createElement(QuickPinchZoom, {
    containerProps: {
      className: styles$1.container
    },
    onUpdate: onUpdate,
    isTouch: function isTouch() {
      return true;
    },
    minZoom: 0.8,
    maxZoom: 5,
    tapZoomFactor: 1.5,
    draggableUnZoomed: false,
    doubleTapToggleZoom: true,
    enforceBoundsDuringZoom: true,
    centerContained: true
  }, /*#__PURE__*/React.createElement("img", {
    src: imageFile.urls.large,
    width: imageFile.width,
    height: imageFile.height,
    alt: "img",
    ref: imgRef,
    className: classNames(styles$1.img, _defineProperty({}, styles$1.visible, isVisible))
  }))));
}

function Viewer(_ref) {
  var imageFile = _ref.imageFile,
    contentElementId = _ref.contentElementId,
    children = _ref.children;
  var _useContentElementEdi = useContentElementEditorState(),
    isEditable = _useContentElementEdi.isEditable,
    isSelected = _useContentElementEdi.isSelected;
  return /*#__PURE__*/React.createElement(FullscreenViewer, {
    contentElementId: contentElementId,
    renderChildren: function renderChildren(_ref2) {
      var enterFullscreen = _ref2.enterFullscreen;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        onClick: enterFullscreen,
        style: {
          pointerEvents: isEditable && !isSelected ? 'none' : undefined
        }
      }, children), /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
        isFullscreen: false,
        onEnter: enterFullscreen
      }));
    },
    renderFullscreenChildren: function renderFullscreenChildren(_ref3) {
      var exitFullscreen = _ref3.exitFullscreen;
      return /*#__PURE__*/React.createElement(ZoomableImage, {
        onClose: exitFullscreen,
        imageFile: imageFile
      });
    }
  });
}

export default Viewer;
