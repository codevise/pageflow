import React from 'react';
import classNames from 'classnames';

import styles from './ActionButton.module.css';

import pencil from './images/pencil.svg';

const icons = {
  pencil
};

export function ActionButton({icon, text, position, onClick}) {
  const Icon = icons[icon];

  return (
    <button className={classNames(styles.button, styles[`position-${position}`])}
            onClick={onClick}>
      <Icon width={15} height={15} />
      {text}
    </button>
  );
}
