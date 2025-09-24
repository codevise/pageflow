import { WidgetSelectionRect, ThemeIcon, frontend } from 'pageflow-scrolled/frontend';
import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

var styles = {"indicator":"IconScrollIndicator-module_indicator__2sC27","size-large":"IconScrollIndicator-module_size-large__Ym7cB","align-center":"IconScrollIndicator-module_align-center__3zoez","align-left":"IconScrollIndicator-module_align-left__3kHWt","align-right":"IconScrollIndicator-module_align-right__3TvRM","animation-smallBounce":"IconScrollIndicator-module_animation-smallBounce__2SngV","animation-largeBounce":"IconScrollIndicator-module_animation-largeBounce__LVzn_","bounce":"IconScrollIndicator-module_bounce__IrI-f"};

function IconScrollIndicator(_ref) {
  var configuration = _ref.configuration,
    sectionLayout = _ref.sectionLayout;
  var ref = useRef();
  useEffect(function () {
    var animation = ref.current.animate({
      opacity: ['100%', '0%'],
      visibility: ['visible', 'hidden']
    }, {
      fill: 'forwards',
      timeline: new window.ViewTimeline({
        subject: ref.current.closest('section')
      }),
      rangeStart: 'exit-crossing 0%',
      rangeEnd: 'exit-crossing 100px'
    });
    return function () {
      return animation.cancel();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(styles.indicator, styles["animation-".concat(configuration.animation || 'smallBounce')], styles["size-".concat(configuration.size)], styles["align-".concat(getAlignment(configuration, sectionLayout))]),
    ref: ref
  }, /*#__PURE__*/React.createElement(WidgetSelectionRect, null, /*#__PURE__*/React.createElement(ThemeIcon, {
    name: "scrollDown",
    width: 30,
    height: 30
  })));
}
function getAlignment(configuration, sectionLayout) {
  if (configuration.alignment === 'centerViewport' || sectionLayout === 'center' || sectionLayout === 'centerRagged') {
    return 'center';
  } else if (sectionLayout === 'right') {
    return 'right';
  } else {
    return 'left';
  }
}

frontend.widgetTypes.register('iconScrollIndicator', {
  component: IconScrollIndicator
});
