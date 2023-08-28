import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';
import {useNarrowViewport} from '../useNarrowViewport';

import styles from './TwoColumn.module.css';

function availablePositions(narrow) {
  if (narrow) {
    return ['inline'];
  }
  else {
    return ['inline', 'sticky'];
  }
}

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
            width: box.width,
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
    const width = getWidth(item);
    const customMargin = !!elementSupportsCustomMargin && width < 3;

    if (!currentGroup || previousPosition !== position ||
        (position === 'sticky' && currentBox.customMargin !== customMargin) ||
        currentBox.width !== width) {
      currentBox = null;

      if (!(previousPosition === 'sticky' && position === 'inline' && width <= 0)) {
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
        width,
        items: []
      };

      if (lastInlineBox && position === 'inline' && width <= 0 && !customMargin) {
        lastInlineBox.openEnd = true;
        currentBox.openStart = true;
      }

      if (position === 'inline' && width <= 0 && !customMargin) {
        lastInlineBox = currentBox;
      }
      else if ((position === 'inline' && width > 0) ||
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

const legacyPositionWidths = {
  wide: 2,
  full: 3
}

function getWidth(item) {
  return (typeof item.props?.width === 'number') ?
         item.props.width :
         legacyPositionWidths[item.position] || 0;
}
