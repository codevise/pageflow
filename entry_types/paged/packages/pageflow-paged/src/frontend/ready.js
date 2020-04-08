
import {browser, events} from 'pageflow/frontend';
import {Visited} from './Visited';

export const ready = new $.Deferred(function(readyDeferred) {
  var pagePreloaded = new $.Deferred(function(pagePreloadedDeferred) {
    $(document).one('pagepreloaded', pagePreloadedDeferred.resolve);
  }).promise();
  window.onload = function() {
    browser.detectFeatures().then(function() {
      Visited.setup();
      pagePreloaded.then(function() {
        readyDeferred.resolve();
        events.trigger('ready');
      });
    });
  };
}).promise();
