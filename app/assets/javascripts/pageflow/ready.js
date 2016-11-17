pageflow.ready = new $.Deferred(function(readyDeferred) {
  window.onload = function() {
    pageflow.browser.detectFeatures().then(function() {
      var slideshow = $('[data-role=slideshow]');
      var body = $('body');

      body.one('pagepreloaded', function() {
        readyDeferred.resolve();
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
          }
        });
      });

      pageflow.links.setup();
      pageflow.FocusOutline.setup(body);
      pageflow.nativeScrolling.preventScrollingOnEmbed(slideshow);
    });
  };
}).promise();