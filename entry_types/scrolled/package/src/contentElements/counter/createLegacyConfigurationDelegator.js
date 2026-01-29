const legacyTextSizes = {
  verySmall: 'xs',
  small: 'md',
  medium: 'xl',
  large: 'xxxl'
};

export function createLegacyConfigurationDelegator(model) {
  const delegator = Object.create(model);

  delegator.get = function(name) {
    const result = model.get(name);

    if (name === 'numberSize') {
      return result || legacyTextSizes[model.get('textSize')];
    }

    if (name === 'countingAnimation') {
      const countingSpeed = model.get('countingSpeed');
      return result || (countingSpeed && countingSpeed !== 'none' ? 'plain' : undefined);
    }

    return result;
  };

  return delegator;
}
