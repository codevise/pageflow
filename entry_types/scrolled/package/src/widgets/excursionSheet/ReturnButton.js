import React from 'react';

import {
  ThemeIcon,
  useIsomorphicLayoutEffect,
  useI18n
} from 'pageflow-scrolled/frontend';

import {useScrollCenter} from './useScrollCenter'

import styles from './ReturnButton.module.css';

export function ReturnButton({label, onClose, children}) {
  const [wrapperRef, buttonRef] = useScrollCenter();

  useIsomorphicLayoutEffect(() => {
    const timeline = new window.ViewTimeline({
      subject: wrapperRef.current
    });

    const animation = buttonRef.current.animate(
      {
        opacity: [
          '0',
          '1'
        ],
      },
      {
        timeline,
        fill: 'both',
        rangeStart: 'entry 10%',
        rangeEnd: 'entry 50%'
      }
    );

    return () => animation.cancel();
  }, []);

  const {t} = useI18n();

  return (
    <div className={styles.wrapper}
         ref={wrapperRef}
         onClick={onClose}>
      <button className={styles.button}
           ref={buttonRef}>
        <ThemeIcon name="back" width={30} height={30} />
        {label || t('pageflow_scrolled.public.exit_excursion')}
      </button>
    </div>
  );
}
