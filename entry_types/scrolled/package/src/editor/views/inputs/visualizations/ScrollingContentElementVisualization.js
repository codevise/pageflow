import React, {useRef} from 'react';

import {ContentElementVisualization, measureScrollTimeline} from './ContentElementVisualization';
import {useScrollAnimation} from './useScrollAnimation';

// Scrolls a miniature section along the view timeline of the content element,
// from before it enters the viewport until it has left again or until the
// offset given by scrollUntil, resting there for scrollRest before scrolling
// back. Children are rendered inside the rectangle representing the content
// element.
export function ScrollingContentElementVisualization({
  position, layout, viewportCenter,
  scrollUntil, scrollDuration, scrollRest, onScroll, children
}) {
  const scrollerRef = useRef();

  useScrollAnimation(scrollerRef, {
    scrollTop: (scroller, animationProgress) => {
      const {from, to} = measureScrollTimeline({scroller, position, until: scrollUntil});

      return from + (to - from) * animationProgress;
    },

    duration: scrollDuration,
    rest: scrollRest,
    onScroll
  });

  return (
    <ContentElementVisualization
      ref={scrollerRef}
      position={position}
      layout={layout}
      narrowBlock
      scrollRoom
      viewportCenter={viewportCenter}>
      {children}
    </ContentElementVisualization>
  );
}
