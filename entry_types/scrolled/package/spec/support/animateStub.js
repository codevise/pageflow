export const animateStub = {};

beforeEach(() => {
  animateStub.current = jest.fn(() => {
    return {
      cancel() {}
    }
  });

  HTMLElement.prototype.animate = animateStub.current;
});
