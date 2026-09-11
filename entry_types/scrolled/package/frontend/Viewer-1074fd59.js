import React, { useRef, useCallback, useState } from 'react';
import 'react-dom';
import classNames from 'classnames';
import './useDelayedBoolean-a387d85b.js';
import 'pageflow-scrolled/entryState';
import 'i18n-js';
import './i18n-493cd2a6.js';
import { u as useContentElementEditorState } from './useContentElementEditorState-a084912e.js';
import './ThemeIcon-ab834849.js';
import { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-30fd1124.js';
import { F as FullscreenViewer } from './index-2e5546f7.js';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';

var styles = {"outer":"SwipeToClose-module_outer__1fl2h","inner":"SwipeToClose-module_inner__NOg1v"};

function SwipeToClose({
  onClose,
  children
}) {
  const start = useRef();
  const inner = useRef();
  const ratio = useRef(0);
  const handleTouchStart = useCallback(event => {
    start.current = event.touches[0].pageY;
  }, []);
  const handleTouchMove = useCallback(event => {
    const offset = Math.max(-200, Math.min(200, event.touches[0].pageY - start.current));
    ratio.current = Math.abs(offset / 200);
    requestAnimationFrame(() => {
      if (inner.current) {
        inner.current.style.setProperty('transition', `none`);
        inner.current.style.setProperty('transform', `translate3d(0, ${offset}px, 0)`);
        inner.current.style.setProperty('opacity', 1 - ratio.current);
      }
    });
  }, []);
  const handleTouchEnd = useCallback(event => {
    event.preventDefault();
    if (ratio.current > 0.5) {
      onClose();
    }
    requestAnimationFrame(() => {
      if (inner.current) {
        inner.current.style.setProperty('transition', `opacity 0.2s linear, transform 0.2s ease`);
        inner.current.style.setProperty('transform', `translate3d(0, 0, 0)`);
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

function ZoomableImage({
  onClose,
  imageFile
}) {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const onUpdate = useCallback(({
    x,
    y,
    scale
  }) => {
    if (imgRef.current) {
      imgRef.current.style.setProperty('transform', make3dTransformValue({
        x,
        y,
        scale
      }));
    }
  }, []);
  const handleClose = useCallback(() => {
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
    isTouch: () => true,
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
    className: classNames(styles$1.img, {
      [styles$1.visible]: isVisible
    })
  }))));
}

function Viewer({
  imageFile,
  contentElementId,
  children
}) {
  const {
    isEditable,
    isSelected
  } = useContentElementEditorState();
  return /*#__PURE__*/React.createElement(FullscreenViewer, {
    contentElementId: contentElementId,
    renderChildren: ({
      enterFullscreen
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: enterFullscreen,
      style: {
        pointerEvents: isEditable && !isSelected ? 'none' : undefined
      }
    }, children), /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
      isFullscreen: false,
      onEnter: enterFullscreen
    })),
    renderFullscreenChildren: ({
      exitFullscreen
    }) => /*#__PURE__*/React.createElement(ZoomableImage, {
      onClose: exitFullscreen,
      imageFile: imageFile
    })
  });
}

export default Viewer;
