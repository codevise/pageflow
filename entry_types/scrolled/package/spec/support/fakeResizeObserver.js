export const fakeResizeObserver = {};

beforeEach(() => {
  fakeResizeObserver.contentRect = {width: 100, height: 100};

  const observe = jest.fn(function() {
    this.callback([
      {
        contentRect: fakeResizeObserver.contentRect
      }
    ]);
  })

  window.ResizeObserver = function(callback) {
    this.callback = callback;
    this.observe = observe;
    this.unobserve = function(element) {};
    this.disconnect = function() {};
  };

  fakeResizeObserver.observe = observe;
});
