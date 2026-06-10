import centerLayoutStyles from 'frontend/layouts/Center.module.css';
import twoColumnLayoutStyles from 'frontend/layouts/TwoColumn.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveAlignment(subject, alignment) {
  const el = getElement(subject);
  const pass = !!(
    el.closest(`.${centerLayoutStyles[`align-${alignment}`]}`) ||
    el.closest(`.${twoColumnLayoutStyles[`align-${alignment}`]}`)
  );

  return {
    pass,
    message: () => pass
      ? `expected element not to have alignment ${JSON.stringify(alignment)}`
      : `expected element to have alignment ${JSON.stringify(alignment)}`
  };
}
