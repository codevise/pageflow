import foregroundStyles from 'frontend/Foreground.module.css';
import transitionStyles from 'frontend/transitions/shared.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveFadedOutForeground(subject) {
  const foreground = getElement(subject).querySelector(`.${foregroundStyles.Foreground}`);
  const pass = foreground.classList.contains(transitionStyles.fadedOut);

  return {
    pass,
    message: () => pass
      ? 'expected section foreground not to be faded out'
      : 'expected section foreground to be faded out'
  };
}
