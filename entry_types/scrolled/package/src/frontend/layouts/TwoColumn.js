import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';
import {useNarrowViewport} from '../useNarrowViewport';

import styles from './TwoColumn.module.css';

function availablePositions(narrow) {
  if (narrow) {
    return ['inline', 'wide', 'full'];
  }
  else {
    return ['inline', 'sticky', 'wide', 'full'];
  }
}

const positionsSupportingCustomMargin = ['inline', 'sticky', 'wide'];

export function TwoColumn(props) {
  const narrow = useNarrowViewport();

  return (
    <div className={classNames(styles.root, styles[props.align])}>
      <div className={classNames(styles.group)} key={props.align}>
        <div className={classNames(styles.box, styles.inline)} ref={props.contentAreaRef} />
      </div>
      {renderItems(props, narrow)}
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

TwoColumn.defaultProps = {
  align: 'left'
}

// Used in tests to render markers around groups
TwoColumn.GroupComponent = 'div';

function renderItems(props, narrow) {
  return groupItemsByPosition(props.items, availablePositions(narrow)).map((group, index) =>
    <TwoColumn.GroupComponent key={index} className={classNames(styles.group, styles[`group-${group.position}`])}>
      {group.boxes.map((box, index) => renderItemGroup(props, box, index))}
    </TwoColumn.GroupComponent>
  );
}

function renderItemGroup(props, box, key) {
  if (box.items.length) {
    return (
      <div key={key} className={classNames(styles.box,
                                           styles[box.position],
                                           {[styles.customMargin]: box.customMargin})}>
        {props.children(
          <ContentElements sectionProps={props.sectionProps}
                           customMargin={box.customMargin}
                           items={box.items} />,
          {
            position: box.position,
            customMargin: box.customMargin,
            openStart: box.openStart,
            openEnd: box.openEnd
          }
        )}
      </div>
    );
      }
}

function groupItemsByPosition(items, availablePositions) {
  const groups = [];

  let lastInlineBox = null;
  let currentGroup, currentBox;

  items.reduce((previousPosition, item, index) => {
    const {customMargin: elementSupportsCustomMargin} = api.contentElementTypes.getOptions(item.type) || {};
    const position = availablePositions.includes(item.position) ? item.position : 'inline';
    const customMargin = !!elementSupportsCustomMargin && positionsSupportingCustomMargin.includes(position);

    if (!currentGroup || previousPosition !== position ||
        (position === 'sticky' && currentBox.customMargin !== customMargin)) {
      currentBox = null;

      if (!(previousPosition === 'sticky' && position === 'inline')) {
        currentGroup = {
          position,
          boxes: []
        };

        groups.push(currentGroup);
      }
    }

    if (!currentBox || currentBox.customMargin !== customMargin) {
      currentBox = {
        customMargin,
        position,
        items: []
      };

      if (lastInlineBox && position === 'inline' && !customMargin) {
        lastInlineBox.openEnd = true;
        currentBox.openStart = true;
      }

      if (position === 'inline' && !customMargin) {
        lastInlineBox = currentBox;
      }
      else if (position === 'wide' || position === 'full' ||
               (customMargin && position !== 'sticky')) {
        lastInlineBox = null;
      }

      currentGroup.boxes.push(currentBox)
    }

    currentBox.items.push(item);
    return position;
  }, null);

  return groups;
}

function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }

  return (
    <div className={classNames(styles.group)}>
      <div className={styles.inline}>
        {placeholder}
      </div>
    </div>
  )
}
