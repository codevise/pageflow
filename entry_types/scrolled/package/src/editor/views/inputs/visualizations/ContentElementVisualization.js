import React, {forwardRef} from 'react';
import classNames from 'classnames';
import {getViewTimelineProgress} from 'pageflow-scrolled/frontend';

import styles from './ContentElementVisualization.module.css';

// Illustrates how a content element behaves while the page scrolls,
// by rendering a miniature of the section it sits in. Children are
// rendered inside the rectangle representing the content element.
export const ContentElementVisualization = forwardRef(function ContentElementVisualization(
  {position, layout, narrowBlock, scrollRoom, viewportCenter, children}, ref
) {
  return (
    <div ref={ref}
         className={classNames(styles.visualization,
                               styles[`${position}Position`],
                               styles[`${layout}Layout`],
                               {[styles.narrowBlock]: narrowBlock,
                                [styles.scrollRoom]: scrollRoom})}
         aria-hidden="true">
      {viewportCenter && <div className={styles.viewportCenter} />}

      <div className={styles.section}>
        <div className={styles.content}>
          <TextBlock words={40} />
        </div>
        <div className={styles.group}>
          <div className={styles.wrapper}>
            <div className={styles.block}>
              {children}
            </div>
          </div>

          <div className={styles.content}>
            <TextBlock words={30} />
            <TextBlock words={40} />
          </div>
        </div>
        <div className={styles.content}>
          <TextBlock words={70} />
        </div>
      </div>
    </div>
  );
});

function TextBlock({words}) {
  return (
    <div className={styles.textBlock}>
      {Array(words).fill().map((i, index) =>
        <div key={index} className={styles.textBlockWord} />
      )}
    </div>
  );
}

// Elements are pinned inside the visualization just like they are in
// the entry, so their bounding rects can drive the same view timeline
// computations. The visualization itself acts as the viewport.
// Positions that keep the element in place while the page scrolls.
export function pinsElement(position) {
  return position === 'sticky' || position === 'standAlone';
}

export function measureViewTimelineProgress({scroller, position, range}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {subject, element} = findViewTimelineElements(scroller, position);

  return getViewTimelineProgress({
    range,
    subjectRect: relativeRect(subject, scrollerRect),
    elementRect: relativeRect(element, scrollerRect),
    viewportHeight: scrollerRect.height
  });
}

// Scroll positions of the visualization at which the element starts
// entering the viewport and at which it has completely left it again.
export function measureScrollTimeline({scroller, position}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {subject} = findViewTimelineElements(scroller, position);
  const subjectRect = subject.getBoundingClientRect();
  const subjectTop = subjectRect.top - scrollerRect.top + scroller.scrollTop;

  return {
    from: Math.max(subjectTop - scrollerRect.height, 0),
    to: subjectTop + subjectRect.height
  };
}

function findViewTimelineElements(scroller, position) {
  if (position === 'sticky') {
    const wrapper = scroller.querySelector(`.${styles.wrapper}`);

    // The group of boxes the wrapper is a child of constrains it, just
    // like in the two column layout of the entry.
    return {subject: wrapper.parentElement, element: wrapper};
  }
  else if (position === 'standAlone') {
    return {
      subject: scroller.querySelector(`.${styles.wrapper}`),
      element: scroller.querySelector(`.${styles.block}`)
    };
  }
  else {
    const block = scroller.querySelector(`.${styles.block}`);

    return {subject: block, element: block};
  }
}

function relativeRect(node, scrollerRect) {
  const {top, height} = node.getBoundingClientRect();

  return {top: top - scrollerRect.top, height};
}
