import React, {useRef} from 'react';
import _ from 'underscore';

import {ListboxInputView} from './ListboxInputView';
import {
  ContentElementVisualization,
  measureScrollTimeline,
  measureViewTimelineProgress,
  pinsElement
} from './visualizations/ContentElementVisualization';
import {PlaybackProgress} from './visualizations/PlaybackProgress';
import {useScrollAnimation} from './visualizations/useScrollAnimation';

import styles from './ScrollRangeSelectInputView.module.css';

export const ScrollRangeSelectInputView = ListboxInputView.extend({
  // Options are rendered when the dropdown is opened, so passing
  // position and layout as functions ensures the illustration matches
  // what the element looks like by then.
  renderItem(item) {
    return (
      <Preview item={item}
               position={_.result(this.options, 'position')}
               layout={_.result(this.options, 'sectionLayout')} />
    );
  }
});

function Preview({item, position, layout}) {
  const scrollerRef = useRef();
  const progressRef = useRef();

  useScrollAnimation(scrollerRef, {
    scrollTop: (scroller, animationProgress) => {
      const {from, to} = measureScrollTimeline({scroller, position});

      return from + (to - from) * animationProgress;
    },

    onScroll: scroller => progressRef.current.setProgress(
      measureViewTimelineProgress({scroller, position, range: item.value})
    )
  });

  return (
    <div className={styles.outer}>
      <ContentElementVisualization
        ref={scrollerRef}
        position={position}
        layout={layout}
        narrowBlock
        scrollRoom
        viewportCenter={measuresViewportCenter(item.value, position)}>
        <PlaybackProgress ref={progressRef} />
      </ContentElementVisualization>

      <div className={styles.description}>
        {item.text}
      </div>
    </div>
  );
}

// Only ranges that are measured relative to the center of the viewport
// benefit from marking it. The inFocus range measures the pinned phase
// of elements that stay in place instead.
function measuresViewportCenter(range, position) {
  return range === 'center' || (range === 'inFocus' && !pinsElement(position));
}
