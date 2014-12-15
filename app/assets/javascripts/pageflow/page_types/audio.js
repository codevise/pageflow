pageflow.pageType.register('audio', _.extend({
  enhance: function(pageElement, configuration) {
    pageElement.find('.contentText').before(pageElement.find('.page_header'));
    pageElement.find('audio').hide();
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    // for SkipLinks
    $('#firstContent').attr("id","");
    var firstContentElement = pageElement.find('*[tabindex], a');

    $(firstContentElement[0]).attr('id','firstContent');
    //

    this._ensureAudioPlayer(pageElement);

    var that = this;

    this.audioPlayer.readyPromise.then(function() {
      that.audioPlayer.volume(pageflow.settings.get('volume'));
      that.listenTo(pageflow.settings, "change:volume", function(model, value) {
        that.audioPlayer.loadedPromise.then(function() {
          that.fadeSound(that.audioPlayer, value, 40);
        });
      });
    });

    $('body').on('keyup', function(e) {
      if(e.keyCode == 32){
        if(!that.audioPlayer.playing) {
          that.audioPlayer.play();
        }
        else {
          that.audioPlayer.pause();
        }
      }
    });
  },

  activated: function(pageElement, configuration) {
    this.active = true;
    var that = this;

    if(!pageflow.features.has('mobile platform')) {
      if (configuration.autoplay === false) {
        that.audioPlayer.volume(pageflow.settings.get('volume'));
      } else {
        this.fadeInTimeout = setTimeout(function() {
          that.audioPlayer.readyPromise.then(function() {
            if (that.active) {
              that.audioPlayer.volume(0);
              that.audioPlayer.play();
              that.audioPlayer.loadedPromise.then(function() {
                that.fadeSound(that.audioPlayer, pageflow.settings.get('volume'), 1000);
              });
            }
          });
        }, 1000);
      }
    }
  },

  deactivating: function(pageElement, configuration) {
    this.active = false;
    var that = this;

    clearTimeout(this.fadeInTimeout);
    this.audioPlayer.loadedPromise.then(function() {
      that.fadeSound(that.audioPlayer, 0, 400);
    });
    this.stopListening();
    $('body').off('keyup');
  },

  deactivated: function(pageElement, configuration) {
    this.audioPlayer.pause();
  },

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateInfoBox(pageElement, configuration);
    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });

    this._ensureAudioPlayer(pageElement);
    this.audioPlayer.src(configuration.getAudioFileSources('audio_file_id'));
  },


  embeddedEditorViews: function() {
    return {
      '.background_image': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id'}
      }
    };
  },

  _ensureAudioPlayer: function(pageElement) {
    this.audioPlayer = this.audioPlayer ||
      pageflow.AudioPlayer.fromScriptTag(pageElement.find('script[data-audio]'),
                                         {mediaEvents: true});

    pageElement.find('.vjs-controls').playerControls({
      player: this.audioPlayer
    });
  }
}, pageflow.volumeFade, pageflow.infoBox, pageflow.commonPageCssClasses));
