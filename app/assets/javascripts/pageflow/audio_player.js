//= require ./media_player

//= require_self

//= require ./audio_player/media_events
//= require ./audio_player/null
//= require ./audio_player/seek_with_invalid_state_handling
//= require ./audio_player/rewind_method
//= require ./audio_player/pause_in_background
//= require ./audio_player/get_media_element_method

/**
 * Playing audio sources
 *
 * @param {Object[]} sources
 * List of sources for audio element.
 *
 * @param {string} sources[].type
 * Mime type of the audio.
 *
 * @param {string} sources[].src
 * Url of the audio.
 *
 * @class
 */
pageflow.AudioPlayer = function(sources, options) {
  options = options || {};

  var codecMapping = ['audio/mpeg', 'audio/ogg', 'audio/mp4'];

  var loaded = new $.Deferred();

  var source = _.find(sources || [], function(source) {
    return _.contains(codecMapping, source.type);
  });

  var audio = new Howl({
    format: ['ogg', 'mp3', 'mp4'],
    src: (source ? source.src : ''),
    loop: options.loop
  });

  audio.loadedPromise = loaded.promise();

  audio.on('load', function() {
    loaded.resolve();

    this.currentSrc = this._src;
    this.position = 0;
    //this.trigger('timeupdate', this.pos(), this.duration());
  });

  if (options.mediaEvents) {
    pageflow.AudioPlayer.mediaEvents(audio, options.context);
  }

  if (options.pauseInBackground && pageflow.browser.has('mobile platform')) {
    pageflow.AudioPlayer.pauseInBackground(audio);
  }

  pageflow.mediaPlayer.enhance(audio, _.extend({
    loadWaiting: true
  }, options || {}));

  pageflow.AudioPlayer.seekWithInvalidStateHandling(audio);
  pageflow.AudioPlayer.rewindMethod(audio);
  pageflow.AudioPlayer.getMediaElementMethod(audio);

  var originalSeek = audio.seek;
  audio.seek = function() {
    if (this.currentSrc) {
      return originalSeek.apply(this, arguments);
    }
  };

  var originalPlay = audio.play;
  audio.play = function() {
    if (this.currentSrc) {
      originalPlay.apply(this, arguments);
    }
  };

  audio.paused = function() {
    return !audio.playing;
  };

  return audio;
};

pageflow.AudioPlayer.fromAudioTag = function(element, options) {
  return new pageflow.AudioPlayer(element.find('source').map(function() {
    return {
      src: $(this).attr('src'),
      type: $(this).attr('type')
    };
  }).get(), _.extend({tag: element[0]}, options || {}));
};

pageflow.AudioPlayer.fromScriptTag = function(element, options) {
  var sources = element.length ? JSON.parse(element.text()) : [];
  return new pageflow.AudioPlayer(sources, options);
};
