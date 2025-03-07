export const scrollTimelineStub = {};

beforeEach(() => {
  scrollTimelineStub.instances = [];

  window.ScrollTimeline = function(options) {
    this.options = options;
    scrollTimelineStub.instances.push(this);
  };
});
