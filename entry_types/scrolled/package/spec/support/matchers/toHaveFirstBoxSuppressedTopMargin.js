import foregroundStyles from 'frontend/Foreground.module.css';
import boxBoundaryMarginStyles from 'frontend/foregroundBoxes/BoxBoundaryMargin.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveFirstBoxSuppressedTopMargin(subject) {
  const foreground = getElement(subject).querySelector(`.${foregroundStyles.Foreground}`);
  const pass = !!foreground.querySelector(`.${boxBoundaryMarginStyles.noTopMargin}`);

  return {
    pass,
    message: () => pass
      ? 'expected first box not to have a suppressed top margin'
      : 'expected first box to have a suppressed top margin'
  };
}
