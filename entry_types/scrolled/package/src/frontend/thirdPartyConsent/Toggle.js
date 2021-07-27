import React from 'react';

import styles from './Toggle.module.css';

import ToggleOnIcon from '../icons/toggleOn.svg';
import ToggleOffIcon from '../icons/toggleOff.svg';

export function Toggle({id, checked, onChange}) {
  const Icon = checked ? ToggleOnIcon : ToggleOffIcon;

  return (
    <button id={id}
            className={styles.toggle}
            role="checkbox"
            aria-checked={checked ? 'true' : 'false'}
            onClick={onChange}>
      <Icon width={50} height={35} />
    </button>
  );
}
