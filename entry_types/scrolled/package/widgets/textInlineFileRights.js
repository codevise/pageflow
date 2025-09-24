import { useDarkBackground, useContentElementEditorState, frontend } from 'pageflow-scrolled/frontend';
import React, { useEffect } from 'react';
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

var styles = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","contentColorScope":"colors-module_contentColorScope__3ypcw","text":"TextInlineFileRights-module_text__1tT0W","withBackdrop":"TextInlineFileRights-module_withBackdrop__2cRu8","darkBackground":"TextInlineFileRights-module_darkBackground__3oIUp","forSection":"TextInlineFileRights-module_forSection__22xHD"};

function TextInlineFileRights(_ref) {
  var configuration = _ref.configuration,
    context = _ref.context,
    children = _ref.children;
  var darkBackground = useDarkBackground();
  var _useContentElementEdi = useContentElementEditorState(),
    setTransientState = _useContentElementEdi.setTransientState;
  var supported = context !== 'insideElement' && context !== 'playerControls';
  useEffect(function () {
    if (supported) {
      setTransientState({
        hasFileRights: true
      });
    }
    return function () {
      if (supported) {
        setTransientState({
          hasFileRights: false
        });
      }
    };
  }, [setTransientState, supported]);
  if (!supported) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.text, _defineProperty(_defineProperty(_defineProperty({}, styles.forSection, context === 'section'), styles.withBackdrop, context === 'section' || configuration.showTextInlineFileRightsBackdrop), styles.darkBackground, darkBackground))
  }, /*#__PURE__*/React.createElement("div", null, children));
}

frontend.widgetTypes.register('textInlineFileRights', {
  component: TextInlineFileRights
});
