import React from 'react';
import classNames from 'classnames';

import styles from './ActionButton.module.css';

import background from './images/background.svg';
import foreground from './images/foreground.svg';
import pencil from './images/pencil.svg';
import link from './images/link.svg';

const icons = {
  background,
  foreground,
  link,
  pencil
};

export function ActionButton({icon, text, position, onClick, size = 'md'}) {
  const Icon = icons[icon];
  const iconSize = size === 'md' ? 15 : 20;

  return (
    <button className={classNames(styles.button,
                                  styles[`position-${position}`],
                                  styles[`size-${size}`])}
            onClick={onClick}>
      <Icon width={iconSize} height={iconSize} />
      {text}
    </button>
  );
}
