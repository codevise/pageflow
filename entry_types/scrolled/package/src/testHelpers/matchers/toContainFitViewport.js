import styles from '../../frontend/FitViewport.module.css';

import {getElement} from './getElement';

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
