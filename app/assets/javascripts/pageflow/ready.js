pageflow.ready = new $.Deferred(function(readyDeferred) {
  var pagePreloaded = new $.Deferred(function(pagePreloadedDeferred) {
    $(document).one('pagepreloaded', pagePreloadedDeferred.resolve);
  }).promise();

  window.onload = function() {
    pageflow.browser.detectFeatures().then(function() {
      var slideshow = $('[data-role=slideshow]');
      var body = $('body');

      pageflow.Visited.setup();

      pagePreloaded.then(function() {
        readyDeferred.resolve();
        pageflow.events.trigger('ready');
      });

      slideshow.each(function() {
        pageflow.events.trigger('seed:loaded');

        pageflow.entryData = new pageflow.SeedEntryData(
          pageflow.seed
        );

        pageflow.Audio.setup({
          audioFiles: pageflow.audioFiles
        });

        pageflow.Slideshow.setup({
          element: $(this),
          pages: pageflow.pages,
          enabledFeatureNames: pageflow.enabledFeatureNames,

          beforeFirstUpdate: function() {
            $('.header').header({slideshow: pageflow.slides});
            $('.overview').overview();
            $('.multimedia_alert').multimediaAlert();

            pageflow.widgetTypes.enhance(body);
            pageflow.delayedStart.perform();
            pageflow.phoneLandscapeFullscreen();
          }
        });
      });

      pageflow.links.setup();
      pageflow.FocusOutline.setup(body);
      pageflow.nativeScrolling.preventScrollingOnEmbed(slideshow);
    });
  };
}).promise();
