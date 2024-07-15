import React, {useRef} from 'react';
import classNames from 'classnames';

import {ThemeIcon} from 'pageflow-scrolled/frontend';

import styles from './ScrollButton.module.css';

export function ScrollButton({type, contentRect, onStep}) {
  const visible = type === 'start' ? contentRect.scroll.left > 0 :
                  contentRect.scroll.width > contentRect.client.width &&
                  contentRect.scroll.left < contentRect.scroll.width - contentRect.client.width;
  const step = type === 'start' ? -100 : 100;
  const interval = useRef();

  return (
    <button className={classNames({[styles.start]: type === 'start',
                                   [styles.end]: type === 'end',
                                   [styles.visible]: visible})}
            onMouseDown={handleMouseDown}
            onKeyPress={handleKeyPress}>
      <ThemeIcon name={type === 'start' ? 'arrowLeft' : 'arrowRight'} />
    </button>
  );

  function handleMouseDown(event) {
    if (event.button === 0) {
      scrollUntilMouseUp();
    }
  }

  function scrollUntilMouseUp() {
    scrollStep();

    clearInterval(interval.current);
    interval.current = setInterval(() => scrollStep(), 400);

    document.addEventListener('mouseup', stopScrolling);

    function stopScrolling() {
      document.removeEventListener('mouseup', stopScrolling);
      clearInterval(interval.current);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      scrollStep()
    }
  }

  function scrollStep() {
    onStep(step)
  }
}
