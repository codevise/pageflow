import $ from 'jquery';
import {browser} from './browser';
import {agent} from './Agent';

browser.feature('mobile platform', function() {
  return agent.matchesMobilePlatform();
});

if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone) {
    $('html').addClass('ipad ios7');
}
