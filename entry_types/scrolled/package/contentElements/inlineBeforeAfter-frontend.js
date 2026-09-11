import { useFileWithInlineRights, useContentElementEditorState, FitViewport, ContentElementBox, ContentElementFigure, InlineFileRights, useContentElementLifecycle, frontend } from 'pageflow-scrolled/frontend';
import React, { useState, useEffect } from 'react';
import ReactCompareImage from 'react-compare-image';
import Measure from 'react-measure';
import cx from 'classnames';

var styles = {"sliderStart":"BeforeAfter-module_sliderStart__2C5cN","container":"BeforeAfter-module_container__2Lm06","wiggle":"BeforeAfter-module_wiggle__3nVSe","SliderLeftRightShake":"BeforeAfter-module_SliderLeftRightShake__2mcn5","BeforeImageLeftRightShake":"BeforeAfter-module_BeforeImageLeftRightShake__38m9V","AfterImageLeftRightShake":"BeforeAfter-module_AfterImageLeftRightShake__3WMf1"};

const placeholderForBeforeImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiMzZDVhODAiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';
const placeholderForAfterImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiM5OGMxZDkiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';
const placeholderFile = {
  width: 640,
  height: 403
};
function BeforeAfter(configuration) {
  const {
    isActive,
    load,
    before_label,
    after_label,
    initial_slider_position,
    slider_color
  } = configuration;
  const [wiggle, setWiggle] = useState(false);
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    // Only wiggle once per element, when it is active for the first
    // time
    setWiggle(wiggle => wiggle || isActive);
  }, [isActive]);
  const beforeImage = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'before_id'
  });
  const afterImage = useFileWithInlineRights({
    configuration,
    collectionName: 'imageFiles',
    propertyName: 'after_id'
  });
  const {
    isSelected
  } = useContentElementEditorState();
  const beforeImageUrl = beforeImage && beforeImage.urls.large;
  const beforeImageAlt = beforeImage && beforeImage.configuration.alt;
  const afterImageUrl = afterImage && afterImage.urls.large;
  const afterImageAlt = afterImage && afterImage.configuration.alt;
  const initialSliderPos = initial_slider_position / 100;
  const inlineFileRightsItems = [{
    file: beforeImage,
    label: 'before'
  }, {
    file: afterImage,
    label: 'after'
  }];
  return /*#__PURE__*/React.createElement(FitViewport, {
    file: beforeImage || afterImage || placeholderFile,
    fill: configuration.position === 'backdrop'
  }, /*#__PURE__*/React.createElement(ContentElementBox, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(ContentElementFigure, {
    configuration: configuration
  }, /*#__PURE__*/React.createElement(FitViewport.Content, null, /*#__PURE__*/React.createElement(Measure, {
    bounds: true
  }, ({
    measureRef,
    contentRect
  }) => {
    const initialRectWidth = contentRect.bounds.width * initialSliderPos + 'px';
    return /*#__PURE__*/React.createElement("div", {
      ref: measureRef,
      style: {
        '--initial-rect-width': initialRectWidth
      },
      className: cx({
        [styles.selected]: isSelected,
        [styles.wiggle]: wiggle && !moved
      }, styles.container)
    }, /*#__PURE__*/React.createElement(InitialSliderPositionIndicator, {
      parentSelected: isSelected,
      position: initial_slider_position
    }), renderCompareImage());
  }), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "insideElement",
    items: inlineFileRightsItems
  })))), /*#__PURE__*/React.createElement(InlineFileRights, {
    configuration: configuration,
    context: "afterElement",
    items: inlineFileRightsItems
  }));
  function renderCompareImage() {
    if (!load) {
      return null;
    }
    return /*#__PURE__*/React.createElement(ReactCompareImage, {
      leftImage: beforeImage ? beforeImageUrl : placeholderForBeforeImage,
      rightImage: afterImage ? afterImageUrl : placeholderForAfterImage,
      leftImageLabel: before_label,
      rightImageLabel: after_label,
      leftImageAlt: beforeImageAlt,
      rightImageAlt: afterImageAlt,
      sliderPositionPercentage: initialSliderPos,
      onSliderPositionChange: () => setMoved(true),
      sliderLineColor: slider_color || undefined
    });
  }
}
function InitialSliderPositionIndicator({
  parentSelected,
  position
}) {
  const indicatorWidth = '2px';
  const indicatorStyles = {
    left: `calc(${position}% - ${indicatorWidth}/2)`,
    width: `${indicatorWidth}`,
    height: '100%',
    borderLeft: '1px solid black',
    borderRight: '1px solid black'
  };

  // In case this element is selected, and its initial slider position
  // is not in the middle, we show InitialSliderPositionIndicator
  return parentSelected && position !== 50 ? /*#__PURE__*/React.createElement("div", {
    className: styles.sliderStart,
    style: indicatorStyles
  }) : '';
}

function InlineBeforeAfter(props) {
  const {
    isActive,
    shouldLoad
  } = useContentElementLifecycle();
  return /*#__PURE__*/React.createElement(BeforeAfter, Object.assign({}, props.configuration, {
    load: shouldLoad,
    isActive: isActive
  }));
}

frontend.contentElementTypes.register('inlineBeforeAfter', {
  component: InlineBeforeAfter,
  lifecycle: true
});
