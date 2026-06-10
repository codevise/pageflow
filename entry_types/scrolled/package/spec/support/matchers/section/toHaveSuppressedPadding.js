import styles from 'frontend/Foreground.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

const sides = {
  top: 'suppressedPaddingTop',
  bottom: 'suppressedPaddingBottom'
};

export function toHaveSuppressedPadding(subject, options = {}) {
  const foreground = getElement(subject).querySelector(`.${styles.Foreground}`);

  const mismatches = Object.keys(sides).reduce((result, side) => {
    if (side in options) {
      const actual = foreground.classList.contains(styles[sides[side]]);

      if (actual !== options[side]) {
        result.push(`${side} ${JSON.stringify(options[side])} (found ${JSON.stringify(actual)})`);
      }
    }

    return result;
  }, []);

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected section padding suppression to have ${mismatches.join(', ')}`
        : 'expected section padding suppression not to match'
  };
}
