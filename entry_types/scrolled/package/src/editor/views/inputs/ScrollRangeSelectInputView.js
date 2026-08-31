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

function measuresViewportCenter(range, position) {
  return range === 'center' || (range === 'inFocus' && !pinsElement(position));
}
