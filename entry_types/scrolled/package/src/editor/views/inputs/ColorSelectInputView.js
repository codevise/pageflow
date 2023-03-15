import React from 'react';
import classNames from 'classnames';

import styles from './ColorSelectInputView.module.css';

import {ListboxInputView} from './ListboxInputView';

export const ColorSelectInputView = ListboxInputView.extend({
  renderItem,
  renderSelectedItem: renderItem
});

function renderItem(item) {
  return (
    <div className={classNames(styles.item, {[styles.blank]: !item.value})}>
      <div className={styles.swatch}
           style={{'--color': `var(--theme-palette-color-${item.value})`}} />
      {item.text}
    </div>
  );
}
