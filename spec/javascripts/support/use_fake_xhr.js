support.useFakeXhr = function(fn) {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function(request) {
      requests.push(request);
    };
  });

  afterEach(function() {
    this.xhr.restore();
  });
};