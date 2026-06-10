import styles from 'frontend/ContentElementMargin.module.css';

import {getElement} from 'testHelpers/matchers/getElement';

export function toHaveContentElementMargin(subject, options = {}) {
  const wrapper = getElement(subject).closest(`.${styles.wrapper}`);

  if (!wrapper) {
    return {
      pass: false,
      message: () => 'expected element to have a content element margin, but found none'
    };
  }

  const mismatches = marginMismatches(wrapper, options);

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected content element margin to have ${mismatches.join(', ')}`
        : 'expected element not to have a content element margin'
  };
}

const customProperties = {
  top: '--margin-top',
  bottom: '--margin-bottom',
  prevBottom: '--prev-margin-bottom'
};

function marginMismatches(wrapper, options) {
  const mismatches = [];

  Object.keys(customProperties).forEach(name => {
    if (name in options) {
      const actual = wrapper.style.getPropertyValue(customProperties[name]);

      if (actual !== options[name]) {
        mismatches.push(`${name} ${JSON.stringify(options[name])} (found ${JSON.stringify(actual)})`);
      }
    }
  });

  if ('topTrimmed' in options) {
    const actual = wrapper.classList.contains(styles.noTopMargin);

    if (actual !== options.topTrimmed) {
      mismatches.push(`topTrimmed ${JSON.stringify(options.topTrimmed)} (found ${JSON.stringify(actual)})`);
    }
  }

  return mismatches;
}
