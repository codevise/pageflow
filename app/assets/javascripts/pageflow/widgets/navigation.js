/*global IScroll*/

(function($) {
  $.widget('pageflow.navigation', {
    _create: function() {
      var overlays = this.element.find('.navigation_site_detail'),
          that = this,
          toggleIndicators = function() {};

      this.element.addClass('js').append(overlays);

      $('a.navigation_top', this.element).topButton();

      $('.navigation_bar_bottom', this.element)
        .append($('.navigation_bar_top > li', this.element).slice(3));

      /* Volume */

      var handlingVolume = false;
      var volumeBeforeMute = 1;
      var muteButton = $('.navigation_bg.navigation_mute', that.element);

      var changeVolume = function(event) {
        var volume = (event.pageX - $('.volume-slider', that.element).offset().left) / $(('.volume-slider')).width();
        if (volume > 1) { volume = 1; }
        if (volume < 0) { volume = 0; }
        setVolume(volume);
      };

      var setVolume = function(volume) {
        $('.volume-level', that.element).css({width: volume * 100 + "%"});
        pageflow.settings.set('volume', volume);

        if (volume === 0) {
          muteButton
            .attr('title', muteButton.attr('data-muted-title'))
            .addClass('muted');
        }
        else {
          muteButton
            .attr('title', muteButton.attr('data-not-muted-title'))
            .removeClass('muted');
        }
      };

      var toggleMute = function () {
        if (pageflow.settings.get('volume') > 0) {
          volumeBeforeMute = pageflow.settings.get('volume');
          setVolume(0);
        }
        else {
          setVolume(volumeBeforeMute);
        }
      };

      muteButton.on("click", function() {
        toggleMute();
      });

      $('.volume-level', this.element).css({
        width: pageflow.settings.get("volume") * 100 + "%"
      });

      $('.navigation_volume_box', this.element).on("mousedown", function(event) {
        handlingVolume = true;
        changeVolume(event);
      });

      $('.navigation_volume_box', this.element).on("mousemove", function(event) {
        if(handlingVolume) {
          changeVolume(event);
        }
      });

      setVolume(pageflow.settings.get('volume'));

      /* hide volume button on mobile devices */
      if (pageflow.features.has('mobile platform')) {
        $('li.mute', this.element).hide();
        $('.navigation_bar_bottom', this.element).css('height', '224px');
        $('.scroller', this.element).css('bottom', '224px');
        $('.scroll_indicator.bottom', this.element).css('bottom', '190px');
      }

      /* header button */
      $('.navigation_main', this.element).click(function() {
        $(this)
          .toggleClass('active')
          .updateTitle();
        $('.header').toggleClass('active');
      });

      /* open header through skiplinks */
      $('a[href="#header"], a[href="#search"]', '#skipLinks').click(function() {
        $('.navigation_main', that.element).addClass('active');
        $('.header').addClass('active');
        $(this.getAttribute('href')).select();
      });

      /* share-button */
      $('.navigation_menu .navigation_menu_box a', this.element).focus(function() {
        $(this).parent().parent().addClass('focused');
      }).blur(function() {
        $(this).parent().parent().removeClass('focused');
      });

      /* pages */
      var pageLinks = $('.navigation_thumbnails a', that.element),
        target;

      function registerHandler() {
        target = $(this);
        target.one('mouseup touchend', goToPage);
      }

      function removeHandler() {
        pageLinks.off('mouseup touchend', goToPage);
      }

      function closeOverview() {
        $('.overview').removeClass("active");
        $('.navigation_index', that.element).removeClass("active");
      }

      function hideOverlay() {
        $(overlays).addClass('hidden').removeClass('visible');
      }

      function goToPage(e) {
        if (target && target[0] != e.currentTarget) {
          return;
        }
        hideOverlay();
        closeOverview();
        $('.page .content, .scroll_indicator').removeClass('hidden');
        pageflow.slides.goToById(this.getAttribute("data-link"));
        e.preventDefault();
      }

      pageLinks.each(function(index) {
        var handlerIn = function() {
          if (!('ontouchstart' in document.documentElement)) {
            $(overlays[index]).css("top", $(this).offset().top).addClass('visible').removeClass('hidden');
          }
        };

        $(this).on({
          'mouseenter': handlerIn,
          'mouseleave': hideOverlay,
          'mousedown touchstart': registerHandler,
          'click': goToPage
        });
      });

      $(window).on('resize', function () {
        $(overlays).css("top","0");
        initiateIndicators();
      });

      var initiateIndicators = function() {
        setTimeout(function() {
          $('.scroll_indicator', that.element).show();
          toggleIndicators();
        }, 500);
      };

      $('.scroller', this.element).each(function () {
        var bottomIndicator = $('.scroll_indicator.bottom', that.element),
          topIndicator = $('.scroll_indicator.top', that.element),
          scrollUpIntervalID, scrollDownIntervalID,
          hideOverlay = function () {
            overlays.addClass('hidden').removeClass('visible');
          };

        var atBoundary = function (direction) {
          if (direction === 'up') {
            return (scroller.y >= 0);
          }
          else {
            return (scroller.y <= scroller.maxScrollY);
          }
        };

        toggleIndicators = function () {
          if (atBoundary('down')) {
            clearInterval(scrollDownIntervalID);
            bottomIndicator.hide().removeClass('pressed');
          }
          if (atBoundary('up')) {
            clearInterval(scrollUpIntervalID);
            topIndicator.hide().removeClass('pressed');
          }
          if (!atBoundary('up') && !atBoundary('down')) {
            topIndicator.show();
            bottomIndicator.show();
          }
        };

        var keyPressHandler = function(e) {
          var that = this,
            scrollByStep = function() {
              if ($(that).hasClass('bottom')) {
                scroller.scrollBy(0, -20, 80);
              } else {
                scroller.scrollBy(0, 20, 80);
              }
              toggleIndicators();
            };

          if (e.which == 13) {
            scrollByStep();

            setTimeout(function() {
              that.focus();
            }, 50);
          }
          else if (e.which === 0) {
            scrollByStep();
          }
        };

        var scrollerOptions = {
          mouseWheel: true,
          bounce    : false,
          probeType : 2
        };

        /*
          This is just a quick fix to detect IE10. We should
          refactor this condition if we decide to use Modernizr
          or another more global detection.
         */
        if (window.navigator.msPointerEnabled) {
          scrollerOptions.preventDefault = false;
        }

        var scroller = new IScroll(this, scrollerOptions);

        $('ul.navigation_thumbnails', that.element).pageNavigationList({
          scroller: scroller,
          scrollToActive: true
        });

        pageflow.ready.then(function() {
          toggleIndicators();
        });

        topIndicator.on({
          'mousedown': function () {
            scrollUpIntervalID = setInterval(function () {
              scroller.scrollBy(0, 1);
              toggleIndicators();
            }, 5);
          },
          'keypress': keyPressHandler,
          'touchstart': keyPressHandler
        });

        topIndicator.on('mouseup touchend', function() {
          clearInterval(scrollUpIntervalID);
        });

        bottomIndicator.on({
          'mousedown': function() {
            scrollDownIntervalID = setInterval(function() {
              scroller.scrollBy(0, -1);
              toggleIndicators();
            }, 5);
          },
          'keypress': keyPressHandler,
          'touchstart': keyPressHandler
        });

        bottomIndicator.on('mouseup touchend', function () {
          clearInterval(scrollDownIntervalID);
        });

        toggleIndicators();

        scroller.on('scroll', function () {
          toggleIndicators();
          hideOverlay();
          removeHandler();
        });

      });

      /* hide text button */
      var hideText = $('.navigation_hide_text', this.element);

      hideText.click(function() {
        pageflow.hideText.toggle();
      });

      pageflow.hideText.on('activate deactivate', function() {
        hideText.toggleClass('active', pageflow.hideText.isActive()).updateTitle();
      });

      /* fullscreen button */
      if ($.support.fullscreen) {
        var fs = $('.navigation_fullscreen', this.element),
            fullscreenCallback = function(isFullScreen) {
              fs
                .toggleClass('active', !!isFullScreen)
                .updateTitle();
            };

        fs.click(function() {
          fs.toggleClass('fs').updateTitle();
          $('#outer_wrapper').fullScreen({'callback': fullscreenCallback});
        });
      }
      else {
        $('.navigation_bar_bottom .fullscreen a', this.element).css('visibility', 'hidden');
      }

      $('.button, .navigation_mute, .scroll_indicator', this.element).on({
        'touchstart mousedown': function() {
          $(this).addClass('pressed');
        },
        'touchend mouseup': function() {
          $(this).removeClass('pressed');
        }
      });

      $('.navigation_share, .navigation_credits', this.element).on({
        'touchstart': function() {
          var element = $(this).parent().parent();
          element.addClass('open');

          function close(e) {
            if (!element.find(e.target).length) {
              element.removeClass('open');
              $('body').off('touchstart', close);
            }
          }
          $('body').on('touchstart', close);
        }
      });

      $('li', this.element).on('mouseleave', function() {
        $(this).blur();
      });

      $('body').on({
        'mouseup': function() {
          handlingVolume = false;
        },
        'pageactivate': function(e) {
          toggleIndicators();
        }
      });
    }
  });
}(jQuery));
