pageflow.ready = new $.Deferred(function(readyDeferred) {
  window.onload = function() {
    pageflow.features.detect().then(function() {
      $('body').one('pagepreloaded', function() {
        readyDeferred.resolve();
      });

      $('[data-role=slideshow]').each(function() {
        var configurationsById = _.reduce(pageflow.pages, function(memo, page) {
          memo[page.id] = page.configuration;
          return memo;
        }, {});

        pageflow.slides = new pageflow.Slideshow($(this), configurationsById);

        $('.header').header({
          slideshow: pageflow.slides
        });
        $('.overview').overview();
        $('.multimedia_alert').multimediaAlert();

        pageflow.widgetTypes.enhance($('body'));

        pageflow.slides.update();
        pageflow.history = new pageflow.History(pageflow.slides);
      });

      pageflow.links.setup();
    });
  };
}).promise();