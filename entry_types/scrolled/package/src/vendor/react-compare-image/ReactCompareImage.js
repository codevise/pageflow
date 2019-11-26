// The MIT License (MIT)

// Copyright (c) 2015 gatsbyjs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Originally based on version 1.4.1,
// https://github.com/junkboy0315/react-compare-image/commit/b3ee5f64bb1d89eacd9a8e950639af3d62844888

import {ResizeSensor} from '../css-element-queries';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

const propTypes = {
  handleSize: PropTypes.number,
  handle: PropTypes.node,
  hover: PropTypes.bool,
  leftImage: PropTypes.string.isRequired,
  leftImageAlt: PropTypes.string,
  leftImageCss: PropTypes.object, // eslint-disable-line
  leftImageLabel: PropTypes.string,
  onSliderPositionChange: PropTypes.func,
  rightImage: PropTypes.string.isRequired,
  rightImageAlt: PropTypes.string,
  rightImageCss: PropTypes.object, // eslint-disable-line
  rightImageLabel: PropTypes.string,
  skeleton: PropTypes.element,
  sliderLineColor: PropTypes.string,
  sliderLineWidth: PropTypes.number,
  sliderPositionPercentage: PropTypes.number,
};

const defaultProps = {
  handleSize: 40,
  handle: null,
  hover: false,
  leftImageAlt: '',
  leftImageCss: {},
  leftImageLabel: null,
  onSliderPositionChange: () => {},
  rightImageAlt: '',
  rightImageCss: {},
  rightImageLabel: null,
  skeleton: null,
  sliderLineColor: '#ffffff',
  sliderLineWidth: 2,
  sliderPositionPercentage: 0.5,
};

