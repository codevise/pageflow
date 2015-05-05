pageflow.ProgressivePreload = function() {
  var run = null;

  function Run(page) {
    var cancelled = false;

    this.cancel = function() {
      cancelled = true;
    };

    this.start = function() {
      preload(page, 0);
    };

    function preload(page) {
      $.when(page.page('preload'), tick()).then(function() {
        var nextPage = page.next('.page');
        if (!cancelled && nextPage.length) {
          preload(nextPage);
        }
      });
    }

    // prevent stack level from becoming to deep
    function tick() {
      return new $.Deferred(function(deferred) {
        setTimeout(function() {
          deferred.resolve();
        }, 1);
      }).promise();
    }
  }

  this.start = function(page) {
    if (run) {
      run.cancel();
    }

    run = new Run(page);
    run.start();
  };
};