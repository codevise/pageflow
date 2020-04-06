import jQuery from 'jquery';

export const DelayedStart = (function($) {
  return function() {
    var waitDeferred = new $.Deferred();
    var promises = [];
    var performed = false;

    return {
      promise: function() {
        return waitDeferred.promise();
      },

      wait: function(callback) {
        var cancelled = false;

        waitDeferred.then(function() {
          if (!cancelled) {
            callback();
          }
        });

        return {
          cancel: function() {
            cancelled = true;
          }
        };
      },

      waitFor: function(callbackOrPromise) {
        if (!performed) {
          if (typeof callbackOrPromise === 'function') {
            callbackOrPromise = new $.Deferred(function(deferred) {
              callbackOrPromise(deferred.resolve);
            }).promise();
          }

          promises.push(callbackOrPromise);
        }
      },

      perform: function() {
        if (!performed) {
          performed = true;
          $.when.apply(null, promises).then(waitDeferred.resolve);
        }
      }
    };
  };
}(jQuery));

export const delayedStart = new DelayedStart();
