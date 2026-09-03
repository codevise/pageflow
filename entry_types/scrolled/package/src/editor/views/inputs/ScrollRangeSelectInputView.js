import React, {useRef} from 'react';
import _ from 'underscore';

import {ListboxInputView} from './ListboxInputView';
import {
  measureViewTimelineProgress,
  pinsElement
} from './visualizations/ContentElementVisualization';
import {
  ScrollingContentElementVisualization
} from './visualizations/ScrollingContentElementVisualization';
import {PlaybackProgress} from './visualizations/PlaybackProgress';

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
  const progressRef = useRef();

  return (
    <div>
      <ScrollingContentElementVisualization
        position={position}
        layout={layout}
        viewportCenter={measuresViewportCenter(item.value, position)}
        onScroll={scroller => progressRef.current.setProgress(
          measureViewTimelineProgress({scroller, position, range: item.value})
        )}>
        <PlaybackProgress ref={progressRef} />
      </ScrollingContentElementVisualization>
      {item.text}
    </div>
  );
}

// Only ranges that are measured relative to the center of the viewport
// benefit from marking it. The inFocus range measures the pinned phase
// of elements that stay in place instead.
function measuresViewportCenter(range, position) {
  return range === 'center' || (range === 'inFocus' && !pinsElement(position));
}
