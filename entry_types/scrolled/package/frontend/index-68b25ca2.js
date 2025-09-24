import React, { useMemo, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { _ as _slicedToArray, b as _defineProperty } from './ThemeIcon-87fcf0dd.js';
import classNames from 'classnames';
import { u as useDelayedBoolean } from './useContentElementEditorState-cd3c272d.js';
import { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-ea2bb05c.js';

var styles = {"wrapper":"Fullscreen-module_wrapper__2MP7f"};

function Fullscreen(_ref) {
  var children = _ref.children;
  var root = useMemo(function () {
    return document.getElementById('fullscreenRoot');
  }, []);
  useEffect(function () {
    var resetScrollbarPadding = adjustScrollbarPadding(function () {
      document.getElementById('root').setAttribute('inert', true);
      document.body.style.overflow = 'hidden';
    });
    return function () {
      resetScrollbarPadding();
      document.getElementById('root').removeAttribute('inert', true);
      document.body.style.overflow = 'initial';
    };
  }, []);
  return ReactDOM.createPortal( /*#__PURE__*/React.createElement("div", {
    className: styles.wrapper
  }, children), root);
}

// Adapted from
// https://github.com/tailwindlabs/headlessui/blob/9dff5456fa196cdc304e2ed17ef47962a9364ce7/packages/%40headlessui-react/src/hooks/document-overflow/adjust-scrollbar-padding.ts
function adjustScrollbarPadding(hideScrollbar) {
  var documentElement = document.documentElement;
  var ownerWindow = document.defaultView || window;
  var scrollbarWidthBefore = ownerWindow.innerWidth - documentElement.clientWidth;
  hideScrollbar();
  var scrollbarWidthAfter = documentElement.clientWidth - documentElement.offsetWidth;
  var scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter;
  document.documentElement.style.paddingRight = "".concat(scrollbarWidth, "px");
  return function () {
    return document.documentElement.style.paddingRight = '0';
  };
}

var styles$1 = {"wrapper":"index-module_wrapper__ilo7n","visible":"index-module_visible__6QUDn"};

function FullscreenViewer(_ref) {
  var contentElementId = _ref.contentElementId,
    renderChildren = _ref.renderChildren,
    renderFullscreenChildren = _ref.renderFullscreenChildren;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isFullscreen = _useState2[0],
    setIsFullscreen = _useState2[1];
  var isRendered = useDelayedBoolean(isFullscreen, {
    fromTrueToFalse: 200
  });
  var isVisible = useDelayedBoolean(isFullscreen, {
    fromFalseToTrue: 1
  });
  useEffect(function () {
    function handlePopState() {
      var _window$history$state;
      setIsFullscreen(((_window$history$state = window.history.state) === null || _window$history$state === void 0 ? void 0 : _window$history$state.fullscreenContentElementId) === contentElementId);
    }
    window.addEventListener('popstate', handlePopState);
    return function () {
      return window.removeEventListener('popstate', handlePopState);
    };
  });
  var enterFullscreen = useCallback(function () {
    setIsFullscreen(true);
    if (window.parent === window) {
      window.history.pushState({
        fullscreenContentElementId: contentElementId
      }, '');
    }
  }, [contentElementId]);
  var exitFullscreen = useCallback(function () {
    var _window$history$state2;
    setIsFullscreen(false);
    if (((_window$history$state2 = window.history.state) === null || _window$history$state2 === void 0 ? void 0 : _window$history$state2.fullscreenContentElementId) === contentElementId && window.parent === window) {
      window.history.back();
    }
  }, [contentElementId]);
  useEffect(function () {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        exitFullscreen();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return function () {
      return window.removeEventListener('keydown', handleKeyDown);
    };
  }, [exitFullscreen]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderChildren({
    enterFullscreen: enterFullscreen,
    isFullscreen: isFullscreen
  }), isRendered && /*#__PURE__*/React.createElement(Fullscreen, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, _defineProperty({}, styles$1.visible, isVisible))
  }, renderFullscreenChildren({
    exitFullscreen: exitFullscreen
  }), /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
    isFullscreen: true,
    onExit: exitFullscreen
  }))));
}

export { FullscreenViewer as F };
