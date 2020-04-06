import {browser} from 'pageflow/frontend';
import {bandwidth} from './bandwidth';

browser.feature('high bandwidth', function() {
  return bandwidth().pipe(function(result) {
    var isHigh = result.speedInBps > 8000 * 1024;

    if (window.console) {
      window.console.log('Detected bandwidth ' + (result.speedInBps / 8 / 1024) + 'KB/s. High: ' + (isHigh ? 'Yes' : 'No'));
    }

    return isHigh;
  });
});