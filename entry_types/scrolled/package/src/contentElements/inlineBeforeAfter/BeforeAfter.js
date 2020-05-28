import React, {useEffect, useRef, useState} from 'react';
import ReactCompareImage from 'react-compare-image';
import styles from './BeforeAfter.module.css';
import cx from 'classnames';
import {useFile, useContentElementEditorState} from 'pageflow-scrolled/frontend';

export function BeforeAfter({state,
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
      let shouldWiggle = !wiggled && (state === 'active');
      setWiggle(shouldWiggle);
      // If wiggle was just set, mark this element as one that already
      // wiggled
      !wiggled && setWiggled(shouldWiggle);
    }
  }, [state, current]);

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

  if (current) {
    // Compute initial slider coordinate and pass it as a CSS
    // variable, so that before/after images can wiggle together with
    // the slider
    const containerWidth = current.getBoundingClientRect().width;
    const initialRectWidth = initialSliderPos * containerWidth;
    current.style.setProperty('--initial-rect-width', initialRectWidth + 'px');
  }

  return (
    <div ref={beforeAfterRef}
      className={cx({[styles.selected]: isSelected, [styles.wiggle]: wiggle},
      styles.container)}>
      <InitialSliderPositionIndicator parentSelected={isSelected}
        position={initial_slider_position}/>
      {/* onSliderPositionChange: Prevent wiggle if user uses slider */}
      <ReactCompareImage leftImage={beforeImageUrl} rightImage={afterImageUrl}
                         leftImageLabel={before_label} rightImageLabel={after_label}
                         leftImageAlt={beforeImageAlt} rightImageAlt={afterImageAlt}
                         sliderPositionPercentage={initialSliderPos}
                         onSliderPositionChange={() => setWiggle(false)}
                         {...opts} />
    </div>
  );
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
