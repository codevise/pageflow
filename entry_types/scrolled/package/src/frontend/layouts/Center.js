import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import styles from './Center.module.css';

export function Center(props) {
  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      <ContentElements sectionProps={props.sectionProps} items={props.items}>
        {(item, child, index) =>
          <div key={item.id} className={outerClassName(item)}>
            <div className={classNames(styles.item, styles[`item-${item.position}`])}>
              {props.children(
                 <div className={styles[`inner-${item.position}`]}>
                  {child}
                 </div>,
                 boxProps(props.items, item, index)
               )}
            </div>
          </div>}
      </ContentElements>
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

function outerClassName(item) {
  const {supportsWrappingAroundFloats} = api.contentElementTypes.getOptions(item.type);

  return classNames(styles.outer,
                    styles[`outer-${item.position}`],
                    {[styles.clear]: !supportsWrappingAroundFloats})
}

function boxProps(items, item, index) {
  const previous = items[index - 1];
  const next = items[index + 1];

  return {
    position: item.position,
    openStart: previous && item.position !== 'full' && previous.position !== 'full',
    openEnd: next && item.position !== 'full' && next.position !== 'full',
  }
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
