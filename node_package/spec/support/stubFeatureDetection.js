import sinon from 'sinon';

export default function stubFeatureDetection() {
  beforeEach(function() {
    window.pageflow = window.pageflow || {};
    this.browserBackup = window.pageflow.browser;

    window.pageflow.browser  = {
      has: sinon.stub().returns(false)
    };
  });

  afterEach(function () {
    window.pageflow.browser = this.browserBackup;
  });
}
