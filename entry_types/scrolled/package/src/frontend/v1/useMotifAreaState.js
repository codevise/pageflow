import {useCallback, useState, useEffect} from 'react';

import isIntersectingX from '../isIntersectingX';
import useBoundingClientRect from '../useBoundingClientRect';
import useDimension from '../useDimension';

/**
 * Handles the state of the section layout based on the current
 * position of content and motif area. Returns an array of the form:
 *
 *     [
 *      {
 *        isContentPadded,    // true if motif and content will
 *                            // not fit side by side.
 *
 *        isMotifIntersected, // true if either section content or
 *                            // or content from the next section
 *                            // entering with a fadeBg transition
 *                            // overlaps the motif. Used to hide
 *                            // interactive parts (e.g., player
 *                            // controls) of backdrop content
 *                            // elements.
 *
 *        intersectionRatioY, // Ratio of the motif area that is
 *                            // covered by the content given the
 *                            // current scroll position of motif
 *                            // is exposed.
 *
 *        paddingTop,         // Distance to shift down the content
 *                            // to ensure the motif area can be
 *                            // seen when entering the section.
 *
 *        minHeight,          // Min Height of the section to ensure
 *                            // the motif area can be seen.
 *      },
 *      setMotifAreaRectRef,  // Assign motif area element that shall be
 *                            // measured.
 *
 *      setContentAreaRef     // Assign content area element that
 *                            // shall be measured.
 *     ]
 *
 * @param {Object} options
 * @param {boolean} backdropContentElement - Whether the section has a
 *   backdrop content element.
 * @param {string[]} transitions - Names of the section's enter and exit
 *   transitions.
 * @param {boolean} fullHeight - Whether the section has full or dynamic
 *   height.
 * @param {boolean} empty - Whether the section contains content
 *  elements.
 * @param {boolean} exposeMotifArea - Whether to pad content down if it
 *  would otherwise intersect with the motif area.
 *
 * @private
 */
export function useMotifAreaState({
  backdropContentElement, transitions, fullHeight, empty, exposeMotifArea, updateOnScrollAndResize
} = {}) {
  const [motifAreaRect, setMotifAreaRectRef] = useBoundingClientRect({updateOnScrollAndResize});
  const [motifAreaDimension, setMotifAreaDimensionRef] = useDimension();
  const [isPadded, setIsPadded] = useState(false);

  const setMotifAreaRef = useCallback(node => {
    setMotifAreaRectRef(node);
    setMotifAreaDimensionRef(node);
  }, [setMotifAreaRectRef, setMotifAreaDimensionRef]);

  const [contentAreaRect, setContentAreaRef] = useBoundingClientRect({
    updateOnScrollAndResize,
    dependencies: [isPadded]
  });

  const contentRequiresPadding =
    exposeMotifArea &&
    isIntersectingX(motifAreaRect, contentAreaRect) &&
    motifAreaRect.height > 0 &&
    !empty;

  const paddingTop = getMotifAreaPadding(
    contentRequiresPadding,
    transitions,
    motifAreaDimension,
    backdropContentElement,
    empty
  );

  // Force measuring content area again since applying the padding
  // changes the intersection ratio.
  const willBePadded = !!paddingTop;

  useEffect(() => {
    setIsPadded(willBePadded);
  }, [willBePadded]);

  const intersectionRatioY = getIntersectionRatioY(motifAreaRect, contentAreaRect);

  return [
    {
      paddingTop,
      isContentPadded: contentRequiresPadding || backdropContentElement,
      minHeight: getMotifAreaMinHeight(fullHeight, transitions, motifAreaDimension),
      intersectionRatioY: contentRequiresPadding ? intersectionRatioY : 0,
      isMotifIntersected: getIsMotifIntersected(empty, transitions, intersectionRatioY)
    },
    setMotifAreaRef,
    setContentAreaRef
  ];
}

function getMotifAreaPadding(
  contentRequiresPadding, transitions, motifAreaDimension, backdropContentElement, empty
) {
  if (backdropContentElement) {
    if (transitions[0] === 'fadeIn' || (empty && transitions[1] === 'fadeOut')) {
      return '70vh';
    }
    else {
      return '110vh';
    }
  }
  else if (!contentRequiresPadding) {
    return;
  }

  if (transitions[0] === 'fadeIn' || transitions[0] === 'fadeInBg') {
    // Once the section has become active, the backdrop becomes
    // visible all at once. Motif area aware background positioning
    // ensures that the motif area is within the viewport. Still, when
    // scrolling fast, the top of the section will already have
    // reached the top of the viewport once the fade transitions ends.
    //
    // If the motif area is at the top of the backdrop, adding its
    // height as padding is enough to ensure that the content does not
    // immediately start intersecting.
    //
    // If the motif area is at the bottom of the backdrop, additional
    // padding is needed to prevent the content from hiding the motif
    // right at the start. Adding the full top distance of the motif
    // area, though, means a full viewport height has to be scrolled
    // by after the content of the previous section has been faded out
    // before the content of the section enters the viewport.
    // Subjectively, this feels like to little feedback that more
    // content is coming. We therefore reduce the additional distance
    // by a third.
    return motifAreaDimension.top * 2 / 3 + motifAreaDimension.height
  }
  if (transitions[0] === 'reveal') {
    // The backdrop remains in a fixed position while the content is
    // being scrolled in. Shifting the content down by the height of
    // the motif area means the motif area will be completely visible
    // when the top of the section aligns with the top of the motif
    // area.
    //
    // For exit transition `scrollOut`, the min height determined
    // below, ensures that the top of the section can actually reach
    // that position before the section begins to scroll.
    return motifAreaDimension.height
  }
  else {
    // In the remaining `scrollIn` case, content and backdrop move in
    // together. We need to shift content down below the motif.
    return motifAreaDimension.top + motifAreaDimension.height
  }
}

function getMotifAreaMinHeight(fullHeight, transitions, motifAreaDimension) {
  if (fullHeight) {
    return;
  }

  if (transitions[0] === 'reveal') {
    if (transitions[1] === 'conceal') {
      // Ensure section is tall enough to reveal the full height of
      // the motif area once the section passes it.
      return motifAreaDimension.height;
    }
    else {
      // Ensure backdrop can be revealed far enough before the section
      // starts scrolling.
      return motifAreaDimension.bottom + motifAreaDimension.height;
    }
  }
  else {
    // Ensure motif is visible in scrolled in section.
    return motifAreaDimension.top + motifAreaDimension.height;
  }
}

function getIntersectionRatioY(motifAreaRect, contentAreaRect) {
  const motifAreaOverlap = Math.max(
    0,
    Math.min(motifAreaRect.height,
             motifAreaRect.bottom - contentAreaRect.top)
  );
  return motifAreaRect.height > 0 ? motifAreaOverlap / motifAreaRect.height : 0;
}

function getIsMotifIntersected(empty, transitions, intersectionRatioY) {
  // Hide interactive parts of backdrop content elements (e.g., player
  // controls) if:
  // - section has content and it has been scrolled to overlap or
  // - next section enters with fadeOutBg making it contents potentially
  //   overlap the motif area
  return !empty || transitions[1] === 'fadeOutBg' ? intersectionRatioY > 0 : false
}
