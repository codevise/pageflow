support.useFakeXhr = function(fn) {
  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.requests = this.server.requests;
  });

  afterEach(function() {
    this.server.restore();
  });
};
