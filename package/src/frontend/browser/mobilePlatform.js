import {browser} from './browser';
import {agent} from './Agent';

browser.feature('mobile platform', function() {
  return agent.matchesMobilePlatform();
});

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
  const el = document.querySelector('html');
  if(!el.classList.contains('ipad')) el.classList.add('ipad');
  if(!el.classList.contains('ios7')) el.classList.add('ios7');
}
