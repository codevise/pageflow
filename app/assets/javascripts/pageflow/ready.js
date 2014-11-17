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
        pageflow.history = new pageflow.History(pageflow.slides);
      });

      $('.header').header({
        slideshow: pageflow.slides
      });
      $('.overview').overview();
      $('.multimedia_alert').multimediaAlert();
      pageflow.widgetTypes.enhance($('body'));

      $("body").on('click mousedown', 'a, [tabindex]', function() {
        $(this).blur();
      });

      $("body").on('keypress', 'a, [tabindex]', function(e) {
        if (e.which == 13) {
          $(this).click();
        }
      });

      $("body").on("keyup", "a, [tabindex]", function (e) {
        e.stopPropagation();
      });

      $(".content_link").attr("href","#firstContent");
      $(".content_link").click(function(e) {
        $("#firstContent").focus();
        e.preventDefault();
        return false; }
      );
    });
  };
}).promise();