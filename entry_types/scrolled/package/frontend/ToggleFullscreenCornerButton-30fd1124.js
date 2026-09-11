import React from 'react';
import { u as useI18n } from './i18n-493cd2a6.js';
import { T as ThemeIcon } from './ThemeIcon-ab834849.js';

var styles = {"button":"ToggleFullscreenButton-module_button__2n69- utils-module_unstyledButton__3rgne"};

function ToggleFullscreenButton(props) {
  const {
    t
  } = useI18n();
  return /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    title: t(props.isFullscreen ? 'exit_fullscreen' : 'enter_fullscreen', {
      scope: 'pageflow_scrolled.public'
    }),
    onClick: () => props.isFullscreen ? props.onExit() : props.onEnter()
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
