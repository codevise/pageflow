import { useDarkBackground, AiIndicatorIcon, ThemeIcon, frontend } from 'pageflow-scrolled/frontend';
import React from 'react';
import classNames from 'classnames';

var styles = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","contentColorScope":"colors-module_contentColorScope__1Nxn3","wrapper":"IconInlineFileRights-module_wrapper__2kQK_ colors-module_contentColorScope__1Nxn3","onLightBackground":"IconInlineFileRights-module_onLightBackground__GTXJd","button":"IconInlineFileRights-module_button__o5ZmR","standAlone":"IconInlineFileRights-module_standAlone__15788","position-top":"IconInlineFileRights-module_position-top__rxJ3d","position-bottom":"IconInlineFileRights-module_position-bottom__25azC","tooltip":"IconInlineFileRights-module_tooltip__2e1u8","fadedOut":"IconInlineFileRights-module_fadedOut__3A7WF","aiIcon":"IconInlineFileRights-module_aiIcon__33otY","scroller":"IconInlineFileRights-module_scroller__1hT8t"};

function IconInlineFileRights({
  context,
  position,
  playerControlsStandAlone,
  playerControlsFadedOut,
  hasRights,
  hasAiIndicators,
  children
}) {
  const darkBackground = useDarkBackground();
  if (context === 'afterElement') {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.wrapper, styles[`position-${position || 'bottom'}`], {
      [styles.fadedOut]: context !== 'playerControls' || playerControlsFadedOut,
      [styles.standAlone]: context !== 'playerControls',
      [styles.onLightBackground]: context === 'playerControls' && playerControlsStandAlone && !darkBackground
    })
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.button
  }, hasAiIndicators && /*#__PURE__*/React.createElement(AiIndicatorIcon, {
    kind: "ai",
    className: styles.aiIcon
  }), hasRights && /*#__PURE__*/React.createElement(ThemeIcon, {
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
