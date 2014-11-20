pageflow.AudioPlayer = function(sources, options) {
  options = options || {};

  var codecMapping = {
    vorbis: 'audio/ogg',
    mp4: 'audio/mp4',
    mp3: 'audio/mpeg'
  };

  var ready = new $.Deferred();
  var loaded = new $.Deferred();

  var audio = new Audio5js({
    reusedTag: options.tag,
    swf_path: pageflow.assetUrls.audioSwf,
    throw_errors: false,
    format_time: false,
    codecs: ['vorbis', 'mp4', 'mp3'],
    ready: ready.resolve,
    loop: options.loop
  });

  audio.readyPromise = ready.promise();
  audio.loadedPromise = loaded.promise();

  audio.on('load', loaded.resolve);

  audio.src = function(sources) {
    ready.then(function() {
      var source = _.detect(sources || [], function(source) {
        if (codecMapping[audio.settings.player.codec] === source.type) {
          return source.src;
        }
      });

      audio.load(source ? source.src : '');
    });
  };

  var originalLoad = audio.load;
  audio.load = function(src) {
    if (!src) {
      this.duration = 0;
    }

    this.currentSrc = src;
    this.position = 0;
    this.trigger('timeupdate', this.position, this.duration);

    originalLoad.apply(this, arguments);
  };

  var originalSeek = audio.seek;
  audio.seek = function() {
    if (this.currentSrc) {
      originalSeek.apply(this, arguments);
    }
  };

  var originalPlay = audio.play;
  audio.play = function() {
    if (this.currentSrc) {
      originalPlay.apply(this, arguments);
    }
  };

  audio.src(sources);
  return audio;
};

pageflow.AudioPlayer.fromAudioTag = function(element, options) {
  return new pageflow.AudioPlayer(element.find('source').map(function() {
    return {
      src: $(this).attr('src'),
      type: $(this).attr('type')
    };
  }).get(), {tag: element[0], loop: options.loop});
};

pageflow.AudioPlayer.fromScriptTag = function(element, options) {
  var sources = element.length ? JSON.parse(element.text()) : [];
  return new pageflow.AudioPlayer(sources, options);
};