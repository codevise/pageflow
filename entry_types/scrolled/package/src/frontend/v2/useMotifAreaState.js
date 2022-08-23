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
  transitions, fullHeight, empty, exposeMotifArea, updateOnScrollAndResize
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
      paddingTop: getMotifAreaPadding(transitions),
      minHeight: getMotifAreaMinHeight(fullHeight, transitions),
      intersectionRatioY: getIntersectionRatioY(
        isContentPadded, motifAreaRect, contentAreaRect
      )
    },
    setMotifAreaRectRef,
    setContentAreaRef
  ];
}

function getMotifAreaPadding(transitions) {
  if (transitions[0] === 'fadeIn' || transitions[0] === 'fadeInBg') {
    return 'var(--motif-padding-fade-in)';
  }
  if (transitions[0] === 'reveal') {
    return 'var(--motif-padding-reveal)';
  }
  else {
    return 'var(--motif-padding-scroll-in)';
  }
}

function getMotifAreaMinHeight(fullHeight, transitions) {
  if (fullHeight) {
    return;
  }

  if (transitions[0] === 'reveal') {
    if (transitions[1] === 'conceal') {
      return 'var(--motif-min-height-reveal-conceal)';
    }
    else {
      return 'var(--motif-min-height-reveal)';
    }
  }
  else {
    return 'var(--motif-min-height-scroll-in)';
  }
}

function getIntersectionRatioY(isContentPadded, motifAreaRect, contentAreaRect) {
  const motifAreaOverlap = Math.max(
    0,
    Math.min(motifAreaRect.height,
             motifAreaRect.bottom - contentAreaRect.top)
  );
  return isContentPadded ? motifAreaOverlap / motifAreaRect.height : 0;
}
