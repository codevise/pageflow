import React from 'react';

import {ScrollButton} from './ScrollButton';

import styles from './Scroller.module.css';

export const Scroller = React.forwardRef(function Scroller(
  {areas, activeIndex, onScrollButtonClick, setStepRef, containerRect, children}, ref
) {
  return (
    <>
      <div className={styles.leftButton}>
        <ScrollButton direction="left"
                      disabled={activeIndex < 0}
                      onClick={() => onScrollButtonClick(activeIndex - 1)} />
      </div>
      <div className={styles.rightButton}>
        <ScrollButton direction="right"
                      disabled={activeIndex < 0}
                      onClick={() => onScrollButtonClick(
                        activeIndex >= areas.length - 1 ? -1 : activeIndex + 1
                      )}/>
      </div>
      <div ref={ref}
           className={styles.scroller}>
        {Array.from({length: areas.length + 2}, (_, index) =>
          <div key={index}
               ref={setStepRef(index)}
               className={styles.step} />
        )}
        <div className={styles.sticky}>
          <div style={{height: containerRect.height}}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
});
