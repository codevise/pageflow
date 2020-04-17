import sinon from 'sinon';

export const useFakeXhr = function(getTestContext) {
  beforeEach(() => {
    const testContext = getTestContext();
    testContext.server = sinon.fakeServer.create();
    testContext.requests = testContext.server.requests;
  });

  afterEach(() => {
    getTestContext().server.restore();
  });
};
