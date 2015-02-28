pageflow.ready = new $.Deferred(function(readyDeferred) {
  window.onload = function() {
    pageflow.browser.detectFeatures().then(function() {
      $('body').one('pagepreloaded', function() {
        readyDeferred.resolve();
      });

      $('[data-role=slideshow]').each(function() {
        pageflow.Audio.setup({
          audioFiles: pageflow.audioFiles
        });

        pageflow.Slideshow.setup({
          element: $(this),
          pages: pageflow.pages,

          beforeFirstUpdate: function() {
            $('.header').header({slideshow: pageflow.slides});
            $('.overview').overview();
            $('.multimedia_alert').multimediaAlert();

            pageflow.widgetTypes.enhance($('body'));
          }
        });
      });

      pageflow.links.setup();
    });
  };
}).promise();