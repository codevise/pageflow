import React, {useEffect, useRef} from 'react';
import classNames from 'classnames';

import {
  useI18n,
  useTheme
} from 'pageflow-scrolled/frontend';

import styles from './PaginationIndicator.module.css';

export function PaginationIndicator({
  itemCount, currentIndex,
  scrollerRef,
  navAriaLabelTranslationKey, itemAriaLabelTranslationKey,
  onItemClick
}) {
  const {t} = useI18n();
  const navRef = useRef();
  const theme = useTheme();

  const currentItemFlex = theme.options.properties.root.paginationIndicatorCurrentItemFlex || 3;

  useEffect(() => {
    if (!(currentItemFlex > 1)) {
      return;
    }

    const timeline = new window.ScrollTimeline({
      source: scrollerRef.current,
      axis: 'inline'
    });

    const animations = [...navRef.current.children].map((element, index) => {
      const start = 1 / Math.max(itemCount - 1, 1) * (index - 1);
      const end = 1 / Math.max(itemCount - 1, 1) * (index + 1);

      return element.animate(
        [
          (start >= 0) && {flex: 1, offset: start},
          {flex: currentItemFlex},
          (end <= 1) && {flex: 1, offset: end}
        ].filter(Boolean),
        {
          easing: 'linear',
          timeline
        }
      )
    });

    return () => animations.forEach(animation => animation.cancel());
  }, [currentItemFlex, scrollerRef, itemCount])

  return (
    <nav ref={navRef}
         className={styles.nav}
         aria-label={t(navAriaLabelTranslationKey)}
         style={{aspectRatio: `${itemCount + 2} / 1`}}>
      {Array(itemCount).fill().map((_, index) =>
        <button key={index}
                className={classNames(styles.item, {[styles.current]: index === currentIndex})}
                aria-label={t(itemAriaLabelTranslationKey, {index})}
                aria-current={index === currentIndex}
                onClick={() => onItemClick(index)} />
      )}
    </nav>
  );
}
