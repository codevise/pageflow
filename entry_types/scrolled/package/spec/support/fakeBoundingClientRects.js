export function fakeBoundingClientRectsByClassName(rectsByClassName, {otherElements} = {}) {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function() {
    // CSS module class names consist of multiple classes when the
    // rule composes others.
    const className = Object.keys(rectsByClassName).find(
      name => name.split(' ').every(single => this.classList.contains(single))
    );

    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
      ...(className ? rectsByClassName[className] : otherElements)
    };
  });
}

export function fakeBoundingClientRectsByTestId(rectsByTestId) {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function() {
    const testId = this.getAttribute('data-testid') ||
                   this.querySelector('[data-testid]')?.getAttribute('data-testid');

    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
      ...(testId ? rectsByTestId[testId] : {})
    };
  });
}
