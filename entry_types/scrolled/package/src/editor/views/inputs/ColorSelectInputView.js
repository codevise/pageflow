import React from 'react';
import classNames from 'classnames';

import styles from './ColorSelectInputView.module.css';

import {ListboxInputView} from './ListboxInputView';

export const ColorSelectInputView = ListboxInputView.extend({
  renderItem,
  renderSelectedItem: renderItem
});

function renderItem(item) {
  const swatches =
    this.options.swatches ||
    [{cssColorPropertyPrefix: '--theme-palette-color'}];

  return (
    <div className={classNames(styles.item, {[styles.blank]: !item.value})}>
      {swatches.map((swatch, index) =>
        <div key={index}
             className={styles.swatch}
             style={{'--color': `var(${swatch.cssColorPropertyPrefix}-${item.value})`}} />
      )}
      <span className={styles.text}>
        {item.text}
      </span>
    </div>
  );
}
