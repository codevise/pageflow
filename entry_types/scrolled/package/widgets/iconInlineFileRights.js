import { ThemeIcon, frontend } from 'pageflow-scrolled/frontend';
import React from 'react';
import classNames from 'classnames';

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

var styles = {"standAlone":"IconInlineFileRights-module_standAlone__15788","position-top":"IconInlineFileRights-module_position-top__rxJ3d","position-bottom":"IconInlineFileRights-module_position-bottom__25azC","button":"IconInlineFileRights-module_button__o5ZmR","tooltip":"IconInlineFileRights-module_tooltip__2e1u8","fadedOut":"IconInlineFileRights-module_fadedOut__3A7WF","wrapper":"IconInlineFileRights-module_wrapper__2kQK_","scroller":"IconInlineFileRights-module_scroller__1hT8t"};

function IconInlineFileRights(_ref) {
  var context = _ref.context,
    position = _ref.position,
    playerControlsStandAlone = _ref.playerControlsStandAlone,
    playerControlsFadedOut = _ref.playerControlsFadedOut,
    children = _ref.children;
  if (context === 'afterElement') {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.wrapper, styles["position-".concat(position || 'bottom')], _defineProperty(_defineProperty({}, styles.fadedOut, context !== 'playerControls' || playerControlsFadedOut), styles.standAlone, context !== 'playerControls'))
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.button
  }, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "copyright"
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.tooltip
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.scroller
  }, children)));
}

frontend.widgetTypes.register('iconInlineFileRights', {
  component: IconInlineFileRights
});
