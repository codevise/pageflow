pageflow.manualStart = (function($) {
  var requiredDeferred = $.Deferred();
  var waitDeferred = $.Deferred();

  $(function() {
    if (pageflow.manualStart.enabled) {
      pageflow.delayedStart.waitFor(waitDeferred);
      requiredDeferred.resolve(waitDeferred.resolve);
    }
  });

  return {
    required: function() {
      return requiredDeferred.promise();
    }
  };
}(jQuery));
