import React from 'react';
import classNames from 'classnames';

import {PagerButton} from './PagerButton';

import styles from './Pager.module.css';

export function Pager({
  areas, customMargin, panZoomEnabled, hideButtons,
  activeIndex, activateArea,
  children
}) {
  return (
    <div className={classNames(styles.outer, {[styles.customMargin]: customMargin})}>
      {renderScrollButtons()}
      <div className={styles.center}>
        {children}
      </div>
    </div>
  );

  function renderScrollButtons() {
    if (!panZoomEnabled) {
      return null;
    }

    return (
      <>
        <div className={styles.left}>
          <PagerButton direction="left"
                       disabled={activeIndex === -1 || hideButtons}
                       onClick={() => {
                         if (activeIndex >= 0) {
                           activateArea(activeIndex - 1)
                         }
                       }} />
        </div>
        <div className={styles.right}>
          <PagerButton direction="right"
                       disabled={activeIndex >= areas.length || hideButtons}
                       onClick={() => {
                         if (activeIndex < areas.length) {
                           activateArea(activeIndex + 1)
                         }
                       }}/>
        </div>
      </>
    );
  }
}
