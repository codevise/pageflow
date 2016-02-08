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
    pageElement.find('.controls').autoHidePlayerControls('reset', {
      autoplay: configuration.autoplay !== false
    });

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

    if (pageflow.browser.has('ios platform')) {
      videoPlayer.src(videoPlayer.srcFromOptions());
    }

    if (!pageflow.browser.has('mobile platform')) {
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
    var scrollIndicator = this.scrollIndicator;
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

      var pageContent = pageElement.find('.scroller, .controls, .shadow'),
          controls = pageElement.find('.controls'),
          controlBar = pageElement.find('.vjs-control-bar'),
          playButton = pageElement.find('.vjs-play-control'),
          loadingSpinner = pageElement.find('.vjs-loading-spinner'),
          poster = pageElement.find('.vjs-poster');

      controlBar.appendTo(controls);

      var additionalControlsHtml =
        '<div class="player_skip" tabindex="4"></div>' +
        '<div class="player_fullscreen" tabindex="4"></div>' +
        '<div class="player_volume">' +
        '  <div class="volume-control">' +
        '    <div tabindex="0" class="player_volume_bar player_slider volume-slider">' +
        '      <div class="player_volume_level volume-level"></div>' +
        '      <div class="player_volume_handle player_slider_handle volume-handle"></div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="player_mute volume-mute-button" tabindex="4"></div>' +
        '</div>' +
        '<div class="control_bar_text">' +
        controls.data('controlBarText') +
        '</div>';

      $(additionalControlsHtml).appendTo(controlBar);

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

      controls.find('a, [tabindex]').on({
        focus: function() {
          controls.addClass('focussed');
        },

        blur: function() {
          controls.removeClass('focussed');
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

      videoPlayer.on('beforeplay', function() {
        loadingSpinner.addClass('showing-for-underrun');
      });

      videoPlayer.on("ended", function() {
        if (pageflow.browser.has('mobile platform')) {
          videoPlayer.showPosterImage();
        }

        if (pageElement.hasClass('active') && configuration.auto_change_page_on_ended) {
          pageflow.slides.next();
        }
      });

      pageElement
        .hideContentDuringPlayback({
          scrollIndicator: scrollIndicator
        })
        .hideContentDuringPlayback('attach', videoPlayer);

      controls
        .autoHidePlayerControls({
          pageElement: pageElement,
          target: pageElement.find('.videoPage'),

          onShow: function() {
            pageContent.addClass('fade-in').removeClass('fade-out');
          },

          onHide: function() {
            pageContent.addClass('fade-out').removeClass('fade-in');
          }
        })
        .autoHidePlayerControls('attach', videoPlayer);

      pageElement.find('.volume-control').volumeSlider({
        orientation: 'v'
      });

      pageElement.find('.player_mute').muteButton();
      pageElement.find('.player_skip').skipPageButton();
      pageElement.find('.player_fullscreen').fullscreenButton();
    });
  }
}, pageflow.volumeFade, pageflow.videoHelpers, pageflow.infoBox, pageflow.commonPageCssClasses));
