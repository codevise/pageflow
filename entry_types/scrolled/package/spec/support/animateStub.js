export const animateStub = {};

beforeEach(() => {
  animateStub.current = jest.fn(() => {
    return {
      cancel() {}
    }
  });

  HTMLDivElement.prototype.animate = animateStub.current;
});
