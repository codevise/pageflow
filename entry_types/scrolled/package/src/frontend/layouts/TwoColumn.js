import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';
import useMediaQuery from '../useMediaQuery';
import {useTheme} from '../../entryState';
import {widthName} from './widthName';

import styles from './TwoColumn.module.css';

export function TwoColumn(props) {
  const shouldInline = useShouldInlineSticky();

  return (
    <div className={classNames(styles.root, styles[props.align])}>
      <div className={classNames(styles.group)} key={props.align}>
        <div className={classNames(styles.box, styles.inline)} ref={props.contentAreaRef} />
      </div>
      {renderItems(props, shouldInline)}
      {renderPlaceholder(props.placeholder)}
    </div>
  );
}

TwoColumn.defaultProps = {
  align: 'left'
}

function useShouldInlineSticky() {
  const theme = useTheme();
  const root = theme.options.properties?.root || {};

  const shouldInline = {
    0: useMediaQuery(`(max-width: ${root.twoColumnStickyBreakpoint || '950px'})`),
    1: useMediaQuery(`(max-width: ${root.twoColumnStickyLgBreakpoint || '1200px'})`),
    2: useMediaQuery(`(max-width: ${root.twoColumnStickyXlBreakpoint || '1400px'})`)
  };

  return function(width) {
    return width <= 0 ? shouldInline[0] : shouldInline[width];
  }
}

// Used in tests to render markers around groups
TwoColumn.GroupComponent = 'div';

function renderItems(props, shouldInline) {
  return groupItemsByPosition(props.items, shouldInline).map((group, index) =>
    <TwoColumn.GroupComponent key={index}
                              className={classNames(styles.group,
                                                    styles[`group-${widthName(group.width)}`])}>
      {group.boxes.map((box, index) => renderItemGroup(props, box, index))}
    </TwoColumn.GroupComponent>
  );
}

function renderItemGroup(props, box, key) {
  if (box.items.length) {

    return (
      <div key={key} className={classNames(styles.box,
                                           styles[box.position],
                                           styles[`width-${widthName(box.width)}`],
                                           {[styles.customMargin]: box.customMargin})}>
        {props.children(
          <RestrictWidth width={box.width}>
            <ContentElements sectionProps={props.sectionProps}
                             customMargin={box.customMargin}
                             items={box.items} />
          </RestrictWidth>,
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

function RestrictWidth({width, children}) {
  if (width >= 0) {
    return children;
  }
  else {
    return (
      <div className={styles[`restrict-${widthName(width)}`]}>
        {children}
      </div>
    );
  }
}

function groupItemsByPosition(items, shouldInline) {
  const groups = [];

  let lastInlineBox = null;
  let currentGroup, currentBox;

  items.reduce((previousPosition, item, index) => {
    const {customMargin: elementSupportsCustomMargin} = api.contentElementTypes.getOptions(item.type) || {};
    let width = getWidth(item);
    const position = item.position === 'sticky' && !shouldInline(width) ? 'sticky' : 'inline';
    const customMargin = !!elementSupportsCustomMargin && width < 3;

    if (item.position === 'sticky' && position === 'inline' && width > 0) {
      width -= 1;
    }

    if (!currentGroup || previousPosition !== position ||
        (position === 'sticky' && currentBox.customMargin !== customMargin) ||
        currentBox.width !== width) {
      currentBox = null;

      if (!(previousPosition === 'sticky' && position === 'inline' && width <= 0)) {
        currentGroup = {
          width,
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

function getWidth(item) {
  if (item.position === 'sticky') {
    return Math.min(Math.max(item.width || 0, -2), 2);
  }
  else {
    return item.width || 0;
  }
}
