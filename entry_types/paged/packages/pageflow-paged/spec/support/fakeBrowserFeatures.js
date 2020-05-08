import {browser} from 'pageflow/frontend';
window.PAGEFLOW_ALLOW_FEATURE_OVERRIDES = true;
browser.on.high_bandwidth();

beforeEach(async () => {
  await browser.detectFeatures();
});
