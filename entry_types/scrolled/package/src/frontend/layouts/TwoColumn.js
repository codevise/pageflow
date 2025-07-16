import React from 'react';
import classNames from 'classnames';

import {api} from '../api';
import {ContentElements} from '../ContentElements';
import useMediaQuery from '../useMediaQuery';
import {useTheme} from '../../entryState';
import {widths, widthName} from './widths';

import styles from './TwoColumn.module.css';

export function TwoColumn(props) {
  const shouldInline = useShouldInlineSticky();

  return (
    <div className={classNames(styles.root, styles[props.align])}>
      <div className={classNames(styles.group)} key={props.align}>
        <div className={classNames(styles.box, styles.inline)}
             ref={props.contentAreaRef}
             {...TwoColumn.contentAreaProbeProps} />
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
    [widths.md]: useMediaQuery(`(max-width: ${root.twoColumnStickyBreakpoint || '950px'})`),
    [widths.lg]: useMediaQuery(`(max-width: ${root.twoColumnStickyLgBreakpoint || '1200px'})`),
    [widths.xl]: useMediaQuery(`(max-width: ${root.twoColumnStickyXlBreakpoint || '1400px'})`)
  };

  return function(width) {
    return width <= widths.md ? shouldInline[widths.md] : shouldInline[width];
  }
}

// Used in tests to render markers around groups
TwoColumn.GroupComponent = 'div';

// Used to set data-testids on probe element
TwoColumn.contentAreaProbeProps = {};

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
    let {customMargin: elementSupportsCustomMargin} =
      api.contentElementTypes.getOptions(item.type) || {};

    if (typeof elementSupportsCustomMargin === 'function') {
      elementSupportsCustomMargin = elementSupportsCustomMargin({configuration: item.props});
    }

    let width = item.width || 0;
    const position = onTheSide(item.position) && !shouldInline(width) ? item.position : 'inline';
    const customMargin = !!elementSupportsCustomMargin && width < widths.full;

    if (onTheSide(item.position) && position === 'inline' && width > widths.md) {
      width -= 1;
    }

    if (!currentGroup || previousPosition !== position ||
        (onTheSide(position) && currentBox.customMargin !== customMargin) ||
        currentBox.width !== width) {
      currentBox = null;

      if (!(onTheSide(previousPosition) && position === 'inline' && width <= widths.md)) {
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

      if (lastInlineBox && position === 'inline' && width <= widths.md && !customMargin) {
        lastInlineBox.openEnd = true;
        currentBox.openStart = true;
      }

      if (position === 'inline' && width <= widths.md && !customMargin) {
        lastInlineBox = currentBox;
      }
      else if ((position === 'inline' && width > widths.md) ||
               (customMargin && !onTheSide(position))) {
        lastInlineBox = null;
      }

      currentGroup.boxes.push(currentBox)
    }

    currentBox.items.push(item);
    return position;
  }, null);

  return groups;
}

function onTheSide(position) {
  return position === 'side' || position === 'sticky';
}

function renderPlaceholder(placeholder) {
  if (!placeholder) {
    return null;
  }

  return (
    <div className={classNames(styles.group)}>
      <div className={classNames(styles.box, styles.inline)}>
        {placeholder}
      </div>
    </div>
  )
}
