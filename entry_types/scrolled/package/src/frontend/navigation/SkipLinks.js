import React from 'react';

import I18n from 'i18n-js';

import styles from './SkipLinks.module.css';

export function SkipLinks() {

  function scrollDown() {
    setTimeout(() => {
      window.scrollTo(0, 50);
    }, 50);
  }

  return (
    <div id='skipLinks'>
      <a href='#goToContent' className={styles.link} onClick={scrollDown}>
        {I18n.t('pageflow_scrolled.public.navigation_skip_links.content')}
      </a>
    </div>
  );
}
