import React from 'react';

import {useI18n} from '../i18n';

import styles from './SkipLinks.module.css';

export function SkipLinks() {
  const {t} = useI18n();

  function scrollDown() {
    setTimeout(() => {
      window.scrollTo(0, 50);
    }, 50);
  }

  return (
    <div id='skipLinks'>
      <a href='#goToContent' className={styles.link} onClick={scrollDown}>
        {t('pageflow_scrolled.public.navigation_skip_links.content')}
      </a>
    </div>
  );
}
