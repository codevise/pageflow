import sinon from 'sinon';

export default function stubFeatureDetection() {
  beforeEach(() => {
    window.pageflow = window.pageflow || {};
    this.browserBackup = window.pageflow.browser;

    window.pageflow.browser  = {
      has: sinon.stub().returns(false)
    };
  });

  afterEach(() => {
    window.pageflow.browser = this.browserBackup;
  });
}
