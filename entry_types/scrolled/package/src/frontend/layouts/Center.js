import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import {widths, widthName} from './widths';

import styles from './Center.module.css';

const floatedPositions = ['left', 'right'];

export function Center(props) {

  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />
      {props.items.map((item, index) => {
        const customMargin = hasCustomMargin(item);
        const position = item.position;
        const width = getWidth(item);
        const alignment = width < 0 && item.position === 'inline' ? item.alignment : null;

        return (
          <ContentElements key={item.id} sectionProps={props.sectionProps} items={[item]} customMargin={customMargin}>
            {(item, child) =>
              <div key={item.id} className={outerClassName(props.items, index)}>
                <div className={classNames(styles.item,
                                           styles[`item-${position}-${widthName(width)}`])}>
                  {props.children(
                    <div className={classNames(styles[`inner-${item.position}`],
                                               styles[`inner-${widthName(width)}`],
                                               styles[`align-${alignment}`],
                                               {[styles[`sideBySide`]]: sideBySideFloat(props.items, index)})}>
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
    styles[`outer-${widthName(getWidth(item))}`],
    {[styles.customMargin]: hasCustomMargin(item)},
    {[styles.clear]: clearItem(items, index)}
  );
}

function boxProps(items, item, index) {
  const previous = items[index - 1];
  const next = items[index + 1];
  const customMargin = hasCustomMargin(item);
  const width = getWidth(item);

  return {
    position: item.position,
    width,
    customMargin,
    selfClear: selfClear(items, index),
    openStart: previous &&
               !customMargin &&
               !hasCustomMargin(previous) &&
               !isWideOrFull(item) && !isWideOrFull(previous),
    openEnd: next &&
             !customMargin &&
             !hasCustomMargin(next) &&
             !isWideOrFull(item) && !isWideOrFull(next),
    atSectionStart: index === 0,
    atSectionEnd: index === items.length - 1
  }
}

function isWideOrFull(item) {
  return item.position === 'inline' && getWidth(item) > widths.md;
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

function sideBySideFloat(items, index) {
  return isFloatedFollowingOppositeFloated(items, index) ||
         isFloatedFollowedByOppositeFloated(items, index);
}

function isFloatedFollowingOppositeFloated(items, index) {
  return index > 0 &&
         isFloated(items[index]) &&
         isFloated(items[index - 1]) &&
         items[index].position !== items[index - 1].position;
}

function isFloatedFollowedByOppositeFloated(items, index) {
  return index < items.length - 1 &&
         isFloated(items[index]) &&
         isFloated(items[index + 1]) &&
         items[index].position !== items[index + 1].position;
}

function isFloated(item) {
  return floatedPositions.includes(item.position);
}

function supportsWrappingAroundFloats(item) {
  const {supportsWrappingAroundFloats} = api.contentElementTypes.getOptions(item.type);
  return supportsWrappingAroundFloats;
}

function hasCustomMargin(item) {
  const position = item.position;
  let {customMargin: elementSupportsCustomMargin} =
    api.contentElementTypes.getOptions(item.type) || {};

  if (typeof elementSupportsCustomMargin === 'function') {
    elementSupportsCustomMargin = elementSupportsCustomMargin({configuration: item.props});
  }

  return !!(elementSupportsCustomMargin &&
            position === 'inline' &&
            getWidth(item) < widths.full);
}

function getWidth(item) {
  return item.width || widths.md;
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
