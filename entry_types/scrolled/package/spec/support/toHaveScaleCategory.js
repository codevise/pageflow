function toHaveScaleCategory(element, scaleCategory, size) {
  const className = size
    ? `typography-${scaleCategory}-${size}`
    : `typography-${scaleCategory.replace(/-/g, '')}`;
  const typographyElement = element.closest(`.${className}`);
  const pass = !!typographyElement;

  const description = size
    ? `scaleCategory '${scaleCategory}' with size '${size}'`
    : `scaleCategory '${scaleCategory}'`;

  return {
    pass,
    message: () => pass
      ? `expected element not to have ${description} on itself or ancestors`
      : `expected element to have ${description} on itself or ancestors`
  };
}

expect.extend({toHaveScaleCategory});
