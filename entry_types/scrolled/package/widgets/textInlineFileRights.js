import { useDarkBackground, useContentElementEditorState, frontend } from 'pageflow-scrolled/frontend';
import React, { useEffect } from 'react';
import classNames from 'classnames';

var styles = {"darkContentSurfaceColor":"var(--theme-dark-content-surface-color, #101010)","lightContentSurfaceColor":"var(--theme-light-content-surface-color, #fff)","darkContentTextColor":"var(--theme-dark-content-text-color, #222)","lightContentTextColor":"var(--theme-light-content-text-color, #fff)","text":"TextInlineFileRights-module_text__1tT0W","darkBackground":"TextInlineFileRights-module_darkBackground__3oIUp","withBackdrop":"TextInlineFileRights-module_withBackdrop__2cRu8","forSection":"TextInlineFileRights-module_forSection__22xHD"};

function TextInlineFileRights({
  configuration,
  context,
  children
}) {
  const darkBackground = useDarkBackground();
  const {
    setTransientState
  } = useContentElementEditorState();
  const supported = context !== 'insideElement' && context !== 'playerControls';
  useEffect(() => {
    if (supported) {
      setTransientState({
        hasFileRights: true
      });
    }
    return () => {
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
    className: classNames(styles.text, {
      [styles.forSection]: context === 'section',
      [styles.withBackdrop]: context === 'section' || configuration.showTextInlineFileRightsBackdrop,
      [styles.darkBackground]: darkBackground
    })
  }, /*#__PURE__*/React.createElement("div", null, children));
}

frontend.widgetTypes.register('textInlineFileRights', {
  component: TextInlineFileRights
});
