import foregroundStyles from 'frontend/Foreground.module.css';
import transitionStyles from 'frontend/transitions/shared.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHavePerElementFadeTransition(subject) {
  const foreground = getElement(subject).querySelector(`.${foregroundStyles.Foreground}`);
  const pass = foreground.classList.contains(transitionStyles.perElementFade);

  return {
    pass,
    message: () => pass
      ? 'expected section not to use the per-element fade transition'
      : 'expected section to use the per-element fade transition'
  };
}
