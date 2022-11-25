import sinon from 'sinon';

export const useFakeXhr = function(getTestContext) {
  let testContext;

  beforeEach(() => {
    testContext = getTestContext ? getTestContext() : {};
    testContext.server = sinon.fakeServer.create();
    testContext.requests = testContext.server.requests;
  });

  afterEach(() => {
    testContext.server.restore();
  });
};
