import styles from 'frontend/ContentElementScrollSpace.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveScrollSpace(subject) {
  const pass = !!getElement(subject).closest(`.${styles.wrapper}`);

  return {
    pass,
    message: () => pass
      ? 'expected element not to have scroll space'
      : 'expected element to have scroll space'
  };
}
