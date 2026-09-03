import React, {useRef} from 'react';
import _ from 'underscore';

import {ListboxInputView} from './ListboxInputView';
import {measureElementTop} from './visualizations/ContentElementVisualization';
import {
  ScrollingContentElementVisualization
} from './visualizations/ScrollingContentElementVisualization';
import {PlaybackProgress} from './visualizations/PlaybackProgress';

// Offsets of the element's top edge at which the lifecycle of a content
// element considers it visible respectively active.
const startOffsets = {onVisible: 1, onActivate: 0.5};

// Stop scrolling just past the offset of the option that starts last, so both
// animations play out near a turning point of the scroll animation, where the
// element barely moves.
const scrollEndOffset = 0.4;

// Since the sweep covers less than a viewport height, the duration a whole
// view timeline takes would make it crawl.
const scrollDuration = 1500;

// Long enough to tell a filling bar apart from a step. The scroll animation
// rests just as long at its end, so the animation triggered at the viewport
// center has played before the element scrolls back out.
const playbackDuration = 1000;

export const PlaybackStartSelectInputView = ListboxInputView.extend({
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

  const onScroll = usePlayback(progressRef, {
    position,
    startOffset: startOffsets[item.value]
  });

  return (
    <div>
      <ScrollingContentElementVisualization
        position={position}
        layout={layout}
        viewportCenter={item.value === 'onActivate'}
        scrollUntil={scrollEndOffset}
        scrollDuration={scrollDuration}
        scrollRest={playbackDuration}
        onScroll={onScroll}>
        <PlaybackProgress ref={progressRef} />
      </ScrollingContentElementVisualization>
      {item.text}
    </div>
  );
}

function usePlayback(progressRef, {position, startOffset}) {
  const startedAtRef = useRef();

  return scroller => {
    const elementTop = measureElementTop({scroller, position});

    // Start over once the element is back below the viewport, so the looping
    // illustration demonstrates the start of playback again.
    if (elementTop >= 1) {
      startedAtRef.current = null;
    }
    else if (!startedAtRef.current && elementTop <= startOffset) {
      startedAtRef.current = new Date().getTime();
    }

    progressRef.current.setProgress(playbackProgress(startedAtRef.current));
  };
}

// An animation that is played once runs at its own pace, so progress follows
// the time elapsed since playback started.
function playbackProgress(startedAt) {
  if (!startedAt) {
    return 0;
  }

  return Math.min((new Date().getTime() - startedAt) / playbackDuration, 1);
}
