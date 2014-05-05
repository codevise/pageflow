pageflow.pageType.register('background_video', _.extend({

  enhance: function(pageElement, configuration) {
    this._initVideoPlayer(pageElement);
  },

  prepare: function(pageElement, configuration) {

    if (!pageflow.features.has('mobile platform')) {
      this.videoPlayer.ensureCreated();
    }
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    this.videoPlayer.ensureCreated();

    if (!pageflow.features.has('mobile platform')) {
      this.prebufferingPromise = this.videoPlayer.prebuffer().then(function() {
        that.videoPlayer.volume(0);
        that.videoPlayer.play();
      });

      this.listenTo(pageflow.settings, "change:volume", function(model, value) {
        this.fadeSound(this.videoPlayer, value, 10);
      });
    }

    pageflow.activeBackgroundVideo = this.videoPlayer;
  },

  activated: function(pageElement, configuration) {
    var that = this;

    if (!pageflow.features.has('mobile platform')) {
      this.prebufferingPromise.then(function() {
        that.fadeSound(that.videoPlayer, pageflow.settings.get('volume'), 1000);
      });
    }
  },

  deactivating: function(pageElement, configuration) {
    this.fadeSound(this.videoPlayer, 0, 400);
    this.stopListening();

    pageflow.activeBackgroundVideo = undefined;
  },

  deactivated: function(pageElement, configuration) {
    this.videoPlayer.pause();
    this.videoPlayer.scheduleDispose();
  },

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);
    pageElement.find('.shadow').css({opacity: configuration.get('gradient_opacity') / 100});

    var videoPlayer = this.videoPlayer;
    videoPlayer.ensureCreated();

    if (!this.srcDefined) {
      videoPlayer.ready(function() {
        videoPlayer.src(configuration.getVideoFileSources('video_file_id'));
      });
    }

    if (!this.srcDefined || configuration.hasChanged('video_file_id')) {
      this.srcDefined = true;
      this.videoPlayer.src(configuration.getVideoFileSources('video_file_id'));
    }

    pageElement.find('.background_image').css({
      backgroundImage: 'url("' + configuration.getVideoPosterUrl() + '")'
    });

    this.updateVideoPoster(pageElement, configuration.getVideoPosterUrl());
  },

  _initVideoPlayer: function(pageElement) {
    var template = pageElement.find('[data-template=video]');

    var min_w = 300; // minimum video width allowed
    var vid_w_orig = template.attr("data-video-width") || 1280;
    var vid_h_orig = template.attr("data-video-height") || 720;

    this.videoPlayer = new pageflow.VideoPlayer.Lazy(template, {
      width: '100%',
      height: '100%'
    });

    this.videoPlayer.ready(function() {
      jQuery(window).on('resize', function () { resizeToCover(); });
      resizeToCover();
    });

    function resizeToCover() {
      var video = pageElement.find('video');

      // use largest scale factor of horizontal/vertical
      var scale_h = jQuery(window).width() / vid_w_orig;
      var scale_v = jQuery(window).height() / vid_h_orig;
      var scale = scale_h > scale_v ? scale_h : scale_v;

      // don't allow scaled width < minimum video width
      if (scale * vid_w_orig < min_w) {
        scale = min_w / vid_w_orig;
      }

      // now scale the video
      video.width(scale * vid_w_orig).height(scale * vid_h_orig);
      // and center it
      video.css({
        "left": "-" + ((video.width() - jQuery(window).width()) / 2) + "px",
        "top": "-" + ((video.height() - jQuery(window).height()) / 2) + "px"
      });
    }
  }
}, pageflow.volumeFade, pageflow.videoHelpers, pageflow.commonPageCssClasses));
