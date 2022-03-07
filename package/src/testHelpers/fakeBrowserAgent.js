import {browser} from 'pageflow/frontend';

const userAgents = {
  'Safari on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) '+
                      'AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0' +
                      'Mobile/14A403 Safari/602.1',
  'Safari on macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) ' +
                     'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 ' +
                     'Safari/605.1.15',
  'Chrome on Android': 'Mozilla/5.0 (Linux; Android 10) '+
                       'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106' +
                       'Mobile Safari/537.36',
  'Chrome on iPhone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)' +
                      'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75' +
                      'Mobile/14E5239e Safari/602.1',
  'Chrome on Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' +
                       '(KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
};

export function fakeBrowserAgent(name) {
  if (!userAgents[name]) {
    throw new Error(`Unknown browser ${name}.`);
  }

  return new browser.Agent(userAgents[name]);
}
