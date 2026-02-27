import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';

import {widths, widthName} from './widths';

import styles from './Center.module.css';

const floatedPositions = ['left', 'right'];

export function Center(props) {
  const groups = groupItems(props.items);

  return (
    <div className={classNames(styles.root)}>
      <div ref={props.contentAreaRef} />

      {groups.map((group, groupIndex) => {
        return (
          <div key={groupIndex}
               className={classNames(styles.outer,
                                     styles[`outer-${widthName(group.width)}`],
                                     {[styles.customMargin]: group.customMargin})}>
            <div className={classNames(styles.box,
                                       styles[`box-${widthName(group.width)}`])}>
              {props.children(
                <ContentElements sectionProps={props.sectionProps}
                                 items={group.items}
                                 customMargin={group.customMargin}>
                  {(item, child, itemIndex) => {
                    const alignment = group.width < 0 && item.position === 'inline' ? item.alignment : null;

                    return (
                      <div key={item.id}
                           className={classNames(styles[`selfClear-${selfClear(group.items, itemIndex)}`])}>
                        <div className={classNames(styles[`inner-${item.position}`],
                                                   styles[`inner-${widthName(item.width)}`],
                                                   styles[`align-${alignment}`],
                                                   {[styles.clear]: clearItem(group.items, itemIndex)},
                                                   {[styles[`sideBySide`]]: sideBySideFloat(group.items, itemIndex)})}>
                          {child}
                        </div>
                      </div>
                    );
                  }}
                </ContentElements>,
                boxProps(groups, groupIndex, props.isContentPadded)
              )}
            </div>
          </div>
        );
      })}
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

function groupItems(items) {
  const groups = [];
  let currentGroup;

  items.forEach(item => {
    const width = isFloated(item) ? widths.md : getWidth(item);
    const customMargin = hasCustomMargin(item);

    if (!currentGroup ||
        (currentGroup.width !== width) ||
        currentGroup.customMargin !== customMargin) {
      currentGroup = {items: [], position: 'inline', width, customMargin};
      groups.push(currentGroup);
    }

    currentGroup.items.push(item);
  });

  return groups;
}

function boxProps(groups, index, isContentPadded) {
  const group = groups[index];

  return {
    position: group.position,
    width: group.width,
    customMargin: group.customMargin,
    atSectionStart: index === 0 && !isContentPadded,
    atSectionEnd: index === groups.length - 1
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
