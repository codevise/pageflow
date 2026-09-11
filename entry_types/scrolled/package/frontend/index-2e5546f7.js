import React, { useMemo, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { u as useDelayedBoolean } from './useDelayedBoolean-a387d85b.js';
import { T as ToggleFullscreenCornerButton } from './ToggleFullscreenCornerButton-30fd1124.js';

var styles = {"wrapper":"Fullscreen-module_wrapper__2MP7f"};

function Fullscreen({
  children
}) {
  const root = useMemo(() => document.getElementById('fullscreenRoot'), []);
  useEffect(() => {
    const resetScrollbarPadding = adjustScrollbarPadding(() => {
      document.getElementById('root').setAttribute('inert', true);
      document.body.style.overflow = 'hidden';
    });
    return () => {
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
  const documentElement = document.documentElement;
  const ownerWindow = document.defaultView || window;
  const scrollbarWidthBefore = ownerWindow.innerWidth - documentElement.clientWidth;
  hideScrollbar();
  const scrollbarWidthAfter = documentElement.clientWidth - documentElement.offsetWidth;
  const scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter;
  document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  return () => document.documentElement.style.paddingRight = '0';
}

var styles$1 = {"wrapper":"index-module_wrapper__ilo7n","visible":"index-module_visible__6QUDn"};

function FullscreenViewer({
  contentElementId,
  renderChildren,
  renderFullscreenChildren
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isRendered = useDelayedBoolean(isFullscreen, {
    fromTrueToFalse: 200
  });
  const isVisible = useDelayedBoolean(isFullscreen, {
    fromFalseToTrue: 1
  });
  useEffect(() => {
    function handlePopState() {
      var _window$history$state;
      setIsFullscreen(((_window$history$state = window.history.state) === null || _window$history$state === void 0 ? void 0 : _window$history$state.fullscreenContentElementId) === contentElementId);
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });
  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    if (window.parent === window) {
      window.history.pushState({
        fullscreenContentElementId: contentElementId
      }, '');
    }
  }, [contentElementId]);
  const exitFullscreen = useCallback(() => {
    var _window$history$state2;
    setIsFullscreen(false);
    if (((_window$history$state2 = window.history.state) === null || _window$history$state2 === void 0 ? void 0 : _window$history$state2.fullscreenContentElementId) === contentElementId && window.parent === window) {
      window.history.back();
    }
  }, [contentElementId]);
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        exitFullscreen();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exitFullscreen]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderChildren({
    enterFullscreen,
    isFullscreen
  }), isRendered && /*#__PURE__*/React.createElement(Fullscreen, null, /*#__PURE__*/React.createElement("div", {
    className: classNames(styles$1.wrapper, {
      [styles$1.visible]: isVisible
    })
  }, renderFullscreenChildren({
    exitFullscreen
  }), /*#__PURE__*/React.createElement(ToggleFullscreenCornerButton, {
    isFullscreen: true,
    onExit: exitFullscreen
  }))));
}

export { FullscreenViewer as F };
