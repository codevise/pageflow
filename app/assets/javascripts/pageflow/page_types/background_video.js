pageflow.pageType.register('background_video', _.extend({

  enhance: function(pageElement, configuration) {
    this._initVideoPlayer(pageElement, configuration);
  },

  prepare: function(pageElement, configuration) {

    if (!pageflow.browser.has('mobile platform')) {
      this.videoPlayer.ensureCreated();
    }
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    var that = this;

    this.videoPlayer.ensureCreated();
    this._resizeToCover(pageElement, configuration);

    if (!pageflow.browser.has('mobile platform')) {
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

    if (!pageflow.browser.has('mobile platform')) {
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

  resize: function(pageElement, configuration) {
    this._resizeToCover(pageElement, configuration);
  },

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);
    pageElement.find('.shadow').css({opacity: configuration.get('gradient_opacity') / 100});

    var videoPlayer = this.videoPlayer,
        x = configuration.getFilePosition('video_file_id', 'x'),
        y = configuration.getFilePosition('video_file_id', 'y'),
        posterUrl = configuration.getVideoPosterUrl();

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

    this.updateBackgroundVideoPosters(pageElement, posterUrl, x, y);
    this._resizeToCover(pageElement, configuration.attributes);
  },

  _initVideoPlayer: function(pageElement, configuration) {
    var that = this;
    var template = pageElement.find('[data-template=video]');

    this.min_w = 300; // minimum video width allowed
    this.vid_w_orig = template.attr("data-video-width") || 1280;
    this.vid_h_orig = template.attr("data-video-height") || 720;

    this.videoPlayer = new pageflow.VideoPlayer.Lazy(template, {
      width: '100%',
      height: '100%'
    });

    this.videoPlayer.ready(function() {
      that._resizeToCover(pageElement, configuration);
    });
  },

  _resizeToCover: function(pageElement, configuration) {
    var x = configuration.hasOwnProperty('video_file_x') ? configuration.video_file_x : 50;
    var y = configuration.hasOwnProperty('video_file_y') ? configuration.video_file_y : 50;
    var video = pageElement.find('video');

    // use largest scale factor of horizontal/vertical
    var scale_h = jQuery(window).width() / this.vid_w_orig;
    var scale_v = jQuery(window).height() / this.vid_h_orig;
    var scale = scale_h > scale_v ? scale_h : scale_v;

    // don't allow scaled width < minimum video width
    if (scale * this.vid_w_orig < this.min_w) {
      scale = this.min_w / this.vid_w_orig;
    }

    // now scale the video
    video.width(scale * this.vid_w_orig).height(scale * this.vid_h_orig);

    video.css({
      "left": "-" + ((video.width() - jQuery(pageElement).width()) * x / 100) + "px",
      "top": "-" + ((video.height() - jQuery(pageElement).height()) * y / 100) + "px"
    });
  }
}, pageflow.volumeFade, pageflow.videoHelpers, pageflow.commonPageCssClasses));
