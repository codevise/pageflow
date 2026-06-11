import styles from 'frontend/Foreground.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

const positions = {
  above: 'spaceAbove',
  below: 'spaceBelow'
};

export function toHaveRemainingSpace(subject, options = {}) {
  const foreground = getElement(subject).querySelector(`.${styles.Foreground}`);

  const mismatches = Object.keys(positions).reduce((result, position) => {
    if (position in options) {
      const actual = foreground.classList.contains(styles[positions[position]]);

      if (actual !== options[position]) {
        result.push(`${position} ${JSON.stringify(options[position])} (found ${JSON.stringify(actual)})`);
      }
    }

    return result;
  }, []);

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected remaining vertical space to have ${mismatches.join(', ')}`
        : 'expected section not to have the given remaining vertical space'
  };
}
