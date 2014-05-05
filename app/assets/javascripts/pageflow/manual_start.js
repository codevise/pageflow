pageflow.manualStart = (function($) {
  var requiredDeferred = $.Deferred();
  var waitDeferred = $.Deferred();

  $(function() {
    if (pageflow.manualStart.enabled) {
      requiredDeferred.resolve(waitDeferred.resolve);
    }
    else {
      waitDeferred.resolve();
    }
  });

  return {
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

    required: function() {
      return requiredDeferred.promise();
    }
  };
}(jQuery));