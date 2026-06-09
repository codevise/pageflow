import styles from '../../frontend/ContentElementBox.module.css';

import {getElement} from './getElement';

export function toContainContentElementBox(subject, options = {}) {
  const wrapper = getElement(subject).querySelector(`.${styles.wrapper}`);

  if (!wrapper) {
    return {
      pass: false,
      message: () => 'expected element to contain a content element box, but found none'
    };
  }

  const mismatches = boxPropertyMismatches(wrapper, options);

  return {
    pass: mismatches.length === 0,
    message: () =>
      mismatches.length
        ? `expected content element box to have ${mismatches.join(', ')}`
        : `expected element not to contain a content element box${describeOptions(options)}`
  };
}

const boxProperties = {
  boxShadow: {
    customProperty: '--content-element-box-shadow',
    expectedValue: value => `var(--theme-content-element-box-shadow-${value})`
  },
  borderRadius: {
    customProperty: '--content-element-box-border-radius',
    expectedValue: value => `var(--theme-content-element-box-border-radius-${value})`
  },
  outlineColor: {
    customProperty: '--content-element-box-outline-color',
    expectedValue: value => value
  }
};

function boxPropertyMismatches(wrapper, options) {
  return Object.keys(options).reduce((mismatches, name) => {
    const property = boxProperties[name];

    if (property) {
      const expected = property.expectedValue(options[name]);
      const actual = wrapper.style.getPropertyValue(property.customProperty);

      if (actual !== expected) {
        mismatches.push(`${name} ${JSON.stringify(options[name])} (found ${JSON.stringify(actual)})`);
      }
    }

    return mismatches;
  }, []);
}

function describeOptions(options) {
  const names = Object.keys(options).filter(name => boxProperties[name]);
  return names.length ? ` with ${names.join(', ')}` : '';
}
