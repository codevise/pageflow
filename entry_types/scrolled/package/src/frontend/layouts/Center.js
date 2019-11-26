import React from 'react';
import classNames from 'classnames';

import ForegroundItems from '../ForegroundItems';

import styles from './Center.module.css';

export default function Center(props) {
  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      <ForegroundItems items={props.items}
                       availablePositions={['inline', 'left', 'right', 'full']}
                       onPositionChange={props.onPositionChange}>
        {(item, child) =>
          <div key={item.index} className={classNames(styles.outer, styles[`outer-${item.position}`])}>
            <div className={classNames(styles.item, styles[`item-${item.position}`])}>
              {props.children(
                 <div className={styles[`inner-${item.position}`]}>
                  {child}
                 </div>
               )}
            </div>
          </div>}
      </ForegroundItems>
    </div>
  );
}