function ReactCompareImage(props) {
  const {
    handleSize,
    handle,
    hover,
    leftImage,
    leftImageAlt,
    leftImageCss,
    leftImageLabel,
    onSliderPositionChange,
    rightImage,
    rightImageAlt,
    rightImageCss,
    rightImageLabel,
    skeleton,
    sliderLineColor,
    sliderLineWidth,
    sliderPositionPercentage,
    sliderPosition,
    setSliderPosition,
    isSliding,
    setIsSliding,
    classicMode,
    wiggle
  } = props;

  const [containerWidth, setContainerWidth] = useState(0);
  const [leftImgLoaded, setLeftImgLoaded] = useState(false);
  const [rightImgLoaded, setRightImgLoaded] = useState(false);

  const containerRef = useRef();
  const rightImageRef = useRef();
  const leftImageRef = useRef();

  // keep track container's width in local state
  useEffect(() => {
    const updateContainerWidth = () => {
      const currentContainerWidth = containerRef.current.getBoundingClientRect()
        .width;
      setContainerWidth(currentContainerWidth);
    };

    // initial execution must be done manually
    updateContainerWidth();

    // update local state if container size is changed
    const containerElement = containerRef.current;
    const resizeSensor = new ResizeSensor(containerElement, () => {
      updateContainerWidth();
    });

    return () => {
      resizeSensor.detach(containerElement);
    };
  }, []);

  useEffect(() => {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    const alreadyDone = leftImageRef.current.complete;
    alreadyDone && setLeftImgLoaded(true);

    return () => {
      // when the left image source is changed
      setLeftImgLoaded(false);
    };
  }, [leftImage]);

  useEffect(() => {
    // consider the case where loading image is completed immediately
    // due to the cache etc.
    const alreadyDone = rightImageRef.current.complete;
    alreadyDone && setRightImgLoaded(true);

    return () => {
      // when the right image source is changed
      setRightImgLoaded(false);
    };
  }, [rightImage]);

  const allImagesLoaded = rightImgLoaded && leftImgLoaded;

  useEffect(() => {
    const handleSliding = event => {
      const e = event || window.event;

      // Calc Cursor Position from the left edge of the viewport
      const cursorXfromViewport = e.touches ? e.touches[0].pageX : e.pageX;

      // Calc Cursor Position from the left edge of the window (consider any page scrolling)
      const cursorXfromWindow = cursorXfromViewport - window.pageXOffset;

      // Calc Cursor Position from the left edge of the image
      const imagePosition = rightImageRef.current.getBoundingClientRect();
      let pos = cursorXfromWindow - imagePosition.left;

      // Set minimum and maximum values to prevent the slider from overflowing
      const minPos = 0 + sliderLineWidth / 2;
      const maxPos = containerWidth - sliderLineWidth / 2;

      if (pos < minPos) pos = minPos;
      if (pos > maxPos) pos = maxPos;

      setSliderPosition(pos / containerWidth);

      // If there's a callback function, invoke it everytime the slider changes
      if (onSliderPositionChange) {
        onSliderPositionChange(pos / containerWidth);
      }
    };

    const startSliding = e => {
      setIsSliding(true);

      // Prevent default behavior other than mobile scrolling
      if (!('touches' in e)) {
        e.preventDefault();
      }

      // Slide the image even if you just click or tap (not drag)
      handleSliding(e);

      window.addEventListener('mousemove', handleSliding); // 07
      window.addEventListener('touchmove', handleSliding); // 08
    };

    const finishSliding = () => {
      setIsSliding(false);
      window.removeEventListener('mousemove', handleSliding);
      window.removeEventListener('touchmove', handleSliding);
    };

    const containerElement = containerRef.current;

    if (allImagesLoaded) {
      if (classicMode) {
        // it's necessary to reset event handlers each time the canvasWidth changes

        // for mobile
        containerElement.addEventListener('touchstart', startSliding); // 01
        window.addEventListener('touchend', finishSliding); // 02

        // for desktop
        if (hover) {
          containerElement.addEventListener('mousemove', handleSliding); // 03
          containerElement.addEventListener('mouseleave', finishSliding); // 04
        } else {
          containerElement.addEventListener('mousedown', startSliding); // 05
          window.addEventListener('mouseup', finishSliding); // 06
        }
      }
    }

    return () => {
      if (classicMode) {
        // cleanup all event resteners
        containerElement.removeEventListener('touchstart', startSliding); // 01
        window.removeEventListener('touchend', finishSliding); // 02
        containerElement.removeEventListener('mousemove', handleSliding); // 03
        containerElement.removeEventListener('mouseleave', finishSliding); // 04
        containerElement.removeEventListener('mousedown', startSliding); // 05
        window.removeEventListener('mouseup', finishSliding); // 06
        window.removeEventListener('mousemove', handleSliding); // 07
        window.removeEventListener('touchmove', handleSliding); // 08
      }
    };
  }, [allImagesLoaded, containerWidth, hover, sliderLineWidth]); // eslint-disable-line

  // Image size set as follows.
  //
  // 1. right(under) image:
  //     width  = 100% of container width
  //     height = auto
  //
  // 2. left(over) imaze:
  //     width  = 100% of container width
  //     height = right image's height
  //              (protrudes is hidden by css 'object-fit: hidden')
  const styles = {
    container: {
      boxSizing: 'border-box',
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
    },
    rightImage: {
      display: 'block',
      height: 'auto', // Respect the aspect ratio
      width: '100%',
      ...rightImageCss,
    },
    leftImage: {
      clip: `rect(auto, ${containerWidth * sliderPosition}px, auto, auto)`,
      display: 'block',
      height: '100%', // fit to the height of right(under) image
      objectFit: 'cover', // protrudes is hidden
      position: 'absolute',
      top: 0,
      width: '100%',
      ...leftImageCss
    },
    slider: {
      alignItems: 'center',
      cursor: !hover && 'ew-resize',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      left: `${containerWidth * sliderPosition - handleSize / 2}px`,
      position: 'absolute',
      top: 0,
      width: `${handleSize}px`
    },
    line: {
      background: sliderLineColor,
      boxShadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      flex: '0 1 auto',
      height: '100%',
      width: `${sliderLineWidth}px`,
    },
    handleCustom: {
      alignItems: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: 'auto',
      justifyContent: 'center',
      width: 'auto',
    },
    handleDefault: {
      alignItems: 'center',
      border: `${sliderLineWidth}px solid ${sliderLineColor}`,
      borderRadius: '100%',
      boxShadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: `${handleSize}px`,
      justifyContent: 'center',
      width: `${handleSize}px`,
    },
    leftArrow: {
      border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
      borderRight: `${handleSize * 0.15}px solid ${sliderLineColor}`,
      height: '0px',
      marginLeft: `-${handleSize * 0.25}px`, // for IE11
      marginRight: `${handleSize * 0.25}px`,
      width: '0px',
    },
    rightArrow: {
      border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
      borderLeft: `${handleSize * 0.15}px solid ${sliderLineColor}`,
      height: '0px',
      marginRight: `-${handleSize * 0.25}px`, // for IE11
      width: '0px',
    },
    leftLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      left: '5%',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      top: '50%',
      transform: 'translate(0,-50%)',
      transition: 'opacity 0.1s ease-out 0.5s',
      maxWidth: '30%',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none'
    },
    rightLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      right: '5%',
      top: '50%',
      transform: 'translate(0,-50%)',
      transition: 'opacity 0.1s ease-out 0.5s',
      maxWidth: '30%',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none'
    },
  };

  return (
    <>
      {skeleton && !allImagesLoaded && (
        <div style={{ ...styles.container }}>{skeleton}</div>
      )}

      <div
        style={{
          ...styles.container,
          display: allImagesLoaded ? 'block' : 'none',
        }}
        ref={containerRef}
        data-testid="container"
      >
        <img
          onLoad={() => setRightImgLoaded(true)}
          alt={rightImageAlt}
          data-testid="right-image"
          ref={rightImageRef}
          src={rightImage}
          style={styles.rightImage}
        />
        <img
          onLoad={() => setLeftImgLoaded(true)}
          alt={leftImageAlt}
          data-testid="left-image"
          ref={leftImageRef}
          src={leftImage}
          style={styles.leftImage}
        />
        <div style={styles.slider} className={classNames({['wiggle']: wiggle})}>
          <div style={styles.line} />
          {handle ? (
            <div style={styles.handleCustom}>{handle}</div>
          ) : (
            <div style={styles.handleDefault}>
              <div style={styles.leftArrow} />
              <div style={styles.rightArrow} />
            </div>
          )}
          <div style={styles.line} />
        </div>
        {/* labels */}
        {leftImageLabel && <div style={styles.leftLabel}>{leftImageLabel}</div>}
        {rightImageLabel && (
          <div style={styles.rightLabel}>{rightImageLabel}</div>
        )}
      </div>
    </>
  );
}

ReactCompareImage.propTypes = propTypes;
ReactCompareImage.defaultProps = defaultProps;

export default ReactCompareImage;
