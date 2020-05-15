import {browser} from 'pageflow/frontend';

beforeEach(async () => {
  await browser.detectFeatures();
});
