import {browser} from './browser';

browser.feature('ie', function() {
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    return true;
  }
  else {
    return false;
  }
});