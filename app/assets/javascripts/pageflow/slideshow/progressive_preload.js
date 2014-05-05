pageflow.ProgressivePreload = function() {
  var run = null;

  function Run(page) {
    var cancelled = false;

    this.cancel = function() {
      cancelled = true;
    };

    this.start = function() {
      return preload(page);
    };

    function preload(page) {
      return $.when(page.page('preload')).pipe(function() {
        var nextPage = page.next('.page');
        if (!cancelled && nextPage.length) {
          return preload(nextPage);
        }
      });
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