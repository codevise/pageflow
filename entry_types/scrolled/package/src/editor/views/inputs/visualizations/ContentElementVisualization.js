import React, {forwardRef} from 'react';
import classNames from 'classnames';
import {getViewTimelineProgress} from 'pageflow-scrolled/frontend';

import styles from './ContentElementVisualization.module.css';

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

// The lifecycle of a content element observes the element's own rect, no
// matter whether something pins it: It turns visible once the rect intersects
// the viewport and active once the rect crosses the center. Offsets are
// fractions of the viewport height, like the root margins of the intersection
// observers behind them.
export function measureElementTop({scroller, position}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {element} = findViewTimelineElements(scroller, position);

  return relativeRect(element, scrollerRect).top / scrollerRect.height;
}

export function measureScrollTimeline({scroller, position, until}) {
  const scrollerRect = scroller.getBoundingClientRect();
  const {subject} = findViewTimelineElements(scroller, position);
  const subjectRect = subject.getBoundingClientRect();
  const subjectTop = subjectRect.top - scrollerRect.top + scroller.scrollTop;

  // The element has completely left the viewport once its bottom edge has
  // reached the top edge of it.
  const end = until ?? -subjectRect.height / scrollerRect.height;

  return {
    from: Math.max(subjectTop - scrollerRect.height, 0),
    to: subjectTop - scrollerRect.height * end
  };
}

function findViewTimelineElements(scroller, position) {
  if (position === 'sticky') {
    const wrapper = scroller.querySelector(`.${styles.wrapper}`);

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
