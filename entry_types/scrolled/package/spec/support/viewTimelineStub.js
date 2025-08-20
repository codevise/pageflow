export const viewTimelineStub = {};

beforeEach(() => {
  viewTimelineStub.instances = [];

  window.ViewTimeline = function({subject}) {
    this.subject = subject;
    viewTimelineStub.instances.push(this);
  };
});