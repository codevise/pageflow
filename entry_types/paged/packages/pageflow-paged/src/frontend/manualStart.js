import jQuery from 'jquery';
import {delayedStart} from './delayedStart';

export const manualStart = (function($) {
  var requiredDeferred = $.Deferred();
  var waitDeferred = $.Deferred();

  $(function() {
    if (manualStart.enabled) {
      delayedStart.waitFor(waitDeferred);
      requiredDeferred.resolve(waitDeferred.resolve);
    }
  });

  return {
    required: function() {
      return requiredDeferred.promise();
    }
  };
}(jQuery));
