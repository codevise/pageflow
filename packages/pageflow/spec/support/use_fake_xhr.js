support.useFakeXhr = function(fn) {
  beforeEach(() => {
    this.server = sinon.fakeServer.create();
    this.requests = this.server.requests;
  });

  afterEach(() => {
    this.server.restore();
  });
};
