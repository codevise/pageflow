import centerLayoutStyles from 'frontend/layouts/Center.module.css';
import twoColumnLayoutStyles from 'frontend/layouts/TwoColumn.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveConstrainedContentWidth(subject) {
  const el = getElement(subject);
  const pass = !!(
    el.querySelector(`.${twoColumnLayoutStyles.constrainContentWidth}`) ||
    el.querySelector(`.${centerLayoutStyles.constrainContentWidth}`)
  );

  return {
    pass,
    message: () => pass
      ? 'expected section not to constrain content width'
      : 'expected section to constrain content width'
  };
}
