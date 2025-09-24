import React from 'react';
import { u as useI18n, T as ThemeIcon } from './ThemeIcon-87fcf0dd.js';

var styles = {"button":"ToggleFullscreenButton-module_button__2n69- utils-module_unstyledButton__3rgne"};

function ToggleFullscreenButton(props) {
  var _useI18n = useI18n(),
    t = _useI18n.t;
  return /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    title: t(props.isFullscreen ? 'exit_fullscreen' : 'enter_fullscreen', {
      scope: 'pageflow_scrolled.public'
    }),
    onClick: function onClick() {
      return props.isFullscreen ? props.onExit() : props.onEnter();
    }
  }, icon(props));
}
function icon(props) {
  if (props.isFullscreen) {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "exitFullscreen"
    });
  } else {
    return /*#__PURE__*/React.createElement(ThemeIcon, {
      name: "enterFullscreen"
    });
  }
}

var styles$1 = {"corner":"ToggleFullscreenCornerButton-module_corner__CxAAH"};

function ToggleFullscreenCornerButton(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: styles$1.corner
  }, /*#__PURE__*/React.createElement(ToggleFullscreenButton, props));
}

export { ToggleFullscreenCornerButton as T };
