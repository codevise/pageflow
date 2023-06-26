import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import styles from './Center.module.css';

const availablePositions = ['inline', 'left', 'right', 'wide', 'full'];

export function Center(props) {
  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      {props.items.map((item, index) => {
        const customMargin = hasCustomMargin(item);

        return (
          <ContentElements key={item.id} sectionProps={props.sectionProps} items={[item]} customMargin={customMargin}>
            {(item, child) =>
              <div key={item.id} className={outerClassName(item, customMargin)}>
                <div className={classNames(styles.item, styles[`item-${item.position}`])}>
                  {props.children(
                    <div className={styles[`inner-${item.position}`]}>
                      {child}
                    </div>,
                    boxProps(props.items, item, index)
                  )}
                </div>
              </div>
            }
          </ContentElements>
        );
      })}
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

function outerClassName(item, customMargin) {
  const {supportsWrappingAroundFloats} = api.contentElementTypes.getOptions(item.type);

  return classNames(styles.outer,
                    styles[`outer-${item.position}`],
                    {[styles.customMargin]: customMargin},
                    {[styles.clear]: !supportsWrappingAroundFloats})
}

function boxProps(items, item, index) {
  const previous = items[index - 1];
  const next = items[index + 1];
  const customMargin = hasCustomMargin(item);

  return {
    position: item.position,
    customMargin,
    openStart: previous &&
               !customMargin &&
               !hasCustomMargin(previous) &&
               item.position !== 'full' && previous.position !== 'full' &&
               item.position !== 'wide' && previous.position !== 'wide',
    openEnd: next &&
             !customMargin &&
             !hasCustomMargin(next) &&
             item.position !== 'full' && next.position !== 'full' &&
             item.position !== 'wide' && next.position !== 'wide',
  }
}

function hasCustomMargin(item) {
  const position = availablePositions.includes(item.position) ? item.position : 'inline';
  const {customMargin: elementSupportsCustomMargin} = api.contentElementTypes.getOptions(item.type) || {};
  return !!elementSupportsCustomMargin && (position === 'inline' || position === 'wide');
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
