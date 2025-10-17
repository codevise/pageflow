import React, {useState, useRef} from 'react'
import classNames from 'classnames';

import styles from './Tooltip.module.css'

export function Tooltip({
  bubbleClassName,
  arrowPos,
  children,
  content,
  fixed,
  highlight,
  name,
  openOnHover,
  verticalOffset,
  horizontalOffset
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  const tooltipId = `tooltip-${name}`;

  const handleClick = () => {
    setIsOpen(prev => !prev);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setTimeout(() => buttonRef.current?.focus(), 0);
    }
  };

  const handleBlur = (event) => {
    if (isOpen && !containerRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const isControlled = !openOnHover && !fixed;

  const buttonProps = isControlled ? {
    onClick: handleClick,
    ref: buttonRef,
    'aria-expanded': isOpen,
    'aria-controls': tooltipId
  } : {};

  return (
    <div ref={containerRef}
         className={classNames(styles.container, {
           [styles.openOnHover]: openOnHover,
           [styles.fixed]: fixed
         })}
         onKeyDown={isControlled ? handleKeyDown : undefined}
         onBlur={isControlled ? handleBlur : undefined}>
      {typeof children === 'function' ? children(buttonProps) : children}
      <Bubble className={bubbleClassName}
              highlight={highlight}
              arrowPos={arrowPos}
              verticalOffset={verticalOffset}
              horizontalOffset={horizontalOffset}
              isOpen={isOpen}
              id={tooltipId}>
        {content}
      </Bubble>
    </div>
  );
}

export function Bubble({className, arrowPos, children, highlight, horizontalOffset, verticalOffset, isOpen, id}) {
  let inlineStyle = {
    marginLeft: horizontalOffset,
    marginTop: verticalOffset
  }

  return (
    <div style={inlineStyle}
         id={id}
         className={classNames(className,
                               styles.bubble,
                               {[styles.highlight]: highlight, [styles.open]: isOpen})}>
      <div style={{left: arrowPos}} className={styles.arrow} />
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  );
}

Tooltip.defaultProps = {
  arrowPos: '50%',
  fixed: false,
  openOnHover: false,
  verticalOffset: 7,
  horizontalOffset: 0
}
