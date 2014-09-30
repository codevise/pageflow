pageflow.ready = new $.Deferred(function(readyDeferred) {
  onLoadWithTimeout(function() {
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
      $('.navigation').navigation();
      $('.navigation_mobile').navigationMobile();
      $('.overview').overview();
      $('.multimedia_alert').multimediaAlert();

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
  });

  function onLoadWithTimeout(callback) {
    var invoked = false;
    var invokeOnce = function() {
      clearTimeout(timeout);

      if (!invoked) {
        callback();
        invoked = true;
      }
    };

    var iOS8 = navigator.userAgent.match(/(iPad|iPhone|iPod).*OS 8_\d/i);

    // iOS 8 fails to trigger window.onload when audio tags are present
    // on the page. Make sure we do not get stuck at the loading spinner.
    var timeout = setTimeout(invokeOnce, iOS8 ? 3000 : 10000);
    window.onload = invokeOnce;
  }
}).promise();