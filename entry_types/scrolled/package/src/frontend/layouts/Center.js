import React from 'react';
import classNames from 'classnames';

import {ContentElements} from '../ContentElements';

import styles from './Center.module.css';

export default function Center(props) {
  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      <ContentElements sectionProps={props.sectionProps} items={props.items}>
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
      </ContentElements>
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }

  return (
    <div className={classNames(styles.outer)}>
      <div className={classNames(styles.item)}>
        {placeholder}
      </div>
    </div>
  )
}
