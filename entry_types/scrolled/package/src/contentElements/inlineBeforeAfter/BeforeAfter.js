import React, { useEffect, useRef, useState } from "react";
import ReactCompareImage from "react-compare-image";
import styles from "./BeforeAfter.module.css";
import cx from "classnames";
import { useFile, useEditorSelection } from "pageflow-scrolled/frontend";

export function BeforeAfter({
  state,
  before_id,
  before_label,
  after_id,
  after_label,
  initial_slider_position,
  position,
  slider,
  slider_color,
  slider_handle,
  contentElementId,
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
      let shouldWiggle = !wiggled && state === "active";
      setWiggle(shouldWiggle);
      // If wiggle was just set, mark this element as one that already
      // wiggled
      !wiggled && setWiggled(shouldWiggle);
    }
  }, [state, current]);

  //Since the slider wiggle only the first time, set the variable once for performance purpose.
  useEffect(() => {
    if (current) {
      // Compute initial slider coordinate and pass it as a CSS
      // variable, so that before/after images can wiggle together with
      // the slider
      const containerWidth = current.getBoundingClientRect().width;
      const initialRectWidth = initialSliderPos * containerWidth;
      current.style.setProperty("--initial-rect-width", initialRectWidth + "px");
    }
  }, [wiggled]);

  const beforeImage = useFile({
    collectionName: "imageFiles",
    permaId: before_id,
  });
  const afterImage = useFile({
    collectionName: "imageFiles",
    permaId: after_id,
  });

  const { isSelected } = useEditorSelection({
    id: contentElementId,
    type: "contentElement",
  });
  const beforeImageUrl = beforeImage && beforeImage.urls.large;
  const beforeImageAlt = beforeImage && beforeImage.configuration.alt;
  const afterImageUrl = afterImage && afterImage.urls.large;
  const afterImageAlt = afterImage && afterImage.configuration.alt;
  const initialSliderPos = initial_slider_position / 100;

  if (current) {
    //If before/left image is missing give a calculated height dependant on the height of right image to element so it can be selected and not vanished.
    if (!before_id && after_id) {
      const rightImageWidthHeightRatio = current.children[0].childNodes[0].naturalHeight / current.children[0].childNodes[0].naturalWidth;
      const idealContainerHeight = current.getBoundingClientRect().width * rightImageWidthHeightRatio;
      current.children[0].style.setProperty('height', `${idealContainerHeight}px`);
    }
    //If after/right image is missing give a calculated height dependant on the height of left image to element so it can be selected and not vanished.
    if (!after_id && before_id) {
      const leftImageWidthHeightRatio = current.children[0].childNodes[1].naturalHeight / current.children[0].childNodes[1].naturalWidth;
      const idealContainerHeight = current.getBoundingClientRect().width * leftImageWidthHeightRatio;
      current.children[0].style.setProperty('height', `${idealContainerHeight}px`);
    }

    current.children[0].style.setProperty('display', 'block');
    //Add pillarbox classes for fullscreen width and remove otherwise.
    if (position === 'full') {
      current.children[0].classList.add(styles.pillarBox);
      current.classList.add(styles.containerPadding);
    }
    else {
      current.children[0].classList.remove(styles.pillarBox);
      current.classList.remove(styles.containerPadding);
    }
    //add some height if no image is present.
    if (before_id || after_id) {
      current.style.removeProperty('height');
    }
    else {
      current.style.setProperty('height', '20px');
      current.children[0].style.setProperty('height', '0px');
    }
  }

  //Give inline height
  let opts = {};
  // Transform slider-related props into the format that
  // react-compare-image needs
  if (!slider) {
    opts = { ...opts, sliderLineWidth: 0, handle: <React.Fragment /> };
  }
  if (slider) {
    if (!slider_handle) {
      opts = { ...opts, handle: <React.Fragment /> };
    }
    if (slider_color) {
      opts = { ...opts, sliderLineColor: slider_color };
    }
  }

  return (
    <div
      ref={beforeAfterRef}
      className={cx(
        { [styles.selected]: isSelected, [styles.wiggle]: wiggle },
        styles.container
      )}
    >
      <InitialSliderPositionIndicator
        parentSelected={isSelected}
        position={initial_slider_position}
      />
      {/* onSliderPositionChange: Prevent wiggle if user uses slider */}
      <ReactCompareImage
        leftImage={beforeImageUrl}
        rightImage={afterImageUrl}
        leftImageLabel={before_label}
        rightImageLabel={after_label}
        leftImageAlt={beforeImageAlt}
        rightImageAlt={afterImageAlt}
        sliderPositionPercentage={initialSliderPos}
        onSliderPositionChange={() => setWiggle(false)}
        {...opts}
      />
    </div>
  );
}

function InitialSliderPositionIndicator({ parentSelected, position }) {
  const indicatorWidth = "2px";
  const indicatorStyles = {
    left: `calc(${position}% - ${indicatorWidth}/2)`,
    width: `${indicatorWidth}`,
    height: "100%",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  };

  // In case this element is selected, and its initial slider position
  // is not in the middle, we show InitialSliderPositionIndicator
  return parentSelected && position !== 50 ? (
    <div className={styles.sliderStart} style={indicatorStyles} />
  ) : (
    ""
  );
}
