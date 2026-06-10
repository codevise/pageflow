import styles from '../../frontend/FitViewport.module.css';

import {getElement} from './getElement';

/**
 * Assert that the subject contains a `FitViewport` and, optionally, that
 * it has a specific aspect ratio. Registered via
 * {@link useContentElementMatchers}.
 *
 * The subject is a DOM element, e.g. the `container` returned by
 * {@link renderInContentElement}. Negate with `.not` to assert that no
 * `FitViewport` is present.
 *
 * @param {Object} [options]
 * @param {string} [options.aspectRatio] -
 *   Expected aspect ratio: a theme scale name (e.g. `'square'`) or a raw
 *   ratio value (e.g. `'0.75'`).
 *
 * @example
 * expect(container).toContainFitViewport();
 * expect(container).toContainFitViewport({aspectRatio: 'square'});
 */
export function toContainFitViewport(subject, {aspectRatio} = {}) {
  const container = getElement(subject).querySelector(`.${styles.container}`);

  if (!container) {
    return {
      pass: false,
      message: () => 'expected element to contain a FitViewport, but found none'
    };
  }

  if (aspectRatio !== undefined) {
    const actual = getAspectRatio(container);

    if (actual !== aspectRatio) {
      return {
        pass: false,
        message: () =>
          `expected FitViewport to have aspect ratio ${JSON.stringify(aspectRatio)} ` +
          `(found ${JSON.stringify(actual)})`
      };
    }
  }

  return {
    pass: true,
    message: () => 'expected element not to contain a FitViewport'
  };
}

function getAspectRatio(container) {
  const cssValue = container.style.getPropertyValue('--fit-viewport-aspect-ratio');
  const match = cssValue.match(/var\(--theme-aspect-ratio-(.+)\)/);
  return match ? match[1] : cssValue;
}
