import React from 'react'
import classNames from 'classnames';

import styles from './Tooltip.module.css'

export function Tooltip({
  bubbleClassName,
  arrowPos,
  children,
  content,
  fixed,
  highlight,
  openOnHover,
  verticalOffset,
  horizontalOffset
}) {
  return (
    <div className={classNames(styles.container, {[styles.openOnHover]: openOnHover, [styles.fixed]: fixed})}
         onClick={fixFocusHandlingSafari}>
      {children}
      <Bubble className={bubbleClassName}
              highlight={highlight}
              arrowPos={arrowPos}
              verticalOffset={verticalOffset}
              horizontalOffset={horizontalOffset}>
        {content}
      </Bubble>
    </div>
  );
}

export function Bubble({className, arrowPos, children, highlight, horizontalOffset, verticalOffset}) {
  let inlineStyle = {
    marginLeft: horizontalOffset,
    marginTop: verticalOffset
  }

  // Negative tabIndex ensures element can take focus but does not
  // come up in tab order. This ensures the tooltip stays expanded
  // when text in the legal info menu is selected.
  return (
    <div style={inlineStyle}
         tabIndex="-1"
         className={classNames(className,
                               styles.bubble,
                               {[styles.highlight]: highlight})}>
      <div style={{left: arrowPos}} className={styles.arrow} />
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  );
}

// Safari does not focus buttons after they are clicked [1]. Focus
// manually to ensure `focus-within` selector that opens the tooltip
// applies.
//
// [1] https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
function fixFocusHandlingSafari(event) {
  if (!event.target.closest) {
    // IE does not support closest, but also does not need this fix.
    return
  }

  const button = event.target.closest('button');

  if (button) {
    button.focus();
  }
}

Tooltip.defaultProps = {
  arrowPos: '50%',
  fixed: false,
  openOnHover: false,
  verticalOffset: 7,
  horizontalOffset: 0
}
