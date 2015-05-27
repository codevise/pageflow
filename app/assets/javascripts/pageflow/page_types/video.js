pageflow.pageType.register('video', _.extend({

  enhance: function(pageElement, configuration) {
    pageElement.find('.contentText').before(pageElement.find('.page_header'));
    this._initVideoPlayer(pageElement, configuration);
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  prepare: function(pageElement, configuration) {
    this.videoPlayer.ensureCreated();
  },

  unprepare: function(pageElement, configuration) {
    this.videoPlayer.scheduleDispose();
  },

  activating: function(pageElement, configuration) {
    var videoPlayer = this.videoPlayer;

    // for SkipLinks
    $('#firstContent').attr("id","");
    var firstContentElement = pageElement.find('*[tabindex="4"], a');
    $(firstContentElement[0]).attr('id','firstContent');
    //

    this.videoPlayer.ensureCreated();

    if (pageflow.browser.has('mobile platform')) {
      this.videoPlayer.showPosterImage();
    }

    $('body').on('keyup', function(e) {
      if(e.keyCode == 32){
        if(videoPlayer.paused()) {
          videoPlayer.play();
        }
        else {
          videoPlayer.pause();
        }
      }
    });
  },

  activated: function(pageElement, configuration) {
    this.pageElement = pageElement;
    var videoPlayer = this.videoPlayer;
    var that = this;

    if (pageflow.browser.has('mobile platform')) {
       videoPlayer.src(videoPlayer.srcFromOptions()); // needed for iOS
    }
    else {
      videoPlayer.prebuffer().done(function() {
        videoPlayer.hidePosterImage();

        if (configuration.autoplay !== false) {
          that.fadeInTimeout = setTimeout(function() {
            videoPlayer.playAndFadeIn(1000);
          }, 1000);
        }
      });
    }
  },

  deactivating: function(pageElement, configuration) {
    clearTimeout(this.fadeInTimeout);
    this.fadeSound(this.videoPlayer, 0, 400);
    this.stopListening();
    $('body').off('keyup');
  },

  deactivated: function(pageElement, configuration) {
    if (pageflow.browser.has('mobile platform')) {
      this.videoPlayer.showPosterImage();
    }
    this.videoPlayer.pause();
    this.videoPlayer.scheduleDispose();
  },

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');

    pageElement.find('p').html(configuration.get('text') || '');

    this.updateInfoBox(pageElement, configuration);
    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({opacity: configuration.get('gradient_opacity') / 100});

    this.updateVideoPoster(pageElement, configuration.getVideoPosterUrl());
  },

  embeddedEditorViews: function() {
    return {
      '.videoWrapper': {
        view: pageflow.LazyVideoEmbeddedView,
        options: {
          propertyName: 'video_file_id'
        }
      }
    };
  },

  _initVideoPlayer: function(pageElement, configuration) {
    var videoPlayer = new pageflow.VideoPlayer.Lazy(pageElement.find('[data-template=video]'), {
      bufferUnderrunWaiting: true,
      controls: true,
      customControlsOnMobile: true,

      volumeFading: true,
      hooks: pageflow.atmo.createMediaPlayerHooks(configuration),

      mediaEvents: true,
      context: {
        page: pageElement.page('instance')
      },

      width: '100%',
      height: '100%'
    });

    this.videoPlayer = videoPlayer;
    pageElement.find('.videoWrapper').data('videoPlayer', videoPlayer);

    videoPlayer.ready(function() {
      videoPlayer.showPosterImage();

      var addInfoBox = pageElement.find('.add_info_box'),
          controls = pageElement.find('.controls'),
          controlBar = pageElement.find('.vjs-control-bar'),
          playButton = pageElement.find('.vjs-play-control'),
          loadingSpinner = pageElement.find('.vjs-loading-spinner'),
          poster = pageElement.find('.vjs-poster'),
          video =  pageElement.find('video');

      controlBar.appendTo(controls);

      var additionalControlsHtml = '<div class="player_skip"></div><div class="player_fullscreen"></div><div class="player_volume"><div class="volume-control"><div tabindex="0" class="player_volume_bar player_slider volume-slider"><div class="player_volume_level volume-level"></div><div class="player_volume_handle player_slider_handle volume-handle"></div></div></div><div class="player_mute volume-mute-button"></div></div>';

      $(additionalControlsHtml).appendTo(controlBar);
      //pageElement.find('.scroller').after(controls);

      controlBar.addClass('vjs-default-skin vjs-player');
      playButton.before(loadingSpinner);
      playButton.attr('tabindex','4');

      playButton.on({
        'mousedown touchstart': function() {
          $(this).addClass('pressed');
        },
        'mouseup touchend': function() {
          $(this).removeClass('pressed');
        }
      });

      videoPlayer.on('bufferunderrun', function() {
        loadingSpinner.addClass('showing-for-underrun');
      });

      videoPlayer.on('timeupdate', function() {
        loadingSpinner.removeClass('showing-for-underrun');
      });

      if (pageflow.browser.has('phone platform')) {
        // alternate poster image handling
        $("<div class='vjs-poster-mobile' style='" +
          poster.attr('style') +
          "display:block; background-size: cover;'></div>").appendTo(pageElement.find(".videoWrapper"));
        poster.removeClass('vjs-poster').addClass('vjs-poster-mobile');

        // listening for exit fullscreen to force pausing
        $(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function() {
          if (!document.fullscreenElement && !document.mozFullScreen && !document.webkitIsFullScreen) {
            videoPlayer.pause();
          }
        });
      }

      var timeout, scrollIndicatorTimeout,
          scrollIndicator = $('.entry .scroll_indicator'),
          pageContent = pageElement.find('.scroller, .controls, .shadow');

      pageContent.addClass('lock-showing');

      videoPlayer.on("pause", function() {
        pageContent.addClass('lock-showing');

        scrollIndicator.removeClass('faded');
        clearTimeout(scrollIndicatorTimeout);
      });

      videoPlayer.on('beforeplay', function() {
        loadingSpinner.addClass('showing-for-underrun');
      });

      videoPlayer.on("play", function() {
        pageContent.removeClass('lock-showing');

        scrollIndicatorTimeout = setTimeout(function() {
          scrollIndicator.addClass('faded');
        }, 2000);
      });

      videoPlayer.on("ended", function() {
        scrollIndicator.removeClass('faded');
        clearTimeout(scrollIndicatorTimeout);

        if (pageflow.browser.has('mobile platform')) {
          videoPlayer.showPosterImage();
        }

        if (pageElement.hasClass('active') && configuration.auto_change_page_on_ended) {
          pageflow.slides.next();
        }
      });

      pageElement.on('mousemove', autoHideControls);
      $('body').on('keydown', autoHideControls);
      pageElement.find('.content').on('touchstart', autoHideControls);

      pageElement.find('.volume-control').volumeSlider({
        orientation: 'v'
      });

      pageElement.find('.player_mute').muteButton();
      pageElement.find('.player_skip').skipPageButton();

      function autoHideControls() {
        showControls();
        if (!pageflow.browser.has('phone platform')) {
          clearTimeout(timeout);
          timeout = setTimeout(hideControls, 2000);
        }
      }

      function hideControls() {
        if (!videoPlayer.paused()) {
          pageContent.addClass('fade-out').removeClass('fade-in');
        }
      }

      function showControls() {
        pageContent.addClass('fade-in').removeClass('fade-out');
      }
    });
  }
}, pageflow.volumeFade, pageflow.videoHelpers, pageflow.infoBox, pageflow.commonPageCssClasses));
