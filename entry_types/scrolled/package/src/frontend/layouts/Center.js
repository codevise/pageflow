import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import styles from './Center.module.css';

const availablePositions = ['inline', 'left', 'right', 'wide', 'full'];
const floatedPositions = ['left', 'right'];

export function Center(props) {
  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      {props.items.map((item, index) => {
        const customMargin = hasCustomMargin(item);

        return (
          <ContentElements key={item.id} sectionProps={props.sectionProps} items={[item]} customMargin={customMargin}>
            {(item, child) =>
              <div key={item.id} className={outerClassName(props.items, index)}>
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

function outerClassName(items, index) {
  const item = items[index];

  return classNames(
    styles.outer,
    styles[`outer-${item.position}`],
    {[styles.customMargin]: hasCustomMargin(item)},
    {[styles.clear]: clearItem(items, index)}
  );
}

function boxProps(items, item, index) {
  const previous = items[index - 1];
  const next = items[index + 1];
  const customMargin = hasCustomMargin(item);

  return {
    position: item.position,
    customMargin,
    selfClear: selfClear(items, index),
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

function selfClear(items, index) {
  const item = items[index];
  const next = items[index + 1];

  if (supportsWrappingAroundFloats(item) ||
      (isFloated(item) && (!next || clearItem(items, index + 1)))) {
    return 'both';
  }
  else if (isFloated(item)) {
    return item.position === 'left' ? 'right' : 'left';
  }

  return 'none';
}

function clearItem(items, index) {
  return supportsWrappingAroundFloats(items[index]) ?
         followsSideBySideElements(items, index) :
         !isFloatedFollowingOppositeFloated(items, index)
}

function followsSideBySideElements(items, index) {
  return index > 1 && (
    (items[index - 1].position === 'left' && items[index - 2].position === 'right') ||
    (items[index - 1].position === 'right' && items[index - 2].position === 'left')
  );
}

function isFloatedFollowingOppositeFloated(items, index) {
  return index > 0 &&
         isFloated(items[index]) &&
         isFloated(items[index - 1]) &&
         items[index].position !== items[index - 1].position;
}

function isFloated(item) {
  return floatedPositions.includes(item.position);
}

function supportsWrappingAroundFloats(item) {
  const {supportsWrappingAroundFloats} = api.contentElementTypes.getOptions(item.type);
  return supportsWrappingAroundFloats;
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
