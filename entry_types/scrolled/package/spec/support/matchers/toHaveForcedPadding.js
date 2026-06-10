import styles from 'frontend/Foreground.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveForcedPadding(subject) {
  const foreground = getElement(subject).querySelector(`.${styles.Foreground}`);
  const pass = foreground.classList.contains(styles.forcePadding);

  return {
    pass,
    message: () => pass
      ? 'expected section not to have forced padding'
      : 'expected section to have forced padding'
  };
}
