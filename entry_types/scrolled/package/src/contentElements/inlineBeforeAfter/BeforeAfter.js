import React, {useEffect, useRef, useState} from 'react';
import ReactCompareImage from 'react-compare-image';
import styles from './BeforeAfter.module.css';
import cx from 'classnames';
import {useFile, useContentElementEditorState, ViewportDependentPillarBoxes} from 'pageflow-scrolled/frontend';

const placeholderForBeforeImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiMzZDVhODAiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';
const placeholderForAfterImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiM5OGMxZDkiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSI0MDUiIHdpZHRoPSI2NDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiA8L2c+Cjwvc3ZnPg==';

const placeholderFile = {
  width: 640,
  height: 403
};

export function BeforeAfter({isActive,
                             isPrepared,
                             position,
                             before_id,
                             before_label,
                             after_id,
                             after_label,
                             initial_slider_position,
                             slider,
                             slider_color,
                             slider_handle
                            }) {
  const beforeAfterRef = useRef();
  const current = beforeAfterRef.current;

  var [wiggled, setWiggled] = useState(false);
  var [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    var node = current;
    if (node) {
      // Only wiggle once per element, when it is active for the first
      // time
      let shouldWiggle = !wiggled && isActive;
      setWiggle(shouldWiggle);
      // If wiggle was just set, mark this element as one that already
      // wiggled
      !wiggled && setWiggled(shouldWiggle);
    }
  }, [isActive, current]);

  const beforeImage = useFile({collectionName: 'imageFiles', permaId: before_id});
  const afterImage = useFile({collectionName: 'imageFiles', permaId: after_id});

  const {isSelected} = useContentElementEditorState();
  const beforeImageUrl = beforeImage && beforeImage.urls.large;
  const beforeImageAlt = beforeImage && beforeImage.configuration.alt;
  const afterImageUrl = afterImage && afterImage.urls.large;
  const afterImageAlt = afterImage && afterImage.configuration.alt;
  const initialSliderPos = initial_slider_position / 100;

  let opts = {};
  // Transform slider-related props into the format that
  // react-compare-image needs
  if (!slider) {
    opts = {...opts, sliderLineWidth: 0, handle: <React.Fragment/>};
  }
  if (slider) {
    if (!slider_handle) {
      opts = {...opts, handle: <React.Fragment/>};
    }
    if (slider_color) {
      opts = {...opts, sliderLineColor: slider_color};
    }
  }

  //Since the slider wiggle only the first time, set the variable once for performance purpose.
  useEffect(() => {
    if (beforeAfterRef.current) {
      // Compute initial slider coordinate and pass it as a CSS
      // variable, so that before/after images can wiggle together with
      // the slider
      const containerWidth = beforeAfterRef.current.getBoundingClientRect().width;
      const initialRectWidth = initialSliderPos * containerWidth;
      beforeAfterRef.current.style.setProperty('--initial-rect-width', initialRectWidth + 'px');
    }
  }, [wiggled, initialSliderPos]);

  return (
    <ViewportDependentPillarBoxes file={beforeImage || afterImage || placeholderFile} position={position}>
      <div ref={beforeAfterRef}
           className={cx({[styles.selected]: isSelected, [styles.wiggle]: wiggle}, styles.container)}>
        <InitialSliderPositionIndicator parentSelected={isSelected}
                                        position={initial_slider_position}/>
        {/* onSliderPositionChange: Prevent wiggle if user uses slider */}
        {renderCompareImage()}
      </div>
    </ViewportDependentPillarBoxes>
  );

  function renderCompareImage() {
    if (!isPrepared) {
      return null;
    }

    return (
      <ReactCompareImage leftImage={beforeImage? beforeImageUrl : placeholderForBeforeImage}
                         rightImage={afterImage? afterImageUrl : placeholderForAfterImage}
                         leftImageLabel={before_label} rightImageLabel={after_label}
                         leftImageAlt={beforeImageAlt} rightImageAlt={afterImageAlt}
                         sliderPositionPercentage={initialSliderPos}
                         onSliderPositionChange={() => setWiggle(false)}
                         {...opts} />
    );
  }
};

function InitialSliderPositionIndicator({parentSelected, position}) {
  const indicatorWidth = '2px';
  const indicatorStyles = {
          left: `calc(${position}% - ${indicatorWidth}/2)`,
          width: `${indicatorWidth}`,
          height: '100%',
          borderLeft: '1px solid black',
          borderRight: '1px solid black',
  };

  // In case this element is selected, and its initial slider position
  // is not in the middle, we show InitialSliderPositionIndicator
  return parentSelected && (position !== 50) ?
      <div className={styles.sliderStart} style={indicatorStyles}/> :
        '';
}
