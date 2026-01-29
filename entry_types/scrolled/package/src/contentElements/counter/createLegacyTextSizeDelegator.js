const legacyTextSizes = {
  verySmall: 'xs',
  small: 'md',
  medium: 'xl',
  large: 'xxxl'
};

export function createLegacyTextSizeDelegator(model) {
  const delegator = Object.create(model);

  delegator.get = function(name) {
    const result = model.get(name);

    if (name === 'numberSize') {
      return result || legacyTextSizes[model.get('textSize')];
    }

    return result;
  };

  return delegator;
}
