// jsdom does not implement scrollIntoView. Stub it so components that
// call it (e.g. Thread auto-scrolling its highlighted state into view)
// don't blow up during render.
beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});
