import isIntersectingX from '../isIntersectingX';
import useBoundingClientRect from '../useBoundingClientRect';

/**
 * Handles the state of the section layout based on the current
 * position of content and motif area. Returns an array of the form:
 *
 *     [
 *      {
 *        isContentPadded,    // true if motif and content will
 *                            // not fit side by side.
 *
 *        intersectionRatioY, // Ratio of the motif area that is
 *                            // covered by the content given the
 *                            // current scroll position if motif
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
 * @param {boolean} empty - Whether the section contains content
 *  elements.
 * @param {boolean} exposeMotifArea - Whether to pad content down if it
 *  would otherwise intersect with the motif area.
 *
 * @private
 */
export function useMotifAreaState({
  empty, exposeMotifArea, updateOnScrollAndResize
} = {}) {
  const [motifAreaRect, setMotifAreaRectRef] = useBoundingClientRect({
    updateOnScrollAndResize
  });

  const [contentAreaRect, setContentAreaRef] = useBoundingClientRect({
    updateOnScrollAndResize
  });

  const isContentPadded = exposeMotifArea &&
                          isIntersectingX(motifAreaRect, contentAreaRect) &&
                          motifAreaRect.height > 0 &&
                          !empty;

  return [
    {
      paddingTop: 0,
      isContentPadded,
      minHeight: 0,
      intersectionRatioY: getIntersectionRatioY(
        isContentPadded, motifAreaRect, contentAreaRect
      )
    },
    setMotifAreaRectRef,
    setContentAreaRef
  ];
}

function getIntersectionRatioY(isContentPadded, motifAreaRect, contentAreaRect) {
  const motifAreaOverlap = Math.max(
    0,
    Math.min(motifAreaRect.height,
             motifAreaRect.bottom - contentAreaRect.top)
  );
  return isContentPadded ? motifAreaOverlap / motifAreaRect.height : 0;
}
