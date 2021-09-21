import React, {useRef} from 'react';
import Measure from 'react-measure';

import {ScrollButton} from './ScrollButton';

import styles from './Scroller.module.css';

export function Scroller({children}) {
  const ref = useRef();

  return (
    <Measure scroll client innerRef={ref}>
      {({contentRect, measureRef, measure}) => (
         <>
           <ScrollButton type="start"
                         contentRect={contentRect}
                         onStep={scrollBy} />
           <ScrollButton type="end"
                         contentRect={contentRect}
                         onStep={scrollBy} />
           <div className={styles.scroller}
                ref={measureRef}
                onFocus={scrollTargetIntoView}
                onScroll={() => measure()}>
             <div className={styles.inner}>
               {children}
             </div>
           </div>
         </>
       )}
    </Measure>
  );

  function scrollBy(x) {
    // IE11 does not support scrollBy
    ref.current.scrollLeft = ref.current.scrollLeft + x;
  }

  function scrollTargetIntoView(event) {
    const targetBounds = event.target.getBoundingClientRect();
    const scrollerClipRight = ref.current.clientWidth * 0.75;
    const scrollerClipLeft = ref.current.clientWidth * 0.25;

    if (targetBounds.left < scrollerClipLeft) {
      scrollBy(targetBounds.left - scrollerClipLeft);
    }
    else if (targetBounds.right > scrollerClipRight) {
      scrollBy(targetBounds.right - scrollerClipRight);
    }
  }
}
